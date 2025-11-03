# Typography System Guide

## Overview

This project uses a custom typography system with two primary font families:
- **Vocago** - Primary serif font for most text
- **BT Beau Sans** - Alternative sans-serif for specific headings

## Font Families

### Available Classes

```css
font-vocago       /* Vocago (serif) */
font-bt-beau-sans /* BT Beau Sans (sans-serif) */
font-sans         /* Fallback to Inter */
```

## Typography Styles

All typography classes are **responsive by default** - they automatically adjust sizes below 744px (tablet breakpoint).

### Display

**Desktop:** 64px / 72px line height  
**Mobile:** 40px / 48px line height  
**Font:** Vocago Regular

```jsx
<h1 className="text-display">Through each entry in this journal a new journey unfolds</h1>
```

### Heading 1

**Desktop:** 52px / 64px line height  
**Mobile:** 32px / 40px line height  
**Font:** Vocago Regular

```jsx
<h1 className="text-h1">Through each entry in this journal a new journey unfolds</h1>
```

### Heading 2 (Beau Sans)

**Desktop:** 32px / 48px line height  
**Mobile:** 20px / 28px line height  
**Font:** BT Beau Sans Regular

```jsx
<h2 className="text-h2-beau">Through each entry in this journal a new journey unfolds</h2>
```

### Heading 2 (Vocago)

**Desktop:** 36px / 40px line height  
**Mobile:** 24px / 28px line height  
**Font:** Vocago Regular

```jsx
<h2 className="text-h2">Through each entry in this journal a new journey unfolds</h2>
```

### Heading 4

**Desktop:** 24px / 32px line height  
**Mobile:** 20px / 24px line height  
**Font:** Vocago Regular

```jsx
<h4 className="text-h4">Through each entry in this journal a new journey unfolds</h4>
```

### Body Large

**Desktop:** 20px / 28px line height  
**Mobile:** 16px / 24px line height  
**Font:** Vocago Regular

```jsx
<p className="text-body-lg">Through each entry in this journal a new journey unfolds</p>
```

### Body Medium

**Desktop:** 16px / 24px line height  
**Mobile:** 14px / 20px line height  
**Font:** Vocago Regular

```jsx
<p className="text-body-md">Through each entry in this journal a new journey unfolds</p>
```

### Body Small

**Desktop:** 14px / 20px line height  
**Mobile:** 12px / 16px line height  
**Font:** Vocago Regular

```jsx
<p className="text-body-sm">Through each entry in this journal a new journey unfolds</p>
```

## Manual Responsive Control

If you need manual control over responsive sizes, use the base font size utilities with breakpoints:

```jsx
<h1 className="font-vocago text-display md:text-display-mobile">
  Custom responsive text
</h1>
```

## Usage Examples

### Article Header

```jsx
<article>
  <h1 className="text-display mb-4">Article Title</h1>
  <p className="text-body-lg text-text-secondary">Introduction paragraph</p>
</article>
```

### Card Component

```jsx
<div className="card">
  <h3 className="text-h4 mb-2">Card Title</h3>
  <p className="text-body-md text-text-tertiary">Card description text</p>
</div>
```

### Mixed Fonts

```jsx
<section>
  <h2 className="text-h2-beau mb-6">Section with Beau Sans</h2>
  <p className="text-body-lg">Body text in Vocago</p>
</section>
```

## Notes

- All typography classes automatically handle responsive sizing at the 744px breakpoint
- Font weights are set to 400 (Regular) for all styles as per design system
- Line heights are optimized for readability at each size
- Use semantic HTML elements (h1, h2, p, etc.) with typography classes for accessibility
