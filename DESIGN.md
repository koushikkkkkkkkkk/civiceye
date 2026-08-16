---
name: AmritaEye Apple HIG Minimalist Design System
description: Ultra-clean, minimalist campus portal inspired by Apple's Human Interface Guidelines with bold AM Maroon accent & confident typography scale.
colors:
  primary: "#A51636"
  primary-dark-contrast: "#E52B50"
  neutral-bg: "#FFFFFF"
  secondary-bg: "#F5F5F7"
  text-primary: "#1D1D1F"
  text-secondary: "#6e6e73"
  border-light: "#e5e5e7"
  dark-canvas-bg: "#000000"
  dark-section-bg: "#0D0D0D"
  dark-card-bg: "#161618"
  dark-elevated-bg: "#1C1C1E"
  dark-border: "#2C2C2E"
  dark-text-primary: "#FFFFFF"
  dark-text-secondary: "#A1A1A6"
typography:
  display:
    fontFamily: "'Playfair Display', 'Times New Roman', Times, Georgia, serif"
    fontSize: "72px"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  display-mobile:
    fontFamily: "'Playfair Display', 'Times New Roman', Times, Georgia, serif"
    fontSize: "56px"
    fontWeight: 800
    lineHeight: 1.0
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "'Playfair Display', 'Times New Roman', Times, Georgia, serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.2
  headline-mobile:
    fontFamily: "'Playfair Display', 'Times New Roman', Times, Georgia, serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  section: "112px"
  group: "32px"
  item: "16px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.full}"
    padding: "16px 36px"
---

# Design System: AmritaEye (Bold Minimalist Apple HIG)

## Overview

**Creative North Star: "The Studio Gallery"**

An ultra-minimalist, high-contrast design system inspired by Apple's Human Interface Guidelines. Designed for bold visual clarity, confident typography, generous negative space, and single-column structural flow.

Key Characteristics:
- **Bold Typography Scale:**
  - **Large Title:** 64px desktop / 56px mobile, Bold (700), -0.03em tracking.
  - **Subheadline:** 24px desktop / 20px mobile, Semi-bold (600), AM Maroon (`#A51636`).
  - **Body Text:** 16px, Regular (400), Dark Grey (`#1D1D1F`), Line-Height 1.5.
- **Weight Calibration:** Maximum **two font weights** per section (`700` bold / `600` semi-bold + `400` regular).
- **Primary Accent:** AM Maroon (`#A51636`) on key subheadlines, primary action targets, and brand accents (`#E52B50` high-contrast variant in dark mode).
- **Pure Canvas Surfaces:** Main canvas is pure white (`#FFFFFF`) in Light Mode and pure OLED black (`#000000`) in Dark Mode. Secondary sections use Apple off-white (`#F5F5F7`) or deep dark section surface (`#0D0D0D`).
- **Ample Negative Space:** Section padding exceeds 80px (`112px` / `py-28 sm:py-36`) with clean baseline grid alignment.

## Colors

### Primary
- **AM Maroon** (#A51636): Subheadlines, primary button CTA, and brand wordmark accent.
- **Vibrant Dark AM Maroon** (#E52B50): High-contrast maroon accent for OLED dark surfaces.

### Neutral (Light Mode)
- **Pure White Canvas** (#FFFFFF): Main hero and content background.
- **Apple Off-White** (#F5F5F7): Secondary sections and metric bar backgrounds.
- **Dark Grey** (#1D1D1F): Primary headings and high-contrast body text.
- **Light Border** (#e5e5e7): Fine structural divider lines.

### Dark Mode (Apple HIG OLED Black System)
- **OLED Black Canvas** (#000000): Pitch black main hero and page background.
- **Deep Dark Section Surface** (#0D0D0D): Secondary section and metric section backgrounds.
- **Dark Card Surface** (#161618): Card panels, containers, and primary tiles.
- **Dark Elevated Surface** (#1C1C1E): Search inputs, filter buttons, and nested interactive elements.
- **Dark Border** (#2C2C2E): Structural fine borders and dividers in dark mode.
- **Dark Text Primary** (#FFFFFF / #F5F5F7): High-contrast primary text on dark background.
- **Dark Text Secondary** (#A1A1A6): Muted sub-text and secondary descriptors.

## Typography Hierarchy & Rules

**Primary Font:** Inter (-apple-system, BlinkMacSystemFont, sans-serif)

### Scales
- **Large Title:** `64px` / `56px` (`text-[56px] sm:text-[64px]`), `font-bold`, `-0.03em` tracking (`tracking-[-0.03em]`), Line Height 1.05 (`leading-[1.05]`).
- **Subheadline:** `24px` / `20px` (`text-[20px] sm:text-[24px]`), `font-semibold`, AM Maroon (`text-[#A51636]`), Line Height 1.3 (`leading-[1.3]`).
- **Body Text:** `16px` (`text-[16px]`), `font-normal`, Dark Grey (`text-[#1D1D1F]`), Line Height 1.5 (`leading-[1.5]`).

## Do's and Don'ts

### Do:
- **Do** enforce `64px` / `56px` Bold for Large Titles, `24px` / `20px` Semi-bold AM Maroon for Subheadlines, and `16px` Regular for Body text.
- **Do** limit each section to at most two font weights.
- **Do** align text line-heights to 1.5 for body paragraphs.

### Don't:
- **Don't** mix more than two font weights in the same component or section.
- **Don't** use arbitrary text sizes outside the documented type scale.
