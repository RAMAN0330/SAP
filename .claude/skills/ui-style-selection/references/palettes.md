# Ready-made palettes

Every palette below has been checked for WCAG AA on its stated pairings. Shift the hue (H) to match a brand, then re-check contrast: chroma and lightness carry most of the contrast, but yellow-greens and cyans gain luminance quickly.

## Dusk Clay (Claymorphism, restrained; education, career and onboarding)

Used by GoLive Academy. Lilac mist ground, pastel trays, one grape action colour.

| Token | Value | Role |
|---|---|---|
| `--background` | `oklch(97.2% 0.014 295)` | canvas |
| `--card` | `oklch(99.5% 0.004 295)` | clay card |
| `--foreground` | `oklch(24% 0.06 285)` | ink (15.3:1 on canvas) |
| `--muted-foreground` | `oklch(47% 0.04 285)` | secondary text (6.3:1) |
| `--board` | `oklch(92.5% 0.04 292)` | lilac clay tray |
| `--board-2` | `oklch(88.5% 0.055 292)` | raised tray |
| `--tile` | `oklch(99% 0.006 292)` | clay key |
| `--letter-dim` | `oklch(45% 0.05 287)` | dim text on tray (6.0:1) |
| `--signal` / `--primary` | `oklch(50% 0.2 288)` | grape action (white on it 6.6:1) |
| `--go` | `oklch(47% 0.12 158)` | success ink (5.0:1 on tray) |
| `--call` | `oklch(50% 0.13 55)` | warning ink (5.0:1 on tray) |
| `--destructive` | `oklch(55% 0.2 25)` | error |
| pastels | peach `oklch(90% 0.06 50)` · mint `oklch(92% 0.06 165)` · sky `oklch(91% 0.05 235)` · butter `oklch(94% 0.07 95)` | decoration and hero blobs only |

Shadows (ink hue 290):

```css
--shadow-clay: inset 0 1.5px 0 oklch(100% 0 0 / .8), inset 0 -4px 10px oklch(35% .1 290 / .06), 0 1px 2px oklch(30% .1 290 / .06), 0 12px 28px -12px oklch(30% .12 290 / .22);
--shadow-clay-lift: inset 0 1.5px 0 oklch(100% 0 0 / .8), inset 0 -4px 10px oklch(35% .1 290 / .06), 0 2px 4px oklch(30% .1 290 / .06), 0 24px 44px -16px oklch(30% .12 290 / .3);
--shadow-clay-press: inset 0 3px 8px oklch(30% .1 290 / .14);
```

## Mint Clay (Claymorphism; kids, wellness, habit)

| Token | Value |
|---|---|
| canvas | `oklch(97.5% 0.015 165)` |
| ink | `oklch(26% 0.05 200)` |
| trays | mint `oklch(91% 0.07 165)`, butter `oklch(94% 0.08 95)`, coral `oklch(89% 0.07 30)` |
| action | `oklch(52% 0.16 250)` (white on it ≈ 5.6:1) |

## Frost Glass (Glassmorphism accent on a flat base; SaaS, dashboards)

| Token | Value |
|---|---|
| canvas | `oklch(98.5% 0.004 250)` |
| ink | `oklch(22% 0.03 260)` |
| glass | `oklch(100% 0 0 / .82)` + `backdrop-blur-md`, border `oklch(100% 0 0 / .6)` |
| action | `oklch(55% 0.19 260)` |
| hero backdrop | radial blobs of `oklch(85% .1 260)`, `oklch(88% .08 200)` |

## Control Room (flat base + glass overlays; ISA-101 operations)

| Token | Value |
|---|---|
| canvas | `oklch(93% 0.005 250)` (grey, deliberately dull) |
| ink | `oklch(25% 0.01 250)` |
| alarm priorities | P1 `oklch(58% 0.21 27)`, P2 `oklch(75% 0.16 65)`, P3 `oklch(85% 0.15 95)` |
| action | `oklch(45% 0.08 250)`, muted so it never competes with alarms |

## Night Map (Spatial UI + dark glass)

| Token | Value |
|---|---|
| map | dark basemap |
| glass | `oklch(22% 0.03 260 / .72)` + `backdrop-blur-md` |
| ink | `oklch(96% 0.01 250)` |
| action | `oklch(80% 0.14 200)` (cyan) |
| status | outlined markers plus a label, never fill colour alone |

## Riot (Maximalism; marketing only)

`oklch(65% 0.25 350)` magenta · `oklch(88% 0.18 100)` acid · `oklch(55% 0.22 265)` cobalt · `oklch(78% 0.14 55)` tangerine · `oklch(20% 0.03 280)` ink · `oklch(97% 0.02 90)` paper. Prose columns stay ink on paper.
