import type { CSSProperties } from 'react';
import { createAvatar } from '@dicebear/core';
import * as openPeeps from '@dicebear/open-peeps';
import type { Options as OpenPeepsOptions } from '@dicebear/open-peeps';
import { motion, useReducedMotion } from 'framer-motion';
import type { TargetAndTransition } from 'framer-motion';
import { rasas } from '../data/rasas';
import { EXPLORERS } from '../data/explorers';
import type { RasaId } from '../types';
import './explorer.css';

type AvatarOptions = OpenPeepsOptions & { seed: string; backgroundColor?: string[] };

const AVATAR_OPTIONS: Record<RasaId, AvatarOptions> = {
  madhura: { seed: 'Guddi-Archivist', head: ['grayBun'], face: ['calm'], accessories: ['glasses2'], accessoriesProbability: 100, skinColor: ['ae5d29'], clothingColor: ['f0a830'] },
  amla: { seed: 'Ami-Botanist-II', head: ['bantuKnots'], face: ['smileBig'], accessoriesProbability: 0, skinColor: ['d08b5b'], clothingColor: ['a8c83c'] },
  lavana: { seed: 'Neer-Navigator', head: ['turban'], face: ['serious'], facialHair: ['moustache4'], facialHairProbability: 100, accessoriesProbability: 0, skinColor: ['ae5d29'], clothingColor: ['7fb2d9'] },
  katu: { seed: 'Tara-Chronicler', head: ['longBangs'], face: ['driven'], accessoriesProbability: 0, skinColor: ['694d3d'], clothingColor: ['e14434'] },
  tikta: { seed: 'Nima-Herbalist', head: ['grayMedium'], face: ['old'], facialHair: ['full3'], facialHairProbability: 100, accessoriesProbability: 0, skinColor: ['d08b5b'], clothingColor: ['4a8f5f'] },
  kashaya: { seed: 'Jamu-Apprentice', head: ['hatBeanie'], face: ['cheeky'], accessoriesProbability: 0, skinColor: ['d08b5b'], clothingColor: ['9a6ec4'] },
};

const AVATARS = Object.fromEntries(
  (Object.keys(AVATAR_OPTIONS) as RasaId[]).map((id) => [
    id,
    createAvatar(openPeeps, { ...AVATAR_OPTIONS[id], maskProbability: 0 }).toDataUri(),
  ]),
) as Record<RasaId, string>;

const GUIDE_TOOLS: Record<RasaId, string> = {
  madhura: '🥻',
  amla: '🌿',
  lavana: '🧭',
  katu: '🌶️',
  tikta: '🪴',
  kashaya: '📓',
};

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
  const reduceMotion = useReducedMotion();
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
  let guideAnimation: TargetAndTransition | undefined;
  if (!reduceMotion && travelling) {
    guideAnimation = { x: [0, 6, -3, 0], y: [0, -4, 0], rotate: [0, 2, -2, 0] };
  } else if (!reduceMotion && active && action === 'greet') {
    guideAnimation = { y: [0, -7, 0], rotate: [0, -3, 3, 0] };
  } else if (!reduceMotion && active && action === 'scout') {
    guideAnimation = { x: [0, 7, 4, -3, 0], scale: [1, 1.06, 1.06, 1] };
  } else if (!reduceMotion && active && action === 'lore') {
    guideAnimation = { rotateY: [0, 16, -10, 0], y: [0, -3, 0] };
  }

  return (
    <span
      className="taste-guide"
      data-rasa={rasaId}
      data-active={active ? 'true' : 'false'}
      data-travelling={travelling ? 'true' : 'false'}
      style={style}
      aria-hidden="true"
    >
      <span className="taste-guide__bubble">{speech}</span>
      <span className="taste-guide__library-shadow" />
      <motion.span
        key={`${rasaId}-${action}-${actionKey}`}
        className="taste-guide__library-character"
        animate={guideAnimation}
        transition={{ duration: travelling ? 0.72 : 0.9, repeat: 0, ease: 'easeInOut' }}
      >
        <img src={AVATARS[rasaId]} alt="" draggable={false} />
        {rasaId === 'madhura' && <span className="taste-guide__sari" />}
        {rasaId === 'katu' && <span className="taste-guide__bindi" />}
        <span className="taste-guide__tool" title={explorer.epithet}>{GUIDE_TOOLS[rasaId]}</span>
      </motion.span>
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
