---
name: GoLive Academy
description: Interview-first SAP training, presented as an airport departures board.
colors:
  signal: "oklch(85.5% 0.165 86)"
  signal-ink: "oklch(19% 0.05 268)"
  go: "oklch(78% 0.17 155)"
  call: "oklch(76% 0.16 55)"
  board: "oklch(19% 0.052 268)"
  board-2: "oklch(24% 0.062 268)"
  tile: "oklch(27.5% 0.06 268)"
  tile-edge: "oklch(15% 0.045 268)"
  letter: "oklch(96.5% 0.008 262)"
  letter-dim: "oklch(72% 0.03 262)"
  concourse: "oklch(97.6% 0.006 262)"
  ink: "oklch(19% 0.045 268)"
  card: "oklch(100% 0 0)"
  secondary: "oklch(93.5% 0.012 264)"
  muted: "oklch(94.5% 0.009 264)"
  muted-ink: "oklch(46% 0.03 266)"
  border: "oklch(89.5% 0.012 266)"
  input-border: "oklch(86% 0.014 266)"
  ring: "oklch(52% 0.19 266)"
  destructive: "oklch(55% 0.2 27)"
typography:
  display:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "4.2rem"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  section:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.6rem"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Overpass Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  data-label:
    fontFamily: "Overpass Mono, ui-monospace, monospace"
    fontSize: "0.62rem"
    fontWeight: 400
    letterSpacing: "0.16em"
  flap:
    fontFamily: "Overpass Mono, ui-monospace, monospace"
    fontWeight: 600
    lineHeight: 1.22
    fontFeature: "\"tnum\" 1"
rounded:
  sm: "3.6px"
  md: "4.8px"
  lg: "6px"
  xl: "9.6px"
  2xl: "13.2px"
  full: "9999px"
spacing:
  gutter-mobile: "16px"
  gutter-tablet: "24px"
  gutter-desktop: "40px"
  container: "78rem"
  card-pad: "20px"
  card-pad-wide: "28px"
  section-y: "80px"
  section-y-wide: "112px"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-primary-lg:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
    rounded: "{rounded.md}"
    padding: "0 24px"
    height: "48px"
  button-board:
    backgroundColor: "rgb(255 255 255 / 0.04)"
    textColor: "{colors.letter}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-outline:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  badge-gate:
    backgroundColor: "{colors.board}"
    textColor: "{colors.signal}"
    typography: "{typography.data-label}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
    height: "24px"
  badge-quiet:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.muted-ink}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
    height: "20px"
  flap-tile:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.letter}"
    typography: "{typography.flap}"
    width: "0.78em"
    height: "1.22em"
  course-row:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "{spacing.card-pad}"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "4px 10px"
    height: "32px"
---

# Design System: GoLive Academy

## Overview

**Creative North Star: "The Departure Board"**

The catalogue is an airport concourse. Courses are departures, modules are gates, enrolment is boarding, and the career go-live is the destination. Two materials carry the whole system: night-navy board panels (a faint 14px perforated backplate, split-flap tiles, letters in a single near-white ink) and a cool concourse-light reading ground where the long prose lives. Every action is a signal-yellow wayfinding plate; status is the only thing allowed colour on a board.

Density follows a real terminal: the board is tight, tabular and monospaced; the concourse is calm, generous and proportional. A page alternates between the two rather than mixing them: a dark sign band at the top (header continuous with the page intro or hero), light reading sections below, a dark board footer to close. Motion is mechanical where the world is mechanical (flaps step through a physical drum, never cross-fade) and soft where it is spatial (expo-out entrances, spring route lines).

The system refuses the gradient-hero-plus-identical-card-grid course site. Course listings are departure rows with a board stub, not cards in a 3-up grid; empty states are blank flap strips, not illustrations.

**Key Characteristics:**
- Two grounds only: night board and cool concourse.
- Two inks inside a board: tile and letter. Only the status column is coloured.
- Signal yellow means "act here" and nothing else.
- Overpass for signage and reading; Overpass Mono only on flaps and data.
- One phase vocabulary everywhere: Check-in, Boarding, In flight, Landed.
- Placeholder data is always labelled as such, in plain text, next to the data.

## Colors

A cold navy world lit by one warm sign colour, with green and amber reserved for departure status.

### Primary
- **Signal Yellow** (signal): every primary action, the active nav indicator, the boarding-pass header band, the board clock, the page-intro hazard stripe, footer column headings, text selection. If it is yellow, it is a sign telling you where to go.
- **Signal Ink** (signal-ink): the only text colour on signal yellow; also the ink on a completed (green) itinerary stop.

### Secondary
- **Boarding Green** (go): BOARDING status flaps, enrolled/BOARDED state, completed itinerary stops and the route-line fill, the stop ping. On the light concourse it is never used as text at full value; text uses a darkened green ink (about oklch 38-45% L, hue 155) and fills use go at 15% alpha.

### Tertiary
- **Final-Call Amber** (call): FINAL CALL status only. On light ground, text uses a darkened amber ink (about oklch 42% L, hue 50) over call at 20% alpha.

### Neutral
- **Night Board** (board): board panels, header, page intros, footer, gate badges, the boarding-pass status strip.
- **Board Raised** (board-2): secondary board surface, sidebar accents.
- **Flap Tile** (tile) and **Tile Edge** (tile-edge): the split-flap cell face and its hinge seam / bottom lip. Never used outside flaps.
- **Board Letter** (letter): all text on boards.
- **Dim Letter** (letter-dim): leads, column headers, data labels and inactive nav on boards; also ON TIME status.
- **Concourse** (concourse): page background for reading sections.
- **Concourse Ink** (ink): body and heading text on light ground.
- **Card White** (card), **Secondary** (secondary), **Muted** (muted), **Muted Ink** (muted-ink): light-ground surfaces, quiet badges, supporting text.
- **Hairline** (border) and **Field Edge** (input-border): dividers, card edges, input strokes.
- **Focus Blue** (ring): focus outlines and caret on light ground. On boards, focus switches to signal yellow.
- **Destructive** (destructive): errors only, at 10-20% alpha fills.

### Named Rules
**The Two-Ink Board Rule.** Inside a board, text is letter or letter-dim on tile or board. The status column is the only coloured column: go for BOARDING, call for FINAL CALL, dim for ON TIME, signal for the clock.

**The Signal Means Act Rule.** Signal yellow is spent on actions and wayfinding. It never fills a decorative panel, a chart, or a status.

**The Light-Ground Status Ink Rule.** Green and amber at full value are board inks. On the concourse they appear as tinted fills with a darkened same-hue ink for text, so status stays legible (AA) on white.

## Typography

**Display Font:** Overpass Variable (with ui-sans-serif, system-ui)
**Body Font:** Overpass Variable
**Label/Mono Font:** Overpass Mono 400/600 (with ui-monospace)

**Character:** Overpass is a highway-signage face: open, sturdy, legible at speed. Set heavy and tight for signs, plain and relaxed for reading. Overpass Mono is the flap and data face; its tabular rhythm is what makes a board read as a board.

### Hierarchy
- **Display** (800, 2.6rem / 3.75rem sm / 4.2rem lg, 1.02, -0.035em): the home hero headline only, on a board, with one phrase in signal.
- **Headline** (800, 2.25rem / 3rem sm / 3.5rem lg, 1.05): page-intro h1 on the dark sign band; login h1 at the same scale.
- **Section** (800, 1.875rem / 2.6rem sm, tight): concourse section headings.
- **Title** (700, 1.25rem): course row titles, card and lesson headings.
- **Lead** (400, 1.05-1.125rem, 1.625): page leads, max 34-60ch; letter-dim on boards, muted-ink on concourse.
- **Body** (400, 0.95-1rem, 1.625): descriptions, max 62ch.
- **Data label** (Mono 400, 0.6-0.7rem, 0.14-0.16em, uppercase): column headers and field labels that name a value directly below or beside them (TIME, GATE, STATUS, PASSENGER, fact-strip terms).
- **Flap** (Mono 600, set by the parent font-size, tabular): split-flap text only.

All headings get balanced wrapping and -0.025em tracking by default; paragraphs wrap pretty. Figures in prices, counts and durations are tabular.

### Named Rules
**The Mono Is Data Rule.** Overpass Mono appears only on flaps, codes (flight, gate, referral), durations, column headers and field labels. Never on prose or marketing headings (the login blueprint is the one scoped exception; see Components).

**The No Kicker Rule.** No eyebrow or kicker text above headings. An uppercase mono label is allowed only when it names a data value it sits against (a column header, a field label, a fact-strip term), never to announce a section.

## Layout

Single centred container (78rem max) with 16 / 24 / 40px side gutters at mobile / 640px / 1024px. Pages are horizontal bands: a dark sign band (header plus hero or page intro, closed by a 6px signal-and-board hazard stripe of 28px segments), concourse reading sections at 80px / 112px vertical padding, and a dark board footer.

Home hero splits roughly 0.92 / 1.08: headline, lead, actions and a three-term fact strip on the left; the live board on the right. Concourse sections favour an asymmetric 0.8 / 1.2 split with a sticky heading column (top 7rem) beside the content, rather than centred stacks. Course listings are a single column of full-width departure rows (board stub 13.5rem | details | fare and action) that collapse to a stacked row on mobile. Filtering re-flows rows with layout animation.

Breakpoints are Tailwind defaults: 640px (sm), 768px (md), 1024px (lg). Below 640px the live board drops the flight and gate columns and shortens destinations to 12 cells; desktop navigation becomes a right-side board sheet below 1024px.

## Elevation & Depth

A hybrid: depth comes mainly from tonal contrast between night board and concourse, plus two named navy-tinted shadows. Shadows are always tinted with board navy, never neutral grey or coloured glows.

### Shadow Vocabulary
- **Panel** (`box-shadow: 0 1px 1px oklch(20% 0.05 268 / 0.05), 0 10px 28px -8px oklch(20% 0.05 268 / 0.16)`): light cards and departure rows at rest.
- **Panel lifted** (`box-shadow: 0 2px 2px oklch(20% 0.05 268 / 0.05), 0 22px 40px -14px oklch(20% 0.05 268 / 0.28)`): departure-row hover, paired with a 2px lift.
- **Board** (`box-shadow: 0 2px 0 oklch(100% 0 0 / 0.04) inset, 0 24px 60px -20px oklch(10% 0.05 268 / 0.55)`): board panels on any ground, the boarding pass.
- **Sign plate** (`box-shadow: inset 0 -2px 0 oklch(0% 0 0 / 0.12), 0 1px 0 oklch(100% 0 0 / 0.4) inset`): the enamel lip on every yellow plate.
- **Flap lip** (`box-shadow: 0 0.06em 0 var(--tile-edge), inset 0 0 0 1px oklch(100% 0 0 / 0.04)`): each flap tile.

### Named Rules
**The Navy Shadow Rule.** Every drop shadow is board-navy at low alpha with a negative spread. No grey shadows, no hard offset shadows, no chromatic glows outside the login blueprint.

## Shapes

Gently squared, signage-like corners. Buttons and plates 4.8px (md); badges 3.6px (sm); inputs 6px (lg); cards, rows and boards 9.6px (xl); the boarding pass 13.2px (2xl). Full rounding is reserved for itinerary stops, the route line, phase-track bars and status dots. Flap tiles round at 0.12em with a 1px hinge seam at mid-height.

Recurring geometry: dashed borders mean "not yet real" or "blank" (ghost empty states, the sample-stories notice, the boarding-pass perforation); the boarding pass carries semicircle notches cut in board navy at the perforation. Borders are 1px hairlines on concourse, white at 7-10% on boards.

## Components

### Buttons
Tactile wayfinding plates: flat, enamel-lipped, never gradient.
- **Shape:** gently squared (4.8px), 40px default, 32px sm, 48px lg; semibold 0.875rem.
- **Primary (sign plate):** signal fill, signal-ink text, inset enamel lip. Hover lightens toward white by 18%; a trailing arrow nudges 2px right. Every primary action on every ground is this button.
- **Board:** for secondary actions on dark ground: 4% white fill, letter text, letter at 25% border, brightening to 9% / 45% on hover. Focus ring signal at 50%.
- **Outline:** secondary on concourse: card fill, ink at 15% border, hover to muted fill and 30% border.
- **Ghost / Link:** tertiary; links underline at 30% ink, solidifying on hover (signal underline on boards).
- **Hover / Focus:** 200ms ease-out-expo transitions; 1px press-down on active; focus is a 3px ring at 40% plus the global 2px outline.

### Chips / Badges
- **Gate:** board-navy chip with signal mono text ("SAP FICO"), the module identifier.
- **Go / Call:** status chips on concourse, mono uppercase 0.68rem, go at 15% or call at 20% fill with darkened same-hue ink.
- **Quiet:** muted fill, muted ink, for level and track.
- **Demand ramp:** one fixed three-bar ramp (Steady / Strong / Hot), bars 5px wide stepping 8 / 12 / 16px, always with the word. Never a colour scale.

### Cards / Containers
- **Corner Style:** 9.6px.
- **Background:** card white on concourse; board-surface for any dark panel.
- **Shadow Strategy:** Panel at rest, Panel lifted on hover (rows only); Board for boards.
- **Border:** 1px hairline.
- **Internal Padding:** 20px, widening to 28px horizontally at md.

### Inputs / Fields
- **Style:** 1px field-edge stroke, transparent fill, 6px radius, 32px base height; forms on boards use 44px height, black at 30% fill, white at 15% stroke, leading icon at 14px inset.
- **Focus:** border shifts to ring (signal on boards) with a 3px ring at 25-50%.
- **Error:** destructive border and ring at 20%; board forms show a red-tinted message panel above the fields, announced assertively.

### Navigation
Sticky 64px board header (board at 90-97% with backdrop blur), letter-dim 0.9rem medium links turning letter on hover. The active route carries a 3px signal bar flush with the header's bottom edge that slides between items with a shared-layout spring (stiffness 520, damping 42). Below 1024px a right-side board sheet lists routes as large semibold rows with mono gate numbers (G01, G02...), the active one in signal.

### Split-Flap Board (signature)
The defining component. Each character is a tile (0.78em by 1.22em) with a hinge seam; changes step forward through a physical drum (space, A-Z, 0-9, punctuation) at 62ms per step, capped at 9 steps, top half folding down then bottom half folding in. Cells in a row stagger by about 22ms; rows stagger by 110ms. Boards mount from blank tiles so they arrive. The live board shows 6 rows (Time, Flight, Destination, Gate, Status), cycles every 6.5s, and pauses when offscreen or the tab is hidden. Screen readers get one plain label per run, never letter by letter. With reduced motion, tiles swap instantly.

### Departure Row
A course listing: a board stub (gate code on flaps, date and time, status flaps) on the left, title / description / lesson-question-week facts on the concourse body, and fare plus a "View course" sign plate on the right. The whole row is one link.

### Boarding Pass
The course-detail purchase panel: signal header band with flight code, a two-column field grid (Passenger, Destination, Departs, Gate) with mono data labels, a board strip whose status flaps flip to BOARDED on enrol, a perforation with notches, then fare and the primary action.

### Itinerary and Phase Track
Lessons are numbered stops on a vertical route line (3px); completed stops fill go with a check, the line fills with a spring (stiffness 120, damping 22), and a just-completed stop emits a 700ms green ping. Progress elsewhere uses the four-segment phase track (Check-in, Boarding, In flight, Landed): done segments solid ink, the current one hatched, future ones at 12%, each labelled in words. Never colour alone.

### Ghost Board (empty states)
A dashed-border card holding a small board with a dim flap readout ("NO DEPARTURES", "GATE NOT FOUND"), then a heading and next action. Empty is drawn as a blank board, not an illustration.

### Login Blueprint (scoped exception)
The login / register page alone, at the user's explicit request, speaks a blueprint flow-diagram sub-language: a 56px grid canvas on board with a soft blue radial wash, dashed swim lanes labelled "01 / Check-in desk" and "02 / Your route", mono headings inside the form card, a travelling dashed connector "on success", and four phase nodes inked per phase (Check-in signal, Boarding go, In flight letter, Landed call) with navy-plus-hue glows. These inks, the mono form headings and the coloured glows are licensed for this diagram only and do not extend to any other surface.

## Do's and Don'ts

### Do:
- **Do** use the yellow sign-plate button for every primary action, on light and dark ground alike.
- **Do** keep boards to two inks and colour only the status column (go BOARDING, call FINAL CALL, dim ON TIME).
- **Do** use the phase words Check-in, Boarding, In flight, Landed for every progress surface, paired with pattern, never colour alone.
- **Do** express hiring demand only with the three-step Steady / Strong / Hot ramp.
- **Do** draw empty states as ghost boards with a dim flap readout.
- **Do** label every placeholder or sample value in plain small text beside it ("sample schedules in IST", "demo price", "Contact details shown are placeholders", "Sample stories — replace with real learner quotes"), with a dashed outline when a whole block is illustrative.
- **Do** use ease-out-expo (cubic-bezier(0.16, 1, 0.3, 1)) for entrances and state changes, and give every animation an instant reduced-motion path.
- **Do** switch focus outlines to signal yellow inside boards and focus blue on concourse.

### Don't:
- **Don't** put eyebrows or kickers above headings; uppercase mono labels only name data.
- **Don't** set prose or marketing headings in Overpass Mono outside the login blueprint.
- **Don't** use signal yellow for status, decoration, charts or large panels.
- **Don't** use go or call at full value as text on light ground; use the darkened same-hue ink.
- **Don't** present invented outcomes, learner counts, placement rates, testimonials or contacts as real; anything without evidence carries its placeholder label.
- **Don't** list courses as an identical 3-up card grid or open a page with a gradient hero.
- **Don't** cross-fade flaps; they step forward through the drum.
- **Don't** use grey, hard-offset or coloured-glow shadows; shadows are board navy.
- **Don't** borrow the login blueprint's grid canvas, swim lanes or per-phase inks (Landed in amber) for other pages.
