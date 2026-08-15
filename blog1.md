*This is a submission for [Frontend Challenge - Comfort Food Edition, CSS Art](https://dev.to/challenges/frontend-2026-07-29).*

## Inspiration

What does comfort food look like when you don't use food photography?

That was the question behind **Rasa**.

Rasa is an interactive culinary atlas exploring India through **Shadrasa**, the six tastes described in Ayurveda:

* **Madhura** — sweet
* **Amla** — sour
* **Lavana** — salty
* **Katu** — pungent
* **Tikta** — bitter
* **Kashaya** — astringent

I wanted to turn those six tastes into something visual rather than simply presenting them as text or cards.

The result is a tongue-shaped interactive map.


![Six guided taste receptors are distributed across the tongue](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/qcyva31g7a7wtg74xxow.png)



One important clarification: the familiar "tongue taste map" is scientifically inaccurate. Taste receptors are distributed across the tongue. In Rasa, the tongue is purely a **cultural and artistic navigation metaphor**, not an anatomy diagram or medical claim.

The idea was to make something that felt like opening an old food journal rather than browsing a database.

## The CSS Art

The tongue is probably the most obvious piece of CSS art in the project.

It isn't an image.

It is a layered CSS illustration with:

* Six selectable rasa regions
* A draggable, bounded CSS 3D orbit
* Pointer-responsive lighting
* Pan and zoom
* Keyboard orbit and navigation
* A dedicated control to centre the 3D view
* Papillae and surface texture
* A median sulcus
* Subtle veins and mucosal variation
* Rim lighting
* Subsurface colour
* Counter-scaled labels that remain readable while zooming

The tongue can be explored almost like a little map.

Select a rasa and the camera moves towards that region, revealing the corresponding field notes.

The 3D effect does not use WebGL, canvas or a 3D library. JavaScript only captures pointer and keyboard input and updates a few CSS custom properties. Perspective, depth, lighting, counter-rotation and shadows remain CSS work.



![Nima, the bitterness guide](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/onlof446yu0s3zqan2xn.png)



That interaction was important to me.

I didn't want the CSS art to be something you simply look at.

I wanted it to become part of the interface.

## Making Food Without Food Images

The other fun constraint was food itself.

Instead of using food photography, every dish has a small declarative **plate-art recipe**.


![Pulihora, a South Indian dish](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/44a7bjbk5w8f926qz8oq.png)



The renderer combines things such as:

* Vessel
* Food form
* Colours
* Garnishes
* Texture
* Lighting
* Serving temperature

The renderer supports vessels including thalis, plates, bowls, kadhais, clay pots, banana leaves and leaf cones.

Food forms include rounds, stacks, curries, grains, crescents, cones, cubes and strands.

CSS then adds details such as oil sheen, highlights, contact shadows, steam, heat haze, condensation and cold mist.

So a dish isn't a static illustration.

It is data that becomes an illustration.

That was one of my favourite parts of building Rasa.

## Six Handcrafted Taste Guides

Each rasa is accompanied by a guide with a distinct silhouette, costume, hairstyle, expression and role:

* **Guddi**, the Culinary Archivist for sweet
* **Ami**, the Fermentation Botanist for sour
* **Neer**, the Coastal Navigator for salty
* **Tara**, the Spice Route Chronicler for pungent
* **Nima**, the Ethnobotanical Elder for bitter
* **Jamu**, the Tea and Tannin Cartographer for astringent

The characters are built from nested HTML and CSS rather than generated avatars, SVG artwork or image files. Gradients, borders, pseudo-elements, clipping and transforms create their faces, clothing, hair, accessories and tools.

They can greet the visitor, scout ingredients and share lore. Their mouths respond while they speak, and gestures such as walking, waving and pointing are finite rather than perpetual. This keeps the characters playful without turning the page into a wall of constant motion.

## Making CSS Feel Less Like CSS

A lot of the work was experimenting with the things CSS is surprisingly good at:

`gradients + shadows + transforms + masks + pseudo-elements + 3D transforms`

Individually, none of those are particularly exotic.

Combined carefully, they can start to feel much closer to illustration.

I also added a small layer of atmospheric "ingredient wind" across the site.

Different rasas get their own ingredient:

* Jaggery for sweet
* Mango leaf for sour
* Salt crystal for salty
* Chilli for pungent
* Neem leaf for bitter
* Jamun for astringent

The ingredients drift across the page like leaves in a breeze.

It is intentionally subtle.

It can also be paused, disappears in forced-colour mode, and respects reduced-motion preferences.

## CSS Art With a Purpose

One thing I wanted to avoid was making a collection of pretty CSS experiments that didn't actually help the user.

The visual language is tied to the content.

The tongue represents the six tastes.

The plate art represents the food.

The notebook changes atmosphere depending on the dish.

Hot dishes introduce warmth, steam and heat shimmer.

Chilled dishes introduce condensation, frost and cool mist.

Festival dishes receive restrained gold details.


![Festive dishes](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/06tjdc9i5c9yyl6713t9.png)



Street food gets a subtle field-stamp treatment.


![Street food dokhla](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/hfowflx3a8y2p8ft630a.png)



The visual effects are therefore part of the storytelling rather than decoration added afterwards.

## 84 Dishes Instead of Six

The six tastes are only the entry point.

Rasa contains **84 dishes**, with 14 primary dishes for each rasa, covering all 28 Indian states and multiple Union Territories across eight culinary macro-regions.

The dataset intentionally goes beyond the usual shorthand for Indian food.

There are:

* Everyday meals
* Breakfasts
* Snacks
* Street foods
* Festival foods
* Temple foods
* City specialities
* Folk and Adivasi traditions
* Fermented foods
* Coastal cuisines
* Mountain cuisines
* Sweets
* Drinks
* Pickles
* Breads
* Rice dishes
* Curries
* Preserved foods

The goal was breadth rather than stereotype.

## The Technical Side

Rasa is built with:

* React 18
* TypeScript 5.7
* Vite 6
* Tailwind CSS 4
* Lucide React
* Handcrafted CSS character art
* Playwright
* axe-core

The application is data-driven.

The six rasas, dishes, regions, festivals, spices and guides are represented as domain models rather than being embedded directly into components.


![Indian Regions](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/ck3634i8zqixxu2c01ev.png)



That makes the CSS renderer reusable.

A `Dish` can describe what something is, while its `PlateArt` recipe describes how it should look.

That separation made it much easier to keep adding dishes without creating a new component for every food.

## Accessibility Still Applies to CSS Art

One of the interesting challenges was making something visually experimental still behave like a normal application.

The map is keyboard-operable.

The rasa controls, field-note tabs, guide commands, notebook corners and CSS 3D orbit are keyboard-operable.

Interactive controls have accessible names and 44 × 44px minimum targets.

There is a skip link.

Notebook page changes are announced to screen readers.

The experience supports reduced motion, persistent motion controls, forced colours, 200% zoom, text-spacing overrides and 320px reflow. Native dish names carry language metadata, page and guide changes use polite status announcements, and textured-paper text now uses darker ink colours for enhanced contrast.

I also added 13 Playwright accessibility and interaction journeys. They run axe with WCAG 2.0, 2.1 and 2.2 A, AA and AAA tags, exercise all six rasa states and all field-note tabs, and check keyboard selection, reduced motion, text spacing, target sizes, finite guide animation, CSS 3D keyboard orbit and notebook corner navigation.

The latest automated run passes all 13 journeys with no axe violations or unresolved structural ARIA checks. Textured gradients can prevent automated tools from resolving every contrast pair, so the underlying ink-on-paper colour pairs were also reviewed directly. This still is not a claim that automation proves complete WCAG AAA conformance: manual testing remains necessary for reading order, language and pronunciation, cognitive clarity, and real assistive-technology behaviour.

## What I Learned

The biggest lesson was that CSS art becomes much more interesting when it has a job.

It is tempting to ask:

> "How can I make this look cool with CSS?"

A better question turned out to be:

> "What should this visual communicate?"

Once the answer was clear, the implementation became much easier.

The tongue needed depth because it was a map.

The food needed texture because it represented serving and preparation.

The notebook needed page turns because the content was designed as a field journal.

The current notebook has clickable outer page corners as well as conventional Previous and Next controls. Each corner uses a small rounded CSS curl: the right edge lifts subtly upward and left, while the left edge lifts upward and right. The fold, underside, highlight and shadow are all CSS, while the button underneath remains semantic and keyboard accessible.

The motion needed to communicate state instead of simply moving things around.

That became one of the design principles for the entire project:

**Motion should explain state or create atmosphere, never prevent reading.**

## Demo

🍛 **Try Rasa:** https://rasa-mu.vercel.app/

The source code is available on GitHub:

{% embed https://github.com/ujjavala/rasa %}

Youtube link: 

{% embed https://youtu.be/Ayx92pdAXPI %}

## What's Next?

There are plenty of things I'd like to explore further:

* Ingredient and state-based search
* Seasonal food trails
* Audio pronunciation for native dish names
* More community-reviewed cultural sources
* Shareable notebook pages
* Deeper VoiceOver, NVDA, TalkBack and keyboard-only testing

For now, Rasa is my little experiment in asking:

**How far can CSS go when you stop treating it as styling and start treating it as an illustration medium?**

And perhaps more importantly:

**Can a website about comfort food make you hungry without using a single food photograph?** 🍚
