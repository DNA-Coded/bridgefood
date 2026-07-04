---
name: Sleek Minimalist Studio
colors:
  surface: '#f9f9fc'
  surface-dim: '#dadadc'
  surface-bright: '#f9f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f6'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#4e453a'
  inverse-surface: '#2f3133'
  inverse-on-surface: '#f0f0f3'
  outline: '#807568'
  outline-variant: '#d2c4b5'
  surface-tint: '#795826'
  primary: '#795826'
  on-primary: '#ffffff'
  primary-container: '#c39b62'
  on-primary-container: '#4e3303'
  inverse-primary: '#ebbf83'
  secondary: '#40674c'
  on-secondary: '#ffffff'
  secondary-container: '#beeac9'
  on-secondary-container: '#446b50'
  tertiary: '#984537'
  on-tertiary: '#ffffff'
  tertiary-container: '#eb8675'
  on-tertiary-container: '#672016'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffddb1'
  primary-fixed-dim: '#ebbf83'
  on-primary-fixed: '#291800'
  on-primary-fixed-variant: '#5f4110'
  secondary-fixed: '#c1edcc'
  secondary-fixed-dim: '#a6d1b1'
  on-secondary-fixed: '#00210f'
  on-secondary-fixed-variant: '#284e36'
  tertiary-fixed: '#ffdad4'
  tertiary-fixed-dim: '#ffb4a7'
  on-tertiary-fixed: '#3f0301'
  on-tertiary-fixed-variant: '#7a2e22'
  background: '#f9f9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e2e2e5'
typography:
  display-lg:
    fontFamily: Merriweather
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Merriweather
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Merriweather
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Merriweather
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system for FoodBridge AI embodies the quiet confidence of a high-end editorial publication. It is designed for an audience that values efficiency, transparency, and a premium aesthetic in the humanitarian and logistical space. 

The visual direction is **Minimalism** with a **Studio Editorial** influence. It prioritizes vast amounts of whitespace, razor-sharp precision, and a warm, inviting atmosphere created through professional photography and a sophisticated color palette. The emotional response should be one of "elevated reliability"—moving away from the typical "charity" aesthetic toward a modern, high-tech logistical platform that feels both human and institutional.

## Colors
This design system utilizes a "Warm Studio" palette. The **Burnished Warm Bronze** (#C39B62) serves as the primary action color, providing a sense of prestige and warmth without the aggressiveness of typical call-to-action colors. 

The interface relies on a clean hierarchy of greys: **Matte Graphite** for primary legibility and **Muted Charcoal** for secondary information. Functional colors (Leaf Green and Rust Crimson) are desaturated to maintain the sophisticated, editorial tone while still providing clear semantic feedback for success and warning states. Panels and cards use a subtle **Off-White** shift to distinguish themselves from the infinite white canvas of the page.

## Typography
The typography strategy pairings a traditional, authoritative Serif (**Merriweather**) for headlines with a clean, systematic Sans-Serif (**Inter**) for functional text. 

Headlines should be treated with editorial care—using tighter letter-spacing for large display sizes to create a "locked-in" look. Body text prioritizes readability with a generous 1.6 line-height. A special `label-caps` style is used for small metadata, category tags, and overlines to provide a modern, structural contrast to the fluid serif headers.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop to maintain the feel of a printed magazine. Content is centered within a 1280px container using a 12-column system. 

On mobile, the layout transitions to a fluid model with 16px side margins. Vertical rhythm is strictly enforced using a 4px baseline grid. Large sections of content should be separated by "XL" (64px) spacing to allow the design to "breathe," emphasizing the minimalist studio aesthetic. Information-dense areas like dashboards utilize "SM" (16px) gutters to maintain a compact, professional feel.

## Elevation & Depth
In keeping with the minimalist studio aesthetic, this design system avoids heavy shadows. Instead, it utilizes **Tonal Layers** and **Low-Contrast Outlines**.

Depth is created by placing Off-White (#F8F9FA) containers atop the Pure White (#FFFFFF) canvas. To separate interactive elements, use 1px Slate Grey (#E5E8EB) borders. When an element requires focus (like a dropdown or active modal), use a single, very soft ambient shadow: `0 4px 20px rgba(18, 20, 22, 0.05)`. Surfaces never feel "floating" high above the page; they feel like paper layers stacked on a desk.

## Shapes
The shape language is defined by **Precision and Sharpness**. A unified 4px corner radius is applied to all buttons, input fields, and cards. This slight rounding prevents the UI from feeling "aggressive" while maintaining a structured, architectural quality. Avoid all pill-shaped elements or large circular buttons, as they detract from the sophisticated editorial narrative.

## Components

### Buttons
Primary buttons use a solid Burnished Warm Bronze background with White text. Secondary buttons use a Slate Grey border with Graphite text. All buttons must have a 4px radius and 0.5px letter spacing for labels. Hover states should involve a slight darkening of the bronze or a subtle Off-White background fill for ghost buttons.

### Demo Mode Banner
A persistent, high-contrast banner at the top of the viewport. Use Matte Graphite (#121416) background with Bronze (#C39B62) accents. The role switcher (DONOR, RECEIVER, ADMIN) should be styled as a segmented control with sharp edges, using the Bronze color to indicate the active selection.

### Cards & Panels
Cards are defined by their Off-White background and 1px Slate Grey border. Padding should be generous (24px or 32px) to maintain the minimalist feel. Do not use shadows for cards in their resting state.

### Input Fields
Inputs use the Off-White background to distinguish them from the page canvas. Focus states are indicated by a 1px Burnished Warm Bronze border. Labels use the `label-caps` typography style, positioned strictly above the field.

### Chips & Tags
Small, rectangular tags with 4px radius. Use a light tint of the status colors (Leaf Green or Rust Crimson) with dark text for status indicators. For general metadata, use a Slate Grey border and Graphite text.