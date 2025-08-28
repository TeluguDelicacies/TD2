/*
  # Products Management System for Telugu Delicacies

  1. New Tables
    - `product_categories`
      - `id` (uuid, primary key)
      - `name` (text, category name like 'ready-to-eat')
      - `display_name` (text, display name like 'Ready To Eat')
      - `display_name_telugu` (text, Telugu translation)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, product name)
      - `name_telugu` (text, Telugu name)
      - `description` (text, product description)
      - `category_id` (uuid, foreign key to categories)
      - `image_url` (text, product image URL)
      - `is_active` (boolean, whether product is available)
      - `features` (jsonb, array of product features)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `product_pricing`
      - `id` (uuid, primary key)
      - `product_id` (uuid, foreign key to products)
      - `quantity` (text, like '100g', '5pcs')
      - `price` (numeric, price in rupees)
      - `is_available` (boolean, stock availability)
      - `sort_order` (integer, display order)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Public read access for products display
    - Authenticated write access for admin management
*/

-- Create product categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  display_name_telugu text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_telugu text,
  description text,
  category_id uuid REFERENCES product_categories(id) ON DELETE CASCADE,
  image_url text,
  is_active boolean DEFAULT true,
  features jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product pricing table
CREATE TABLE IF NOT EXISTS product_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity text NOT NULL,
  price numeric(10,2) NOT NULL,
  is_available boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_pricing ENABLE ROW LEVEL SECURITY;

-- Public read access for displaying products
CREATE POLICY "Public can read categories"
  ON product_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read active products"
  ON products
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Public can read available pricing"
  ON product_pricing
  FOR SELECT
  TO public
  USING (is_available = true);

-- Admin access for authenticated users (you can modify this later)
CREATE POLICY "Authenticated users can manage categories"
  ON product_categories
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage products"
  ON products
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage pricing"
  ON product_pricing
  FOR ALL
  TO authenticated
  USING (true);

-- Insert default categories
INSERT INTO product_categories (name, display_name, display_name_telugu) VALUES
('ready-to-eat', 'Ready To Eat', 'తయారుగా తినడానికి'),
('ready-to-cook', 'Ready To Cook', 'వంట చేయడానికి తయారుగా'),
('ready-to-use', 'Ready To Use', 'వాడుకకు తయారుగా')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products (you can modify these through admin interface later)
DO $$
DECLARE
    ready_to_eat_id uuid;
    ready_to_cook_id uuid;
    ready_to_use_id uuid;
    product_id uuid;
BEGIN
    -- Get category IDs
    SELECT id INTO ready_to_eat_id FROM product_categories WHERE name = 'ready-to-eat';
    SELECT id INTO ready_to_cook_id FROM product_categories WHERE name = 'ready-to-cook';
    SELECT id INTO ready_to_use_id FROM product_categories WHERE name = 'ready-to-use';
    
    -- Insert Ready to Eat products
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features) VALUES
    ('Kadapa Kaaram', 'కడప కారం', 'A fiery and flavorful spice blend from the Kadapa region, known for its perfect balance of heat and taste. Made with carefully selected red chilies and traditional spices.', ready_to_eat_id, './images/products/kadapa-kaaram.jpg', '["Authentic Kadapa region recipe", "Perfect balance of heat and flavor", "Made with premium red chilies", "Ready to eat with rice and ghee"]'::jsonb),
    ('Nalla Kaaram', 'నల్ల కారం', 'Premium black pepper powder blend that adds warmth and depth to any dish. Rich in antioxidants and known for its digestive properties.', ready_to_eat_id, './images/products/nalla-kaaram.jpg', '["Premium black pepper blend", "Rich in antioxidants", "Aids digestion", "Perfect with idli and dosa"]'::jsonb),
    ('Kandi Podi', 'కంది పొడి', 'Traditional lentil-based spice powder that''s protein-rich and flavorful. Perfect for mixing with rice and ghee for a nutritious meal.', ready_to_eat_id, './images/products/kandi-podi.jpg', '["High protein lentil base", "Traditional Telugu recipe", "Nutritious and filling", "Great with hot rice"]'::jsonb),
    ('Idli Podi', 'ఇడ్లీ పొడి', 'The classic accompaniment for idli and dosa. A perfect blend of lentils, chilies, and spices ground to perfection.', ready_to_eat_id, './images/products/idli-podi.jpg', '["Classic idli companion", "Perfect spice blend", "Traditional recipe", "Ground to perfection"]'::jsonb);
    
    -- Insert Ready to Cook products
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features) VALUES
    ('Malabar Parota', 'మలబార్ పరోటా', 'Authentic Kerala-style layered parota made with premium flour and traditional techniques. Soft, flaky layers that separate beautifully when cooked.', ready_to_cook_id, './images/products/malabar-parota.jpg', '["Authentic Kerala-style preparation", "Multiple flaky layers", "Made with premium flour", "Ready in 3-4 minutes"]'::jsonb),
    ('Wheat Chapathi', 'గోధుమ చపాతీ', 'Soft, wholesome wheat chapathi made from carefully selected wheat flour. Perfect balance of nutrition and taste.', ready_to_cook_id, './images/products/wheat-chapathi.jpg', '["100% wheat flour", "Soft and flexible texture", "High in fiber and nutrients", "Perfect for healthy meals"]'::jsonb);
    
    -- Insert Ready to Use products
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features) VALUES
    ('Pure Ghee', 'స్వచ్ఛమైన నెయ్యి', 'Traditional clarified butter made from pure cow''s milk. Rich in vitamins A, D, E, and K, perfect for cooking and tempering.', ready_to_use_id, './images/products/ghee.jpg', '["Made from pure cow''s milk", "Rich in essential vitamins", "Perfect for cooking and tempering", "Traditional preparation method"]'::jsonb),
    ('Premium Coffee', 'ప్రీమియం కాఫీ', 'Aromatic South Indian filter coffee blend made from carefully selected coffee beans. Rich, smooth, and perfect for your daily ritual.', ready_to_use_id, './images/products/coffee.jpg', '["Premium coffee bean blend", "Traditional South Indian style", "Rich and aromatic", "Perfect grind consistency"]'::jsonb);
END $$;

-- Insert sample pricing data
DO $$
DECLARE
    product_record RECORD;
BEGIN
    -- Add pricing for Kadapa Kaaram
    SELECT id INTO product_record FROM products WHERE name = 'Kadapa Kaaram';
    IF FOUND THEN
        INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
        (product_record.id, '100g', 70, 1),
        (product_record.id, '250g', 160, 2),
        (product_record.id, '500g', 300, 3),
        (product_record.id, '1000g', 550, 4);
    END IF;
    
    -- Add pricing for Nalla Kaaram
    SELECT id INTO product_record FROM products WHERE name = 'Nalla Kaaram';
    IF FOUND THEN
        INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
        (product_record.id, '100g', 80, 1),
        (product_record.id, '250g', 180, 2),
        (product_record.id, '500g', 340, 3),
        (product_record.id, '1000g', 650, 4);
    END IF;
    
    -- Add pricing for Malabar Parota
    SELECT id INTO product_record FROM products WHERE name = 'Malabar Parota';
    IF FOUND THEN
        INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
        (product_record.id, '5pcs', 120, 1),
        (product_record.id, '10pcs', 220, 2),
        (product_record.id, '20pcs', 400, 3);
    END IF;
    
    -- Add pricing for Pure Ghee
    SELECT id INTO product_record FROM products WHERE name = 'Pure Ghee';
    IF FOUND THEN
        INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
        (product_record.id, '250ml', 280, 1),
        (product_record.id, '500ml', 520, 2),
        (product_record.id, '1000ml', 980, 3);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_product_id ON product_pricing(product_id);
CREATE INDEX IF NOT EXISTS idx_pricing_available ON product_pricing(is_available);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON product_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_updated_at 
    BEFORE UPDATE ON product_pricing 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();