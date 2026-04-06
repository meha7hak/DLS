# Design System Specification: Deep Professional Editorial

## 1. Overview & Creative North Star
### The Creative North Star: "The Executive Curator"
This design system is built to transform a high-density HOD dashboard from a mere utility into an authoritative editorial experience. We reject the "generic SaaS" aesthetic of rounded boxes and bright blue links. Instead, "The Executive Curator" focuses on high-contrast typography, intentional asymmetry, and deep tonal layering.

The visual language is characterized by a "Deep Professional" atmosphere: it is minimalist yet high-impact. We utilize a rigid typographic scale against a fluid, layered surface hierarchy to ensure that heads of departments feel they are interacting with a sophisticated decision-making engine, not a spreadsheet.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep indigo and cool greys, punctuated by a surgical application of vibrant teal.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders are prohibited for sectioning or containment. 
Boundaries must be defined through background color shifts or tonal transitions. To separate the sidebar from the main stage, use `surface_container_low` against a `surface` background. If an element needs to stand out, use a elevation shift, never a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of heavy-weight paper or frosted architectural glass.
- **Base Layer:** `surface` (#F9F9F9) – The canvas.
- **Sectioning:** `surface_container_low` (#F3F3F3) – Defines large functional zones.
- **Interaction Layer:** `surface_container_lowest` (#FFFFFF) – Used for primary cards to create a "lifted" feel.
- **Authoritative Accents:** `primary_container` (#1A237E) – Reserved for high-value headers or the main navigation sidebar to establish immediate gravity.

### The Glass & Gradient Rule
For floating modals or persistent status indicators, use **Glassmorphism**. Apply a semi-transparent `surface_container_lowest` with a 20px backdrop blur. 
- **Signature Texture:** When using primary CTAs, apply a subtle linear gradient from `primary` (#000666) to `primary_container` (#1A237E) at 135 degrees. This adds "soul" and depth that prevents the UI from looking flat or "out-of-the-box."

---

## 3. Typography: The Editorial Voice
We use a dual-font strategy to balance character with readability.

*   **Display & Headlines (Manrope):** This is our "Editorial Voice." Manrope’s geometric yet warm proportions provide an authoritative, modern executive feel. Use `display-lg` for dashboard greetings and `headline-sm` for section titles.
*   **Body & Labels (Inter):** The "Utility Voice." Inter provides maximum legibility for data-heavy HOD metrics.

### Hierarchy Highlights
- **Title-LG (Inter, 1.375rem):** Use for card titles.
- **Label-MD (Inter, 0.75rem, All Caps, Tracking: 0.05em):** Use for metadata and overlines to create a sense of professional categorization.
- **On-Tertiary-Container (#00AB93):** Use this vibrant teal exclusively for success metrics, "active" indicators, or primary action labels.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** rather than structural lines.

- **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` background. The subtle 2-step difference in grey creates a soft, natural lift.
- **Ambient Shadows:** Shadows are reserved for floating elements (e.g., dropdowns, modals). They must be extra-diffused. Use a blur of 32px, an offset of Y: 8px, and 6% opacity of `on_surface` (#1A1C1C).
- **The "Ghost Border" Fallback:** If a border is required for accessibility, it must be the "Ghost Border": `outline_variant` at 15% opacity. Never use 100% opaque borders.
- **Depth through Glass:** When a header scrolls over content, it should transition to a blurred `surface_bright` with 80% opacity, allowing the indigo and teal tones of the dashboard to "bleed" through softly.

---

## 5. Components

### Navigation & Sidebars
- **Sidebar:** Uses `primary_container` (#1A237E). Active states should not use "blobs" but rather a subtle background shift to `on_primary_fixed_variant` and a `tertiary` (#00BFA5) leading vertical indicator.

### Buttons
- **Primary:** Gradient from `primary` to `primary_container`. `xl` roundedness (0.75rem). White text.
- **Secondary:** `surface_container_high` background with `primary` text. No border.
- **Tertiary/Ghost:** `on_surface` text, no background. On hover, apply a 5% `primary` tint.

### Data Cards
- **Construction:** No dividers. Use `body-sm` for labels and `headline-md` for the metric itself.
- **Spacing:** Use 32px (2rem) internal padding to provide "executive breathing room."
- **Separation:** Use vertical white space from the 8px grid rather than horizontal lines.

### Input Fields
- **Default State:** `surface_container_highest` background. Bottom-only "Ghost Border" (15% opacity `outline`).
- **Focus State:** Background remains, but the "Ghost Border" transitions to a 2px `tertiary` (#00BFA5) bottom stroke.

---

## 6. Do's and Don'ts

### Do
- **Do** use intentional asymmetry. Align a headline to the left but place the primary action button slightly offset or nested within a glass container.
- **Do** use the teal accent (`tertiary`) sparingly. It is a laser pointer, not a paint brush.
- **Do** maximize white space. If you think there is enough space, add 8px more.

### Don't
- **Don't** use black (#000000). Use `on_surface` (#1A1C1C) for text to maintain a premium, ink-like feel.
- **Don't** use standard 1px dividers between list items. Use a background toggle (Zebra striping using `surface` and `surface_container_low`) or simply 16px of vertical padding.
- **Don't** use "Default" shadows. If a card looks flat, increase the background contrast between it and its parent container before reaching for a shadow.