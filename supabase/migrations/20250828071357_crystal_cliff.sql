/*
  # Insert Current Products into Database

  1. Categories
    - Insert product categories (Ready to Eat, Ready to Cook, Ready to Use)
  
  2. Products
    - Insert all current products from sales page
    - Include English and Telugu names
    - Add descriptions and features
    
  3. Pricing
    - Insert pricing options for each product
    - Multiple quantity/price combinations
*/

-- Insert categories
INSERT INTO product_categories (name, display_name, display_name_telugu) VALUES
('ready-to-eat', 'Ready to Eat', 'తినడానికి సిద్ధం'),
('ready-to-cook', 'Ready to Cook', 'వండటానికి సిద్ధం'),
('ready-to-use', 'Ready to Use', 'ఉపయోగించటానికి సిద్ధం')
ON CONFLICT (name) DO NOTHING;

-- Insert Ready to Eat Products
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
    
    -- Kadapa Kaaram
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Kadapa Kaaram', 
        'కడప కారం', 
        'A fiery and flavorful spice blend from the Kadapa region, known for its perfect balance of heat and taste. Made with carefully selected red chilies and traditional spices.',
        ready_to_eat_id,
        './images/products/kadapa-kaaram.jpg',
        '["Authentic Kadapa region recipe", "Perfect balance of heat and flavor", "Made with premium red chilies", "Ready to eat with rice and ghee"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '100g', 70, 1),
    (product_id, '250g', 160, 2),
    (product_id, '500g', 300, 3),
    (product_id, '1000g', 550, 4);
    
    -- Nalla Kaaram
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Nalla Kaaram', 
        'నల్ల కారం', 
        'Premium black pepper powder blend that adds warmth and depth to any dish. Rich in antioxidants and known for its digestive properties.',
        ready_to_eat_id,
        './images/products/nalla-kaaram.jpg',
        '["Premium black pepper blend", "Rich in antioxidants", "Aids digestion", "Perfect with idli and dosa"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '100g', 80, 1),
    (product_id, '250g', 180, 2),
    (product_id, '500g', 340, 3),
    (product_id, '1000g', 650, 4);
    
    -- Kandi Podi
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Kandi Podi', 
        'కంది పొడి', 
        'Traditional lentil-based spice powder that''s protein-rich and flavorful. Perfect for mixing with rice and ghee for a nutritious meal.',
        ready_to_eat_id,
        './images/products/kandi-podi.jpg',
        '["High protein lentil base", "Traditional Telugu recipe", "Nutritious and filling", "Great with hot rice"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '100g', 75, 1),
    (product_id, '250g', 170, 2),
    (product_id, '500g', 320, 3),
    (product_id, '1000g', 600, 4);
    
    -- Godhuma Kaaram
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Godhuma Kaaram', 
        'గోధుమ కారం', 
        'Roasted wheat-based spice powder with aromatic spices. A healthy and wholesome option that adds texture and flavor to your meals.',
        ready_to_eat_id,
        './images/products/godhuma-kaaram.jpg',
        '["Roasted wheat base", "Aromatic spice blend", "High fiber content", "Crunchy texture"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '100g', 65, 1),
    (product_id, '250g', 150, 2),
    (product_id, '500g', 280, 3),
    (product_id, '1000g', 520, 4);
    
    -- Karivepaku Podi
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Karivepaku Podi', 
        'కరివేపాకు పొడి', 
        'Fresh curry leaves dried and ground with traditional spices. Adds authentic South Indian aroma and is known for its health benefits.',
        ready_to_eat_id,
        './images/products/karivepaku-podi.jpg',
        '["Fresh curry leaves", "Authentic aroma", "Rich in vitamins", "Traditional preparation"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '100g', 85, 1),
    (product_id, '250g', 200, 2),
    (product_id, '500g', 380, 3),
    (product_id, '1000g', 720, 4);
    
    -- Palli Dhaniya Podi
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Palli Dhaniya Podi', 
        'పల్లి ధనియా పొడి', 
        'A unique blend of roasted groundnuts and coriander seeds. Rich in protein and adds a nutty, aromatic flavor to rice and rotis.',
        ready_to_eat_id,
        './images/products/palli-dhaniya-podi.jpg',
        '["Roasted groundnuts and coriander", "High protein content", "Nutty aromatic flavor", "Great with rotis"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '100g', 90, 1),
    (product_id, '250g', 210, 2),
    (product_id, '500g', 400, 3),
    (product_id, '1000g', 760, 4);
    
    -- Tamalapaaku Kaaram
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Tamalapaaku Kaaram', 
        'తమలపాకు కారం', 
        'Bay leaf spice powder that adds a distinctive aroma and flavor. Used traditionally in Telugu cuisine for its medicinal properties.',
        ready_to_eat_id,
        './images/products/tamalapaaku-kaaram.jpg',
        '["Distinctive bay leaf aroma", "Medicinal properties", "Traditional Telugu cuisine", "Unique flavor profile"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '100g', 95, 1),
    (product_id, '250g', 220, 2),
    (product_id, '500g', 420, 3),
    (product_id, '1000g', 800, 4);
    
    -- Sambar Premix
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Sambar Premix', 
        'సాంబార్ ప్రీమిక్స్', 
        'Ready-to-use sambar masala powder with the perfect balance of tangy and spicy flavors. Makes authentic sambar in minutes.',
        ready_to_eat_id,
        './images/products/sambar-premix.jpg',
        '["Perfect tangy-spicy balance", "Instant sambar preparation", "Authentic South Indian taste", "No artificial colors"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '100g', 80, 1),
    (product_id, '250g', 180, 2),
    (product_id, '500g', 340, 3),
    (product_id, '1000g', 650, 4);
    
    -- Velluli Kaaram
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Velluli Kaaram', 
        'వెల్లుల్లి కారం', 
        'Fresh garlic dried and ground with aromatic spices. Known for its health benefits and bold flavor that enhances any dish.',
        ready_to_eat_id,
        './images/products/velluli-kaaram.jpg',
        '["Fresh garlic base", "Bold flavor enhancement", "Health benefits", "Aromatic spice blend"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '100g', 100, 1),
    (product_id, '250g', 230, 2),
    (product_id, '500g', 440, 3),
    (product_id, '1000g', 840, 4);
    
    -- Idli Podi
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Idli Podi', 
        'ఇడ్లీ పొడి', 
        'The classic accompaniment for idli and dosa. A perfect blend of lentils, chilies, and spices ground to perfection.',
        ready_to_eat_id,
        './images/products/idli-podi.jpg',
        '["Classic idli companion", "Perfect spice blend", "Traditional recipe", "Ground to perfection"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '100g', 75, 1),
    (product_id, '250g', 170, 2),
    (product_id, '500g', 320, 3),
    (product_id, '1000g', 600, 4);
    
    -- Konaseema Kaaram
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Konaseema Kaaram', 
        'కోనసీమ కారం', 
        'A special spice blend from the Konaseema region, known for its unique flavor profile and traditional preparation methods.',
        ready_to_eat_id,
        './images/products/konaseema-kaaram.jpg',
        '["Konaseema region specialty", "Unique flavor profile", "Traditional methods", "Regional authenticity"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '100g', 85, 1),
    (product_id, '250g', 200, 2),
    (product_id, '500g', 380, 3),
    (product_id, '1000g', 720, 4);
    
    -- Chutney Premix
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Chutney Premix', 
        'చట్నీ ప్రీమిక్స్', 
        'Ready-to-use chutney powder that makes instant chutneys. Just add water or oil for a quick and delicious accompaniment.',
        ready_to_eat_id,
        './images/products/chutney-premix.jpg',
        '["Instant chutney preparation", "Just add water or oil", "Quick and convenient", "Delicious accompaniment"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '100g', 70, 1),
    (product_id, '250g', 160, 2),
    (product_id, '500g', 300, 3),
    (product_id, '1000g', 550, 4);
    
    -- Palli Kaaram
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Palli Kaaram', 
        'పల్లి కారం', 
        'Roasted groundnut spice powder that''s protein-rich and flavorful. Perfect with idli, dosa, or mixed with rice and ghee.',
        ready_to_eat_id,
        './images/products/palli-kaaram.jpg',
        '["Roasted groundnut base", "High protein content", "Rich and flavorful", "Versatile usage"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '100g', 85, 1),
    (product_id, '250g', 200, 2),
    (product_id, '500g', 380, 3),
    (product_id, '1000g', 720, 4);
    
    -- Ready to Cook Products
    
    -- Malabar Parota
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Malabar Parota', 
        'మలబార్ పరోటా', 
        'Authentic Kerala-style layered parota made with premium flour and traditional techniques. Soft, flaky layers that separate beautifully when cooked. Perfect with curry or dal.',
        ready_to_cook_id,
        './images/products/malabar-parota.jpg',
        '["Authentic Kerala-style preparation", "Multiple flaky layers", "Made with premium flour", "Ready in 3-4 minutes"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '5pcs', 120, 1),
    (product_id, '10pcs', 220, 2),
    (product_id, '20pcs', 400, 3);
    
    -- Wheat Chapathi
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Wheat Chapathi', 
        'గోధుమ చపాతీ', 
        'Soft, wholesome wheat chapathi made from carefully selected wheat flour. Perfect balance of nutrition and taste, ideal for wrapping curries or enjoying with dal and vegetables.',
        ready_to_cook_id,
        './images/products/wheat-chapathi.jpg',
        '["100% wheat flour", "Soft and flexible texture", "High in fiber and nutrients", "Perfect for healthy meals"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '5pcs', 100, 1),
    (product_id, '10pcs', 180, 2),
    (product_id, '20pcs', 320, 3);
    
    -- Ready to Use Products
    
    -- Pure Ghee
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Pure Ghee', 
        'స్వచ్ఛమైన నెయ్యి', 
        'Traditional clarified butter made from pure cow''s milk. Rich in vitamins A, D, E, and K, our ghee is perfect for cooking, tempering, and adding authentic flavor to your meals.',
        ready_to_use_id,
        './images/products/ghee.jpg',
        '["Made from pure cow milk", "Rich in essential vitamins", "Perfect for cooking and tempering", "Traditional preparation method"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '250ml', 280, 1),
    (product_id, '500ml', 520, 2),
    (product_id, '1000ml', 980, 3);
    
    -- Multigrain Atta
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Multigrain Atta', 
        'మల్టిగ్రెయిన్ ఆటా', 
        'A nutritious blend of wheat, millet, barley, and other wholesome grains. Perfect for making healthy rotis, parathas, and bread with enhanced nutritional value.',
        ready_to_use_id,
        './images/products/multigrain-atta.jpg',
        '["Blend of multiple healthy grains", "High in fiber and protein", "Perfect for healthy rotis", "Enhanced nutritional value"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '500g', 120, 1),
    (product_id, '1000g', 220, 2),
    (product_id, '2000g', 400, 3);
    
    -- Premium Coffee
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Premium Coffee', 
        'ప్రీమియం కాఫీ', 
        'Aromatic South Indian filter coffee blend made from carefully selected coffee beans. Rich, smooth, and perfect for your morning ritual or evening relaxation.',
        ready_to_use_id,
        './images/products/coffee.jpg',
        '["Premium coffee bean blend", "Traditional South Indian style", "Rich and aromatic", "Perfect grind consistency"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '250g', 200, 1),
    (product_id, '500g', 380, 2),
    (product_id, '1000g', 720, 3);
    
    -- Pure Pasupu
    INSERT INTO products (name, name_telugu, description, category_id, image_url, features, is_active) 
    VALUES (
        'Pure Pasupu', 
        'స్వచ్ఛమైన పసుపు', 
        'Premium quality turmeric powder with high curcumin content. Known for its anti-inflammatory and antioxidant properties, perfect for cooking and health benefits.',
        ready_to_use_id,
        './images/products/pasupu.jpg',
        '["High curcumin content", "Anti-inflammatory properties", "Pure and natural", "Vibrant color and aroma"]',
        true
    ) RETURNING id INTO product_id;
    
    INSERT INTO product_pricing (product_id, quantity, price, sort_order) VALUES
    (product_id, '250g', 80, 1),
    (product_id, '500g', 150, 2),
    (product_id, '1000g', 280, 3);
    
END $$;