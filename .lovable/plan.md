# Tabbed "Tell me about" Card on Product Page

Convert the existing **Clinical Proof Box** sa `/products/desire-men` (at sa lahat ng product variants) into a **4-tab interactive card** following the reference design — pero gagamitin natin ang **Desire branding** (cream/red/ink), hindi yung teal ng reference.

## Reference vs Brand

| Reference (pet supplement) | Desire version |
|---|---|
| Teal accent (#0d8a8a) | Brand red `--red` (#db2626) |
| White card on plain bg | Cream card `var(--white)` with subtle red glow (kept from current) |
| "Tell me about:" eyebrow | "Tell me about:" eyebrow — Montserrat, mute color |
| Generic sans | Montserrat headings + Inter body (existing tokens) |
| Pet content | Adult wellness / Desire content |

## The 4 Tabs (variant-aware)

The card already lives inside `ClinicalProofBox` na may access sa `variant` context (Him / Her / Couple). Each tab gets variant-aware content kung saan applicable.

### Tab 1 — Clinical Results (default, active on load)
**Reuses 95% ng existing card content.** Kept as-is:
- "Verified by Independent Lab" green pill
- "Clinically *Proven* Results." headline + sub
- "30 Day Study" block
- 4 animated progress bars (More Drive 92%, Best Nights 87%, Deeper Sleep 79%, Better Mood 74%)
- "View third-party study report" link → `/our-science`
- 2 info pills (Active Ingredients · 6 Clinically-Studied | First Results · In 14 Days)
- "30-Day Money-Back Guarantee" dark callout

### Tab 2 — Key Ingredients
List style (matches reference image-150). Pulled from existing `INGREDIENTS` data sa `src/components/desire/Ingredients.tsx` — variant-aware (Him/Her/Couple shows both):
- **For Him:** Tongkat Ali, Maca Root, Panax Ginseng, Lactobacillus rhamnosus, Zinc, L-Arginine
- **For Her:** Ashwagandha, Red Maca Root, Dong Quai, Chaste Berry, Zinc, Lactobacillus rhamnosus

Each row: bold Montserrat name + 1-line description in mute. Divider between rows. Footer link: "See full breakdown →" → `/#ingredients`.

### Tab 3 — How To Use
Table style (matches reference image-151) na adapted para sa adult dosing:

| When | Daily Dose |
|---|---|
| **EVERY MORNING** (heading row, red bg `--red-soft`) | |
| With breakfast | **2 gummies** · for all-day drive |
| **BEFORE INTIMACY** (heading row) | |
| 30–60 min before | **2 gummies** · extra boost |

Plus 3 short tip bullets below: "Take consistently for 14 days to feel first results" · "Best taken with water" · "Safe for daily use, no cycling required".

### Tab 4 — Why Desire (Product Benefits)
Checklist style (matches reference image-152). Red `✓` circles, Montserrat body:
- Boosts natural drive and stamina
- Restores confidence in the bedroom
- Deepens emotional connection with your partner
- Improves mood and reduces stress
- Promotes deeper, restorative sleep
- 100% natural, no harsh stimulants, no crash

Headline above list: **"Take your relationship to the next level."**

## Visual Spec (Brand-Aligned)

- **Eyebrow** above tabs: "Tell me about:" — Montserrat 11px, uppercase, `--mute`, letter-spacing 0.15em
- **Tab strip**: 4 buttons in a row sa top of card
  - Inactive: cream-2 bg, mute text, subtle border-top-left/right radius
  - Active: white bg (lifts up), red text `--red`, bold, 2px red underline at bottom (or border-bottom: 3px solid red)
  - Hover: ink color
  - Mobile: scrolls horizontally if needed (overflow-x-auto)
- **Card body**: existing `.clinical-box-v2` shell (cream white, red glow corner, 20px radius) — content area swaps based on active tab
- **Smooth tab transition**: 200ms fade + 4px translateY on content area only (header/tabs static)
- **Active tab indicator**: animated red underline that slides between tabs (framer-motion `layoutId` or CSS transform)

## Technical Implementation

### Files to edit
1. **`src/routes/products.tsx`** — refactor `ClinicalProofBox` (lines 198–289):
   - Add `useState` for active tab (`"results" | "ingredients" | "usage" | "benefits"`)
   - Add prop `variant: "him" | "her" | "couple"` (passed from parent at line 620 — currently no prop, parent has variant in scope)
   - Render eyebrow + tab strip ABOVE existing card
   - Wrap existing content in tab panel for "results"
   - Add 3 new tab panel components inline: `IngredientsPanel`, `UsagePanel`, `BenefitsPanel`
   - Reuse `INGREDIENTS` constant — import from `Ingredients.tsx` or inline a slim version

2. **`src/styles.css`** — add new classes after line 4252 (existing `.clinical-box-v2`):
   - `.cb-eyebrow` (Tell me about label)
   - `.cb-tabs` (flex row, gap, mobile scroll)
   - `.cb-tab` (inactive state)
   - `.cb-tab.active` (active state with red underline)
   - `.cb-tab-panel` (panel container with fade transition)
   - `.cb-ing-row`, `.cb-ing-name`, `.cb-ing-desc` (ingredient list)
   - `.cb-usage-table`, `.cb-usage-head` (red-soft bg heading rows), `.cb-usage-row`, `.cb-usage-dose`
   - `.cb-benefits-title`, `.cb-benefit-row`, `.cb-benefit-check` (red circle ✓)

### Interaction detail
- Tab click: instant state change, content fades out (150ms) → swaps → fades in (150ms)
- Underline slides smoothly between tabs (framer-motion `layoutId="tab-underline"`)
- Default active tab on mount: **"results"** (so existing content shows by default — zero regression sa visual hierarchy)
- All existing scroll-trigger animations (the bar fill on intersect) only fire when "results" tab is active or first viewed

### Variant awareness
At the call site (line 620), `<ClinicalProofBox />` will become `<ClinicalProofBox variant={variant} />`. The variant value already exists in `ProductDesire*` parent components. For the "couple" variant, Key Ingredients tab shows both Him and Her ingredients sa 2 columns (or stacked on mobile).

### No regressions
- All existing copy, animations, and links sa Clinical Results tab preserved 100%.
- Card position (between Check Out button and FAQ card, line 620) unchanged.
- Brand tokens only — walang bagong colors na ido-introduce.

## Out of Scope
- Walang bagong images / icons (gagamitin natin lucide-react `Check` para sa benefits checkmarks — already imported sa file)
- FAQ card sa baba ng `ClinicalProofBox` hindi gagalawin
- Other product pages na hindi gumagamit ng `ClinicalProofBox` hindi apektado

