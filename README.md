# Rasa — The Tongue Map of India

An interactive culinary atlas that explores India through **Shadrasa**, Ayurveda's six tastes: sweet, sour, salty, pungent, bitter, and astringent.

Rasa is a React experience built for the DEV Frontend Challenge themes **CSS Art: Comfort Food** and **Perfect Landing: Comfort Food**. It combines an editorial landing page, a zoomable CSS-art tongue map, character-led exploration, regional food history, and a page-turning field notebook containing 84 dishes from across India.

> **Important:** the familiar “tongue taste map” is scientifically inaccurate. Taste receptors are distributed across the tongue. This project uses the tongue only as a cultural and artistic navigation metaphor for the six rasas; it is not an anatomy chart or medical guidance.

## Why this project exists

Indian food is often flattened into a small set of restaurant dishes. Rasa was created to show a wider table: home cooking, street food, temple food, festival dishes, city specialities, fermentation traditions, folk and Adivasi foods, regional ingredients, and techniques shaped by climate, migration, ritual, and trade.

The central question behind the experience is:

> What if a food atlas felt less like a database and more like opening a traveller's field journal?

The result is deliberately tactile. Brass, paper, ink, food vessels, spice textures, map controls, page edges, shadows, and atmospheric movement are produced primarily with CSS rather than static illustration assets.

## Experience overview

### Editorial landing page

The landing page introduces the idea with a restrained editorial composition, an extremely slow-turning CSS flower with one vivid petal for each taste, an animated call to action, and a concise explanation of the atlas.

### Interactive tongue map

The map is a layered, three-dimensional CSS illustration with:

- Six selectable rasa regions
- Pointer-responsive depth and lighting
- Map-style pan and zoom
- Keyboard navigation between taste regions
- Escape and reset controls
- Counter-scaled labels that remain readable while zooming
- Anatomical surface details including a median sulcus, papillae, mucosal variation, faint veins, rim light, and subsurface colour
- A clear disclaimer that the map is metaphorical

Selecting a rasa moves the camera towards that region and opens its field notes.

### The six guides

Each taste has a persistent guide with a distinct age, role, silhouette, dialogue, and visual identity:

| Taste | Guide | Role |
| --- | --- | --- |
| Madhura · sweet | **Guddi** | Culinary Archivist |
| Amla · sour | **Ami** | Fermentation Botanist |
| Lavana · salty | **Neer** | Coastal Navigator |
| Katu · pungent | **Tara** | Spice Route Chronicler |
| Tikta · bitter | **Nima** | Ethnobotanical Elder |
| Kashaya · astringent | **Jamu** | Tea and Tannin Cartographer |

The portraits are hand-built from nested HTML elements and CSS gradients, borders, pseudo-elements, shadows, and transforms. No SVG, canvas, generated avatar, or image asset is used. The figures use finite command and travel gestures rather than distracting perpetual idle loops.

Guide commands include:

- **Greet** — introduces the guide and rasa
- **Scout** — surfaces characteristic ingredients
- **Lore** — reveals cultural context about the taste

### Culinary field notebook

Dish exploration uses a two-page, three-dimensional notebook instead of a conventional card grid.

- Previous and next page controls
- Direct dish selector
- Direction-aware page turns
- Region and context annotations
- Native names with appropriate BCP 47 language tags
- History, technique, ingredients, occasions, and food facts
- Links to canonical Wikipedia articles
- Responsive single-column book layout on narrow screens
- Screen-reader page announcements

The notebook changes atmosphere with the food:

- **Piping hot** dishes warm the paper and produce heat shimmer and steam
- **Chilled** dishes add cool paper tones, frost, condensation, and cold mist
- **Festival** foods receive restrained gold detail
- **Street food** receives a subtle field-stamp treatment
- Food forms influence the notebook watermark and plate composition

### Pure-CSS food portraits

Every dish has a declarative plate-art recipe. The renderer combines vessel, food form, colour, garnish, texture, lighting, and temperature effects.

Supported vessels:

- Thali
- Plate
- Bowl
- Kadai
- Clay pot
- Banana leaf
- Leaf cone

Supported food forms:

- Round portions
- Stacks
- Curry
- Grains
- Crescents
- Cones
- Cubes
- Strands

The food renderer adds oil sheen, irregular highlights, contact shadows, garnish depth, steam, heat haze, condensation, cold mist, and serving-temperature labels. No remote food photography is required.

### Full-site ingredient wind

Small CSS-art ingredients drift across the site like leaves in a light breeze:

- Jaggery for sweet
- Mango leaf for sour
- Salt crystal for salty
- Chilli for pungent
- Neem leaf for bitter
- Jamun for astringent

The layer is decorative, pointer-transparent, subtle, pausable, hidden in forced-colour mode, and disabled when reduced motion is requested.

### Regions, festivals, and spice trail

The field notes extend beyond dishes into:

- Eight culinary macro-regions
- Geography, staples, fats, and dominant tastes
- Festival food traditions
- Spice compounds, historical movement, and culinary effects
- State, city, community, folk, coastal, mountain, and regional contexts

## Content coverage

The dataset contains **84 dishes**, with 14 primary dishes for each rasa. It represents all 28 Indian states and multiple Union Territories across eight culinary macro-regions.

Coverage includes:

- Everyday meals
- Breakfasts and snacks
- Street foods
- Festival and temple foods
- City specialities
- Folk and Adivasi traditions
- Fermented foods
- Coastal and mountain cuisines
- Sweets, drinks, pickles, breads, rice dishes, curries, and preserved foods

The original cultural names are retained where possible, alongside language metadata and regional origin.

## Accessibility

Accessibility is part of the product design rather than a final audit step.

Implemented foundations include:

- Semantic landmarks, headings, lists, figures, tabs, and buttons
- Skip link
- Keyboard-operable map and tabs
- Roving tab index for the tab interface
- Visible high-contrast focus treatment
- Minimum 44 × 44 pixel interactive targets
- Accessible names for icon controls
- Native-name language tags and automatic text direction
- Status announcements for notebook pages and selected rasas
- Reduced-motion support
- Persistent pause/play motion control
- Forced-colours support
- 200% zoom and 320px reflow coverage
- Automated axe checks using WCAG 2.0, 2.1, and 2.2 A/AA/AAA tags plus best-practice rules

Automated tests are a safety net, not a claim that automation alone proves complete WCAG AAA conformance. Manual testing remains necessary for reading order, cognitive clarity, assistive-technology behaviour, and cultural comprehension.

## Technology

- React 18
- TypeScript 5.7 in strict mode
- Vite 6
- Tailwind CSS 4 via the Vite plugin
- Lucide React icons
- ESLint 9
- Stylelint
- Playwright
- axe-core for Playwright

## Architecture

The application is deliberately data-driven:

- `Rasa` defines each taste, doctrine, colour, map region, and zoom target
- `Dish` defines cultural content and a declarative `PlateArt` recipe
- `Region` defines macro-regional geography and food patterns
- `Festival` and `Spice` provide additional exploration paths
- React components render these models without embedding cultural content in view logic

Primary areas:

```text
src/
├── App.tsx                     Application state and interaction orchestration
├── components/
│   ├── SiteShell.tsx           Header, hero, atmospheric layer, footer
│   ├── TongueMap.tsx           Zoomable six-rasa map
│   ├── RasaExplorer.tsx        Pure-CSS guide portraits and finite command motion
│   ├── ExplorePanel.tsx        Tabs, storybook, dish and region exploration
│   ├── DishPlate.tsx           Data-driven CSS food renderer
│   └── *.css                   CSS art, 3D, responsive and a11y states
├── data/
│   ├── rasas.ts                Six taste records
│   ├── dishes.ts               84 dish records
│   ├── regions.ts              Eight culinary macro-regions
│   ├── festivals.ts            Festival-food records
│   ├── spices.ts               Spice-trail records
│   ├── explorers.ts            Guide identities and dialogue
│   └── serving.ts              Serving-temperature classification
└── types.ts                    Shared domain model

tests/
└── accessibility.spec.ts       Desktop and mobile accessibility journeys
```

## Motion philosophy

Movement should explain state or create atmosphere, never prevent reading.

- Guide commands are finite
- Travel movement stops when the guide arrives
- Notebook motion communicates page direction
- Food motion communicates serving temperature and texture
- Ingredient wind is slow and decorative
- The global motion control persists through `localStorage`
- `prefers-reduced-motion` removes non-essential animation

## Running locally

### Requirements

- Node.js 20 or newer
- npm 10 or newer recommended

### Install

```bash
npm install
```

### Start the development server

```bash
npm start
```

The terminal prints the local URL, normally `http://localhost:5173`.

### Production build

```bash
npm run build
npm run preview
```

## Quality commands

```bash
npm run typecheck   # strict TypeScript validation
npm run lint        # ESLint with zero warnings allowed
npm run lint:css    # Stylelint over source CSS
npm run build       # typecheck and optimized Vite build
npm run test:a11y   # Playwright + axe desktop/mobile checks
npm run quality     # complete quality gate
```

Playwright requires its Chromium browser on a new machine:

```bash
npx playwright install chromium
```

## Design principles

1. **Breadth over stereotype** — represent many Indian food traditions, not a restaurant shorthand.
2. **Context over list-making** — connect dishes to place, community, technique, history, and occasion.
3. **CSS as illustration** — use gradients, shadows, transforms, masks, and generated geometry as the primary visual material.
4. **Motion with meaning** — animate navigation, serving temperature, and atmosphere rather than adding constant noise.
5. **Progressive accessibility** — preserve content and controls when motion, colour, pointer input, or wide layouts are unavailable.
6. **Cultural humility** — present an invitation to explore, not a claim that one atlas can exhaust India's food cultures.

## Data and attribution

- Dish “read more” links point to Wikipedia for further context. Those pages and their contents remain under their respective licences.
- Lucide icons are provided by [Lucide](https://lucide.dev/).
- The food and tongue illustrations in the interface are generated from project CSS and application data; the application does not depend on remote food photographs.

## CSS-first implementation

JavaScript is reserved for purposeful interaction: selecting a taste, moving the map camera, paging through field notes, and pausing motion. The visual language—food, vessels, ingredients, landscape, tongue, guide characters, texture, depth, lighting, and atmosphere—is authored in CSS.

## Future directions

- Search by ingredient, state, season, and cooking technique
- Optional audio pronunciation for native dish names
- Pre-generated guide SVG assets for a smaller bundle
- Deeper community-reviewed citations and oral-history sources
- User-created food trails and shareable notebook pages
- Additional accessibility testing with VoiceOver, NVDA, and keyboard-only user sessions

---

**Rasa is a small celebration of India's very large table.**
