/*
  Unified Products Table for Telugu Delicacies
  
  This migration creates a simplified, unified products table that consolidates
  categories, products, and pricing into a single table structure.
  
  New Unified Products Table Fields:
  - id: Unique product identifier
  - product_name: Product name
  - product_category: Category (Ready to Eat, Ready to Cook, Ready to Use)
  - product_description: Detailed product description
  - product_tagline: Short marketing tagline
  - showcase_image: Image URL for showcase/listing section
  - info_image: Image URL for product detail/info section
  - mrp: Maximum Retail Price
  - net_weight: Default net weight or quantity
  - total_stock: Total units in stock
  - quantity_variants: JSONB array of quantity options with prices and stock
  - is_active: Whether product is available for sale
  - created_at: Creation timestamp
  - updated_at: Last update timestamp
*/

-- Drop old tables safely
DROP TABLE IF EXISTS product_pricing CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;

-- Drop the trigger function if it exists
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- Create new unified products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name text NOT NULL,
  product_category text NOT NULL,
  product_description text DEFAULT '',
  product_tagline text DEFAULT '',
  showcase_image text DEFAULT '',
  info_image text DEFAULT '',
  mrp numeric(10,2) DEFAULT 0,
  net_weight text DEFAULT '',
  total_stock integer DEFAULT 0,
  quantity_variants jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(product_category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(product_name);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access for active products
CREATE POLICY "Public can read active products"
  ON products
  FOR SELECT
  TO public
  USING (is_active = true);

-- Authenticated users can read all products (including inactive)
CREATE POLICY "Authenticated users can read all products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert products
CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update products
CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete products
CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO products (
  product_name, 
  product_category, 
  product_description, 
  product_tagline,
  showcase_image,
  info_image,
  mrp,
  net_weight,
  total_stock,
  quantity_variants,
  is_active
) VALUES
(
  'Kadapa Kaaram',
  'Ready to Eat',
  'A fiery and flavorful spice blend from the Kadapa region, known for its perfect balance of heat and taste. Made with carefully selected red chilies and traditional spices.',
  'Authentic spice blend from Kadapa',
  './images/products/kadapa-kaaram.jpg',
  './images/products/kadapa-kaaram-detail.jpg',
  80,
  '100g',
  200,
  '[
    {"quantity": "100g", "price": 70, "stock": 50, "mrp": 80},
    {"quantity": "250g", "price": 160, "stock": 40, "mrp": 180},
    {"quantity": "500g", "price": 300, "stock": 60, "mrp": 340},
    {"quantity": "1000g", "price": 550, "stock": 50, "mrp": 650}
  ]'::jsonb,
  true
),
(
  'Malabar Parota',
  'Ready to Cook',
  'Authentic Kerala-style layered parota made with premium flour and traditional techniques. Soft, flaky layers that separate beautifully when cooked.',
  'Kerala-style layered parota',
  './images/products/malabar-parota.jpg',
  './images/products/malabar-parota-detail.jpg',
  25,
  '5pcs',
  300,
  '[
    {"quantity": "5pcs", "price": 120, "stock": 100, "mrp": 140},
    {"quantity": "10pcs", "price": 220, "stock": 100, "mrp": 260},
    {"quantity": "20pcs", "price": 400, "stock": 100, "mrp": 480}
  ]'::jsonb,
  true
),
(
  'Pure Ghee',
  'Ready to Use',
  'Traditional clarified butter made from pure cow milk. Rich in vitamins A, D, E, and K, perfect for cooking and tempering.',
  'Traditional clarified butter',
  './images/products/ghee.jpg',
  './images/products/ghee-detail.jpg',
  320,
  '250ml',
  150,
  '[
    {"quantity": "250ml", "price": 280, "stock": 50, "mrp": 320},
    {"quantity": "500ml", "price": 520, "stock": 50, "mrp": 600},
    {"quantity": "1000ml", "price": 980, "stock": 50, "mrp": 1150}
  ]'::jsonb,
  true
);