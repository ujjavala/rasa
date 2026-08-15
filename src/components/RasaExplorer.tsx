import type { CSSProperties } from 'react';
import { rasas } from '../data/rasas';
import { EXPLORERS } from '../data/explorers';
import type { RasaId } from '../types';
import './explorer.css';

type ExplorerStyle = CSSProperties & {
  '--explorer-color': string;
  '--explorer-light': string;
  '--explorer-deep': string;
  '--explorer-ink': string;
  '--explorer-delay': string;
};

export interface TasteGuideProps {
  rasaId: RasaId;
  active?: boolean;
  travelling?: boolean;
  destination?: string | null;
  action?: 'greet' | 'scout' | 'lore';
  actionKey?: number;
  dialogue?: string;
}

/** Compact map-scale version of a guide, intended to sit inside a taste zone. */
export function TasteGuide({
  rasaId,
  active = false,
  travelling = false,
  destination,
  action = 'greet',
  actionKey = 0,
  dialogue,
}: Readonly<TasteGuideProps>) {
  const rasa = rasas.find((item) => item.id === rasaId)!;
  const explorer = EXPLORERS[rasaId];
  const style: ExplorerStyle = {
    '--explorer-color': rasa.color.base,
    '--explorer-light': rasa.color.light,
    '--explorer-deep': rasa.color.deep,
    '--explorer-ink': rasa.color.ink,
    '--explorer-delay': '0s',
  };
  let speech = `I’m ${explorer.name}. Enter ${rasa.english.toLowerCase()} country!`;
  if (active) speech = `${explorer.greeting} Choose a dish or region below.`;
  if (destination) speech = `${destination} is our next stop. Follow me!`;
  if (dialogue) speech = dialogue;

  return (
    <span
      className="taste-guide"
      data-rasa={rasaId}
      data-active={active ? 'true' : 'false'}
      data-travelling={travelling ? 'true' : 'false'}
      data-action={active ? action : undefined}
      style={style}
      aria-hidden="true"
    >
      <span key={`speech-${actionKey}`} className="taste-guide__bubble"><i />{speech}</span>
      <span className="taste-guide__library-shadow" />
      <span
        key={`${rasaId}-${action}-${actionKey}`}
        className="taste-guide__character"
        data-action={active ? action : undefined}
        data-travelling={travelling ? 'true' : 'false'}
      >
        <span className="taste-guide__leg taste-guide__leg--left" />
        <span className="taste-guide__leg taste-guide__leg--right" />
        <span className="taste-guide__body"><i /><i /><i /></span>
        <span className="taste-guide__costume"><i /></span>
        <span className="taste-guide__arm taste-guide__arm--left" />
        <span className="taste-guide__arm taste-guide__arm--right" />
        <span className="taste-guide__head">
          <i className="taste-guide__hair" />
          <i className="taste-guide__ear taste-guide__ear--left" />
          <i className="taste-guide__ear taste-guide__ear--right" />
          <i className="taste-guide__eye taste-guide__eye--left" />
          <i className="taste-guide__eye taste-guide__eye--right" />
          <i className="taste-guide__nose" />
          <i className="taste-guide__mouth" />
          <i className="taste-guide__hair-ribbon" />
          <i className="taste-guide__detail" />
        </span>
        <span className="taste-guide__tool" title={explorer.epithet}><i /></span>
      </span>
    </span>
  );
}

/**
 * A persistent party of the six rasas, rendered entirely with semantic HTML
 * and CSS shapes. The figures are decorative; their names and dialogue remain
 * available as text when animation or visual styling is unavailable.
 */
export default function RasaExplorer() {
  return (
    <section className="rasa-explorer" aria-labelledby="rasa-explorer-title">
      <header className="rasa-explorer__header">
        <p className="rasa-explorer__eyebrow">The six-taste fellowship</p>
        <h2 id="rasa-explorer-title">Meet the rasa explorers</h2>
        <p>
          Six travelling companions, each carrying one taste and one part of the story.
        </p>
      </header>

      <ul className="rasa-explorer__party" aria-label="The six rasa explorer characters">
        {rasas.map((rasa, index) => {
          const explorer = EXPLORERS[rasa.id];
          const style: ExplorerStyle = {
            '--explorer-color': rasa.color.base,
            '--explorer-light': rasa.color.light,
            '--explorer-deep': rasa.color.deep,
            '--explorer-ink': rasa.color.ink,
            '--explorer-delay': `${index * -0.43}s`,
          };

          return (
            <li className={`rasa-explorer__card rasa-explorer__card--${rasa.id}`} style={style} key={rasa.id}>
              <article aria-labelledby={`explorer-${rasa.id}`}>
                <div className="rasa-explorer__scene">
                  <blockquote className="rasa-explorer__bubble">
                    <p>“{explorer.greeting}”</p>
                  </blockquote>

                  <div className="rasa-explorer__character" aria-hidden="true">
                    <div className="rasa-explorer__shadow" />
                    <div className="rasa-explorer__walker">
                      <div className="rasa-explorer__scarf">
                        <i />
                        <i />
                      </div>
                      <div className="rasa-explorer__head">
                        <div className="rasa-explorer__hair" />
                        <div className="rasa-explorer__ear rasa-explorer__ear--left" />
                        <div className="rasa-explorer__ear rasa-explorer__ear--right" />
                        <div className="rasa-explorer__face">
                          <i className="rasa-explorer__eye rasa-explorer__eye--left" />
                          <i className="rasa-explorer__eye rasa-explorer__eye--right" />
                          <i className="rasa-explorer__nose" />
                          <i className="rasa-explorer__smile" />
                          <i className="rasa-explorer__blush rasa-explorer__blush--left" />
                          <i className="rasa-explorer__blush rasa-explorer__blush--right" />
                        </div>
                      </div>
                      <div className="rasa-explorer__body">
                        <div className="rasa-explorer__collar" />
                        <div className={`rasa-explorer__accessory rasa-explorer__accessory--${explorer.accessory}`} />
                      </div>
                      <div className="rasa-explorer__arm rasa-explorer__arm--wave"><i /></div>
                      <div className="rasa-explorer__arm rasa-explorer__arm--rest"><i /></div>
                      <div className="rasa-explorer__leg rasa-explorer__leg--left"><i /></div>
                      <div className="rasa-explorer__leg rasa-explorer__leg--right"><i /></div>
                    </div>
                  </div>
                </div>

                <div className="rasa-explorer__identity">
                  <span className="rasa-explorer__script" lang="sa">{rasa.sanskrit}</span>
                  <div>
                    <h3 id={`explorer-${rasa.id}`}>{explorer.name}</h3>
                    <p>{explorer.epithet}</p>
                  </div>
                  <span className="rasa-explorer__taste">{rasa.name} · {rasa.english}</span>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
