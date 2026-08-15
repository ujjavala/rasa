/**
 * Shared domain contract for "Rasa — The Tongue Map of India".
 * Every data file and component codes against these types.
 */

/** The six tastes of Ayurveda (Shadrasa). */
export type RasaId =
  | 'madhura' // sweet
  | 'amla' // sour
  | 'lavana' // salty
  | 'katu' // pungent
  | 'tikta' // bitter
  | 'kashaya'; // astringent

/** Broad culinary zones of India. */
export type RegionId =
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'northeast'
  | 'central'
  | 'coastal'
  | 'himalayan';

/** How a dish shows up in real life. */
export type DishContext =
  | 'everyday'
  | 'festival'
  | 'street'
  | 'folk'
  | 'temple'
  | 'royal'
  | 'ritual'
  | 'monsoon';

export type Intensity = 1 | 2 | 3 | 4 | 5;

export interface Rasa {
  id: RasaId;
  /** Devanagari name, e.g. मधुर */
  sanskrit: string;
  /** Romanised Sanskrit, e.g. Madhura */
  name: string;
  /** Plain-English taste, e.g. Sweet */
  english: string;
  /** Ayurvedic elemental pairing, e.g. 'Earth + Water' */
  elements: string;
  /** One-line poetic hook shown on the tongue map. */
  tagline: string;
  /** 2–3 sentence description of the rasa's role in Indian cooking. */
  description: string;
  /** The Ayurvedic doctrine: what this rasa does to the body/doshas. */
  doctrine: string;
  /** Which doshas it pacifies / aggravates, human readable. */
  dosha: string;
  /** A myth this rasa busts about "Indian food". */
  mythBuster: string;
  /** Signature ingredients that carry this rasa. */
  carriers: string[];
  /** Colour ramp for the rasa — CSS colour strings. */
  color: {
    /** Core hue used for glow and accents. */
    base: string;
    /** Lighter tint for highlights. */
    light: string;
    /** Deep shade for shadows/depth. */
    deep: string;
    /** Ink colour that reads legibly on `light`. */
    ink: string;
  };
  /**
   * Where this rasa's taste-bud cluster sits on the tongue map,
   * as percentages of the tongue's bounding box (0–100).
   * Also used as the transform-origin when the map zooms into the zone.
   */
  zone: {
    x: number;
    y: number;
    /** Radius of the cluster as a % of tongue width. */
    r: number;
    /** Scale factor applied when this zone is zoomed into, map-style. */
    zoom: number;
  };
}

export interface Dish {
  id: string;
  name: string;
  /** Name in its own script/language, e.g. 'पूरन पोळी' */
  nativeName: string;
  /** The language the native name is in. */
  language: string;
  rasa: RasaId;
  /** Secondary rasas present — Indian food is rarely mono-taste. */
  secondaryRasa?: RasaId[];
  region: RegionId;
  /** Specific state or community, e.g. 'Maharashtra' or 'Chettinad, Tamil Nadu'. */
  origin: string;
  contexts: DishContext[];
  /** 1–5, how loud the primary rasa is. */
  intensity: Intensity;
  /** One-line description shown in cards. */
  blurb: string;
  /** 2–4 sentences of real history: era, dynasty, trade route, migration. */
  history: string;
  /** What makes it taste the way it does — the technique or chemistry. */
  technique: string;
  /** Key ingredients. */
  ingredients: string[];
  /** When/why it is eaten — festival, season, ritual. */
  occasion?: string;
  /** A single surprising fact. */
  didYouKnow: string;
  /** Emoji or short glyph used as a lightweight visual token. */
  glyph: string;
  /** Full canonical Wikipedia URL for "read more". Must be a real, existing article. */
  wikipedia: string;
  /**
   * Pure-CSS plate art recipe. The DishPlate component renders these as
   * stacked, styled layers — no images anywhere in this project.
   */
  plate: PlateArt;
}

/** Declarative recipe for the pure-CSS dish illustration. */
export interface PlateArt {
  /** The vessel the dish is served in. */
  vessel: 'thali' | 'banana-leaf' | 'kadai' | 'bowl' | 'clay-pot' | 'leaf-cone' | 'plate';
  /** Base colour of the food mass. */
  base: string;
  /** Secondary colour — gravy, syrup, chutney. */
  accent: string;
  /** Garnish colour — herbs, seeds, ghee. */
  garnish: string;
  /** Visual form of the food on the vessel. */
  form: 'round' | 'stack' | 'curry' | 'grains' | 'crescent' | 'cone' | 'cubes' | 'strands';
  /** Whether to render animated steam. */
  steam: boolean;
}

export interface Region {
  id: RegionId;
  name: string;
  /** States/UTs covered. */
  states: string[];
  /** The flavour thesis of the region in one line. */
  signature: string;
  /** 2–3 sentences on geography, climate and trade shaping the food. */
  description: string;
  /** The fat that defines the region's cooking. */
  fat: string;
  /** Staple grain. */
  staple: string;
  /** Dominant rasas in this region. */
  dominantRasa: RasaId[];
  /** Accent colour for the atlas. */
  color: string;
  /** Approx position on a stylised map, 0–100 percentages. */
  pos: { x: number; y: number };
}

export interface Festival {
  id: string;
  name: string;
  /** e.g. 'Chaitra · March–April' */
  when: string;
  region: RegionId;
  /** Where it is celebrated. */
  place: string;
  /** Why food matters at this festival. */
  significance: string;
  /** Dish ids or free-text dish names eaten. */
  dishes: string[];
  /** The dominant rasa of the festival table. */
  rasa: RasaId;
  glyph: string;
  /** Real Wikipedia URL for the festival. */
  wikipedia: string;
}

export interface Spice {
  id: string;
  name: string;
  nativeName: string;
  /** Which rasa it primarily delivers. */
  rasa: RasaId;
  /** The active compound, e.g. 'Piperine'. */
  compound: string;
  /** What it actually does on the palate. */
  effect: string;
  /** Trade/colonial/botanical history in 1–2 sentences. */
  lore: string;
  color: string;
  /** Real Wikipedia URL for the spice. */
  wikipedia: string;
}
