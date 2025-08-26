# Dynamic Color Palette System

A comprehensive, lightweight color palette generator that creates accessible, cohesive color schemes from three primary colors. This system automatically generates semantic color variations, ensures WCAG 2.1 AA compliance, and applies consistent styling across all UI components.

## 🌟 Features

### Core Capabilities
- **Dynamic Palette Generation**: Create complete color schemes from 3 primary colors
- **Accessibility First**: Automatic WCAG 2.1 AA compliance checking and text color optimization
- **CSS Custom Properties**: Leverages modern CSS for efficient color management
- **Semantic Color System**: Organized color variables for different UI purposes
- **Edge Case Handling**: Gracefully manages very light/dark colors and low saturation inputs

### Color Derivation Methodology

#### 1. **Primary Color Variations**
Each input color generates 6 variations using HSL manipulation:
- **Base**: Original color
- **Light** (+20% lightness): Hover states, softer appearances
- **Lighter** (+40% lightness): Background tints
- **Lightest** (+60% lightness): Subtle backgrounds, disabled states
- **Dark** (-20% lightness): Active states, emphasis
- **Darker** (-40% lightness): Deep accents, footer backgrounds

#### 2. **Neutral Color Generation**
Creates a harmonious neutral palette based on the primary color's hue:
```javascript
// Maintains primary color's hue with reduced saturation
neutral: {
  white: '#ffffff',
  lightest: hsl(primaryHue, 10%, 95%),  // Very light tint
  lighter: hsl(primaryHue, 15%, 85%),   // Background grays
  light: hsl(primaryHue, 20%, 75%),     // Border colors
  medium: hsl(primaryHue, 25%, 50%),    // Muted text
  dark: hsl(primaryHue, 30%, 25%),      // Dark text
  darker: hsl(primaryHue, 35%, 15%),    // Very dark backgrounds
  black: '#000000'
}
```

#### 3. **Accessibility-First Text Colors**
Automatically calculates optimal text colors using WCAG contrast formulas:
```javascript
// Calculates relative luminance and chooses optimal contrast
const getAccessibleTextColor = (backgroundColor) => {
  const whiteContrast = getContrastRatio('#ffffff', backgroundColor);
  const blackContrast = getContrastRatio('#000000', backgroundColor);
  return whiteContrast > blackContrast ? '#ffffff' : '#000000';
}
```

#### 4. **Status Color Derivation**
Semantic status colors blend primary palette with standard status hues:
- **Success**: Primary + Green (70% primary, 30% #28a745)
- **Warning**: Secondary + Yellow (80% secondary, 20% #ffc107)  
- **Error**: Accent + Red (60% accent, 40% #dc3545)
- **Info**: Primary + Blue (50% primary, 50% #17a2b8)

## 🚀 Quick Start

### 1. Include the Files
```html
<link rel="stylesheet" href="color-system.css">
<script src="color-palette-generator.js"></script>
```

### 2. Apply a New Palette
```javascript
// Update entire website color scheme
updateWebsitePalette('#228B22', '#FFD700', '#FF6B35');

// Or use the class directly
const generator = new ColorPaletteGenerator();
const palette = generator.generatePalette('#2E86AB', '#A23B72', '#F18F01');
generator.applyPaletteToCss(palette);
```

### 3. Use in Your CSS
```css
.my-component {
  background-color: var(--interactive-primary);
  color: var(--text-on-primary);
  border: 2px solid var(--border-primary);
}

.my-component:hover {
  background-color: var(--interactive-primary-hover);
  box-shadow: 0 4px 12px var(--shadow-primary);
}
```

## 📋 CSS Custom Properties Reference

### Primary Color System
```css
:root {
  /* Input Colors (dynamically updated) */
  --primary-color-1: #228B22;    /* Main brand color */
  --primary-color-2: #FFD700;    /* Secondary/accent */
  --primary-color-3: #FF6B35;    /* Supporting accent */
  
  /* Generated Variations */
  --color-primary: var(--primary-color-1);
  --color-primary-light: /* +20% lightness */;
  --color-primary-lighter: /* +40% lightness */;
  --color-primary-lightest: /* +60% lightness */;
  --color-primary-dark: /* -20% lightness */;
  --color-primary-darker: /* -40% lightness */;
}
```

### Semantic Applications
```css
:root {
  /* Interactive States */
  --interactive-primary: var(--color-primary);
  --interactive-primary-hover: var(--color-primary-light);
  --interactive-primary-active: var(--color-primary-dark);
  --interactive-primary-disabled: /* 40% opacity blend */;
  
  /* Text Colors (accessibility optimized) */
  --text-on-primary: /* Auto-calculated for contrast */;
  --text-on-secondary: /* Auto-calculated for contrast */;
  --text-on-accent: /* Auto-calculated for contrast */;
  
  /* Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: /* Light neutral */;
  --bg-tertiary: /* Medium neutral */;
  --bg-dark: var(--color-primary-darker);
  
  /* Borders & Shadows */
  --border-primary: /* 30% opacity primary */;
  --shadow-primary: /* 25% opacity primary */;
}
```

## 🎯 Component Examples

### Buttons
```html
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-secondary">Secondary Action</button>
<button class="btn btn-primary" disabled>Disabled State</button>
```

### Cards
```html
<div class="card">
  <div class="card-header">
    <h3>Card Title</h3>
  </div>
  <p>Card content automatically inherits palette colors...</p>
</div>
```

### Forms
```html
<input type="text" class="form-input" placeholder="Styled input">
<select class="form-input">
  <option>Styled select</option>
</select>
```

### Status Messages
```html
<div class="status status-success">Success message</div>
<div class="status status-warning">Warning message</div>
<div class="status status-error">Error message</div>
<div class="status status-info">Info message</div>
```

## 🔧 JavaScript API

### ColorPaletteGenerator Class

#### Core Methods
```javascript
const generator = new ColorPaletteGenerator();

// Generate complete palette
const palette = generator.generatePalette('#primary', '#secondary', '#accent');

// Apply palette to CSS
generator.applyPaletteToCss(palette);

// Color manipulation
const lighter = generator.adjustLightness('#228B22', 30);
const desaturated = generator.adjustSaturation('#228B22', -20);
const complement = generator.getComplementaryColor('#228B22');

// Accessibility checking
const contrast = generator.getContrastRatio('#000000', '#ffffff'); // 21
const accessible = generator.checkAccessibility('#000000', '#ffffff', 'AA', 'normal');
const textColor = generator.getAccessibleTextColor('#228B22'); // '#ffffff'
```

#### Palette Object Structure
```javascript
{
  primary: {
    base: '#228B22',
    light: '#4da34d',     // +20% lightness
    lighter: '#7bb67b',   // +40% lightness
    lightest: '#b3d9b3',  // +60% lightness
    dark: '#1b6e1b',      // -20% lightness
    darker: '#0e4f0e'     // -40% lightness
  },
  secondary: { /* same structure */ },
  accent: { /* same structure */ },
  neutral: {
    white: '#ffffff',
    lightest: '#f8f9fa',
    /* ... */
    black: '#000000'
  },
  status: {
    success: '#calculated',
    warning: '#calculated',
    error: '#calculated',
    info: '#calculated'
  },
  accessibility: {
    textOnPrimary: '#ffffff',
    textOnSecondary: '#000000',
    textOnAccent: '#ffffff',
    textOnLight: '#000000',
    textOnDark: '#ffffff'
  }
}
```

## ♿ Accessibility Features

### WCAG 2.1 AA Compliance
- **Automatic Contrast Checking**: All color combinations tested against 4.5:1 ratio requirement
- **Text Color Optimization**: Automatically chooses black or white text for optimal readability
- **Large Text Support**: 3:1 ratio for text larger than 18pt or bold 14pt
- **Status Color Accessibility**: Status indicators maintain sufficient contrast

### Edge Case Handling
```javascript
// Automatically adjusts problematic colors
const handleEdgeCases = (color) => {
  const hsl = rgbToHsl(hexToRgb(color));
  
  if (hsl.l > 95) hsl.l = 85;      // Too light → darken
  if (hsl.l < 5) hsl.l = 15;       // Too dark → lighten  
  if (hsl.s < 10) hsl.s = 20;      // Too gray → add saturation
  
  return hslToRgb(hsl.h, hsl.s, hsl.l);
}
```

### High Contrast & Reduced Motion Support
```css
@media (prefers-contrast: high) {
  :root {
    --border-light: var(--border-dark);  /* Stronger borders */
  }
  
  .btn-primary { border-width: 3px; }    /* Thicker borders */
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;  /* Disable animations */
  }
}
```

## 🎨 Color Presets

Ready-to-use color combinations:

```javascript
// Ocean theme
updateWebsitePalette('#2E86AB', '#A23B72', '#F18F01');

// Forest theme  
updateWebsitePalette('#228B22', '#FFA500', '#FF6347');

// Sunset theme
updateWebsitePalette('#FF6B35', '#F7931E', '#FFD23F');

// Purple theme
updateWebsitePalette('#6A4C93', '#C44536', '#FFCA3A');

// Teal theme
updateWebsitePalette('#17A2B8', '#FFC107', '#DC3545');
```

## 📱 Responsive Considerations

The system works seamlessly across all device sizes:
- **Consistent Colors**: Same palette applied across breakpoints
- **Touch-Friendly**: Adequate color contrast for mobile interfaces  
- **Print Optimization**: Automatic high-contrast mode for printing

## ⚡ Performance

- **Lightweight**: ~8KB total (CSS + JS combined)
- **No Dependencies**: Pure JavaScript and CSS
- **CSS Custom Properties**: Efficient real-time color updates
- **Minimal Repaints**: Changes only affect necessary elements

## 🔍 Browser Support

- **Modern Browsers**: Chrome 49+, Firefox 31+, Safari 9.1+, Edge 16+
- **CSS color-mix()**: Chrome 111+, Firefox 113+, Safari 16.2+
- **Fallback**: Automatic degradation for older browsers

## 📖 Integration Examples

### React/Vue Components
{% raw %}
```jsx
// React component using the system
const MyButton = ({ variant = 'primary', children, ...props }) => (
  <button 
    className={`btn btn-${variant}`} 
    style={{ 
      backgroundColor: `var(--interactive-${variant})`,
      color: `var(--text-on-${variant})`
    }}
    {...props}
  >
    {children}
  </button>
);
```
{% endraw %}

### CSS Preprocessors
{% raw %}
```scss
// SCSS mixin using the palette
@mixin themed-button($variant: primary) {
  background-color: var(--interactive-#{$variant});
  color: var(--text-on-#{$variant});
  border: 2px solid var(--interactive-#{$variant});
  
  &:hover {
    background-color: var(--interactive-#{$variant}-hover);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow-#{$variant});
  }
}

.my-button { @include themed-button(primary); }
```
{% endraw %}

This system provides a robust, accessible foundation for any web application's color scheme while maintaining simplicity and performance.