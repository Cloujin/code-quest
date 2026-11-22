# Patterns from good AI products, and fixing vibe-coded apps

## AI tool patterns

- **The prompt box is the product.** Land users in it. Make it useful: previews of attached
  PDFs and images, pasted code collapsed into a block, mode chips (brainstorm, data, email),
  context chips (files, repos), integrations (Drive, GitHub, Figma), progressive disclosure
  (advanced toggle, token cost estimate).
- **Loading is short, looping, fluid** (three dots, a rotating mark); stream output; skeletons
  with shimmer that the real content slots into.
- **History is retrievable**: first-line preview, delete, search.
- **Memory is visible and controllable**: what is stored, how much space, bulk delete, add a
  fact.
- **Inline editing**: highlight, type the change, keyboard shortcuts — revision, not
  regeneration.
- **Show the work**: research steps, sources, a short animated trail.
- **Confidence**: a pill under the answer (high confidence / unverified) that reveals the number.
- Dark soft glass: translucent fill, subtle gradient, background blur, 1px border, soft inner
  shadow, an optional slow shimmer on the border.

## Fixing a vibe-coded app

- Replace emoji with an interface icon set.
- Don't let the generator pick colours or layout; check every repeated KPI block, and remove
  cards that do nothing.
- Sidebar: only what a user navigates to; account card at the bottom with a popover holding
  settings, billing and usage.
- Busy list cards: actions into a `⋯` menu, chips reduced to icons, the key number right-aligned.
- Sparse flyout with few fields → a modal; advanced options collapsed by default.
- Replace generic KPI rows with a two-column layout and small charts; replace a plain bar chart
  with the visual the data wants (a shaded map for geography).
- Cheap high-value features: compare items (toggle to split a chart per item), richer rows with
  helpful coloured icons.
- User intent first: start from what the user came to do (search), add only what serves a
  second intent (browse → listings → filters). Fonts and colours change the look, not the
  function.
