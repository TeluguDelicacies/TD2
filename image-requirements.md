# 📸 Image Requirements for Telugu Delicacies Website

*Updated for rem-based responsive design with Montserrat headers and Roboto body text*

## 📁 **Required Folder Structure**
Create this folder structure in your main directory:

```
/images/
├── logo.png                               # Company logo
├── hero-background.jpg                    # Hero section background
├── categories/
│   ├── ready-to-eat-podis.jpg            # Ready-to-eat podis category  
│   ├── ready-to-use.jpg                   # Ready-to-use category
│   └── ready-to-cook.jpg                  # Ready-to-cook category
└── products/
    ├── malabar-parota.jpg                 # Product ticker items
    ├── wheat-chapathi.jpg
    ├── ghee.jpg
    ├── multigrain-atta.jpg
    ├── coffee.jpg
    ├── pasupu.jpg
    ├── kadapa-kaaram.jpg
    ├── nalla-kaaram.jpg
    ├── kandi-podi.jpg
    ├── karivepaku-podi.jpg
    ├── idli-podi.jpg
    ├── sambar-premix.jpg
    ├── godhuma-kaaram.jpg
    ├── palli-dhaniya-podi.jpg
    ├── tamalapaaku-kaaram.jpg
    ├── velluli-kaaram.jpg
    ├── konaseema-kaaram.jpg
    ├── chutney-premix.jpg
    ├── palli-kaaram.jpg
    ├── malabar-parota-detail.jpg         # Detailed product images
    ├── wheat-chapathi-detail.jpg
    ├── ghee-detail.jpg
    ├── multigrain-atta-detail.jpg
    ├── coffee-detail.jpg
    ├── pasupu-detail.jpg
    ├── kadapa-kaaram-detail.jpg
    ├── nalla-kaaram-detail.jpg
    ├── kandi-podi-detail.jpg
    ├── godhuma-kaaram-detail.jpg
    ├── karivepaku-podi-detail.jpg
    ├── palli-dhaniya-podi-detail.jpg
    ├── tamalapaaku-kaaram-detail.jpg
    ├── sambar-premix-detail.jpg
    ├── velluli-kaaram-detail.jpg
    ├── idli-podi-detail.jpg
    ├── konaseema-kaaram-detail.jpg
    ├── chutney-premix-detail.jpg
    └── palli-kaaram-detail.jpg
```

## 📱 **Responsive Design Considerations (rem-based scaling)**

With the new rem-based responsive scaling system, images need to work seamlessly across all breakpoints:
- **Mobile**: 320px-767px (base font: 14px, extra small: 13px at 320px)
- **Tablet**: 768px-1023px (base font: 15px) 
- **Desktop**: 1024px-1439px (base font: 16px)
- **Large Desktop**: 1440px+ (base font: 18px)

## 📐 **Optimized Aspect Ratios**

### **1. Hero Background Image**
- **File**: `hero-background.jpg`
- **Aspect Ratio**: **16:9** (1920×1080px recommended)
- **Mobile**: Will be cropped to show center portion
- **Purpose**: Background for main banner

### **2. Company Logo**
- **File**: `logo.png`
- **Aspect Ratio**: **1:1** (Square - 200×200px recommended)
- **Format**: PNG with transparent background
- **Purpose**: Header navigation

### **3. Category Images**
- **Files**: `ready-to-eat.jpg`, `telugu-podis.jpg`
- **Aspect Ratio**: **16:9** (800×450px recommended)
- **Mobile**: Displays full width on mobile
- **Purpose**: Category section headers

### **4. Product Showcase Images (Enhanced Scaling)**
- **Files**: All product `.jpg` files (malabar-parota.jpg, wheat-chapathi.jpg, etc.)
- **Aspect Ratio**: **1:1** (Square - optimized for rem-based scaling)
- **Recommended Sizes**: 
  - **Standard**: 400×400px (25rem equivalent at 16px base)
  - **High-DPI**: 800×800px (for retina displays)
- **Purpose**: Responsive scrolling product showcase with CSS variable sizing

### **5. Product Detail Images**
- **Files**: All `-detail.jpg` files
- **Aspect Ratio**: **4:3** (400×300px recommended)
- **Mobile**: Good balance of detail and space
- **Purpose**: Product description sections

## 🎯 **Mobile Optimization Guidelines**

### **Why These Aspect Ratios?**

#### **Square (1:1) for Products:**
- ✅ Consistent grid layout on mobile
- ✅ Equal visual weight for all products
- ✅ Perfect for ticker scrolling
- ✅ Instagram-style familiarity

#### **16:9 for Categories & Hero:**
- ✅ Standard widescreen format
- ✅ Works well across all devices
- ✅ Good for landscape orientation
- ✅ Cinematic feel

#### **4:3 for Product Details:**
- ✅ Good balance of width and height
- ✅ Shows product details clearly
- ✅ Traditional photography ratio
- ✅ Mobile-friendly viewing

## 📐 **Exact Dimensions for Best Results**

### **High Quality (Recommended - rem-optimized):**
```
Hero Background:     1920×1080px (16:9) - responsive scaling via CSS
Logo:               200×200px   (1:1) - scales with header (2.5rem-3.75rem)
Category Images:    800×450px   (16:9) - fluid scaling with containers
Product Showcase:   400×400px   (1:1) - CSS variable controlled sizing
Product Details:    400×300px   (4:3) - proportional rem scaling
```

### **Minimum Quality (rem-compatible):**
```
Hero Background:     1280×720px  (16:9) - minimum for responsive hero
Logo:               150×150px   (1:1) - minimum for mobile scaling
Category Images:    600×338px   (16:9) - minimum for tablet/desktop
Product Showcase:   300×300px   (1:1) - minimum for CSS variable scaling  
Product Details:    300×225px   (4:3) - minimum for description sections
```

## 📱 **Responsive Performance Optimization**

### **File Size Optimization (rem-scaling compatible):**
- **Hero Background**: Keep under 200KB (responsive CSS scaling handles sizing)
- **Product Images**: Keep under 50KB each (CSS variables handle responsive sizing)
- **Logo**: Keep under 20KB (PNG format, scales via rem units)
- **Use WebP format** with fallbacks for 30% better compression
- **Responsive Images**: Consider `srcset` for different screen densities

### **Loading Optimization (updated for rem-based design):**
- **Hero image**: Load immediately (critical for above-fold content)
- **Product showcase**: Lazy load with intersection observer (JavaScript enhanced)
- **Detail images**: Lazy load with fade-in animations
- **Progressive enhancement**: Images work with CSS scaling at any load state

## 🔧 **Image Preparation Checklist (Updated for Responsive Design)**

### **Before Upload (rem-scaling optimized):**
- [ ] Resize to recommended dimensions (consider 2x for high-DPI screens)
- [ ] Compress for web (JPG quality 80-85%, or WebP with JPG fallback)
- [ ] Use descriptive filenames matching HTML structure (no spaces)
- [ ] Test across all breakpoints (320px, 768px, 1024px, 1440px+)
- [ ] Ensure good contrast with Montserrat headers and Roboto body text
- [ ] Verify images scale properly with CSS variables and rem units

### **Photography Tips (updated for modern responsive design):**
- [ ] Good lighting (natural preferred for authentic South Indian aesthetic)
- [ ] Clean, uncluttered backgrounds (work well with Montserrat typography overlays)
- [ ] High contrast for text readability (especially with Roboto body text)
- [ ] Show products clearly (important for 1:1 square aspect ratios)
- [ ] Consistent style across all images (matches professional Montserrat/Roboto design)
- [ ] Consider image focal points for responsive cropping across breakpoints

## 🚀 **Quick Setup Guide (rem-based responsive)**

1. **Create** the `/images/` folder structure as outlined above
2. **Add your photos** with exact filenames (ensure compatibility with CSS variables)
3. **Test locally** by opening index.html and checking all breakpoints
4. **Test responsive scaling** - images should scale with rem-based layout
5. **Upload to GitHub** and deploy via GitHub Pages
6. **Verify cross-device compatibility** at 320px, 768px, 1024px, and 1440px+
7. **Check product showcase** - images should scale with CSS variable controls

## 🎯 **Technical Integration Notes**

### **CSS Variable Integration:**
The product showcase now uses CSS variables for responsive scaling:
```css
--product-item-width: 10rem;  /* Mobile: 140px at 14px base */
--product-gap-width: 1.25rem; /* Scales proportionally */
```

### **Font Compatibility:**
Images should complement the new typography:
- **Headers**: Montserrat (clean, geometric - works well with sharp product images)
- **Body**: Roboto (friendly, readable - pairs well with descriptive text over images)
- **Telugu**: Noto Sans Telugu (comprehensive language support)

### **Performance with Scaling:**
- Images load efficiently regardless of CSS scaling
- Lazy loading is enhanced with intersection observer
- Responsive images work seamlessly with rem-based layout

Your website will now look professional, scale perfectly, and load quickly on all devices! 📱✨
