*This is a submission for [Frontend Challenge - Comfort Food Edition, Perfect Landing](https://dev.to/challenges/frontend-2026-07-29).*

## What I Built

I built **Rasa**, an interactive culinary atlas that explores India through the six tastes of **Shadrasa**:

**sweet, sour, salty, pungent, bitter and astringent.**


![Image showing India is more than just butter chicken. Also has a rasa wheel on the right](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/ib3w8to8e1pdtahpjguy.png)



The starting point was simple:

> What if a food atlas felt less like a database and more like opening a traveller's field journal?

That idea shaped the entire landing page.

Instead of starting with a grid of dishes or a traditional restaurant-style hero, I wanted the page to feel editorial, tactile and slightly mysterious.

The landing page introduces the six tastes through a CSS-built rasa mandala and then invites the visitor into the atlas.

From there, the experience expands into an interactive tongue map, character-led exploration, regional food history and a page-turning culinary notebook containing 84 dishes.

## The Landing Page Is the Beginning, Not the Destination

I approached the hero as an invitation rather than a summary.

The visitor first encounters the concept of Rasa.

Then the six tastes.

Then the tongue.

Then the exploration.

That progression was deliberate.

I didn't want to put every feature into the first screen.

The landing page establishes the mental model first:

**Rasa → taste → region → dish → story**

Once that relationship is understood, the rest of the application becomes easier to navigate.

## Why a Tongue?

There is a familiar visual idea of dividing the tongue into taste regions.


![Has a 3D tongue on which personified taste guides stand](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/b3n0ohgr209vbyn7tfpb.png)


Taste receptors are distributed across the tongue, so Rasa does **not** present this as an anatomy chart.

Instead, I used the tongue as a visual metaphor.

Six regions.

Six tastes.

Six entry points into a much larger culinary landscape.

The tongue is interactive, zoomable and keyboard accessible. It also supports a shallow, bounded 3D orbit: visitors can drag the backdrop, use arrow keys, hold Shift for larger steps, or press Home and the dedicated centre control to reset the view.

Selecting a rasa moves the camera towards that region and opens its field notes.

The depth effect is still CSS-first. JavaScript captures input and updates CSS custom properties; perspective, layer separation, lighting, shadows and character depth are rendered in CSS. There is no canvas, WebGL or 3D dependency.

So the hero concept eventually becomes the primary navigation mechanism.

## From Landing Page to Field Journal

The biggest design decision was to avoid making the experience feel like a food catalogue.

India has far too many food traditions for that approach to feel right.

Rasa explores:

* Everyday home cooking
* Street food
* Festival and temple food
* City specialities
* Folk and Adivasi traditions
* Fermented foods
* Coastal cuisines
* Mountain cuisines
* Regional ingredients and techniques

The current dataset contains **84 dishes** across eight culinary macro-regions, representing all 28 Indian states and multiple Union Territories.

Each dish includes context around its history, ingredients, technique, occasions and regional identity.

The landing page therefore needed to communicate **exploration**, not simply consumption.

## Meet the Guides

I also wanted the interface to have some personality.

Each rasa has a guide with a distinct identity:

| Taste                | Guide | Role                        |
| -------------------- | ----- | --------------------------- |
| Madhura · sweet      | Guddi | Culinary Archivist          |
| Amla · sour          | Ami   | Fermentation Botanist       |
| Lavana · salty       | Neer  | Coastal Navigator           |
| Katu · pungent       | Tara  | Spice Route Chronicler      |
| Tikta · bitter       | Nima  | Ethnobotanical Elder        |
| Kashaya · astringent | Jamu  | Tea and Tannin Cartographer |

Each guide can:

* Greet
* Scout ingredients
* Reveal lore

The portraits are handcrafted from nested HTML and CSS. Each guide has a different figure, skin tone, costume, hairstyle, accessories and expression, with Guddi, Tara and Nima represented as women and Ami, Neer and Jamu as men. They use no generated avatar package, SVG character asset or image file.

Their walking, waving, scouting and lore gestures are intentionally finite rather than constant idle animation. Speech bubbles restart for each command, and the mouth moves briefly while a guide talks.

That was another deliberate choice.

I wanted characters to feel responsive rather than noisy.

## The Notebook

The deeper you go into the experience, the more the interface changes.

Instead of a conventional card grid, dishes appear in a two-page field notebook.

You can turn pages.

You can also use the lifted outer corners: the right corner turns forward and the left corner turns backward. They are semantic buttons with subtle rounded CSS curls that rise inward like the edge of a real page, while the existing Previous, Next and direct-jump controls remain available.

Jump directly to a dish.

Move backwards and forwards.

See regional and contextual annotations.

Read the native name with appropriate language metadata.

Follow the dish to further context.

The notebook also changes atmosphere based on the food.

A piping-hot dish can introduce warmth, steam and heat shimmer.

A chilled dish can introduce frost, condensation and cool mist.

Festival foods receive restrained gold detailing.

Street foods receive a subtle field-stamp treatment.

This was my way of making the interface feel like a physical object rather than another collection of UI cards.

## Designing for Accessibility From the Start

A visually heavy landing page can very quickly become inaccessible.

So accessibility wasn't treated as something to check after the animations were finished.

The application includes:

* Semantic landmarks and headings
* A skip link
* Keyboard-operable navigation
* Roving tab navigation
* Visible focus states
* Accessible icon controls
* 44 × 44px minimum interactive targets
* Screen-reader announcements
* Reduced-motion support
* Persistent pause/play motion control
* Forced-colour support
* 200% zoom support
* 320px reflow
* Text-spacing resilience
* Keyboard control for the CSS 3D orbit and notebook corners
* Enhanced ink-on-paper contrast
* Automated axe checks through Playwright across all six rasa states and every field-note tab

The principle was simple:

**The experience should remain useful when the visual effects disappear.**

If someone disables animation, uses keyboard navigation, zooms the page or doesn't have pointer input, the content and navigation still need to make sense.

The current suite contains 13 accessibility and interaction journeys and passes in Chromium. It runs axe using WCAG 2.0, 2.1 and 2.2 A, AA and AAA tags, and now rejects unresolved structural ARIA findings as well as violations. Automation still cannot certify every AAA success criterion, especially where manual judgement, language, pronunciation, reading clarity or real assistive technology is involved, so manual review remains part of the roadmap.

## Motion With Meaning

There is quite a lot of movement in Rasa.

But every type of movement has a reason.

Guide movement communicates an interaction.

The camera movement communicates navigation.

Notebook movement communicates page direction.

Steam and heat haze communicate serving temperature.

Ingredient wind creates atmosphere.

And the global motion control lets the user pause the experience.

The application also respects `prefers-reduced-motion`.

This led to one of my favourite principles from the project:

> Movement should explain state or create atmosphere, never prevent reading.

## The Visual Language

I wanted the interface to feel somewhere between:

**a field journal + an old map + a recipe notebook + a museum exhibit.**

Brass.

Paper.

Ink.

Food vessels.

Spice textures.

Map controls.

Shadows.

Atmospheric movement.

Most of those visual elements are created with CSS rather than remote food photography.

That constraint ended up becoming one of the most interesting parts of the project.

## Technical Stack

The application is built with:

* React 18
* TypeScript 5.7 in strict mode
* Vite 6
* Tailwind CSS 4
* Lucide React
* Handcrafted HTML and CSS character art
* ESLint
* Stylelint
* Playwright
* axe-core

The application is deliberately data-driven.

Rasas, dishes, regions, festivals, spices and explorers are represented as data models.

React components are responsible for rendering those models rather than containing the cultural content themselves.

That made it possible to build a fairly elaborate experience without turning the components into giant collections of hard-coded content.

## What I Enjoyed Most

The most satisfying part was seeing a landing-page idea evolve into an actual world.

At first it was just:

**six tastes.**

Then:

**six tastes → six regions → six guides.**

Then:

**guides → dishes → regions → festivals → spices.**

Eventually it became an atlas containing 84 dishes and multiple ways to explore them.

That progression made the project feel much more like a small product than a challenge submission.

## What I Would Improve Next

There is still plenty I would like to add.

Some ideas are:

* Search by ingredient, state, season and technique
* Audio pronunciation for native dish names
* User-created food trails
* Shareable notebook pages
* More community-reviewed citations and oral-history sources
* More manual accessibility testing with VoiceOver, NVDA and TalkBack
* Additional contrast review for complex textured and gradient surfaces

## Demo

🍛 **Explore Rasa:** https://rasa-mu.vercel.app/

## Source Code

The project is open source on GitHub:

{% embed https://github.com/ujjavala/rasa %}

Youtube link: {% embed https://youtu.be/Ayx92pdAXPI %}

## Final Thought

I started with a comfort-food challenge.

I ended up building a small interactive atlas.

That was probably the most enjoyable part of the challenge.

Instead of asking:

**"How do I make a landing page about food?"**

I asked:

**"How would a food atlas feel if you could walk into it?"**

Rasa is my attempt at that answer.

A little paper.

A little spice.

A little CSS magic.

And a very large table. 🍛
