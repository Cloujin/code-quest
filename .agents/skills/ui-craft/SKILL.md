---
name: ui-craft
description: "Product UI craft rules distilled from our design references — edges and alignment, differentiating dense content, visuals over text, emphasis by contrast with neighbours, data driving the form, progressive disclosure, invisible UI (hover, tooltips, states), colour in four layers (neutrals, accent ramp, semantic, OKLCH charts), dark mode, and landing-page identity. Load before designing, building or reviewing ANY interface in ANY project — screens, cards, tables, dashboards, settings, forms, landing pages — and run its checklist before calling UI done. Project design systems still win on tokens and components."
---

# UI craft

The standing rule: **every UI in this repository is built and reviewed against this skill.**
A project's own design system (tokens, component vocabulary, page anatomy) wins wherever the
two disagree on specifics; this skill supplies the judgment the design system does not write
down. Deeper notes: `references/color.md`, `references/landing-pages.md`,
`references/ai-products.md`.

**The one idea under all of it: nobody reads a screen.** People arrive with one question and
hunt for one answer — one file, one setting, one row. Every rule below exists to make a screen
faster to *scan*, not prettier.

## 1. Edges hold everything together

- **Lock every element to an edge.** A card has four edges; a row, an avatar and a heading make
  more. Text hard left, numbers and prices hard right, like a receipt. Centre only what is not
  meant to be read (codes, decoration).
- **Two strong edges beat dividers and whitespace.** Before adding a divider, a box or padding,
  ask which edge the content should hang from.
- **When content does not line up, manufacture an edge** (a header row, a subline, an avatar
  baseline) instead of hiding things in a menu. Hiding is not the default fix.
- **Bigger icons lose the bottom edge** — restore it with a subline.
- **Width is part of the edge.** Lines that run the full width of a wide screen are a chore to
  read. Constrain measure; let columns, not the viewport, set line length.
- **Don't nest containers.** Borders on borders and three stacked radii add nothing. A single
  column line or section heading can dissolve cards into the page; the column edge does the
  card's job. Concentric radii when nesting is unavoidable (inner = outer − padding).

## 2. Differentiate, don't pad

- Density is not the problem; **undifferentiated** density is. Adding whitespace only makes the
  wall longer.
- **Group** (by date, status, owner, section) so any item is found in about a second.
- **Vary the content type**: avatars where people are referenced, chips for finite sets
  (department, status, type), icons for categories, monospace/tabular figures for numbers.
- Tables: chips for enumerations, **numbers right-aligned with tabular figures**, truncate long
  text to give other columns room, shade inactive/deactivated rows.

## 3. Show, don't tell

- **Swap text for instantly recognised visuals**: icons, diagrams, avatars, a from→to line, a
  progress ring, a sparkline, a map. A stop sign needs no label.
- The instinct when something is unclear is to explain harder (another label, comparison,
  tooltip). That makes the screen harder to read to make it easier to understand — almost never
  worth it. Pick the visual that needs no explanation.
- **Signifiers do the teaching**: a container means grouped, a filled pill means selected, grey
  means inactive, placement means scope (a checkbox above a list selects the list). If a control
  needs a tooltip to be guessed, first try a better signifier; keep the tooltip as backup.
- Links look like links; categories are chips — and chips double as the control to change them.

## 4. Emphasis is relative

- **Emphasis is the difference between an element and its neighbours**, not a property of the
  element. Make something stand out by quieting what surrounds it, not by making it louder.
- **Default values are quiet.** A filter reading "all", a setting at its default, an unchecked
  box: grey, thin, no fill. Only a changed/non-default value earns colour and weight — exactly
  like a checkbox that only gains fill and a check when on. Six blue "default" chips is six
  checkboxes that are blue when off.
- One accent-coloured thing per region at most; the one blue item in a menu is the upsell.
- Hierarchy tools are size, position and colour/contrast. Most important: top, bigger, colourful
  (price top-right in the accent). Least: smaller, lower, grey.

## 5. Let the data drive the form

- Choose the shape from the data: finite set → chips; quantity → right-aligned figure;
  time-ordered events → a **timeline**, not a time-sorted table; trend → a chart beside or above
  the list; geography → a map; part-of-whole → donut/bar.
- **Colour comes from the data** (urgent = red icon/chip), never sprinkled for decoration.
- Roll a log up into a small chart when it has a time dimension.
- Don't repeat the same KPIs on several screens; each screen answers its own question.

## 6. Progressive disclosure and the spectrum of explicitness

- Every action sits somewhere on a spectrum: always-visible labelled button → icon button →
  revealed on hover/focus/swipe → inside a popover or `⋯` menu → behind a page. Place each action
  by how often and how importantly it is used, not by how easy it was to build.
- Primary action visible and labelled; secondary actions on hover with a tooltip; rare actions
  in a menu or popover; **a popover beats sending the user to another page**.
- Hover-only actions must still be reachable by keyboard focus and on touch (visible on
  `:focus-within`, or always visible below `sm`).
- **Onboarding is progressive disclosure**: one pointer at the most important action, then the
  next, or a small checklist — never a six-bullet modal on first login.
- Load-more over infinite scroll (control, and the footer stays reachable).

## 7. The invisible UI is most of the UI

A finished product is mostly UI you do not see at first glance. Design all of it:

- **States for every control**: default, hover, active/pressed, focus, disabled, loading.
  Inputs add focus, error (red border + message beside the field), warning.
- **Every action gets a response**: spinner while waiting, success confirmation, error with a
  way forward. Micro-interactions confirm the invisible (a "Copied" chip sliding up).
- **Empty, loading, error, success** for every screen and panel. An empty state says what is
  missing and the next step, with one call to action.
- **Tooltips on every icon-only control and ambiguous label**; keyboard shortcuts shown in them.
- Hover affordances on dense data: copy-on-hover cells, comment indicators, row actions.
- **Design flows, not screens**: ask how the user got here and what they need next (create team
  space → immediately offer "add members", skippable).
- Design for imperfect content: very long names (truncate + title), missing images, bright
  images under icons (give icons a backing circle), zero, one, many.

## 8. Basics that are always on

- **One sans-serif family** for product UI. Large headings: letter-spacing −2 to −3%, line-height
  110–120%. Dashboards rarely need text above ~24px.
- **Icon size = the line height of the text beside it** (16px text/24px line → 20–24px icon,
  then tighten), and from one interface icon set (Phosphor, Lucide). **Never emoji as UI icons.**
- 4-point spacing; group related items tighter than unrelated ones (proximity is hierarchy).
  Button padding: width ≈ 2× height.
- **Shadows**: if the shadow is the first thing you notice, it is too strong. Low opacity, more
  blur; cards weak, popovers stronger. In dark mode depth comes from lighter surfaces, not
  shadows.
- **Animation must add clarity or function** (direct the eye, show where something went,
  confirm an action). Buttons almost always get a small press response; scroll-jacking almost
  never. Everything collapses under `prefers-reduced-motion`.
- **Text over images** needs a gradient (optionally a progressive blur), not a flat full overlay.
- Respect conventions (nav top, content top-to-bottom, left-to-right, CTA easy to find); be
  original in the details, not in where things are.
- A design system is a set of decisions you stick to, not hundreds of components: same button
  rules, spacing and type everywhere builds trust (the safe action is always the primary
  colour in a destructive confirm).

## 9. Colour in one paragraph

Neutrals do almost all the work (layered backgrounds, 1–2 strokes, ~3 text greys; text never
pure black — headings ≈11% lightness, body 15–20%, subtext 30–40%). One accent as a full ramp
(500/600 main, 700 hover, lighter for tints). Semantic colours break the system on purpose (red
is always destructive). Charts use an **OKLCH** series: same L and C, hue stepped 25–30°. Dark
mode doubles the lightness distance between layers, raises elevated surfaces, dims text,
brightens borders, uses the 300–400 of the accent. Details: `references/color.md`.

## 10. Checklist before UI is done

1. Is every element locked to an edge? Anything floating, centred without reason, or full-width
   prose on a wide screen?
2. Is dense content grouped and varied (avatars, chips, icons, right-aligned tabular numbers)?
3. Could any label, sentence or tooltip be replaced by a visual that needs no reading?
4. Are default values quiet and only changed values emphasised? At most one loud thing per
   region?
5. Does the data's shape (set, quantity, time, place) decide the component?
6. Is every action at the right point on the spectrum of explicitness? Are hover actions
   reachable by keyboard and touch?
7. Do all states exist: hover, focus, pressed, disabled, loading, empty, error, success? Long
   and missing content?
8. Tooltips on icon-only controls; shortcuts shown where they exist?
9. No nested cards, no stacked borders, no emoji icons, no shadow you notice first?
10. Light **and** dark checked, phone width checked, reduced motion checked — in a real browser.
