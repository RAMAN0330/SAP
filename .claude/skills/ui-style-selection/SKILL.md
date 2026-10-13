---
name: ui-style-selection
description: Choose the visual design style for a new UI project (spatial UI, glassmorphism, neumorphism, claymorphism or maximalism), then apply it with a matching colour palette, tokens and QA checks. Use at the start of every new frontend, dashboard, app or website project, and whenever the user asks which design style to use, asks for a redesign, a new colour palette, or a "more enhanced" look.
---

# UI style selection

At the start of every new UI project (or redesign), pick ONE primary style from the five below, optionally plus one accent style. Tell the user the choice and give a one-line reason, then build with it. Only ask the user to choose when the project type is genuinely unclear. Otherwise recommend a style and let them override it.

The workflow is: **classify → pick style → pick palette → write tokens → build → QA**.

## The five styles

| Style | What it is | Strengths | Weaknesses |
|---|---|---|---|
| **Spatial UI** | The content's real space (a map, floor plan, 3D model or canvas) is the workspace. Panels float over it with depth hierarchy. Selecting an object moves the camera to it and anchors its details beside it. | Shows *where* things are; keeps context; great for anything physical or geographic. | Needs real spatial data; heavier to build (3D or map stack); poor fit for list- or form-heavy apps. |
| **Glassmorphism** | Translucent frosted panels (backdrop blur) over a background that carries meaning. | Keeps the background visible under overlays; modern and light. | Text is harder to read over busy backgrounds; blur is costly on low-end devices. Best as an **accent**, not a base. |
| **Neumorphism** | Soft extruded or pressed shapes in the same colour as the background, at low contrast. | Calm, tactile, minimal. | Poor contrast and accessibility (easily fails WCAG); pressed and unpressed states look alike. Use only for tiny, low-stakes surfaces such as a single control panel or a music player. |
| **Claymorphism** | Chunky, rounded, inflated 3D-looking shapes with soft inner shadows and pastel colours. | Friendly, playful, memorable. | Uses a lot of space; reads as a toy in professional contexts unless it is restrained. |
| **Maximalism** | Bold colour, dense layering, mixed type, with decoration as a feature. | Strong personality and brand expression; stands out. | Competes with status and error signals; tiring over long sessions; hard to scan. |

## Decision procedure

1. **Is the work about stakes and speed?** Examples: operations, control rooms, monitoring, trading, medical, admin consoles, or anything with alarms, approvals or long sessions.
   - Use a calm, muted base and reserve colour for state (the ISA-101 "high-performance HMI" principle).
   - Never use neumorphism, claymorphism or maximalism here.
   - If the domain is physical or geographic (grid, fleet, logistics, buildings, field assets, maps), choose **Spatial UI + Glassmorphism accent**.
   - Otherwise, choose a **clean flat base + Glassmorphism accent**, using glass only for overlays (drawers, popovers, floating panels).
2. **Is it a data-heavy productivity tool** (CRM, analytics, internal tools, SaaS dashboards)?
   - Choose a **clean flat base**, with Glassmorphism only for overlays.
   - Add Spatial UI only if there is real spatial data.
3. **Is it consumer, onboarding, education, kids, or a habit or wellness app?**
   - Choose **Claymorphism**, with accessible text contrast. Use Glassmorphism for hero and overlay moments.
   - For adult or professional learners (career training, certification, upskilling), use **restrained clay**: one pastel family plus a single saturated action colour, medium radii on dense surfaces, and generous radii only on hero and feature objects.
4. **Is it brand, marketing, portfolio, editorial, fashion, music or an event site** (expression over efficiency)?
   - Choose **Maximalism**, kept to marketing surfaces.
   - Any functional flow inside it (checkout, forms) stays clean.
5. **Is it a small device-like surface** (a single widget, smart-home or media control, settings panel)?
   - **Neumorphism** is acceptable.
   - Verify text contrast is at least 4.5:1, and add a non-shadow cue (colour or icon) for on and off states.
6. **Is it an immersive or 3D product** (configurator, digital twin, AR/VR, game, visualisation)? Choose **Spatial UI**.

When two rules match, the higher-stakes rule wins, and rule 1 beats everything. For a redesign, keep the product's information architecture and any signature components; change the material, palette, shape and depth language.

## Palette selection

Pick the palette in the same step as the style. Write every colour as an `oklch()` token. Never use raw hex values inside components.

**The 60-30-10 structure.** About 60% of a screen is ground (canvas and surfaces), about 30% is structure (ink, borders, pastel trays), and about 10% is action. A product has **one** action hue. Status hues (success, warning, error, info) are separate tokens and are never decorative.

| Style | Ground | Structure | Action | Notes |
|---|---|---|---|---|
| Spatial UI | the map or canvas itself | slate glass `oklch(25% 0.03 260 / .7)` | one saturated hue (cyan or amber) | Status hues must also read on the map; outline them. |
| Glassmorphism | a meaningful gradient or photo | white 80–90% or slate 70% panels | one brand hue at L 50–60% | Test the panel over the busiest point of the background. |
| Neumorphism | one mid-light neutral (L 90–93%) | the same hue ±4% L for shadows | one accent used for the "on" state | Body text must be at L ≤ 35%. |
| Claymorphism | a tinted cream or mist (L 96–98%) | 4–5 pastels at L 88–94%, C 0.04–0.08 | one saturated hue at L 48–55%, C ≥ 0.18 | Text never sits on a pastel lighter than L 88% unless ink is at L ≤ 30%. |
| Maximalism | a bold base or off-white | 4–6 hues at full chroma | the highest-contrast pairing | Keep one neutral reading column for prose. |

Ready-made palettes with tokens are in `references/palettes.md`. Start from the closest one and shift the hue rather than inventing from scratch.

## Non-negotiables in every style

- Text contrast meets WCAG AA: 4.5:1 for body text, 3:1 for large text and UI components. Test glass panels over the busiest background they can appear on, and test pastel trays with the dimmest text you put on them.
- State never relies on shadow or translucency alone. Pair it with colour, an icon or a label.
- Error, warning and success colours are reserved for meaning, not decoration.
- Respect `prefers-reduced-motion`. For glass, fall back to an opaque surface when `backdrop-filter` is unsupported (`@supports not (backdrop-filter: blur(1px))`) or performance is poor.
- Keep one spacing scale, one radius scale and at most two typefaces (maximalism may use three on marketing surfaces).
- Support keyboard focus with a visible 2px ring in the action hue (or ink on action-coloured fills).
- Shadows are tinted with the palette's ink hue, never neutral grey.

## Implementation notes (Tailwind v4 / shadcn)

Define the palette once on `:root`, expose it through `@theme inline`, and restyle shadcn primitives through tokens rather than one-off classes.

- **Glass panel:** `bg-white/85 backdrop-blur-md border border-white/60 shadow-lg shadow-slate-900/5`. On dark maps, use a dark variant `bg-slate-900/70`. Keep opacity at 80% or more when text sits on the panel. Add a `glass` utility with an opaque fallback inside `@supports not (backdrop-filter: blur(1px))`.
- **Spatial:** make the map or canvas the page background (`fixed inset-0`). Put panels in an overlay layer with `pointer-events-none` on the layer and `pointer-events-auto` on each panel. Fly the camera to the selected object and anchor its detail card to it.
- **Neumorphism:** put two shadows (light top-left, dark bottom-right) on a surface the same colour as the background. Use the inset version for the pressed state.
- **Claymorphism:** use a large radius (`rounded-3xl`), a pastel fill, an outer soft shadow and an inner highlight, for example `shadow-[inset_0_-6px_12px_rgba(0,0,0,.08),0_12px_24px_rgba(0,0,0,.08)]`. Better: define three tokens (`--shadow-clay`, `--shadow-clay-lift`, `--shadow-clay-press`) that all use the ink hue. Make buttons pill-shaped with an inner top highlight; on press, translate them 1px down and switch to the press shadow.
- **Maximalism:** use a bold palette of 4–6 hues, oversized display type, layered imagery and texture. Keep the grid underneath so the page still scans.

## Enhancement pass (when asked to make it "more enhanced")

Apply these in order and stop when the page feels finished, not decorated:

1. **Depth:** three named elevation levels (rest, lift, press) and consistent hover and active transitions (200–300ms, ease-out-expo).
2. **Atmosphere:** one soft background layer on hero bands only (pastel radial blobs or a mesh), never behind dense content.
3. **Typography:** display headings at weight 800 with tight tracking, body at weight 400 and 1.6 line height, `text-wrap: balance` on headings and `pretty` on paragraphs.
4. **Micro-interactions:** springy press, a 2px hover lift on interactive cards, and a staggered entrance for lists, each with an instant reduced-motion path.
5. **Signature moment:** keep or create one memorable component per product (for example a live board, boarding pass or progress route) and give it the most polish.

## QA before handing over

- Typecheck and build pass.
- Screenshot every route at desktop (1440px) and mobile (390px) width. Check for horizontal overflow, clipped shadows and unreadable text on tinted surfaces.
- Check contrast for: body text on canvas, dim text on the pastel tray, white on the action colour, and each status ink on both white and the tray.
- Keyboard-tab through the header, a form and a card list, and confirm the focus ring is visible everywhere.
- Update the project's design doc (for example `DESIGN.md`) with the new tokens and rules.

## Output to the user

Start the project with one short line, for example:
"Style: Spatial UI + glass accents. It's a geographic operations tool where operators need to see where problems are, and colour must be reserved for alarms."

For a redesign, also give the palette in one line, for example:
"Palette: Dusk Clay. Lilac mist ground, pastel lilac/peach/mint trays, grape action colour, with green and amber reserved for status."
