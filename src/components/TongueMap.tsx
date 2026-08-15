import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { BookOpen, Locate, MessageCircle, Minimize2, RotateCcw, Search } from 'lucide-react';
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

const HOVER_TILT = 7;
const ORBIT_X_LIMIT = 18;
const ORBIT_Y_LIMIT = 24;
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
  const orbitRef = useRef({
    active: false,
    dragging: false,
    moved: false,
    pointerId: -1,
    rx: 0,
    ry: 0,
    startX: 0,
    startY: 0,
    startRx: 0,
    startRy: 0,
  });
  const suppressBackdropClickRef = useRef(false);
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

  const paintOrbit = useCallback((rx: number, ry: number, active: boolean) => {
    const tilt = tiltRef.current;
    const root = rootRef.current;
    if (!tilt || !root) return;
    tilt.style.setProperty('--tm-rx', `${rx.toFixed(2)}deg`);
    tilt.style.setProperty('--tm-ry', `${ry.toFixed(2)}deg`);
    root.style.setProperty('--tm-orbit-depth', active ? '1' : '.35');
    root.dataset.orbit = active ? 'set' : 'idle';
  }, []);

  const resetOrbit = useCallback(() => {
    const orbit = orbitRef.current;
    orbit.active = false;
    orbit.dragging = false;
    orbit.rx = 0;
    orbit.ry = 0;
    pointerRef.current = { x: 0.5, y: 0.4 };
    paintOrbit(0, 0, false);
  }, [paintOrbit]);

  const adjustOrbit = useCallback((deltaRx: number, deltaRy: number) => {
    const orbit = orbitRef.current;
    orbit.active = true;
    orbit.rx = clamp(orbit.rx + deltaRx, -ORBIT_X_LIMIT, ORBIT_X_LIMIT);
    orbit.ry = clamp(orbit.ry + deltaRy, -ORBIT_Y_LIMIT, ORBIT_Y_LIMIT);
    paintOrbit(orbit.rx, orbit.ry, true);
  }, [paintOrbit]);

  const onViewportKeyDown = useCallback((event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.target !== event.currentTarget) return;
    const step = event.shiftKey ? 6 : 3;
    if (event.key === 'ArrowLeft') adjustOrbit(0, -step);
    else if (event.key === 'ArrowRight') adjustOrbit(0, step);
    else if (event.key === 'ArrowUp') adjustOrbit(-step, 0);
    else if (event.key === 'ArrowDown') adjustOrbit(step, 0);
    else if (event.key === 'Home') resetOrbit();
    else return;
    event.preventDefault();
  }, [adjustOrbit, resetOrbit]);

  /* ---- CSS 3D tour: rAF-throttled drag orbit with lightweight hover
          parallax. React state is not touched during pointer movement. --- */
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
      const orbit = orbitRef.current;
      const ry = orbit.active ? orbit.ry : clamp((x - 0.5) * 2, -1, 1) * HOVER_TILT;
      const rx = orbit.active ? orbit.rx : clamp((0.5 - y) * 2, -1, 1) * HOVER_TILT;
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
      const orbit = orbitRef.current;
      if (orbit.dragging && e.pointerId === orbit.pointerId) {
        const dx = (e.clientX - orbit.startX) / rect.width;
        const dy = (e.clientY - orbit.startY) / rect.height;
        orbit.moved ||= Math.abs(dx) + Math.abs(dy) > 0.008;
        orbit.rx = clamp(orbit.startRx - dy * 52, -ORBIT_X_LIMIT, ORBIT_X_LIMIT);
        orbit.ry = clamp(orbit.startRy + dx * 64, -ORBIT_Y_LIMIT, ORBIT_Y_LIMIT);
      }
      schedule();
    };

    const onDown = (e: PointerEvent) => {
      const target = e.target as Element;
      const otherControl = target.closest('a, input, select')
        || (target.closest('button') && !target.closest('.tm-backdrop'));
      if (!e.isPrimary || e.button !== 0 || otherControl) return;
      const orbit = orbitRef.current;
      orbit.active = true;
      orbit.dragging = true;
      orbit.moved = false;
      orbit.pointerId = e.pointerId;
      orbit.startX = e.clientX;
      orbit.startY = e.clientY;
      orbit.startRx = orbit.rx;
      orbit.startRy = orbit.ry;
      rootRef.current!.dataset.orbit = 'dragging';
      viewport.setPointerCapture(e.pointerId);
      e.preventDefault();
    };

    const onUp = (e: PointerEvent) => {
      const orbit = orbitRef.current;
      if (!orbit.dragging || e.pointerId !== orbit.pointerId) return;
      orbit.dragging = false;
      suppressBackdropClickRef.current = orbit.moved;
      rootRef.current!.dataset.orbit = 'set';
      if (viewport.hasPointerCapture(e.pointerId)) viewport.releasePointerCapture(e.pointerId);
    };

    const onLeave = () => {
      if (orbitRef.current.active) return;
      pointerRef.current = { x: 0.5, y: 0.4 };
      schedule();
    };

    viewport.addEventListener('pointerdown', onDown);
    viewport.addEventListener('pointermove', onMove);
    viewport.addEventListener('pointerup', onUp);
    viewport.addEventListener('pointercancel', onUp);
    viewport.addEventListener('pointerleave', onLeave);
    return () => {
      viewport.removeEventListener('pointerdown', onDown);
      viewport.removeEventListener('pointermove', onMove);
      viewport.removeEventListener('pointerup', onUp);
      viewport.removeEventListener('pointercancel', onUp);
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
    if (suppressBackdropClickRef.current) {
      suppressBackdropClickRef.current = false;
      return;
    }
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
        arrow keys to move between neighbouring regions. Drag empty space to orbit the CSS 3D
        scene. When the 3D tour frame is focused, use arrow keys to orbit and Home to centre it.
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
          aria-label="CSS 3D orbit surface. Use arrow keys to orbit, Home to centre, or activate to reset map zoom."
          onClick={onBackdrop}
          onKeyDown={onViewportKeyDown}
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
            aria-label="Center 3D view"
            onClick={(event) => {
              event.stopPropagation();
              resetOrbit();
            }}
          >
            <RotateCcw size={13} strokeWidth={1.75} aria-hidden="true" />
            <span>Center 3D</span>
          </button>
          <button
            type="button"
            className="tm-btn glass"
            aria-label="Reset map zoom"
            disabled={!active}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(null);
            }}
          >
            <Minimize2 size={13} strokeWidth={1.75} aria-hidden="true" />
            <span>Reset view</span>
          </button>
        </div>

        {active && (
          <section className="tm-guide-console glass" aria-label={`${EXPLORERS[active.id].name} guide commands`}>
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
          </section>
        )}
      </div>
    </div>
  );
}
