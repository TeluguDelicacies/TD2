# 📸 Image Requirements for Telugu Delicacies Website

## 📁 **Required Folder Structure**
Create this folder structure in your main directory:

```
/images/
├── logo.png                               # Company logo
├── hero-background.jpg                    # Hero section background
├── categories/
│   ├── ready-to-eat.jpg                   # Ready-to-eat category
│   └── telugu-podis.jpg                   # Telugu podis category
└── products/
    ├── parota.jpg                         # Product ticker items
    ├── chapathi.jpg
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
    ├── kadapa-kaaram-detail.jpg           # Detailed product images
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

## 📱 **Mobile-First Aspect Ratios (Recommended)**

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

### **4. Product Ticker Images**
- **Files**: All product `.jpg` files (parota.jpg, chapathi.jpg, etc.)
- **Aspect Ratio**: **1:1** (Square - 400×400px recommended)
- **Mobile**: Perfect for ticker scroll on mobile
- **Purpose**: Scrolling product showcase

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

### **High Quality (Recommended):**
```
Hero Background:     1920×1080px (16:9)
Logo:               200×200px   (1:1)
Category Images:    800×450px   (16:9)
Product Ticker:     400×400px   (1:1)
Product Details:    400×300px   (4:3)
```

### **Minimum Quality:**
```
Hero Background:     1280×720px  (16:9)
Logo:               150×150px   (1:1)
Category Images:    600×338px   (16:9)
Product Ticker:     300×300px   (1:1)
Product Details:    300×225px   (4:3)
```

## 📱 **Mobile Performance Tips**

### **File Size Optimization:**
- **Hero Background**: Keep under 200KB (high compression)
- **Product Images**: Keep under 50KB each
- **Logo**: Keep under 20KB (PNG)
- **Use WebP format** if possible for better compression

### **Loading Optimization:**
- **Hero image**: Load immediately (above fold)
- **Product images**: Lazy load (already implemented)
- **Detail images**: Lazy load (already implemented)

## 🔧 **Image Preparation Checklist**

### **Before Upload:**
- [ ] Resize to recommended dimensions
- [ ] Compress for web (JPG quality 80-85%)
- [ ] Use descriptive filenames (no spaces)
- [ ] Test on mobile device
- [ ] Ensure good contrast with text overlays

### **Photography Tips:**
- [ ] Good lighting (natural preferred)
- [ ] Clean, uncluttered backgrounds
- [ ] High contrast for text readability
- [ ] Show products clearly
- [ ] Consistent style across all images

## 🚀 **Quick Setup Guide**

1. **Create** the `/images/` folder structure
2. **Add your photos** with exact filenames listed above
3. **Test locally** by opening index.html
4. **Upload to GitHub** and deploy
5. **Verify** all images load on mobile

Your website will look professional and load quickly on all devices! 📱✨
