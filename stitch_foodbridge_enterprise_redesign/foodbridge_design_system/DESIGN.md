---
name: FoodBridge Design System
colors:
  surface: '#f4fcf0'
  surface-dim: '#d5dcd1'
  surface-bright: '#f4fcf0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff6ea'
  surface-container: '#e9f0e5'
  surface-container-high: '#e3eadf'
  surface-container-highest: '#dde5d9'
  on-surface: '#171d16'
  on-surface-variant: '#3e4a3d'
  inverse-surface: '#2b322b'
  inverse-on-surface: '#ecf3e7'
  outline: '#6e7b6c'
  outline-variant: '#bdcaba'
  surface-tint: '#006e2d'
  primary: '#006b2c'
  on-primary: '#ffffff'
  primary-container: '#00873a'
  on-primary-container: '#f7fff2'
  inverse-primary: '#62df7d'
  secondary: '#2e6a41'
  on-secondary: '#ffffff'
  secondary-container: '#b1f2be'
  on-secondary-container: '#347047'
  tertiary: '#a72d51'
  on-tertiary: '#ffffff'
  tertiary-container: '#c74668'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#7ffc97'
  primary-fixed-dim: '#62df7d'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005320'
  secondary-fixed: '#b1f2be'
  secondary-fixed-dim: '#96d5a3'
  on-secondary-fixed: '#00210d'
  on-secondary-fixed-variant: '#12512c'
  tertiary-fixed: '#ffd9de'
  tertiary-fixed-dim: '#ffb2bf'
  on-tertiary-fixed: '#3f0016'
  on-tertiary-fixed-variant: '#8a143c'
  background: '#f4fcf0'
  on-background: '#171d16'
  surface-variant: '#dde5d9'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max-width: 1440px
  gutter: 16px
  margin-desktop: 32px
  margin-mobile: 16px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is built for a high-stakes food logistics environment where speed of comprehension and operational efficiency are paramount. The brand personality is **utilitarian, reliable, and precise**. It avoids decorative flourishes in favor of a "tools-not-toys" philosophy, ensuring that users can manage complex supply chains without visual fatigue.

The aesthetic follows a **Corporate Minimalist** approach, drawing inspiration from high-performance developer tools. It utilizes a restrained color palette, crisp borders instead of shadows, and a strict adherence to a systematic grid. The goal is to evoke an emotional response of total control and professional clarity.

## Colors

The palette is strategically limited to ensure that color always conveys meaning—typically status, action, or progression. 

- **Primary (#16A34A):** Reserved for primary call-to-actions, successful delivery statuses, and active selection states.
- **Secondary (#14532D):** Used for deep-tier navigation elements and high-contrast text headers to provide grounding.
- **Surface & Neutral:** The UI relies on a white base with `Slate-50` surfaces to define different functional areas. `Slate-200` is the standard for hair-line borders that define the structure without adding visual weight.
- **Functional Use:** Semantic colors (Red for delays, Amber for expiring stock) should be used only within status chips and icons.

## Typography

This design system uses **Inter** for all UI elements to ensure maximum legibility across high-density data tables and dashboards. 

- **Hierarchy:** We use a tight type scale. Headline sizes are restrained to keep more data "above the fold."
- **Data Density:** For SKU numbers, tracking IDs, and timestamps, an optional Monospace secondary font (JetBrains Mono) is used to ensure character alignment and readability in lists.
- **Weight:** Bold (700) is used sparingly for page titles. Semi-bold (600) is the standard for section headers and interactive labels.

## Layout & Spacing

The layout model is a **fixed-fluid hybrid**. On desktop, the main content area has a maximum width of 1440px to prevent line lengths from becoming unreadable on ultra-wide monitors.

- **Grid:** A 12-column grid system with 16px gutters. In logistics views (e.g., Inventory Management), the sidebar is fixed at 240px, and the remaining space is fluid.
- **Rhythm:** We use a strict 4px baseline grid. Padding and margins should always be multiples of 4 (4, 8, 12, 16, 24, 32).
- **Density:** Components use "Compact" spacing by default (8px vertical padding for inputs and list items) to allow for more rows of data per screen.

## Elevation & Depth

To maintain a "flat" production-ready look, this design system avoids traditional box shadows.

- **Tonal Layers:** Depth is created through background color shifts. The base canvas is `White`, while sidebars and secondary panels use `Slate-50`.
- **Borders:** Instead of shadows, use 1px solid borders (`Slate-200`) to separate components. 
- **Active State Elevation:** When an element is dragged or focused, a single, very crisp 2px stroke of the primary color or a subtle `Slate-300` border is used. 
- **Overlays:** Modals and dropdowns use a single-pixel border with a very subtle, neutral "feather" shadow (0px 4px 12px rgba(0,0,0,0.05)) to distinguish them from the background.

## Shapes

The shape language is **Soft (0.25rem)**. This provides a modern, approachable feel while maintaining the professional structure of a grid-based system. 

- **Standard Elements:** Buttons, Input fields, and Chips use a 4px radius.
- **Container Elements:** Large cards or dashboard widgets use an 8px (rounded-lg) radius.
- **Interactive Feedback:** Focus states follow the radius of the parent element with a 2px offset.

## Components

- **Buttons:** Primary buttons are solid `#16A34A` with white text. Secondary buttons use a white background with a `#E2E8F0` border. No gradients.
- **Inputs:** Text inputs have a 1px border. On focus, the border changes to the primary color with a subtle 2px outer glow of the same color at 10% opacity.
- **Data Tables:** The core of the platform. Rows have a fixed height (40px for compact, 56px for standard). Use zebra-striping (Slate-50) only for tables exceeding 20 rows.
- **Status Chips:** Small, semi-rounded indicators. Use a "tinted" background (10% opacity of the status color) with high-contrast text for maximum legibility without the heaviness of solid blocks.
- **Navigation:** A vertical left-hand navigation bar is preferred for logistics tools. Active links are indicated by a 2px vertical "pill" on the leading edge and a subtle text weight increase.
- **Search:** A persistent, global command-bar style search (Cmd+K) should be accessible from any screen, styled with a simple border and minimal backdrop blur.