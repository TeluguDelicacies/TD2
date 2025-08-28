/*
========================================
SUPABASE CLIENT CONFIGURATION
========================================
Supabase client setup for Telugu Delicacies
*/

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Debug logging to verify environment variables
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Loaded' : 'Not Loaded')
console.log('Environment variables check:', {
  url: !!supabaseUrl,
  key: !!supabaseAnonKey
})

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
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
  console.log('Categories fetched successfully:', data?.length || 0, 'categories')
  return data
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

// Get all products with pricing for display
export async function getProductsForDisplay() {
  console.log('Fetching products for display from Supabase...')
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
  
  if (error) {
    console.error('Error fetching products for display:', error)
    throw error
  }
  
  console.log('Products fetched successfully:', data?.length || 0, 'products')
  
  // Sort pricing within each product
  const processedData = data.map(product => ({
    ...product,
    pricing: product.pricing
      .filter(p => p.is_available)
      .sort((a, b) => a.sort_order - b.sort_order)
  }))
  
  console.log('Products processed with pricing:', processedData?.length || 0, 'products')
  return processedData
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