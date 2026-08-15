import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { BookOpen, Locate, MessageCircle, Minimize2, Search } from 'lucide-react';
import { rasas } from '../data';
import { EXPLORERS } from '../data/explorers';
import type { Rasa, RasaId } from '../types';
import { TasteGuide } from './RasaExplorer';
import './tongue.css';

/** Local, explicitly-typed view of the shared data module. */
const RASAS: Rasa[] = rasas;

export interface TongueMapProps {
  activeRasa: RasaId | null;
  onSelect: (id: RasaId | null) => void;
  guideAction: 'greet' | 'scout' | 'lore';
  guideActionKey: number;
  guideDialogue?: string;
  guideTravelling: boolean;
  onGuideAction: (action: 'greet' | 'scout' | 'lore') => void;
}

/* ------------------------------------------------------------------
   Deterministic pseudo-random placement.
   The art must be identical on every render and on the server, so we
   seed everything rather than calling Math.random().
   ------------------------------------------------------------------ */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Papilla {
  x: number;
  y: number;
  s: number;
  d: number;
}

/** Fungiform papillae — scattered inside the tongue's ellipse. */
const FUNGIFORM: Papilla[] = (() => {
  const rnd = mulberry32(20260815);
  const out: Papilla[] = [];
  let guard = 0;
  while (out.length < 54 && guard++ < 4000) {
    const x = rnd() * 100;
    const y = rnd() * 100;
    const nx = (x - 50) / 45;
    const ny = (y - 54) / 47;
    if (nx * nx + ny * ny > 1) continue;
    out.push({ x, y, s: 0.55 + rnd() * 1.0, d: rnd() * 6 });
  }
  return out;
})();

/** Circumvallate papillae — the V of the sulcus terminalis, apex pointing
    backwards (up, toward the root). The detail that reads as craft. */
const CIRCUMVALLATE: Array<{ x: number; y: number }> = (() => {
  const pts: Array<{ x: number; y: number }> = [];
  const n = 5;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = 50 - t * 25;
    const y = 15 + t * 13;
    pts.push({ x, y });
    if (i > 0) pts.push({ x: 100 - x, y });
  }
  return pts;
})();

interface Nub {
  x: number;
  y: number;
  s: number;
  d: number;
}

/** A bloom of taste-bud nubs packed into a disc. */
function buildNubs(seed: number, count: number, spread: number, minS: number, maxS: number): Nub[] {
  const rnd = mulberry32(seed);
  const out: Nub[] = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 60) {
    const x = rnd() * 100;
    const y = rnd() * 100;
    const nx = (x - 50) / (50 * spread);
    const ny = (y - 50) / (50 * spread);
    if (nx * nx + ny * ny > 1) continue;
    out.push({ x, y, s: minS + rnd() * (maxS - minS), d: rnd() * 3.2 });
  }
  return out;
}

const CLAMP_TILT = 10;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type Direction = 'left' | 'right' | 'up' | 'down';

/** Style object that also carries CSS custom properties. */
type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

export default function TongueMap({
  activeRasa,
  onSelect,
  guideAction,
  guideActionKey,
  guideDialogue,
  guideTravelling,
  onGuideAction,
}: Readonly<TongueMapProps>) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.4 });
  const buttonsRef = useRef(new Map<RasaId, HTMLButtonElement>());

  /* Tab order follows the tongue top-to-bottom, left-to-right. */
  const ordered = useMemo<Rasa[]>(
    () => [...RASAS].sort((a, b) => a.zone.y - b.zone.y || a.zone.x - b.zone.x),
    [],
  );

  /* Two levels of detail per cluster: coarse nubs always visible,
     fine nubs that resolve in when the map zooms into the zone. */
  const clusters = useMemo(() => {
    const map = new Map<RasaId, { core: Nub[]; fine: Nub[] }>();
    RASAS.forEach((r, i) => {
      map.set(r.id, {
        core: buildNubs(i * 977 + 131, 9, 0.72, 13, 24),
        fine: buildNubs(i * 613 + 47, 22, 0.96, 9, 17),
      });
    });
    return map;
  }, []);

  const active = useMemo(
    () => (activeRasa ? (RASAS.find((r) => r.id === activeRasa) ?? null) : null),
    [activeRasa],
  );

  /* ----------------------------------------------------------------
     THE ZOOM MATHS
     ----------------------------------------------------------------
     .tm-frame is exactly the tongue's bounding box and is centred in
     the viewport, so the frame's centre IS the viewport's centre.
     .tm-camera fills the frame and is transformed from its top-left
     corner (transform-origin: 0 0).

     A zone lives at (x%, y%) of the camera, i.e. at pixel
     (x/100 * W, y/100 * H) before any transform.

     `translate(tx%, ty%) scale(z)` applies right-to-left, and translate
     percentages resolve against the element's own box (W x H), so the
     zone lands at:  (z * x/100 * W  +  tx/100 * W,  ... same in y).

     We want that to equal the frame centre (0.5 * W, 0.5 * H):
        z * x/100 + tx/100 = 0.5   =>   tx = 50 - x * z
        z * y/100 + ty/100 = 0.5   =>   ty = 50 - y * z

     For the overview we pretend the "zone" is the centre of the frame
     at zoom 1 (x = y = 50, z = 1), which collapses to translate(0, 0).
     ---------------------------------------------------------------- */
  const zoom = active ? active.zone.zoom : 1;
  const cx = active ? active.zone.x : 50;
  const cy = active ? active.zone.y : 50;
  const tx = 50 - cx * zoom;
  const ty = 50 - cy * zoom;

  /* ---- Pointer parallax: rAF-throttled, written straight to the
          DOM as custom properties. Never touches React state. ------- */
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return;

    const apply = () => {
      rafRef.current = null;
      const tilt = tiltRef.current;
      const root = rootRef.current;
      if (!tilt || !root) return;
      const { x, y } = pointerRef.current;
      const ry = clamp((x - 0.5) * 2, -1, 1) * CLAMP_TILT;
      const rx = clamp((0.5 - y) * 2, -1, 1) * CLAMP_TILT;
      tilt.style.setProperty('--tm-rx', `${rx.toFixed(2)}deg`);
      tilt.style.setProperty('--tm-ry', `${ry.toFixed(2)}deg`);
      /* the wet highlight chases the cursor across the dorsum */
      root.style.setProperty('--tm-px', `${(x * 100).toFixed(1)}%`);
      root.style.setProperty('--tm-py', `${(y * 100).toFixed(1)}%`);
    };

    const schedule = () => {
      rafRef.current ??= requestAnimationFrame(apply);
    };

    const onMove = (e: PointerEvent) => {
      const rect = viewport.getBoundingClientRect();
      pointerRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
      schedule();
    };

    const onLeave = () => {
      pointerRef.current = { x: 0.5, y: 0.4 };
      schedule();
    };

    viewport.addEventListener('pointermove', onMove);
    viewport.addEventListener('pointerleave', onLeave);
    return () => {
      viewport.removeEventListener('pointermove', onMove);
      viewport.removeEventListener('pointerleave', onLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  /* ---- Escape resets the view from anywhere on the page ---------- */
  useEffect(() => {
    if (!activeRasa) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onSelect(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeRasa, onSelect]);

  /* ---- Arrow keys walk to the nearest zone in that direction ----- */
  const moveFocus = useCallback(
    (from: Rasa, dir: Direction) => {
      const others = ordered.filter((r) => r.id !== from.id);
      const inDirection = others.filter((r) => {
        const dx = r.zone.x - from.zone.x;
        const dy = r.zone.y - from.zone.y;
        if (dir === 'left') return dx < -1;
        if (dir === 'right') return dx > 1;
        if (dir === 'up') return dy < -1;
        return dy > 1;
      });
      const pool = inDirection.length > 0 ? inDirection : others;
      const cost = (r: Rasa) => {
        const dx = Math.abs(r.zone.x - from.zone.x);
        const dy = Math.abs(r.zone.y - from.zone.y);
        const along = dir === 'left' || dir === 'right' ? dx : dy;
        const across = dir === 'left' || dir === 'right' ? dy : dx;
        return along + across * 2.2;
      };
      const next = [...pool].sort((a, b) => cost(a) - cost(b))[0];
      buttonsRef.current.get(next.id)?.focus();
    },
    [ordered],
  );

  const onZoneKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLButtonElement>, rasa: Rasa) => {
      const dirs: Record<string, Direction> = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
      };
      const dir = dirs[e.key];
      if (dir) {
        e.preventDefault();
        moveFocus(rasa, dir);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onSelect(null);
      }
    },
    [moveFocus, onSelect],
  );

  const toggle = useCallback(
    (id: RasaId) => {
      if (activeRasa === id) {
        onGuideAction('lore');
        return;
      }
      onSelect(id);
    },
    [activeRasa, onGuideAction, onSelect],
  );

  /* Clicking empty mouth resets to the overview. */
  const onBackdrop = useCallback(() => {
    if (activeRasa) onSelect(null);
  }, [activeRasa, onSelect]);

  const status = active
    ? `Zoomed into ${active.name}, ${active.english.toLowerCase()}. ${active.tagline}`
    : 'Overview. All six rasa regions of the tongue are visible.';

  return (
    <div
      ref={rootRef}
      className="tm-root"
      style={{ '--tm-zoom': zoom, '--tm-tiltk': active ? 0.25 : 1 } as CSSVars}
    >
      {/* Screen-reader equivalent of the spatial map ---------------- */}
      <p className="sr-only" id="tm-intro">
        An interactive illustration of a tongue with six regions, one for each rasa of Ayurveda.
        Choose a region to zoom the map into it. Press Escape to return to the overview. Use the
        arrow keys to move between neighbouring regions.
      </p>
      <ul className="sr-only">
        {ordered.map((r) => (
          <li key={r.id}>
            {r.name} ({r.sanskrit}) — {r.english}. {r.elements}. {r.tagline}
          </li>
        ))}
      </ul>
      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>

      <div ref={viewportRef} className="tm-viewport grain">
        {/* Click-anywhere-else to zoom out. Not focusable: Escape and the
            Reset button are the keyboard-accessible equivalents. */}
        <button
          type="button"
          className="tm-backdrop"
          tabIndex={-1}
          aria-hidden="true"
          onClick={onBackdrop}
        />
        <div className="tm-frame">
          <div
            className="tm-camera"
            style={{ transform: `translate(${tx}%, ${ty}%) scale(${zoom})` }}
          >
            <div className="tm-stage">
              <div ref={tiltRef} className="tm-tilt">
                {/* ---- ambient occlusion onto the dark ------------- */}
                <div className="tm-cast" aria-hidden="true" />

                {/* ---- the flesh ---------------------------------- */}
                <div className="tm-breath" aria-hidden="true">
                  <div className="tm-tongue">
                    {/* stacked Z slabs => real volume */}
                    <div className="tm-slab tm-slab--base" />
                    <div className="tm-slab tm-slab--mid" />
                    <div className="tm-slab tm-slab--dorsum" />
                    <div className="tm-sss" />

                    {/* filiform nap */}
                    <div className="tm-filiform" />

                    {/* median sulcus */}
                    <div className="tm-sulcus" />

                    {/* circumvallate V near the root */}
                    {CIRCUMVALLATE.map((p) => (
                      <div
                        key={`cv-${p.x}-${p.y}`}
                        className="tm-vallate"
                        style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      />
                    ))}

                    {/* fungiform buds that catch the light */}
                    {FUNGIFORM.map((p) => (
                      <div
                        key={`fg-${p.x}-${p.y}`}
                        className="tm-fungiform"
                        style={
                          {
                            '--fx': p.x,
                            '--fy': p.y,
                            '--fs': p.s,
                            '--fd': p.d,
                          } as CSSVars
                        }
                      />
                    ))}

                    {/* wet pass */}
                    <div className="tm-wet" />
                    <div className="tm-sheen" />
                    <div className="tm-rim" />
                  </div>
                </div>

                {/* ---- the six rasa zones ------------------------- */}
                <div className="tm-zones" data-zoomed={active ? 'true' : 'false'}>
                  {ordered.map((r) => {
                    const selected = r.id === activeRasa;
                    const bloom = clusters.get(r.id);
                    const zoneTabIndex = !active || selected ? 0 : -1;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        ref={(el) => {
                          if (el) buttonsRef.current.set(r.id, el);
                          else buttonsRef.current.delete(r.id);
                        }}
                        className="tm-zone"
                        data-selected={selected ? 'true' : 'false'}
                        tabIndex={zoneTabIndex}
                        aria-pressed={selected}
                        aria-describedby="tm-intro"
                        aria-label={`${r.name}, ${r.english.toLowerCase()}, guided by ${EXPLORERS[r.id].name} — ${
                          selected ? 'ask the guide for a field note' : 'zoom into this taste region'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(r.id);
                        }}
                        onKeyDown={(e) => onZoneKeyDown(e, r)}
                        style={
                          {
                            '--zx': r.zone.x,
                            '--zy': r.zone.y,
                            '--zr': r.zone.r,
                            '--rasa-base': r.color.base,
                            '--rasa-light': r.color.light,
                            '--rasa-deep': r.color.deep,
                            '--tm-label-k': selected ? zoom : 1,
                          } as CSSVars
                        }
                      >
                        <span className="tm-halo" aria-hidden="true" />
                        <span className="tm-bloom" aria-hidden="true">
                          {bloom?.core.map((n) => (
                            <span
                              key={`c-${n.x}-${n.y}`}
                              className="tm-nub"
                              style={
                                {
                                  '--nx': n.x,
                                  '--ny': n.y,
                                  '--ns': n.s,
                                  '--nd': n.d,
                                } as CSSVars
                              }
                            />
                          ))}
                          {bloom?.fine.map((n) => (
                            <span
                              key={`f-${n.x}-${n.y}`}
                              className="tm-nub tm-nub--fine"
                              style={
                                {
                                  '--nx': n.x,
                                  '--ny': n.y,
                                  '--ns': n.s,
                                  '--nd': n.d,
                                } as CSSVars
                              }
                            />
                          ))}
                        </span>
                        <TasteGuide
                          rasaId={r.id}
                          active={selected}
                          travelling={selected && guideTravelling}
                          action={selected ? guideAction : 'greet'}
                          actionKey={selected ? guideActionKey : 0}
                          dialogue={selected ? guideDialogue : undefined}
                        />
                        <span className="tm-ring" aria-hidden="true" />
                        <span className="tm-label" aria-hidden="true">
                          <span className="tm-label-deva">{r.sanskrit}</span>
                          <span className="tm-label-name">{r.name}</span>
                          <span className="tm-label-en">{r.english}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tm-cavity" aria-hidden="true" />

        {/* ---- HUD: cartographic furniture ------------------------ */}
        <div className="tm-hud tm-hud--zoom glass" aria-hidden="true">
          <Locate size={13} strokeWidth={1.75} className="text-[color:var(--color-brass)]" />
          <span className="tm-scalebar">
            <span
              className="tm-scalebar-fill"
              style={{ width: `${clamp(((zoom - 1) / 2.2) * 100, 6, 100)}%` }}
            />
          </span>
          <span className="tm-hud-value">{zoom.toFixed(1)}×</span>
          <span className="tm-hud-label">zoom</span>
        </div>

        <div className="tm-hud tm-hud--reset">
          <button
            type="button"
            className="tm-btn glass"
            disabled={!active}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(null);
            }}
          >
            <Minimize2 size={13} strokeWidth={1.75} aria-hidden="true" />
            Reset view
          </button>
        </div>

        {active && (
          <div className="tm-guide-console glass" aria-label={`${EXPLORERS[active.id].name} guide commands`}>
            <span className="tm-guide-console__name">Command {EXPLORERS[active.id].name}</span>
            <button type="button" onClick={(event) => { event.stopPropagation(); onGuideAction('greet'); }}>
              <MessageCircle size={14} aria-hidden="true" /> Greet
            </button>
            <button type="button" onClick={(event) => { event.stopPropagation(); onGuideAction('scout'); }}>
              <Search size={14} aria-hidden="true" /> Scout
            </button>
            <button type="button" onClick={(event) => { event.stopPropagation(); onGuideAction('lore'); }}>
              <BookOpen size={14} aria-hidden="true" /> Lore
            </button>
            <span className="sr-only" role="status" aria-live="polite">
              {guideDialogue ?? EXPLORERS[active.id].greeting}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
