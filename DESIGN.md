# Design System

## Direction

Une chambre noire contemporaine. La page reste entièrement sombre et monochrome; chaque univers se distingue par une valeur de noir différente, comme plusieurs papiers photographiques. La mise en page est asymétrique, nette et sans angles arrondis.

## Color

All colors use OKLCH.

- Background: `oklch(0.09 0 0)`
- Surface low: `oklch(0.12 0.004 270)`
- Surface mid: `oklch(0.16 0.006 270)`
- Surface high: `oklch(0.20 0.008 270)`
- Ink: `oklch(0.96 0.004 270)`
- Muted: `oklch(0.72 0.008 270)`
- Primary silver-violet: `oklch(0.78 0.018 270)`
- Hairline: `oklch(0.34 0.008 270 / 0.55)`

The palette-seed hue remains present as a nearly achromatic silver-violet. It supports the requested monochrome direction instead of becoming a visible purple accent.

## Typography

Archivo, self-hosted, is the only family. Condensed and heavy settings create the title voice; normal-width, regular settings keep paragraphs calm and readable.

- Display: 700-900 weight, condensed, tight but never below `-0.04em`
- Body: 400 weight, 1.65 line-height, maximum 68 characters
- Metadata: 500 weight, compact scale, sentence case

## Layout

- Maximum content width: 1600px
- Desktop side margins: fluid `clamp(20px, 4vw, 72px)`
- Section spacing: fluid `clamp(88px, 13vw, 190px)`
- Mobile: strict single column below 768px
- Shape system: sharp corners throughout; controls may be circular only when their function is directional

## Motion

- Orchestrated hero load introduces hierarchy
- IntersectionObserver reveals selected groups without hiding default content
- Image hover uses restrained scale and contrast changes
- Lightbox transitions communicate state changes
- All motion collapses under `prefers-reduced-motion`

## Components

- Fixed transparent navigation that becomes opaque after the hero
- Asymmetric image grids with a different composition per offer
- Native dialog lightbox with keyboard navigation
- Direct mail and telephone links
- Mobile menu with a simple text control
