import { useState } from 'react';
import type { ReactNode } from 'react';
import { Pause, Play } from 'lucide-react';
import type { RasaId } from '../types';
import './shell.css';

const RASA_NAMES: Record<RasaId, string> = {
  madhura: 'Madhura · sweet',
  amla: 'Amla · sour',
  lavana: 'Lavana · salty',
  katu: 'Katu · pungent',
  tikta: 'Tikta · bitter',
  kashaya: 'Kashaya · astringent',
};

export interface SiteShellProps {
  children: ReactNode;
  activeRasa: RasaId | null;
  onReset: () => void;
}

export default function SiteShell({
  children,
  activeRasa,
  onReset,
}: Readonly<SiteShellProps>) {
  const activeName = activeRasa ? RASA_NAMES[activeRasa] : null;
  const [motionPaused, setMotionPaused] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem('rasa-motion') === 'paused',
  );

  const toggleMotion = () => {
    setMotionPaused((paused) => {
      const next = !paused;
      window.localStorage.setItem('rasa-motion', next ? 'paused' : 'playing');
      return next;
    });
  };

  return (
    <div className="shell" data-motion={motionPaused ? 'paused' : 'playing'}>
      <a className="shell-skip" href="#rasa-map">
        Skip to the tongue map
      </a>

      <header className="shell-header">
        <a className="shell-brand" href="#top" aria-label="Rasa, back to the beginning">
          <span className="shell-brand-mark" aria-hidden="true">
            र
          </span>
          <span>
            <strong>Rasa</strong>
            <small>The tongue map of India</small>
          </span>
        </a>
        <nav className="shell-nav" aria-label="Primary navigation">
          <a href="#rasa-map">Explore</a>
          <a href="#six-rasas">Six rasas</a>
          <a href="#science-note">The science</a>
          <button
            type="button"
            className="shell-motion-toggle"
            aria-label={motionPaused ? 'Play motion' : 'Pause motion'}
            aria-pressed={motionPaused}
            onClick={toggleMotion}
          >
            {motionPaused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
            <span>{motionPaused ? 'Play motion' : 'Pause motion'}</span>
          </button>
        </nav>
      </header>

      <main id="top">
        <section className="shell-hero" aria-labelledby="shell-title">
          <div className="shell-sky" aria-hidden="true">
            <span className="shell-sun" />
            <span className="shell-cloud shell-cloud--one" />
            <span className="shell-cloud shell-cloud--two" />
            <span className="shell-cloud shell-cloud--three" />
            <div className="shell-cosmos">
              <span className="shell-cosmos-orbit shell-cosmos-orbit--outer" />
              <span className="shell-cosmos-orbit shell-cosmos-orbit--inner" />
              <div className="shell-dabba">
                <span className="shell-dabba-core" />
                <span className="shell-spice-bowl shell-spice-bowl--madhura"><i /></span>
                <span className="shell-spice-bowl shell-spice-bowl--amla"><i /></span>
                <span className="shell-spice-bowl shell-spice-bowl--lavana"><i /></span>
                <span className="shell-spice-bowl shell-spice-bowl--katu"><i /></span>
                <span className="shell-spice-bowl shell-spice-bowl--tikta"><i /></span>
                <span className="shell-spice-bowl shell-spice-bowl--kashaya"><i /></span>
              </div>
              <span className="shell-spice-moon shell-spice-moon--one" />
              <span className="shell-spice-moon shell-spice-moon--two" />
            </div>
            <span className="shell-ridge shell-ridge--far" />
            <span className="shell-ridge shell-ridge--mid" />
            <span className="shell-hill shell-hill--far" />
            <span className="shell-hill shell-hill--near" />
            <span className="shell-fields" />
            <span className="shell-petal shell-petal--one" />
            <span className="shell-petal shell-petal--two" />
            <span className="shell-petal shell-petal--three" />
            <span className="shell-petal shell-petal--four" />
            <span className="shell-petal shell-petal--five" />
          </div>

          <div className="shell-hero-copy">
            <p className="shell-kicker">An edible atlas · six tastes · countless tables</p>
            <h1 id="shell-title">
              More than{' '}
              <span>butter chicken.</span>
            </h1>
            <p className="shell-lede">
              Follow sweet, sour, salty, pungent, bitter and astringent through a food culture
              shaped by climate, migration, ritual and trade—not one curry, but a continent of
              distinct culinary traditions.
            </p>
            <a className="shell-cta" href="#rasa-map">
              Taste the map <span aria-hidden="true">↓</span>
            </a>
          </div>

          <dl className="shell-stats" aria-label="At a glance">
            <div>
              <dt>6</dt>
              <dd>classical rasas</dd>
            </div>
            <div>
              <dt>8</dt>
              <dd>culinary regions</dd>
            </div>
            <div>
              <dt>1</dt>
              <dd>many-layered table</dd>
            </div>
          </dl>
        </section>

        <section className="shell-map-section" id="six-rasas" aria-labelledby="map-heading">
          <div className="shell-section-heading">
            <div>
              <p className="shell-kicker">The Shadrasa</p>
              <h2 id="map-heading">Meet the six tastes</h2>
            </div>
            <p>
              Choose a glowing region to move closer. Each rasa is a doorway into ingredients,
              techniques and stories from kitchens across India.
            </p>
          </div>

          <div className="shell-map-frame" id="rasa-map" tabIndex={-1}>
            <div className="shell-map-toolbar">
              <p className="shell-map-status">
                <span className="shell-status-dot" aria-hidden="true" />
                {activeName ? `Exploring ${activeName}` : 'All six rasas in view'}
              </p>
              <button type="button" onClick={onReset} disabled={!activeRasa}>
                Reset map
              </button>
            </div>
            {children}
          </div>
        </section>

        <aside className="shell-science" id="science-note" aria-labelledby="science-heading">
          <span className="shell-science-flower" aria-hidden="true" />
          <div>
            <p className="shell-kicker">A note on the science</p>
            <h2 id="science-heading">A cultural map, not an anatomy chart</h2>
          </div>
          <p>
            The familiar idea that different parts of the tongue detect different tastes is a
            debunked myth. Taste receptors are distributed across the tongue. This map is an
            artistic metaphor for Ayurveda’s six rasas—not a claim about human physiology or
            medical advice.
          </p>
        </aside>
      </main>

      <footer className="shell-footer">
        <div>
          <span className="shell-brand-mark" aria-hidden="true">
            र
          </span>
          <p>
            <strong>Rasa</strong>
            <span>A small celebration of India’s very large table.</span>
          </p>
        </div>
        <p>Made with curiosity, context and room for another helping.</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </div>
  );
}
