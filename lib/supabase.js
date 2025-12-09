/*
========================================
SUPABASE CLIENT CONFIGURATION
========================================
Supabase client setup for Telugu Delicacies
*/

const supabaseUrl = 'https://pfffotghmcofyrvqynbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZmZvdGdobWNvZnlydnF5bmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNTM4OTYsImV4cCI6MjA4MDgyOTg5Nn0.eo9VOZZGX4do91GYnBCJa6a9mqcbVqqolQDQ4-C9YYc';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('FATAL ERROR: Missing Supabase configuration!');
  throw new Error('Missing Supabase configuration.');
}

const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

console.log('Supabase client initialized successfully.');
console.log('Supabase URL:', supabaseUrl);

export { supabase };



/*
========================================
AUTHENTICATION FUNCTIONS  
========================================
*/

// Get current user session
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Check if user is authenticated
export async function isAuthenticated() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return !!session
}

/*
========================================
PRODUCTS API FUNCTIONS
========================================
*/

// Get all product categories
export async function getCategories() {
  console.log('Fetching categories from Supabase...')
  
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('name')
    
    console.log('getCategories: Supabase response data:', data)
    console.log('getCategories: Supabase response error:', error)
  
    if (error) {
      console.error('getCategories: Error fetching categories:', error)
      console.error('getCategories: Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }
    
    console.log('getCategories: Categories fetched successfully:', data?.length || 0, 'categories')
    return data
  } catch (queryError) {
    console.error('getCategories: Unexpected error during query:', queryError)
    throw queryError
  }
}

// Get products by category (or all if no category specified)
export async function getProducts(categoryName = null) {
  let query = supabase
    .from('products')
    .select(`
      *,
      category:product_categories(*),
      pricing:product_pricing(*)
    `)
    .eq('is_active', true)
  
  if (categoryName && categoryName !== 'all') {
    query = query.eq('product_categories.name', categoryName)
  }
  
  const { data, error } = await query.order('name')
  
  if (error) throw error
  return data
}

// Get product with pricing
export async function getProductWithPricing(productId) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:product_categories(*),
      pricing:product_pricing(*)
    `)
    .eq('id', productId)
    .eq('is_active', true)
    .single()
  
  if (error) throw error
  return data
}

// Get all products with pricing for display (public-facing, active only)
export async function getProductsForDisplay() {
  console.log('Fetching products for display from Supabase...')

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:product_categories(*),
        pricing:product_pricing(
          id,
          quantity,
          price,
          is_available,
          sort_order
        )
      `)
      .eq('is_active', true)
      .order('name')

    console.log('getProductsForDisplay: Supabase response data:', data)
    console.log('getProductsForDisplay: Supabase response error:', error)

    if (error) {
      console.error('getProductsForDisplay: Error fetching products:', error)
      console.error('getProductsForDisplay: Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log('getProductsForDisplay: Products fetched successfully:', data?.length || 0, 'products')

    // Sort pricing within each product
    const processedData = data.map(product => ({
      ...product,
      pricing: product.pricing
        .filter(p => p.is_available)
        .sort((a, b) => a.sort_order - b.sort_order)
    }))

    console.log('getProductsForDisplay: Products processed with pricing:', processedData?.length || 0, 'products')
    return processedData
  } catch (queryError) {
    console.error('getProductsForDisplay: Unexpected error during query:', queryError)
    throw queryError
  }
}

// Get all products for admin panel (includes inactive products)
export async function getProductsForAdmin() {
  console.log('Fetching all products for admin from Supabase...')

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:product_categories(*),
        pricing:product_pricing(
          id,
          quantity,
          price,
          is_available,
          sort_order
        )
      `)
      .order('name')

    console.log('getProductsForAdmin: Supabase response data:', data)
    console.log('getProductsForAdmin: Supabase response error:', error)

    if (error) {
      console.error('getProductsForAdmin: Error fetching products:', error)
      console.error('getProductsForAdmin: Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log('getProductsForAdmin: Products fetched successfully:', data?.length || 0, 'products')

    // Sort pricing within each product
    const processedData = data.map(product => ({
      ...product,
      pricing: (product.pricing || [])
        .sort((a, b) => a.sort_order - b.sort_order)
    }))

    console.log('getProductsForAdmin: Products processed with pricing:', processedData?.length || 0, 'products')
    return processedData
  } catch (queryError) {
    console.error('getProductsForAdmin: Unexpected error during query:', queryError)
    throw queryError
  }
}

/*
========================================
ADMIN FUNCTIONS (Authenticated users only)
========================================
*/

// Add new product
export async function addProduct(productData) {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Update product
export async function updateProduct(productId, updates) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Delete product
export async function deleteProduct(productId) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
  
  if (error) throw error
}

// Add pricing option
export async function addPricingOption(pricingData) {
  const { data, error } = await supabase
    .from('product_pricing')
    .insert([pricingData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Update pricing
export async function updatePricing(pricingId, updates) {
  const { data, error } = await supabase
    .from('product_pricing')
    .update(updates)
    .eq('id', pricingId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Delete pricing option
export async function deletePricingOption(pricingId) {
  const { error } = await supabase
    .from('product_pricing')
    .delete()
    .eq('id', pricingId)
  
  if (error) throw error
}

/*
========================================
UTILITY FUNCTIONS
========================================
*/

// Format price for display
export function formatPrice(price) {
  return `₹${price}`
}

// Get category display name
export function getCategoryDisplayName(category, isTeluguName = false) {
  if (!category) return ''
  return isTeluguName ? category.display_name_telugu || category.display_name : category.display_name
}