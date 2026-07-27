# Design System: Finance Dashboard

## 1. Visual Theme & Atmosphere
Personal finance dashboard for Indonesian users. Green-accented fintech interface — premium, trustworthy, data-dense but not cluttered. "Premium fintech morning": soft glass cards, subtle gradient backgrounds, restrained motion. Dark mode inverts to deep charcoal with same green accent.

**Density:** Daily App Balanced (5)
**Variance:** Offset Asymmetric (5) — structured grids, not chaos
**Motion:** Fluid CSS (4) — hover micro-interactions, no GSAP
**Glass:** White/80 cards in light, near-black/80 cards in dark with backdrop blur

## 2. Color Palette (OKLCH)
- **Background:** oklch(0.972 0.008 140) — warm paper
- **Card:** oklch(0.99 0.004 80) — off-white raised surface
- **Surface Raised:** oklch(0.99 0.003 80) — modal/overlay surface
- **Foreground:** oklch(0.2 0.035 140) — deep green-black
- **Ink-2:** oklch(0.3 0.04 140) — secondary headings
- **Ink-3:** oklch(0.46 0.035 140) — muted/tertiary text
- **Accent (Primary):** oklch(0.72 0.16 140) — #59C749-ish green
- **Accent Dark:** oklch(0.4 0.1 140) — hover/income text
- **Expense:** oklch(0.55 0.23 25) — red for expenses
- **Expense BG:** oklch(0.55 0.23 25 / 0.1) — tint for expense icons
- **Border:** oklch(0.86 0.02 140) — soft rule lines
- **Chart (7):** green → emerald → amber → rose → violet → cyan → slate

**Dark Mode:**
- Background: oklch(0.035 0.002 80) — near-black
- Card: oklch(0.09 0.003 80)
- Accent: oklch(0.68 0.14 140) — brighter for dark legibility
- Border: oklch(0.15 0.002 80)

## 3. Elevation System
| Level | Light | Dark |
|-------|-------|------|
| shadow-sm | 0 1px 3px -1px rgba(0,0,0,0.04) | 0 1px 3px -1px rgba(0,0,0,0.25) |
| shadow-soft (md) | 0 4px 16px -8px rgba(0,0,0,0.06) | 0 4px 16px -8px rgba(0,0,0,0.40) |
| shadow-lg | 0 12px 32px -12px rgba(0,0,0,0.08) | 0 12px 32px -12px rgba(0,0,0,0.50) |
| shadow-xl | 0 20px 48px -16px rgba(0,0,0,0.10) | 0 20px 48px -16px rgba(0,0,0,0.55) |

## 4. Typography
- **Display/Headlines:** Outfit (sans-serif) — track-tight, 600/700 weight
- **Body:** Outfit — 0.875rem base, 1.5 line-height
- **Mono:** Geist Mono / JetBrains Mono — ALL monetary values (tabular numbers)
- **Scale:** 2.75rem display / 1.125rem title / 0.875rem body / 0.75rem caption / 0.625rem micro
- **Banned:** Inter, serif fonts, italic headers, gradient text

## 5. Component Stylings
- **Buttons:** Rounded-xl (12px). Flat, no outer glow. `active:scale-[0.98]`. Shadow-sm on hover.
- **Cards:** Rounded-xl (12px). `card` utility: bg-surface + border-rule + shadow-soft. Hover elevates border & shadow.
- **Inputs:** Rounded-lg (8px) → upgraded to rounded-xl (12px). Label above. Focus ring accent/50.
- **Modals:** Centered, backdrop-blur-sm, card-2 bg, rounded-2xl.
- **Skeletons:** Pulse animation with bg-muted, matching exact card layout.
- **Status Tags:** Pill (9999px), 10px font, tint bg. `tag` utility.
- **Progress Bars:** Rounded-full, 2-2.5px height, transition-all duration-500.

## 6. Layout Principles
- **Shell:** Fixed sidebar (desktop, w-64) + mobile bottom nav + sticky mobile header
- **Content:** max-w-6xl centered within lg:pl-64 offset
- **Grid:** CSS Grid for multi-column (grid-cols-1 md:cols-2 lg:cols-3)
- **Mobile (< 768px):** Single column, sidebar → off-canvas drawer
- **Spacing:** section gap space-y-8, card padding p-5/p-6, grid gap gap-5
- **Dividers:** Separator with `opacity-50` between major sections

## 7. Motion & Interaction
| State | Button | Input | Card |
|-------|--------|-------|------|
| Default | bg-primary, text-primary-foreground | bg-background, border-input | bg-card, shadow-soft, border-rule |
| Hover | bg-primary/90, shadow-sm, scale-[0.98] | border-accent | border-ink-3, shadow-lg |
| Focus | ring-2 ring-ring/50 | ring-2 ring-ring | — |
| Active | scale-[0.98] | — | — |
| Disabled | opacity-50, cursor-not-allowed | opacity-50 | — |
| Error | — | ring-2 ring-destructive | — |

- **Duration:** 150ms short, 200ms default, 500ms progress bars
- **Performance:** transform/opacity only. No layout-triggering properties.
- **Reduced Motion:** respects prefers-reduced-motion

## 8. Responsive Strategy
- **Breakpoints:** sm 640, md 768, lg 1024, xl 1280
- **Mobile Nav:** Fixed bottom tab (5 items: Home, Trans, Add, Goals, Stats)
- **FAB:** Primary rounded-full button with shadow, -top-4 offset
- **Touch:** ≥ 44px interactive targets
- **Body text:** minimum 14px on mobile

## 9. Design Decisions & Rationale

### Why OKLCH over HSL/Hex
OKLCH provides perceptual uniformity — green at 53% chroma reads consistently across hues. HSL exaggerates some hues over others. Oklch chroma values map to real perception.

### Why `font-mono` on ALL amounts
Monospace with tabular numbers ensures digits align vertically across rows — critical for comparing expenses and income at a glance. Applied via CSS `font-feature-settings: "tnum", "zero"`.

### Why Separator + opacity-50 between dashboard sections
Horizontal rules create visual breathing room without full-width borders. The `opacity-50` reduces visual noise while maintaining hierarchy.

### Why active state icons use tint backgrounds
Colored icon on transparent tint (e.g. `bg-income/15 text-income`) reads as interactive without the visual weight of a filled background. The 15% opacity tint is visible enough for hierarchy while keeping the card surface dominant.

### Why sidebar nav uses icon containers
Consistent 9×9 rounded-xl icon containers with tint fill create rhythm. Active state inverts to full primary bg — gives clear location signal without relying on text color alone.

## 10. Anti-Patterns (Banned)
- No emojis as UI icons (SVG only: Lucide, Phosphor)
- No Inter font
- No serif fonts (dashboard domain)
- No pure black/white — use off-black/off-white
- No neon/outer glow shadows
- No gradient text on headers
- No custom mouse cursors
- No 3-column equal card rows (dashboard grid is fine, not marketing cards)
- No generic names ("John Doe", "Acme")
- No filler copy ("Elevate", "Seamless", "Scroll to explore")
- No hand-rolled SVGs (use Lucide)
- No inline color hex in JSX — CSS variables only
- No floating labels — labels above inputs
- No fake round numbers (use real data)
