# Design System Specification: The Elevated Coordinator

## 1. Overview & Creative North Star

**Creative North Star: The Informed Architect**
This design system moves away from the chaotic "grid-heavy" and high-vibrancy aesthetic of traditional management portals toward a philosophy of **Informed Architecture**. We treat the coordinator dashboard not as a series of boxes, but as a curated editorial experience. 

By leveraging a sophisticated palette of deep navy, slate, and ethereal neutrals, we establish a sense of authority and calm. We break the "template" look by prioritizing **tonal depth over structural lines**. The system utilizes intentional asymmetry—large, breathable margins juxtaposed with high-density data clusters—to guide the eye toward action without overwhelming the senses.

---

## 2. Colors

The color strategy is rooted in "Atmospheric Professionalism." We replace the heavy purple with a grounding Deep Navy (`primary`) and a tiered system of off-whites and cool grays.

### Core Palette
- **Primary (`#0c1427`)**: Our "Anchor." Reserved for high-authority elements like the sidebar and primary headers.
- **Secondary (`#006c49`)**: "Action Emerald." Used specifically for positive reinforcement and success states.
- **Tertiary (`#201100`) / Amber (`#c88000`)**: "Attention Amber." Designed for pending states and high-priority warnings.
- **Surface (`#f7f9fb`)**: Our canvas. A cool, crisp off-white that reduces eye strain compared to pure hex white.

### The "No-Line" Rule
**Borders are prohibited for sectioning.** To separate the sidebar from the main content, or a data table from a header, use background shifts. 
*   *Example:* A sidebar using `primary` sits flush against a main content area using `surface`. No 1px line should exist between them.

### Surface Hierarchy & Nesting
Depth is achieved through the "Paper Stack" method. Each layer of importance shifts the surface container:
1.  **Base Layer:** `surface` (`#f7f9fb`)
2.  **Sectioning:** `surface_container_low` (`#f2f4f6`)
3.  **Interactive Cards:** `surface_container_lowest` (`#ffffff`) - This creates a natural "lift" as white appears closer to the user than gray.

### Signature Textures
To avoid a flat "SaaS-in-a-box" feel, use a subtle linear gradient on primary action buttons:
*   **Primary CTA:** Transition from `primary` (`#0c1427`) to `primary_container` (`#21283c`) at a 135-degree angle. This adds "soul" and a tactile, premium weight to the interaction.

---

## 3. Typography

The system employs a dual-font strategy to balance editorial elegance with functional clarity.

*   **Headlines (Manrope):** A modern geometric sans-serif with a high x-height. Use `display-lg` to `headline-sm` for page titles and section headers. The wider apertures of Manrope convey openness and modernity.
*   **Body & Labels (Inter):** A workhorse typeface designed for readability. Inter is used for all data points, form labels, and status indicators.

**Editorial Hierarchy:**
*   **The Power Gap:** Create a significant scale jump between your `headline-lg` (32px) and `body-md` (14px). This high-contrast scale makes the dashboard feel like a high-end publication rather than a spreadsheet.

---

## 4. Elevation & Depth

We move beyond Material Design's standard shadows toward **Tonal Layering**.

*   **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_high` background. The difference in luminance provides all the "elevation" needed for standard dashboard components.
*   **Ambient Shadows:** For floating elements (Modals/Popovers), use a "Whisper Shadow."
    *   *Spec:* `0px 12px 32px rgba(25, 28, 30, 0.06)`
    *   The shadow is tinted with the `on_surface` color (`#191c1e`) to feel integrated into the environment.
*   **Glassmorphism:** For the "Coordinator Dashboard" top navigation bar, use a `surface` color with 80% opacity and a `20px` backdrop-blur. This allows the content to scroll beneath the header with a frosted glass effect, maintaining a sense of space.

---

## 5. Components

### Buttons
*   **Primary:** Gradient (`primary` to `primary_container`), `md` (0.375rem) roundedness. White text.
*   **Secondary (Approve):** Solid `secondary` (`#006c49`). No border.
*   **Tertiary (Reject/Danger):** Text-only with a `soft red` (`#ba1a1a`) label, or a Ghost Border (see below).

### Status Chips (High-End Execution)
Instead of high-vibrancy blocks, use "Tonal Chips":
*   **Success:** `secondary_container` background with `on_secondary_container` text.
*   **Pending:** `tertiary_fixed` background with `on_tertiary_container` text.
*   **Style:** Pill-shaped (`full` roundedness) with `label-sm` typography in all-caps for a "pro" metadata feel.

### Cards & Lists
*   **The Rule of Separation:** Forbid divider lines. Use `1.5rem` to `2rem` of vertical whitespace to separate list items. 
*   **Container:** Use `surface_container_lowest` with an `xl` (0.75rem) corner radius for a soft, modern silhouette.

### Input Fields
*   **Ghost Borders:** Use the `outline_variant` (`#c5c6cd`) at 20% opacity. 
*   **Focus State:** Shift the background to `surface_bright` and animate a 2px `primary_fixed` glow.

---

## 6. Do's and Don'ts

### Do
*   **DO** use whitespace as a functional tool. If a section feels cluttered, increase the padding rather than adding a border.
*   **DO** use "Primary" (`#0c1427`) for the sidebar to create a strong vertical anchor for the dashboard.
*   **DO** ensure all status text meets a 4.5:1 contrast ratio against its chip background.

### Don't
*   **DON'T** use 100% black. Use `on_background` (`#191c1e`) for text to maintain a premium, "ink-like" look.
*   **DON'T** use standard "drop shadows" on every card. Rely on background color shifts (`surface` vs `surface_container`) first.
*   **DON'T** use the "heavy purple" from the legacy design. If a brand accent is needed, use the `surface_tint` (`#565e74`) sparingly.