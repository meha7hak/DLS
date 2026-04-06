# Design System Specification: High-End Editorial

## 1. Overview & Creative North Star

### The Creative North Star: "The Crimson Curator"
This design system is built upon the concept of **The Crimson Curator**. It moves away from the rigid, boxy nature of traditional SaaS interfaces and embraces the world of high-end digital editorial. The experience is designed to feel like a bespoke gallery: authoritative, effortless, and deeply intentional.

We achieve this by breaking the "template" look. Instead of standard grids, we utilize **intentional asymmetry**, allowing elements to breathe through expansive whitespace. We replace harsh structural lines with soft tonal shifts and layered surfaces. This system is not just a tool; it is a premium environment that commands respect through subtlety.

---

## 2. Color & Tonal Architecture

Our palette is anchored by a sophisticated 'Modern Crimson' (`#75001f`), balanced by the warmth of Ivory (`#fbf9f5`) and the depth of Charcoal (`#383737`).

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or layout containment. 
Boundary definition must be achieved through:
- **Background Color Shifts:** Placing a `surface-container-low` (`#f5f3ef`) section against a `surface` (`#fbf9f5`) background.
- **Tonal Transitions:** Using subtle variations in surface tiers to distinguish between navigation, content, and utility areas.

### Surface Hierarchy & Nesting
Treat the UI as physical layers—like stacked sheets of fine paper or frosted glass.
- **Base Layer:** `surface` (`#fbf9f5`) for main page backgrounds.
- **Nested Depth:** Use `surface-container-lowest` (`#ffffff`) for elevated cards to create a "pop," or `surface-container-high` (`#eae8e4`) for recessed areas like sidebars or footers.

### The "Glass & Gradient" Rule
To elevate the experience beyond flat design:
- **Glassmorphism:** For floating elements (modals, dropdowns), use semi-transparent surface colors combined with a `20px` to `40px` backdrop blur.
- **Signature Gradients:** Use a subtle linear gradient from `primary` (`#75001f`) to `primary-container` (`#9a1631`) for high-impact CTAs. This provides a "soul" and depth that flat hex codes cannot replicate.

---

## 3. Typography

The system utilizes **Plus Jakarta Sans** for its modern, geometric clarity and high-end tech feel. 

| Level | Token | Size | Weight / Style | Role |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | 3.5rem | Bold | Hero headlines with ultra-wide tracking. |
| **Headline** | `headline-md` | 1.75rem | Medium | Section starters; the "Editorial" voice. |
| **Title** | `title-lg` | 1.375rem | Semi-Bold | Card titles and primary navigation nodes. |
| **Body** | `body-lg` | 1rem | Regular | Primary content; high line-height (1.6). |
| **Label** | `label-md` | 0.75rem | Medium | Metadata, all-caps with 0.05em letter spacing. |

**Editorial Intent:** Mix scales dramatically. Pair a `display-lg` headline with a small, wide-tracked `label-md` directly above it to create an authoritative, magazine-style layout.

---

## 4. Elevation & Depth

We eschew traditional shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Soft, natural lift is achieved by placing a `surface-container-lowest` (`#ffffff`) card on a `surface-container-low` (`#f5f3ef`) background.
*   **Ambient Shadows:** If a floating effect is required, shadows must be "Ambient."
    *   *Blur:* 32px – 64px.
    *   *Opacity:* 4% – 8%.
    *   *Color:* Use a tinted version of `on-surface` (`#1b1c1a`) rather than pure black.
*   **The "Ghost Border" Fallback:** If a container requires a border for accessibility, use the `outline-variant` (`#e0bfbf`) at **15% opacity**. Never use 100% opaque borders.
*   **Glassmorphism Depth:** Elements using backdrop blur should use a very thin `outline-variant` at 10% opacity to catch the "light" at the edge, simulating the thickness of glass.

---

## 5. Components

### Buttons
*   **Primary:** Background: Gradient `primary` to `primary-container`. Typography: `on-primary` (`#ffffff`). Corner Radius: `xl` (1.5rem).
*   **Secondary:** Background: `secondary-container` (`#fbd7dc`). Typography: `on-secondary-container` (`#775c60`). No border.
*   **Tertiary (Ghost):** No background. Typography: `primary`. Hover state uses a 5% `primary` background tint.

### Cards & Lists
*   **Strict Rule:** No divider lines. Separate items using `1.5rem` to `2rem` of vertical whitespace or a subtle background shift to `surface-container-lowest`.
*   **Corner Radius:** Cards must use `xl` (1.5rem) or `lg` (1rem) for a friendly, professional feel.

### Input Fields
*   **Style:** Minimalist. Use `surface-variant` (`#e4e2de`) as a subtle background fill rather than a stroke. 
*   **States:** On focus, transition the background to `primary-fixed` (`#ffdada`) with a soft `primary` text cursor.

### Chips
*   **Selection:** Use `secondary-fixed` (`#fedadf`) with `on-secondary-fixed` (`#2a161a`) text. 
*   **Roundedness:** Always `full` (9999px) for a "pill" aesthetic.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins. If a container is centered, try offsetting its internal content to the left to create visual tension.
*   **Do** use Ivory (`#fbf9f5`) for all main backgrounds. It feels warmer and more "premium" than clinical white.
*   **Do** use generous white space. If you think there is enough space, add 20% more.
*   **Do** apply `backdrop-blur` to any element that overlaps another to maintain the "layering" metaphor.

### Don't
*   **Don't** use pure black for text. Use `on-surface` (`#1b1c1a`) or `tertiary` (`#383737`) for a softer, high-end feel.
*   **Don't** use sharp corners. Every interactive element should have at least an `md` (12px) radius.
*   **Don't** use 1px dividers to separate list items; let the typography and spacing do the work.
*   **Don't** clutter the Crimson. Use the `primary` color as a "surgical strike"—only for the most important actions or brand moments.