/*
========================================
SUPABASE CLIENT CONFIGURATION
========================================
Supabase client setup for Telugu Delicacies
*/

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('FATAL ERROR: Missing Supabase configuration!');
  throw new Error('Missing Supabase configuration.');
}

const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

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

// Get all product categories (unique from products table)
export async function getCategories() {
  console.log('Fetching categories from products...')

  try {
    const { data, error } = await supabase
      .from('products')
      .select('product_category')
      .eq('is_active', true)

    if (error) {
      console.error('getCategories: Error fetching categories:', error)
      throw error
    }

    const uniqueCategories = [...new Set(data.map(p => p.product_category))]
      .sort()
      .map(category => ({
        name: category.toLowerCase().replace(/\s+/g, '-'),
        display_name: category
      }))

    console.log('getCategories: Categories fetched successfully:', uniqueCategories.length, 'categories')
    return uniqueCategories
  } catch (queryError) {
    console.error('getCategories: Unexpected error during query:', queryError)
    throw queryError
  }
}

// Get products by category (or all if no category specified)
export async function getProducts(categoryName = null) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)

  if (categoryName && categoryName !== 'all') {
    const displayCategory = categoryName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    query = query.eq('product_category', displayCategory)
  }

  const { data, error } = await query.order('product_name')

  if (error) throw error
  return data
}

// Get product by ID
export async function getProductById(productId) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw error
  return data
}

// Get all products for display (public-facing, active only)
export async function getProductsForDisplay() {
  console.log('Fetching products for display from Supabase...')

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('product_name')

    console.log('getProductsForDisplay: Supabase response data:', data)
    console.log('getProductsForDisplay: Supabase response error:', error)

    if (error) {
      console.error('getProductsForDisplay: Error fetching products:', error)
      throw error
    }

    console.log('getProductsForDisplay: Products fetched successfully:', data?.length || 0, 'products')
    return data
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
      .select('*')
      .order('product_name')

    console.log('getProductsForAdmin: Supabase response data:', data)
    console.log('getProductsForAdmin: Supabase response error:', error)

    if (error) {
      console.error('getProductsForAdmin: Error fetching products:', error)
      throw error
    }

    console.log('getProductsForAdmin: Products fetched successfully:', data?.length || 0, 'products')
    return data
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

/*
========================================
UTILITY FUNCTIONS
========================================
*/

// Format price for display
export function formatPrice(price) {
  return `₹${price}`
}

// Parse quantity variants from JSONB
export function getQuantityVariants(product) {
  if (!product || !product.quantity_variants) return []

  try {
    if (typeof product.quantity_variants === 'string') {
      return JSON.parse(product.quantity_variants)
    }
    return product.quantity_variants
  } catch (error) {
    console.error('Error parsing quantity variants:', error)
    return []
  }
}