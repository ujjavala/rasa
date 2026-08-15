import { useCallback, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { BookOpen, Compass, Footprints, Map, Sparkles } from 'lucide-react';
import ExplorePanel from './components/ExplorePanel';
import SiteShell from './components/SiteShell';
import TongueMap from './components/TongueMap';
import { rasas } from './data';
import { EXPLORERS } from './data/explorers';
import type { RasaId, RegionId } from './types';
import './app.css';

export default function App() {
  const [activeRasa, setActiveRasa] = useState<RasaId | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionId | null>(null);
  const [activeDish, setActiveDish] = useState<string | null>(null);
  const [isTravelling, setIsTravelling] = useState(false);
  const [guideAction, setGuideAction] = useState<'greet' | 'scout' | 'lore'>('greet');
  const [guideActionKey, setGuideActionKey] = useState(0);
  const [guideDialogue, setGuideDialogue] = useState<string | undefined>();

  const active = useMemo(
    () => rasas.find((rasa) => rasa.id === activeRasa) ?? null,
    [activeRasa],
  );

  const reset = useCallback(() => {
    setActiveRasa(null);
    setSelectedRegion(null);
    setActiveDish(null);
  }, []);

  const selectRasa = useCallback((id: RasaId | null) => {
    setActiveRasa(id);
    setSelectedRegion(null);
    setActiveDish(null);
    if (id) {
      setGuideAction('greet');
      setGuideDialogue(undefined);
      setGuideActionKey((key) => key + 1);
      setIsTravelling(true);
      window.setTimeout(() => setIsTravelling(false), 900);
    }
  }, []);

  const commandGuide = useCallback((action: 'greet' | 'scout' | 'lore') => {
    if (!active) return;
    setGuideAction(action);
    setGuideActionKey((key) => key + 1);
    if (action === 'greet') setGuideDialogue(EXPLORERS[active.id].greeting);
    if (action === 'scout') setGuideDialogue(`I found ${active.carriers.slice(0, 4).join(', ')}. These are strong carriers of ${active.english.toLowerCase()}.`);
    if (action === 'lore') setGuideDialogue(`${active.tagline} ${active.elements} shape this rasa’s traditional character.`);
  }, [active]);

  return (
    <SiteShell activeRasa={activeRasa} onReset={reset}>
      <section className="app-expedition" aria-label="Interactive taste expedition">
        <div className="app-map-column">
          <div className="app-map-caption">
            <span><Compass size={16} aria-hidden="true" /> Live expedition</span>
            <p>{active ? `${EXPLORERS[active.id].name} is guiding ${active.name} country` : 'Choose a glowing guide to enter a taste region'}</p>
          </div>
          <TongueMap
            activeRasa={activeRasa}
            onSelect={selectRasa}
            guideAction={guideAction}
            guideActionKey={guideActionKey}
            guideDialogue={guideDialogue}
            guideTravelling={isTravelling}
            onGuideAction={commandGuide}
          />
          <div className="app-map-legend" aria-label="Map instructions">
            <span><Footprints size={14} aria-hidden="true" /> Select a guide</span>
            <span><Map size={14} aria-hidden="true" /> Map zooms to the rasa</span>
            <span><BookOpen size={14} aria-hidden="true" /> Open field notes below</span>
          </div>
        </div>

        <aside className="app-guidebook">
          {active ? (
            <>
              <p className="app-overline">
                Guide’s field journal · entry 0{rasas.indexOf(active) + 1}
              </p>
              <h3>
                <span lang="sa">{active.sanskrit}</span> {active.name}
              </h3>
              <blockquote>“{EXPLORERS[active.id].greeting}”</blockquote>
              <p>{active.description}</p>
              <div className="app-carriers">
                {active.carriers.map((carrier) => (
                  <span key={carrier}>{carrier}</span>
                ))}
              </div>
              <section>
                <Sparkles size={17} aria-hidden="true" />
                <div><strong>Myth to leave behind</strong><p>{active.mythBuster}</p></div>
              </section>
              <p className="app-travel-state" data-moving={isTravelling ? 'true' : 'false'}>
                <Footprints size={15} aria-hidden="true" />
                {isTravelling ? `${EXPLORERS[active.id].name} is walking to the marker…` : `${EXPLORERS[active.id].name} has made camp. Explore below.`}
              </p>
            </>
          ) : (
            <>
              <p className="app-overline">Explorer’s field journal</p>
              <h3>Six guides are waiting.</h3>
              <p>Each glowing figure belongs to one rasa. Select a taste bud and that guide will stay with you as the map dives closer—then lead you through dishes, states, festivals and spice routes.</p>
              <ol className="app-roster">
                {rasas.map((rasa) => (
                  <li key={rasa.id}>
                    <button
                      type="button"
                      onClick={() => selectRasa(rasa.id)}
                      style={{ '--guide': rasa.color.base } as CSSProperties}
                    >
                      <span>{rasa.sanskrit}</span>
                      <strong>{EXPLORERS[rasa.id].name}</strong>
                      <small>{rasa.english}</small>
                    </button>
                  </li>
                ))}
              </ol>
            </>
          )}
        </aside>
      </section>

      <div id="field-notes" className="app-field-notes">
        <ExplorePanel
          activeRasa={activeRasa}
          selectedRegion={selectedRegion}
          onRegionSelect={setSelectedRegion}
          activeDish={activeDish}
          onDishSelect={setActiveDish}
        />
      </div>
    </SiteShell>
  );
}
