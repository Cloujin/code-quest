# Colour for product UI — four layers

Product UI is not 60/30/10. Vercel is ~90% black, 8% white, 2% red. Colour is mostly neutrals,
with accent and meaning applied sparingly.

## Layer 1 — neutral foundation

- Backgrounds: near or pure white (Linear 99%, Notion 100%, Vercel 98%). A product needs about
  four background layers, one or two strokes, three text variants, plus hover states.
- The app frame (sidebar) is a slightly darker anchor — a large element needs only a tiny shift
  (Mercury adds ~2% blue).
- Light mode is flexible: dark background + lighter cards (Vercel), light background + darker
  cards (Notion), or monochrome layers (Supabase). If cards are pure white, the background should
  not be.
- Card edges: no thin black border; use a stroke around 85% lightness so the edge is defined
  but quiet. A subtle shadow alone washes out.
- **The more important a button, the darker it is**: ghost → ~90–95% neutral → solid accent →
  black with white text.
- Text: headings ≈ 11% lightness, body 15–20%, subtext 30–40%. Never pure black.

## Layer 2 — functional accent

- Think in a **ramp** (50–950), not one colour. Main 500/600, hover 700, link 400/500, tints for
  backgrounds (e.g. selected row, chip fill), darks for text on tints.
- Generate the ramp with a tool (uicolors.app or OKLCH stepping) so dark mode can reuse it.
- Some products stay neutral; the accent should be recognisable (Linear blue-violet, Supabase
  green) and used for function, not decoration.

## Layer 3 — semantic colour

- Meaning overrides the brand: success green, warning amber, danger red, info blue. Destructive
  is red even when the brand is purple.
- Status at a glance (build succeeded / failed / running) should be readable from colour + icon
  without the label.
- Charts need a full spectrum, not the brand ramp (too similar) and not grey (lifeless). Use
  **OKLCH**: fix lightness and chroma, step hue by 25–30°, so every series has the same perceived
  brightness (bright green otherwise looks neon next to blue).

## Layer 4 — theming and dark mode

- **Dark mode is not the inverse.** Dark colours look more alike, so double the lightness step
  between layers (light ≈ 2% apart → dark 4–6% apart).
- Elevated surfaces always get **lighter** in dark mode; depth from lightness or a border, not
  shadows.
- Accent shifts to the 300–400 step (hover 400–500). Dim body text slightly, brighten borders,
  lower chip saturation and brightness, flip chip text for hierarchy.
- Dark doesn't have to be navy or grey — deep purple, red or green neutrals work.
- **Theming any neutral palette**: in OKLCH, drop lightness ~0.03, add chroma ~0.02, set the hue.
  Works for light and dark.
