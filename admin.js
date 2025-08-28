/*
========================================
ADMIN PANEL FUNCTIONALITY
========================================
Manages products, categories, and pricing through Supabase
*/

import { 
  getProductsForDisplay, 
  getCategories, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  addPricingOption,
  updatePricing,
  deletePricingOption,
  formatPrice 
} from './lib/supabase.js'

import { AuthManager } from './auth.js'

class AdminPanel {
  constructor() {
    this.products = []
    this.categories = []
    this.currentEditingProduct = null
    this.currentFilter = 'all'
    this.searchTerm = ''
    this.currentUser = null
    
    this.init()
  }

  async init() {
    try {
      // Check authentication first
      const isAuthenticated = await this.checkAuthentication()
      if (!isAuthenticated) {
        return // Stop initialization if not authenticated
      }
      
      this.showLoading()
      await this.loadData()
      this.renderDashboard()
      this.renderProductsTable()
      this.setupEventListeners()
      this.hideLoading()
      
      console.log('Admin panel initialized successfully')
    } catch (error) {
      console.error('Error initializing admin panel:', error)
      this.showToast('Failed to initialize admin panel: ' + error.message, 'error')
      this.hideLoading()
    }
  }

  async checkAuthentication() {
    try {
      const session = await AuthManager.checkAuthStatus();
      console.log('AdminPanel: AuthManager.checkAuthStatus returned session:', session);

      if (!session) {
        console.log('AdminPanel: No active session found. Redirecting to login.html...');
        window.location.href = 'login.html';
        // Crucially, return false to stop further init
        return false // Stop execution immediately
      }
      
      this.currentUser = session.user;
      console.log('AdminPanel: Authenticated user:', this.currentUser.email);
      
      // Update UI with user info
      this.updateUserInfo()
      
      return true
    } catch (error) {
      console.error('AdminPanel: Authentication check failed:', error);
      window.location.href = 'login.html'
      return false
    }
  }

  updateUserInfo() {
    // Show user info section
    const userInfoSection = document.querySelector('.user-info')
    if (userInfoSection) {
      userInfoSection.classList.remove('hidden')
    }
    
    // Update user email
    const userEmail = document.getElementById('userEmail')
    if (userEmail && this.currentUser) {
      userEmail.textContent = this.currentUser.email
    }
  }

  async loadData() {
    try {
      console.log('Starting to load categories and products...')
      
      // Load categories and products concurrently with enhanced error handling
      let categoriesData, productsData;
      try {
        [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProductsForDisplay()
        ]);
        
        // Log raw data returned from Supabase
        console.log('Admin: Raw categories data from Supabase:', categoriesData);
        console.log('Admin: Raw products data from Supabase:', productsData);
      } catch (fetchError) {
        console.error('Admin: Error during data fetching from Supabase:', fetchError);
        console.error('Admin: Fetch error details:', {
          message: fetchError.message,
          stack: fetchError.stack,
          name: fetchError.name
        });
        throw fetchError;
      }
      
      this.categories = categoriesData
      this.products = productsData
      
      console.log('Successfully loaded:', this.products.length, 'products and', this.categories.length, 'categories')
      console.log('Categories:', this.categories)
      console.log('Products sample:', this.products.slice(0, 2))
    } catch (error) {
      console.error('Error loading data:', error)
      console.error('Detailed data loading error:', error.message, error.stack)
      throw error
    }
  }

  renderDashboard() {
    const totalProducts = this.products.length
    const totalCategories = this.categories.length
    const activeProducts = this.products.filter(p => p.is_active).length
    
    document.getElementById('totalProducts').textContent = totalProducts
    document.getElementById('totalCategories').textContent = totalCategories
    document.getElementById('activeProducts').textContent = activeProducts
    
    // Populate category filter
    const categoryFilter = document.getElementById('categoryFilter')
    const productCategorySelect = document.getElementById('productCategory')
    
    if (categoryFilter) {
      categoryFilter.innerHTML = '<option value="all">All Categories</option>' +
        this.categories.map(cat => `<option value="${cat.name}">${cat.display_name}</option>`).join('')
    }
    
    if (productCategorySelect) {
      productCategorySelect.innerHTML = '<option value="">Select Category</option>' +
        this.categories.map(cat => `<option value="${cat.id}">${cat.display_name}</option>`).join('')
    }
  }

  renderProductsTable() {
    const tbody = document.getElementById('productsTableBody')
    if (!tbody) return

    let filteredProducts = this.products

    // Apply category filter
    if (this.currentFilter !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.category?.name === this.currentFilter
      )
    }

    // Apply search filter
    if (this.searchTerm) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (product.name_telugu && product.name_telugu.toLowerCase().includes(this.searchTerm.toLowerCase()))
      )
    }

    if (filteredProducts.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center" style="padding: 2rem; color: var(--admin-gray-500);">
            <i class="fas fa-box-open" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
            No products found
          </td>
        </tr>
      `
      return
    }

    tbody.innerHTML = filteredProducts.map(product => `
      <tr>
        <td class="product-image-cell">
          <img src="${product.image_url || './images/placeholder-product.jpg'}" 
               alt="${product.name}"
               onerror="this.src='./images/placeholder-product.jpg'">
        </td>
        <td>
          <div class="product-name-cell">${product.name}</div>
          ${product.name_telugu ? `<div class="telugu-name">${product.name_telugu}</div>` : ''}
        </td>
        <td>${product.category?.display_name || 'Uncategorized'}</td>
        <td class="pricing-cell">
          ${product.pricing?.map(p => `${p.quantity}: ${formatPrice(p.price)}`).join('<br>') || 'No pricing'}
        </td>
        <td>
          <span class="status-badge ${product.is_active ? 'active' : 'inactive'}">
            <i class="fas fa-circle" style="font-size: 0.5rem;"></i>
            ${product.is_active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td class="actions-cell">
          <button class="action-icon-btn edit" onclick="adminPanel.editProduct('${product.id}')" title="Edit Product">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-icon-btn delete" onclick="adminPanel.confirmDeleteProduct('${product.id}')" title="Delete Product">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('')
  }

  setupEventListeners() {
    // Add Product button
    document.getElementById('addProductBtn')?.addEventListener('click', () => {
      this.showProductModal()
    })

    // Category filter
    document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
      this.currentFilter = e.target.value
      this.renderProductsTable()
    })

    // Search input
    document.getElementById('searchProducts')?.addEventListener('input', (e) => {
      this.searchTerm = e.target.value
      this.renderProductsTable()
    })

    // Refresh button
    document.getElementById('refreshData')?.addEventListener('click', () => {
      this.refresh()
    })

    // Logout button
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      this.handleLogout()
    })

    // Modal events
    document.getElementById('closeModal')?.addEventListener('click', () => {
      this.hideProductModal()
    })

    document.getElementById('cancelBtn')?.addEventListener('click', () => {
      this.hideProductModal()
    })

    // Form submission
    document.getElementById('productForm')?.addEventListener('submit', (e) => {
      e.preventDefault()
      this.saveProduct()
    })

    // Feature and pricing management
    document.getElementById('addFeature')?.addEventListener('click', () => {
      this.addFeatureField()
    })

    document.getElementById('addPricing')?.addEventListener('click', () => {
      this.addPricingField()
    })

    // Modal backdrop click
    document.getElementById('productModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'productModal') {
        this.hideProductModal()
      }
    })

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('productModal')
        if (modal && !modal.classList.contains('hidden')) {
          this.hideProductModal()
        }
      }
    })
  }

  showProductModal(product = null) {
    this.currentEditingProduct = product
    const modal = document.getElementById('productModal')
    const modalTitle = document.getElementById('modalTitle')
    const form = document.getElementById('productForm')
    
    if (!modal || !form) return

    // Set modal title
    modalTitle.textContent = product ? 'Edit Product' : 'Add New Product'
    
    // Reset form
    form.reset()
    
    // Clear dynamic fields
    this.resetDynamicFields()
    
    if (product) {
      // Populate form with product data
      document.getElementById('productName').value = product.name || ''
      document.getElementById('productNameTelugu').value = product.name_telugu || ''
      document.getElementById('productCategory').value = product.category_id || ''
      document.getElementById('productDescription').value = product.description || ''
      document.getElementById('productImage').value = product.image_url || ''
      document.getElementById('productActive').checked = product.is_active !== false
      
      // Populate features
      if (Array.isArray(product.features)) {
        product.features.forEach(feature => {
          this.addFeatureField(feature)
        })
      }
      
      // Populate pricing
      if (Array.isArray(product.pricing)) {
        product.pricing.forEach(price => {
          this.addPricingField(price.quantity, price.price)
        })
      }
    } else {
      // Add default empty fields
      this.addFeatureField()
      this.addPricingField()
    }
    
    modal.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
    
    // Focus first input
    setTimeout(() => {
      document.getElementById('productName')?.focus()
    }, 100)
  }

  hideProductModal() {
    const modal = document.getElementById('productModal')
    if (modal) {
      modal.classList.add('hidden')
      document.body.style.overflow = 'auto'
      this.currentEditingProduct = null
    }
  }

  resetDynamicFields() {
    // Reset features
    const featuresContainer = document.getElementById('featuresContainer')
    if (featuresContainer) {
      featuresContainer.innerHTML = ''
    }
    
    // Reset pricing
    const pricingContainer = document.getElementById('pricingContainer')
    if (pricingContainer) {
      pricingContainer.innerHTML = ''
    }
  }

  addFeatureField(value = '') {
    const container = document.getElementById('featuresContainer')
    if (!container) return

    const div = document.createElement('div')
    div.className = 'feature-input'
    div.innerHTML = `
      <input type="text" placeholder="Enter feature" class="feature-field" value="${value}">
      <button type="button" class="remove-feature">
        <i class="fas fa-trash"></i>
      </button>
    `
    
    // Add remove functionality
    div.querySelector('.remove-feature').addEventListener('click', () => {
      div.remove()
    })
    
    container.appendChild(div)
  }

  addPricingField(quantity = '', price = '') {
    const container = document.getElementById('pricingContainer')
    if (!container) return

    const div = document.createElement('div')
    div.className = 'pricing-input'
    div.innerHTML = `
      <input type="text" placeholder="Quantity (e.g., 100g)" class="quantity-field" value="${quantity}">
      <input type="number" placeholder="Price" class="price-field" step="0.01" min="0" value="${price}">
      <button type="button" class="remove-pricing">
        <i class="fas fa-trash"></i>
      </button>
    `
    
    // Add remove functionality
    div.querySelector('.remove-pricing').addEventListener('click', () => {
      div.remove()
    })
    
    container.appendChild(div)
  }

  async saveProduct() {
    try {
      this.showLoading()
      
      const form = document.getElementById('productForm')
      const formData = new FormData(form)
      
      // Collect features
      const features = Array.from(document.querySelectorAll('.feature-field'))
        .map(input => input.value.trim())
        .filter(value => value)
      
      // Collect pricing
      const pricingInputs = document.querySelectorAll('.pricing-input')
      const pricing = Array.from(pricingInputs).map((input, index) => ({
        quantity: input.querySelector('.quantity-field').value.trim(),
        price: parseFloat(input.querySelector('.price-field').value) || 0,
        sort_order: index
      })).filter(p => p.quantity && p.price > 0)
      
      const productData = {
        name: formData.get('name'),
        name_telugu: formData.get('name_telugu'),
        description: formData.get('description'),
        category_id: formData.get('category_id'),
        image_url: formData.get('image_url'),
        is_active: formData.get('is_active') === 'on',
        features: features
      }
      
      let savedProduct
      
      if (this.currentEditingProduct) {
        // Update existing product
        savedProduct = await updateProduct(this.currentEditingProduct.id, productData)
        
        // TODO: Handle pricing updates (would need more complex logic)
        // For now, we'll show a message about pricing updates
        this.showToast('Product updated successfully! Note: Pricing updates require manual management.', 'success')
      } else {
        // Create new product
        savedProduct = await addProduct(productData)
        
        // Add pricing options
        for (const price of pricing) {
          await addPricingOption({
            product_id: savedProduct.id,
            quantity: price.quantity,
            price: price.price,
            sort_order: price.sort_order
          })
        }
        
        this.showToast('Product added successfully!', 'success')
      }
      
      // Refresh data and UI
      await this.refresh()
      this.hideProductModal()
      
    } catch (error) {
      console.error('Error saving product:', error)
      this.showToast('Failed to save product: ' + error.message, 'error')
    } finally {
      this.hideLoading()
    }
  }

  editProduct(productId) {
    const product = this.products.find(p => p.id === productId)
    if (product) {
      this.showProductModal(product)
    }
  }

  async confirmDeleteProduct(productId) {
    const product = this.products.find(p => p.id === productId)
    if (!product) return

    if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      try {
        this.showLoading()
        await deleteProduct(productId)
        await this.refresh()
        this.showToast('Product deleted successfully!', 'success')
      } catch (error) {
        console.error('Error deleting product:', error)
        this.showToast('Failed to delete product: ' + error.message, 'error')
      } finally {
        this.hideLoading()
      }
    }
  }

  async refresh() {
    try {
      await this.loadData()
      this.renderDashboard()
      this.renderProductsTable()
      console.log('Admin panel data refreshed')
    } catch (error) {
      console.error('Error refreshing data:', error)
      this.showToast('Failed to refresh data', 'error')
    }
  }

  async handleLogout() {
    if (confirm('Are you sure you want to sign out?')) {
      try {
        this.showLoading()
        await AuthManager.signOut()
        // Redirect happens in AuthManager.signOut()
      } catch (error) {
        console.error('Error signing out:', error)
        this.showToast('Failed to sign out: ' + error.message, 'error')
        this.hideLoading()
      }
    }
  }

  showLoading() {
    const overlay = document.getElementById('loadingOverlay')
    if (overlay) {
      overlay.classList.remove('hidden')
    }
  }

  hideLoading() {
    const overlay = document.getElementById('loadingOverlay')
    if (overlay) {
      overlay.classList.add('hidden')
    }
  }

  showToast(message, type = 'success') {
    const toast = document.getElementById('toast')
    if (!toast) return

    const icon = toast.querySelector('.toast-icon')
    const messageEl = toast.querySelector('.toast-message')
    
    // Set content
    messageEl.textContent = message
    
    // Set type
    toast.className = `toast ${type}`
    
    // Set icon
    if (icon) {
      icon.className = `toast-icon fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`
    }
    
    // Show toast
    toast.classList.remove('hidden')
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      toast.classList.add('hidden')
    }, 5000)
  }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.adminPanel = new AdminPanel()
})

// Export for console access
window.refreshAdminData = () => {
  if (window.adminPanel) {
    window.adminPanel.refresh()
  }
}