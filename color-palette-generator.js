/*
========================================
DYNAMIC COLOR PALETTE GENERATOR
========================================
Comprehensive color manipulation and palette generation system
with accessibility compliance and contrast validation
========================================
*/

class ColorPaletteGenerator {
  constructor() {
    this.contrastThreshold = {
      AA_NORMAL: 4.5,
      AA_LARGE: 3.0,
      AAA_NORMAL: 7.0,
      AAA_LARGE: 4.5
    };
  }

  /*
  ================================
  COLOR CONVERSION UTILITIES
  ================================
  */

  /**
   * Convert hex color to RGB values
   * @param {string} hex - Hex color code (#RRGGBB or #RGB)
   * @returns {Object} RGB values {r, g, b}
   */
  hexToRgb(hex) {
    // Remove hash if present
    hex = hex.replace(/^#/, '');
    
    // Handle 3-digit hex codes
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Convert RGB to hex
   * @param {number} r - Red value (0-255)
   * @param {number} g - Green value (0-255)
   * @param {number} b - Blue value (0-255)
   * @returns {string} Hex color code
   */
  rgbToHex(r, g, b) {
    const toHex = (n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  /**
   * Convert RGB to HSL
   * @param {number} r - Red value (0-255)
   * @param {number} g - Green value (0-255)
   * @param {number} b - Blue value (0-255)
   * @returns {Object} HSL values {h, s, l}
   */
  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const sum = max + min;
    const l = sum / 2;

    let h = 0;
    let s = 0;

    if (diff !== 0) {
      s = l > 0.5 ? diff / (2 - sum) : diff / sum;

      switch (max) {
        case r:
          h = ((g - b) / diff) + (g < b ? 6 : 0);
          break;
        case g:
          h = ((b - r) / diff) + 2;
          break;
        case b:
          h = ((r - g) / diff) + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  /**
   * Convert HSL to RGB
   * @param {number} h - Hue (0-360)
   * @param {number} s - Saturation (0-100)
   * @param {number} l - Lightness (0-100)
   * @returns {Object} RGB values {r, g, b}
   */
  hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  /*
  ================================
  ACCESSIBILITY & CONTRAST UTILITIES
  ================================
  */

  /**
   * Calculate relative luminance of a color
   * @param {Object} rgb - RGB color {r, g, b}
   * @returns {number} Relative luminance (0-1)
   */
  getRelativeLuminance(rgb) {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Calculate contrast ratio between two colors
   * @param {string} color1 - First color (hex)
   * @param {string} color2 - Second color (hex)
   * @returns {number} Contrast ratio
   */
  getContrastRatio(color1, color2) {
    const lum1 = this.getRelativeLuminance(this.hexToRgb(color1));
    const lum2 = this.getRelativeLuminance(this.hexToRgb(color2));
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * Check if color combination meets accessibility standards
   * @param {string} foreground - Foreground color (hex)
   * @param {string} background - Background color (hex)
   * @param {string} level - Accessibility level ('AA' or 'AAA')
   * @param {string} size - Text size ('normal' or 'large')
   * @returns {Object} Accessibility results
   */
  checkAccessibility(foreground, background, level = 'AA', size = 'normal') {
    const ratio = this.getContrastRatio(foreground, background);
    const threshold = this.contrastThreshold[`${level}_${size.toUpperCase()}`];
    
    return {
      ratio: ratio,
      threshold: threshold,
      passes: ratio >= threshold,
      level: level,
      size: size
    };
  }

  /**
   * Find accessible text color for a given background
   * @param {string} backgroundColor - Background color (hex)
   * @param {string} preferredColor - Preferred text color (hex)
   * @returns {string} Accessible text color (hex)
   */
  getAccessibleTextColor(backgroundColor, preferredColor = '#000000') {
    const whiteContrast = this.getContrastRatio('#ffffff', backgroundColor);
    const blackContrast = this.getContrastRatio('#000000', backgroundColor);
    const preferredContrast = this.getContrastRatio(preferredColor, backgroundColor);

    // If preferred color has good contrast, use it
    if (preferredContrast >= this.contrastThreshold.AA_NORMAL) {
      return preferredColor;
    }

    // Otherwise, choose between white and black based on better contrast
    return whiteContrast > blackContrast ? '#ffffff' : '#000000';
  }

  /*
  ================================
  COLOR MANIPULATION UTILITIES
  ================================
  */

  /**
   * Adjust color lightness
   * @param {string} hexColor - Color in hex format
   * @param {number} amount - Amount to adjust (-100 to 100)
   * @returns {string} Adjusted color in hex format
   */
  adjustLightness(hexColor, amount) {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return hexColor;

    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.l = Math.max(0, Math.min(100, hsl.l + amount));

    const adjustedRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
    return this.rgbToHex(adjustedRgb.r, adjustedRgb.g, adjustedRgb.b);
  }

  /**
   * Adjust color saturation
   * @param {string} hexColor - Color in hex format
   * @param {number} amount - Amount to adjust (-100 to 100)
   * @returns {string} Adjusted color in hex format
   */
  adjustSaturation(hexColor, amount) {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return hexColor;

    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.s = Math.max(0, Math.min(100, hsl.s + amount));

    const adjustedRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
    return this.rgbToHex(adjustedRgb.r, adjustedRgb.g, adjustedRgb.b);
  }

  /**
   * Create complementary color
   * @param {string} hexColor - Base color in hex format
   * @returns {string} Complementary color in hex format
   */
  getComplementaryColor(hexColor) {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return hexColor;

    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.h = (hsl.h + 180) % 360;

    const complementaryRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
    return this.rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b);
  }

  /**
   * Create analogous colors
   * @param {string} hexColor - Base color in hex format
   * @param {number} angle - Angle offset (default: 30)
   * @returns {Array} Array of analogous colors
   */
  getAnalogousColors(hexColor, angle = 30) {
    const rgb = this.hexToRgb(hexColor);
    if (!rgb) return [hexColor];

    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    const colors = [];

    for (let i = -1; i <= 1; i++) {
      const newHue = (hsl.h + (angle * i) + 360) % 360;
      const analogousRgb = this.hslToRgb(newHue, hsl.s, hsl.l);
      colors.push(this.rgbToHex(analogousRgb.r, analogousRgb.g, analogousRgb.b));
    }

    return colors;
  }

  /*
  ================================
  PALETTE GENERATION
  ================================
  */

  /**
   * Generate a complete color palette from three primary colors
   * @param {string} primary - Primary color (hex)
   * @param {string} secondary - Secondary color (hex)
   * @param {string} accent - Accent color (hex)
   * @returns {Object} Complete color palette
   */
  generatePalette(primary, secondary, accent) {
    const palette = {
      primary: {
        base: primary,
        light: this.adjustLightness(primary, 20),
        lighter: this.adjustLightness(primary, 40),
        lightest: this.adjustLightness(primary, 60),
        dark: this.adjustLightness(primary, -20),
        darker: this.adjustLightness(primary, -40)
      },
      secondary: {
        base: secondary,
        light: this.adjustLightness(secondary, 20),
        lighter: this.adjustLightness(secondary, 40),
        lightest: this.adjustLightness(secondary, 60),
        dark: this.adjustLightness(secondary, -20),
        darker: this.adjustLightness(secondary, -40)
      },
      accent: {
        base: accent,
        light: this.adjustLightness(accent, 20),
        lighter: this.adjustLightness(accent, 40),
        lightest: this.adjustLightness(accent, 60),
        dark: this.adjustLightness(accent, -20),
        darker: this.adjustLightness(accent, -40)
      }
    };

    // Generate neutral colors based on primary color
    const primaryHsl = this.rgbToHsl(...Object.values(this.hexToRgb(primary)));
    palette.neutral = {
      white: '#ffffff',
      lightest: this.rgbToHex(...Object.values(this.hslToRgb(primaryHsl.h, 10, 95))),
      lighter: this.rgbToHex(...Object.values(this.hslToRgb(primaryHsl.h, 15, 85))),
      light: this.rgbToHex(...Object.values(this.hslToRgb(primaryHsl.h, 20, 75))),
      medium: this.rgbToHex(...Object.values(this.hslToRgb(primaryHsl.h, 25, 50))),
      dark: this.rgbToHex(...Object.values(this.hslToRgb(primaryHsl.h, 30, 25))),
      darker: this.rgbToHex(...Object.values(this.hslToRgb(primaryHsl.h, 35, 15))),
      black: '#000000'
    };

    // Generate status colors
    palette.status = {
      success: this.adjustSaturation(this.adjustLightness(primary, 10), 20),
      warning: this.adjustSaturation(this.adjustLightness(secondary, -10), 30),
      error: this.adjustSaturation(this.adjustLightness(accent, -15), 40),
      info: this.adjustSaturation(this.adjustLightness(primary, 25), -20)
    };

    // Add accessibility information
    palette.accessibility = this.generateAccessibilityMap(palette);

    return palette;
  }

  /**
   * Generate accessibility map for the palette
   * @param {Object} palette - Generated color palette
   * @returns {Object} Accessibility information
   */
  generateAccessibilityMap(palette) {
    const accessibility = {
      textOnPrimary: this.getAccessibleTextColor(palette.primary.base),
      textOnSecondary: this.getAccessibleTextColor(palette.secondary.base),
      textOnAccent: this.getAccessibleTextColor(palette.accent.base),
      textOnLight: this.getAccessibleTextColor(palette.neutral.lighter),
      textOnDark: this.getAccessibleTextColor(palette.neutral.dark)
    };

    return accessibility;
  }

  /**
   * Apply the generated palette to CSS custom properties
   * @param {Object} palette - Generated color palette
   */
  applyPaletteToCss(palette) {
    const root = document.documentElement;

    // Apply primary colors
    root.style.setProperty('--primary-color-1', palette.primary.base);
    root.style.setProperty('--primary-color-2', palette.secondary.base);
    root.style.setProperty('--primary-color-3', palette.accent.base);

    // Update text colors for accessibility
    root.style.setProperty('--text-on-primary', palette.accessibility.textOnPrimary);
    root.style.setProperty('--text-on-secondary', palette.accessibility.textOnSecondary);
    root.style.setProperty('--text-on-accent', palette.accessibility.textOnAccent);
    root.style.setProperty('--text-on-dark', palette.accessibility.textOnDark);
    root.style.setProperty('--text-on-light', palette.accessibility.textOnLight);

    // Trigger CSS custom property updates
    const event = new CustomEvent('paletteUpdated', { detail: palette });
    document.dispatchEvent(event);
  }

  /**
   * Validate color input
   * @param {string} color - Color to validate
   * @returns {boolean} Whether color is valid
   */
  isValidColor(color) {
    if (typeof color !== 'string') return false;
    
    // Test hex color format
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexPattern.test(color);
  }

  /**
   * Handle edge cases for very light or very dark colors
   * @param {string} color - Color to check
   * @returns {string} Adjusted color if needed
   */
  handleEdgeCases(color) {
    const rgb = this.hexToRgb(color);
    if (!rgb) return color;

    const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

    // If color is too light (>95% lightness), darken it
    if (hsl.l > 95) {
      hsl.l = 85;
    }
    
    // If color is too dark (<5% lightness), lighten it
    if (hsl.l < 5) {
      hsl.l = 15;
    }

    // If color has very low saturation (<10%), increase it slightly
    if (hsl.s < 10) {
      hsl.s = 20;
    }

    const adjustedRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
    return this.rgbToHex(adjustedRgb.r, adjustedRgb.g, adjustedRgb.b);
  }
}

/*
================================
GLOBAL PALETTE MANAGER
================================
*/

// Create global instance
const paletteGenerator = new ColorPaletteGenerator();

/**
 * Main function to update the entire website palette
 * @param {string} primary - Primary color (hex)
 * @param {string} secondary - Secondary color (hex)
 * @param {string} accent - Accent color (hex)
 */
function updateWebsitePalette(primary, secondary, accent) {
  try {
    // Validate colors
    if (!paletteGenerator.isValidColor(primary) || 
        !paletteGenerator.isValidColor(secondary) || 
        !paletteGenerator.isValidColor(accent)) {
      throw new Error('Invalid color format. Please use hex colors (#RRGGBB or #RGB)');
    }

    // Handle edge cases
    primary = paletteGenerator.handleEdgeCases(primary);
    secondary = paletteGenerator.handleEdgeCases(secondary);
    accent = paletteGenerator.handleEdgeCases(accent);

    // Generate and apply palette
    const palette = paletteGenerator.generatePalette(primary, secondary, accent);
    paletteGenerator.applyPaletteToCss(palette);

    // Log accessibility information
    console.log('Palette Applied Successfully');
    console.log('Accessibility Check:');
    Object.entries(palette.accessibility).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });

    return palette;

  } catch (error) {
    console.error('Error updating palette:', error.message);
    return null;
  }
}

// Export for use in modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ColorPaletteGenerator, updateWebsitePalette, paletteGenerator };
}