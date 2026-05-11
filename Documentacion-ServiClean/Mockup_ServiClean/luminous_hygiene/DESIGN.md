# The Design System Specification: Editorial Purity

## 1. Overview & Creative North Star
The North Star for this design system is **"The Pristine Curator."** 

Moving beyond the utilitarian "app" feel, we treat on-demand cleaning as a premium lifestyle service. The aesthetic rejects the cluttered "grid-and-border" layouts of the past in favor of an editorial, high-end magazine feel. We achieve this through **Intentional Asymmetry** (e.g., hero text offset from imagery), **Breathing Room** (aggressive use of whitespace), and **Tonal Depth**. By layering surfaces rather than boxing them in, we create a digital environment that feels as fresh and ventilated as a professionally cleaned home.

---

## 2. Color & Surface Architecture
We utilize a sophisticated Material-based palette to ensure the interface feels "expensive" rather than "default."

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined solely through background color shifts.
*   *Implementation:* A `surface-container-low` (#f3f4f5) section sitting on a `background` (#f8f9fa) creates a sophisticated, soft-edge transition that 1px lines cannot replicate.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass.
*   **Lowest Tier (`surface-container-lowest` / #ffffff):** Reserved for the most important interactive cards or "hero" modules.
*   **Base Tier (`surface` / #f8f9fa):** The canvas for the entire experience.
*   **High Tier (`surface-container-high` / #e7e8e9):** Used for navigation bars or footer elements to provide anchor points.

### The "Glass & Gradient" Rule
To inject "soul" into the teal and blue palette, avoid flat blocks of color.
*   **Signature Textures:** Use subtle linear gradients for CTAs, transitioning from `primary` (#006565) to `primary_container` (#008080) at a 135-degree angle.
*   **Glassmorphism:** For floating action buttons or modal overlays, use `surface` at 80% opacity with a `20px` backdrop-blur. This ensures the UI feels integrated and airy.

---

## 3. Typography: The Editorial Voice
We pair the structural reliability of **Inter** (Body) with the architectural elegance of **Manrope** (Display) to create a high-contrast hierarchy.

*   **Display & Headlines (Manrope):** Use `display-lg` (3.5rem) for hero statements. Kern these tightly (-0.02em) to create an authoritative, premium feel. 
*   **Body & Titles (Inter):** Use `body-lg` (1rem) for primary descriptions. The increased line-height (1.6) is non-negotiable to maintain the "breathable" vibe.
*   **Labels:** Use `label-md` (0.75rem) in all-caps with a 0.05em letter spacing for category tags or metadata to provide a technical, precise counterpoint to the fluid headlines.

---

## 4. Elevation & Depth
Depth is a functional tool, not a decoration. We favor **Tonal Layering** over shadows wherever possible.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This 2-point hex shift creates a natural "lift" that feels modern and clean.
*   **Ambient Shadows:** When a float is required (e.g., a "Book Now" sticky bar), use an extra-diffused shadow: `0px 12px 32px rgba(0, 101, 101, 0.06)`. Note the teal tint in the shadow—never use pure black or grey.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke (e.g., input fields), use `outline_variant` at 20% opacity. 100% opaque borders are strictly forbidden as they "trap" the eye.

---

## 5. Components & Interaction Patterns

### Buttons (The "Soft-Touch" CTA)
*   **Primary:** A gradient-filled container (`primary` to `primary_container`) with `xl` (1.5rem) roundedness for a pill shape. 
*   **Secondary:** No background. Use a "Ghost Border" (20% `outline`) and `secondary` (#0059bb) text.
*   **Tertiary:** Text-only, using `secondary` with an icon.

### Input Fields
*   **Style:** Minimalist. Use `surface-container-low` as the fill. No border. On focus, transition the background to `surface-container-lowest` and add a subtle 2px teal bottom-accent.

### Cards & Lists
*   **Forbid Dividers:** Do not use lines to separate list items. Use `2.5rem` (Space 10) of vertical whitespace or alternating `surface` and `surface-container-low` backgrounds.
*   **Service Cards:** Use `lg` (1rem) corner radius. Imagery should bleed to the edges of the card to maximize visual impact.

### Contextual Components (Cleaning Service Specific)
*   **Trust Badges:** Micro-chips using `tertiary_fixed` (#ffdbc8) backgrounds to highlight "Vetted" or "Insured" status without clashing with the primary teal.
*   **The Pulse Indicator:** A small, animated teal dot next to "Cleaner En Route" status to provide real-time reassurance.

---

## 6. Do’s and Don’ts

### Do
*   **Do** lean into asymmetry. It’s okay if a photo is 60% width and the text is 40% with a large gap. 
*   **Do** use the `tertiary` (Orange/Yellow) palette sparingly. These are "spices"—use them for ratings and urgent actions only.
*   **Do** use `8.0rem` (Space 32) top-margins for major sections to allow the design to breathe.

### Don't
*   **Don't** use 1px dividers. If you feel you need one, increase the whitespace instead.
*   **Don't** use "Card-in-Card" layouts without a background color shift. 
*   **Don't** use high-contrast black (#000000) for text. Always use `on_surface` (#191c1d) to maintain a soft, premium look.