import { useId, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Beaker,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Flame,
  History,
  MapPin,
  MapPinned,
  Navigation,
  PartyPopper,
  Route,
  Snowflake,
  Sparkles,
  UtensilsCrossed,
  Wind,
} from 'lucide-react';
import { dishes, festivals, rasas, regions, spices } from '../data';
import { SERVING_LABELS, servingTemperature } from '../data/serving';
import type { Dish, Festival, Rasa, RasaId, Region, RegionId, Spice } from '../types';
import DishPlate from './DishPlate';
import './explore.css';

export interface ExplorePanelProps {
  activeRasa: RasaId | null;
  selectedRegion: RegionId | null;
  onRegionSelect: (region: RegionId | null) => void;
  activeDish: string | null;
  onDishSelect: (dish: string | null) => void;
}

type ExploreTab = 'dishes' | 'regions' | 'festivals' | 'spices';
type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

/** Explicit boundary type keeps this component strict if data is loaded/generated separately. */
const DISHES: Dish[] = dishes;
const FESTIVALS: Festival[] = festivals;
const RASAS: Rasa[] = rasas;
const REGIONS: Region[] = regions;
const SPICES: Spice[] = spices;

const LANGUAGE_TAGS: Record<string, string> = {
  Assamese: 'as', Bengali: 'bn', Bhojpuri: 'bho', Chhattisgarhi: 'hne', Dogri: 'doi',
  Garhwali: 'gbm', Gujarati: 'gu', Himachali: 'him', Hindi: 'hi', 'Hindi/Punjabi': 'hi',
  'Hindi/Rajasthani': 'hi', 'Hindi/Urdu': 'hi', Kannada: 'kn', Kashmiri: 'ks', Khasi: 'kha',
  Kokborok: 'trp', Konkani: 'kok', Kumaoni: 'kfy', Ladakhi: 'lbj', Malayalam: 'ml',
  Marathi: 'mr', 'Marathi/Konkani': 'mr', Meitei: 'mni', Mizo: 'lus', Nagamese: 'nag',
  'Nagpuri/Hindi': 'sck', Nepali: 'ne', Nyishi: 'njz', Odia: 'or', Punjabi: 'pa',
  Rajasthani: 'raj', Tamil: 'ta', Telugu: 'te', Tulu: 'tcy', Urdu: 'ur',
};

const SERVING_ICONS = {
  'piping-hot': Flame,
  warm: Flame,
  cool: Wind,
  chilled: Snowflake,
} as const;

const languageTag = (language: string) => LANGUAGE_TAGS[language] ?? 'und';

const TABS: Array<{
  id: ExploreTab;
  label: string;
  icon: typeof UtensilsCrossed;
}> = [
  { id: 'dishes', label: 'Dishes', icon: UtensilsCrossed },
  { id: 'regions', label: 'Regions', icon: MapPinned },
  { id: 'festivals', label: 'Festivals', icon: PartyPopper },
  { id: 'spices', label: 'Spice Trail', icon: Route },
];

const rasaName = (id: RasaId) => RASAS.find((rasa) => rasa.id === id)?.english ?? id;
const regionName = (id: RegionId) => REGIONS.find((region) => region.id === id)?.name ?? id;

function WikipediaLink({ href, label }: Readonly<{ href: string; label: string }>) {
  return (
    <a className="ep-wikipedia" href={href} target="_blank" rel="noreferrer">
      <span>Wikipedia: {label}</span>
      <ExternalLink size={14} aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function DishCard({
  dish,
  expanded,
  onToggle,
  onRegionSelect,
}: Readonly<{
  dish: Dish;
  expanded: boolean;
  onToggle: () => void;
  onRegionSelect: (region: RegionId) => void;
}>) {
  const detailsId = useId();

  return (
    <article
      className="ep-paper ep-dish-card"
      data-expanded={expanded ? 'true' : 'false'}
      style={
        {
          '--plate-base': dish.plate.base,
          '--plate-accent': dish.plate.accent,
          '--plate-garnish': dish.plate.garnish,
        } as CSSVars
      }
    >
      <div className="ep-paper-edge" aria-hidden="true" />
      <DishPlate dish={dish} compact />
      <div className="ep-dish-topline">
        <span className="ep-glyph" aria-hidden="true">
          {dish.glyph}
        </span>
        <span className="ep-intensity" role="img" aria-label={`Taste intensity ${dish.intensity} out of 5`}>
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index} data-filled={index < dish.intensity ? 'true' : 'false'} />
          ))}
        </span>
      </div>

      <h3>{dish.name}</h3>
      <p className="ep-native" lang={languageTag(dish.language)} dir="auto">
        {dish.nativeName}
      </p>
      <p className="ep-blurb">{dish.blurb}</p>

      <div className="ep-tags" aria-label="Dish details">
        <button type="button" className="ep-region-chip" onClick={() => onRegionSelect(dish.region)}>
          <MapPin size={12} aria-hidden="true" />
          {dish.origin}
        </button>
        {dish.secondaryRasa?.map((id) => (
          <span key={id}>{rasaName(id)}</span>
        ))}
      </div>

      <button
        type="button"
        className="ep-expand"
        aria-expanded={expanded}
        aria-controls={detailsId}
        onClick={onToggle}
      >
        <span>{expanded ? 'Close story' : 'History & technique'}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      <div id={detailsId} className="ep-dish-details" hidden={!expanded}>
        <section>
          <h4>
            <History size={15} aria-hidden="true" />
            History
          </h4>
          <p>{dish.history}</p>
        </section>
        <section>
          <h4>
            <Beaker size={15} aria-hidden="true" />
            Technique
          </h4>
          <p>{dish.technique}</p>
        </section>
        <p className="ep-fact">
          <Sparkles size={15} aria-hidden="true" />
          <span>
            <strong>Did you know?</strong> {dish.didYouKnow}
          </span>
        </p>
        <p className="ep-ingredients">
          <strong>Key ingredients</strong> · {dish.ingredients.join(' · ')}
        </p>
        <WikipediaLink href={dish.wikipedia} label={dish.name} />
      </div>
    </article>
  );
}

function DishStorybook({
  entries,
  activeDish,
  onDishSelect,
  onRegionSelect,
}: Readonly<{
  entries: Dish[];
  activeDish: string | null;
  onDishSelect: (dish: string | null) => void;
  onRegionSelect: (region: RegionId) => void;
}>) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState<'next' | 'previous'>('next');
  const current = entries[page];

  if (!current) return null;

  const serving = servingTemperature(current);
  const ServingIcon = SERVING_ICONS[serving];

  const goTo = (nextPage: number) => {
    setDirection(nextPage > page ? 'next' : 'previous');
    setPage(nextPage);
    onDishSelect(null);
  };

  return (
    <section className="ep-storybook" aria-label={`${entries.length} dish field notebook`}>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Page {page + 1} of {entries.length}: {current.name}, {current.origin}
      </p>
      <div
        className="ep-book"
        data-serving={serving}
        data-form={current.plate.form}
        data-context={current.contexts.join(' ')}
        style={{ '--book-accent': current.plate.accent } as CSSVars}
      >
        <span className="ep-book-cover" aria-hidden="true" />
        <span className="ep-book-pages" aria-hidden="true" />
        <div className="ep-book-spread">
          <article className="ep-book-page ep-book-page--left">
            <span className="ep-book-stitch" aria-hidden="true" />
            <p className="ep-book-chapter">Field note · {String(page + 1).padStart(2, '0')}</p>
            <span className="ep-book-glyph" aria-hidden="true">{current.glyph}</span>
            <h3>{current.name}</h3>
            <p className="ep-book-native" lang={languageTag(current.language)} dir="auto">{current.nativeName}</p>
            <button type="button" className="ep-book-place" onClick={() => onRegionSelect(current.region)}>
              <MapPin size={14} aria-hidden="true" /> {current.origin}
            </button>
            <span className="ep-serving-badge">
              <ServingIcon size={14} strokeWidth={1.8} aria-hidden="true" />
              {SERVING_LABELS[serving]}
            </span>
            <blockquote>{current.occasion ?? current.didYouKnow}</blockquote>
            <div className="ep-book-contexts" aria-label="Dish contexts">
              {current.contexts.map((context) => <span key={context}>{context}</span>)}
            </div>
            <p className="ep-book-folio">Rasa culinary field atlas</p>
          </article>

          <div
            key={`${current.id}-${direction}`}
            className="ep-book-page ep-book-page--right"
            data-turn={direction}
          >
            <DishCard
              dish={current}
              expanded={activeDish === current.id}
              onToggle={() => onDishSelect(activeDish === current.id ? null : current.id)}
              onRegionSelect={onRegionSelect}
            />
            <span className="ep-book-folio ep-book-folio--right">{page + 1} / {entries.length}</span>
          </div>
          <span className="ep-book-spine" aria-hidden="true" />
        </div>
      </div>

      <div className="ep-book-controls">
        <button type="button" onClick={() => goTo(page - 1)} disabled={page === 0} aria-label="Previous dish">
          <ChevronLeft size={18} aria-hidden="true" /> Previous
        </button>
        <label>
          <span>Jump to dish</span>
          <select value={page} onChange={(event) => goTo(Number(event.target.value))}>
            {entries.map((dish, index) => (
              <option key={dish.id} value={index}>{index + 1}. {dish.name} — {dish.origin}</option>
            ))}
          </select>
        </label>
        <button type="button" onClick={() => goTo(page + 1)} disabled={page === entries.length - 1} aria-label="Next dish">
          Next <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

export default function ExplorePanel({
  activeRasa,
  selectedRegion,
  onRegionSelect,
  activeDish,
  onDishSelect,
}: Readonly<ExplorePanelProps>) {
  const [activeTab, setActiveTab] = useState<ExploreTab>('dishes');
  const tabsId = useId();
  const active = RASAS.find((rasa) => rasa.id === activeRasa) ?? null;

  const matchingDishes = useMemo(() => {
    if (!activeRasa) return [];
    return DISHES.filter(
      (dish) =>
        (dish.rasa === activeRasa || dish.secondaryRasa?.includes(activeRasa)) &&
        (!selectedRegion || dish.region === selectedRegion),
    );
  }, [activeRasa, selectedRegion]);

  const matchingRegions = useMemo(() => {
    if (!activeRasa) return [];
    const dishRegionIds = new Set(
      DISHES
        .filter((dish) => dish.rasa === activeRasa || dish.secondaryRasa?.includes(activeRasa))
        .map((dish) => dish.region),
    );
    return REGIONS.filter(
      (region) => region.dominantRasa.includes(activeRasa) || dishRegionIds.has(region.id),
    );
  }, [activeRasa]);

  const matchingFestivals = useMemo(
    () =>
      activeRasa
        ? FESTIVALS.filter(
            (festival) =>
              festival.rasa === activeRasa &&
              (!selectedRegion || festival.region === selectedRegion),
          )
        : [],
    [activeRasa, selectedRegion],
  );

  const matchingSpices = useMemo(
    () => (activeRasa ? SPICES.filter((spice) => spice.rasa === activeRasa) : []),
    [activeRasa],
  );

  const tabCounts: Record<ExploreTab, number> = {
    dishes: matchingDishes.length,
    regions: matchingRegions.length,
    festivals: matchingFestivals.length,
    spices: matchingSpices.length,
  };

  if (!active) {
    return (
      <aside className="ep-shell ep-empty" aria-label="Rasa explorer">
        <Sparkles size={25} aria-hidden="true" />
        <p className="ep-eyebrow">The field notes</p>
        <h2>Choose a rasa to begin</h2>
        <p>Select a taste on the tongue map to explore its dishes, places and culinary history.</p>
      </aside>
    );
  }

  const panelId = `${tabsId}-panel`;

  return (
    <aside
      className="ep-shell"
      aria-labelledby={`${tabsId}-heading`}
      style={
        {
          '--rasa': active.color.base,
          '--rasa-light': active.color.light,
          '--rasa-deep': active.color.deep,
          '--rasa-ink': active.color.ink,
        } as CSSVars
      }
    >
      <header className="ep-header">
        <div>
          <p className="ep-eyebrow">Active rasa · {active.elements}</p>
          <h2 id={`${tabsId}-heading`}>
            <span className="ep-sanskrit" lang="sa">{active.sanskrit}</span>
            {active.name} <em>{active.english}</em>
          </h2>
          <p>{active.tagline}</p>
        </div>
        <span className="ep-rasa-seal" aria-hidden="true">
          {active.sanskrit}
        </span>
      </header>

      <div className="ep-tabs" role="tablist" aria-label={`${active.english} field notes`}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`${tabsId}-${id}-tab`}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={panelId}
            tabIndex={activeTab === id ? 0 : -1}
            onClick={() => setActiveTab(id)}
            onKeyDown={(event) => {
              if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
              event.preventDefault();
              const current = TABS.findIndex((tab) => tab.id === id);
              let next: number;
              if (event.key === 'Home') next = 0;
              else if (event.key === 'End') next = TABS.length - 1;
              else {
                const direction = event.key === 'ArrowRight' ? 1 : -1;
                next = (current + direction + TABS.length) % TABS.length;
              }
              setActiveTab(TABS[next].id);
              document.getElementById(`${tabsId}-${TABS[next].id}-tab`)?.focus();
            }}
          >
            <Icon size={16} aria-hidden="true" />
            <span>{label}</span>
            <small>{tabCounts[id]}</small>
          </button>
        ))}
      </div>

      <div
        id={panelId}
        className="ep-panel"
        role="tabpanel"
        aria-labelledby={`${tabsId}-${activeTab}-tab`}
        tabIndex={0}
      >
        {activeTab === 'dishes' && (
          <>
            {selectedRegion && (
              <div className="ep-filter-note">
                <Navigation size={14} aria-hidden="true" />
                Showing {regionName(selectedRegion)}
                <button type="button" onClick={() => onRegionSelect(null)}>
                  Clear region
                </button>
              </div>
            )}
            <DishStorybook
              key={`${activeRasa}-${selectedRegion ?? 'all'}`}
              entries={matchingDishes}
              activeDish={activeDish}
              onDishSelect={onDishSelect}
              onRegionSelect={(region) => {
                onRegionSelect(region);
                setActiveTab('dishes');
              }}
            />
            {matchingDishes.length === 0 && (
              <p className="ep-no-results">No dishes in this region carry {active.english.toLowerCase()} in the current collection.</p>
            )}
          </>
        )}

        {activeTab === 'regions' && (
          <div className="ep-card-grid ep-region-grid">
            {matchingRegions.map((region) => {
              const selected = selectedRegion === region.id;
              return (
                <button
                  key={region.id}
                  type="button"
                  className="ep-paper ep-region-card"
                  aria-pressed={selected}
                  onClick={() => {
                    onRegionSelect(selected ? null : region.id);
                    setActiveTab('dishes');
                  }}
                  style={{ '--region': region.color } as CSSVars}
                >
                  <span className="ep-paper-edge" aria-hidden="true" />
                  <span className="ep-map-dot" aria-hidden="true" />
                  <small>{region.states.slice(0, 3).join(' · ')}</small>
                  <strong>{region.name}</strong>
                  <span>{region.signature}</span>
                  <span className="ep-region-meta">
                    <b>Staple</b> {region.staple}
                  </span>
                  <span className="ep-region-action">
                    <Navigation size={14} aria-hidden="true" />
                    {selected ? 'Clear this region' : 'Explore its dishes'}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === 'festivals' && (
          <div className="ep-card-grid">
            {matchingFestivals.map((festival) => (
              <article key={festival.id} className="ep-paper ep-note-card">
                <span className="ep-paper-edge" aria-hidden="true" />
                <span className="ep-note-glyph" aria-hidden="true">{festival.glyph}</span>
                <p className="ep-card-kicker">{festival.when}</p>
                <h3>{festival.name}</h3>
                <button
                  type="button"
                  className="ep-place"
                  onClick={() => onRegionSelect(festival.region)}
                >
                  <MapPin size={13} aria-hidden="true" /> {festival.place}
                </button>
                <p>{festival.significance}</p>
                <p className="ep-menu"><strong>On the table</strong> · {festival.dishes.join(' · ')}</p>
                <WikipediaLink href={festival.wikipedia} label={festival.name} />
              </article>
            ))}
            {matchingFestivals.length === 0 && (
              <p className="ep-no-results">No matching festivals in the current collection.</p>
            )}
          </div>
        )}

        {activeTab === 'spices' && (
          <div className="ep-spice-trail">
            {matchingSpices.map((spice, index) => (
              <article
                key={spice.id}
                className="ep-paper ep-spice-card"
                style={{ '--spice': spice.color, '--trail-index': index } as CSSVars}
              >
                <span className="ep-paper-edge" aria-hidden="true" />
                <span className="ep-spice-seed" aria-hidden="true" />
                <div>
                  <p className="ep-card-kicker">{spice.compound}</p>
                  <h3>{spice.name}</h3>
                  <p className="ep-native" lang="hi" dir="auto">{spice.nativeName}</p>
                </div>
                <p><strong>On the palate.</strong> {spice.effect}</p>
                <p><strong>Along the trail.</strong> {spice.lore}</p>
                <WikipediaLink href={spice.wikipedia} label={spice.name} />
              </article>
            ))}
            {matchingSpices.length === 0 && (
              <p className="ep-no-results">No spices mapped to this rasa yet.</p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
