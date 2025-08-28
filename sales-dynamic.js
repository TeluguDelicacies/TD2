/*
========================================
DYNAMIC SALES PAGE FUNCTIONALITY
========================================
Loads products from Supabase and manages the sales interface
*/

import { getProductsForDisplay, getCategories, formatPrice } from './lib/supabase.js'

class SalesPageManager {
  constructor() {
    this.products = []
    this.categories = []
    this.currentFilter = 'all'
    this.overlay = null
    
    this.init()
  }

  async init() {
    try {
      // Show loading state
      this.showLoadingState()
      
      // Load data from Supabase
      await this.loadData()
      
      // Render the interface
      this.renderCategories()
      this.renderProducts()
      
      // Setup event listeners
      this.setupEventListeners()
      
      console.log('Dynamic sales page initialized successfully')
    } catch (error) {
      console.error('Error initializing sales page:', error)
      this.showErrorState(error.message)
    }
  }

  async loadData() {
    try {
      console.log('Sales page: Starting to load categories and products...')
      // Load categories and products concurrently
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProductsForDisplay()
      ])
      
      this.categories = categoriesData
      this.products = productsData
      
      console.log('Sales page: Successfully loaded', this.products.length, 'products and', this.categories.length, 'categories')
      console.log('Sales page categories:', this.categories)
      console.log('Sales page products sample:', this.products.slice(0, 2))
    } catch (error) {
      console.error('Sales page: Error loading data from Supabase:', error)
      console.error('Sales page: Detailed error:', error.message, error.stack)
      throw error
    }
  }

  showLoadingState() {
    const container = document.querySelector('.product-categories')
    if (container) {
      container.innerHTML = `
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      `
    }
  }

  showErrorState(message) {
    const container = document.querySelector('.product-categories')
    if (container) {
      container.innerHTML = `
        <div class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Unable to load products</h3>
          <p>${message}</p>
          <p style="font-size: 0.875rem; color: #666; margin-top: 1rem;">
            Check browser console for detailed error information.
          </p>
          <button onclick="location.reload()" class="retry-btn">
            <i class="fas fa-refresh"></i> Try Again
          </button>
        </div>
      `
    }
  }

  renderCategories() {
    const categoryTabs = document.querySelector('.category-tabs')
    if (!categoryTabs) return

    // Create "All Products" tab
    let tabsHTML = `
      <button class="category-tab active" data-category="all">
        All Products
      </button>
    `

    // Add category tabs
    this.categories.forEach(category => {
      tabsHTML += `
        <button class="category-tab" data-category="${category.name}">
          ${category.display_name}
        </button>
      `
    })

    categoryTabs.innerHTML = tabsHTML
  }

  renderProducts() {
    const container = document.querySelector('.product-categories')
    if (!container) return

    const filteredProducts = this.currentFilter === 'all' 
      ? this.products 
      : this.products.filter(product => product.category?.name === this.currentFilter)

    if (filteredProducts.length === 0) {
      container.innerHTML = `
        <div class="no-products">
          <i class="fas fa-box-open"></i>
          <h3>No products found</h3>
          <p>There are no products in this category yet.</p>
        </div>
      `
      return
    }

    const productsHTML = filteredProducts.map(product => this.renderProductCard(product)).join('')
    container.innerHTML = productsHTML
  }

  renderProductCard(product) {
    const features = Array.isArray(product.features) ? product.features : []
    const pricing = product.pricing || []
    
    // Get first available pricing option for default display
    const defaultPricing = pricing.length > 0 ? pricing[0] : null
    
    return `
      <div class="product-shop-card" data-category="${product.category?.name || 'uncategorized'}">
        <img src="${product.image_url || './images/placeholder-product.jpg'}" 
             alt="${product.name}" 
             class="product-image" 
             loading="lazy"
             onerror="this.src='./images/placeholder-product.jpg'">
        
        <h3 class="product-name">${product.name}</h3>
        ${product.name_telugu ? `<p class="telugu-name">${product.name_telugu}</p>` : ''}
        
        <button class="info-toggle-btn" 
                aria-label="Toggle product description"
                data-product-id="${product.id}">
          <i class="fas fa-info-circle"></i>
        </button>
        
        <div class="description-text-content hidden">
          <p>${product.description || ''}</p>
          ${features.length > 0 ? `
            <ul>
              ${features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
        
        ${pricing.length > 0 ? `
          <div class="quantity-price-selector">
            <select class="quantity-dropdown" data-product-id="${product.id}">
              ${pricing.map((price, index) => `
                <option value="${price.id}" 
                        data-price="${price.price}"
                        ${index === 0 ? 'selected' : ''}>
                  ${price.quantity}
                </option>
              `).join('')}
            </select>
            <span class="current-price">${formatPrice(defaultPricing?.price || 0)}</span>
          </div>
        ` : `
          <div class="quantity-price-selector">
            <span class="price-unavailable">Price not available</span>
          </div>
        `}
      </div>
    `
  }

  setupEventListeners() {
    // Category filter tabs
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('category-tab')) {
        this.handleCategoryChange(e.target)
      }
    })

    // Info toggle buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.info-toggle-btn')) {
        const button = e.target.closest('.info-toggle-btn')
        const productId = button.dataset.productId
        this.showProductInfo(productId)
      }
    })

    // Quantity dropdown changes
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('quantity-dropdown')) {
        this.handlePriceChange(e.target)
      }
    })

    // Modal close events
    this.setupModalEvents()
  }

  handleCategoryChange(tabElement) {
    // Update active tab
    document.querySelectorAll('.category-tab').forEach(tab => 
      tab.classList.remove('active')
    )
    tabElement.classList.add('active')

    // Update filter and re-render products
    this.currentFilter = tabElement.dataset.category
    this.renderProducts()
  }

  handlePriceChange(selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex]
    const price = selectedOption.dataset.price
    const priceDisplay = selectElement.closest('.product-shop-card').querySelector('.current-price')
    
    if (priceDisplay && price) {
      priceDisplay.textContent = formatPrice(parseFloat(price))
      
      // Announce to screen readers
      this.announceToScreenReader(`Price updated to ${formatPrice(parseFloat(price))}`)
    }
  }

  showProductInfo(productId) {
    const product = this.products.find(p => p.id === productId)
    if (!product) return

    const overlay = this.getOrCreateOverlay()
    const modalTitle = overlay.querySelector('#modalTitle')
    const modalTeluguName = overlay.querySelector('#modalTeluguName')
    const overlayBody = overlay.querySelector('#overlayBody')

    // Update modal content
    if (modalTitle) modalTitle.textContent = product.name
    if (modalTeluguName) {
      modalTeluguName.textContent = product.name_telugu || ''
      modalTeluguName.style.display = product.name_telugu ? 'block' : 'none'
    }

    const features = Array.isArray(product.features) ? product.features : []
    
    if (overlayBody) {
      overlayBody.innerHTML = `
        <div class="product-details">
          <h4>Product Details</h4>
          <div class="product-description">
            <p>${product.description || 'No description available.'}</p>
            ${features.length > 0 ? `
              <ul class="features-list">
                ${features.map(feature => `<li>${feature}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        </div>
      `
    }

    // Show overlay
    overlay.classList.remove('hidden')
    document.body.style.overflow = 'hidden'

    // Focus management
    const closeButton = overlay.querySelector('#closeOverlay')
    if (closeButton) closeButton.focus()
  }

  getOrCreateOverlay() {
    let overlay = document.getElementById('infoOverlay')
    
    if (!overlay) {
      overlay = document.createElement('div')
      overlay.id = 'infoOverlay'
      overlay.className = 'info-overlay hidden'
      overlay.innerHTML = `
        <div class="overlay-backdrop"></div>
        <div class="overlay-content">
          <button class="close-overlay-btn" id="closeOverlay">
            <i class="fas fa-times"></i>
          </button>
          <div class="modal-header">
            <h3 class="modal-title" id="modalTitle"></h3>
            <p class="modal-telugu-name" id="modalTeluguName"></p>
          </div>
          <div class="modal-body" id="overlayBody"></div>
        </div>
      `
      document.body.appendChild(overlay)
    }

    return overlay
  }

  setupModalEvents() {
    document.addEventListener('click', (e) => {
      const overlay = document.getElementById('infoOverlay')
      
      // Close button
      if (e.target.id === 'closeOverlay' || e.target.closest('#closeOverlay')) {
        this.closeModal()
      }
      
      // Backdrop click
      if (e.target.classList.contains('overlay-backdrop') || e.target.id === 'infoOverlay') {
        this.closeModal()
      }
    })

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const overlay = document.getElementById('infoOverlay')
        if (overlay && !overlay.classList.contains('hidden')) {
          this.closeModal()
        }
      }
    })
  }

  closeModal() {
    const overlay = document.getElementById('infoOverlay')
    if (overlay) {
      overlay.classList.add('hidden')
      
      this.announceToScreenReader('Product information dialog closed')
    }
  }

  announceToScreenReader(message) {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.textContent = message
    announcement.style.position = 'absolute'
    announcement.style.left = '-10000px'
    announcement.style.width = '1px'
    announcement.style.height = '1px'
    announcement.style.overflow = 'hidden'
    
    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }

  // Method to refresh data (useful for admin updates)
  async refresh() {
    try {
      await this.loadData()
      this.renderCategories()
      this.renderProducts()
      console.log('Sales page data refreshed')
    } catch (error) {
      console.error('Error refreshing data:', error)
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.salesPageManager = new SalesPageManager()
})

// Export for use in other scripts
window.refreshSalesData = () => {
  if (window.salesPageManager) {
    window.salesPageManager.refresh()
  }
}