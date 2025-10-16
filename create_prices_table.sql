-- Create prices table for mobile phone repair parts
CREATE TABLE IF NOT EXISTS prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  series VARCHAR(100),
  product_title VARCHAR(255) NOT NULL,
  product_type VARCHAR(100),
  image_url TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  description TEXT,
  availability_status VARCHAR(20) DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_prices_brand ON prices(brand);
CREATE INDEX IF NOT EXISTS idx_prices_model ON prices(model);
CREATE INDEX IF NOT EXISTS idx_prices_series ON prices(series);
CREATE INDEX IF NOT EXISTS idx_prices_product_title ON prices(product_title);
CREATE INDEX IF NOT EXISTS idx_prices_brand_model ON prices(brand, model);

-- Enable RLS and create policy to allow public read access
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Prices are viewable by everyone" ON prices FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON prices FOR INSERT WITH CHECK (true);

-- Insert sample data
INSERT INTO prices (brand, model, series, product_title, product_type, image_url, price, currency, description) VALUES
('Apple', 'iPhone 16 Pro Max', 'iPhone 16 Series', 'iPhone 16 Pro Max LCD Display Assembly', 'LCD Display', 'https://via.placeholder.com/300x300/1f2937/ffffff?text=iPhone+16+Pro+Max+LCD', 89.99, 'USD', 'High-quality LCD display assembly for iPhone 16 Pro Max'),
('Apple', 'iPhone 15 Pro', 'iPhone 15 Series', 'iPhone 15 Pro Camera Module', 'Camera Module', 'https://via.placeholder.com/300x300/1f2937/ffffff?text=iPhone+15+Pro+Camera', 129.99, 'USD', 'Rear camera module for iPhone 15 Pro'),
('Apple', 'iPhone 14', 'iPhone 14 Series', 'iPhone 14 Back Glass Panel', 'Back Glass', 'https://via.placeholder.com/300x300/1f2937/ffffff?text=iPhone+14+Back+Glass', 65.99, 'USD', 'Replacement back glass panel for iPhone 14'),
('Samsung', 'Galaxy S24 Ultra', 'Galaxy S24 Series', 'Samsung Galaxy S24 Ultra Battery', 'Battery', 'https://via.placeholder.com/300x300/1f2937/ffffff?text=S24+Ultra+Battery', 45.99, 'USD', 'Original capacity battery for Samsung Galaxy S24 Ultra'),
('Samsung', 'Galaxy S23', 'Galaxy S23 Series', 'Samsung Galaxy S23 Screen Protector', 'Screen Protector', 'https://via.placeholder.com/300x300/1f2937/ffffff?text=S23+Screen+Protector', 12.99, 'USD', 'Tempered glass screen protector for Galaxy S23'),
('Xiaomi', 'Mi 14', 'Mi 14 Series', 'Xiaomi Mi 14 Charging Port', 'Charging Port', 'https://via.placeholder.com/300x300/1f2937/ffffff?text=Mi+14+Charging+Port', 25.99, 'USD', 'USB-C charging port assembly for Xiaomi Mi 14'),
('Xiaomi', 'Redmi Note 13', 'Redmi Note Series', 'Redmi Note 13 Pro Display', 'Display', 'https://via.placeholder.com/300x300/1f2937/ffffff?text=Redmi+Note+13+Display', 55.99, 'USD', 'AMOLED display for Redmi Note 13 Pro'),
('Huawei', 'P60 Pro', 'P60 Series', 'Huawei P60 Pro Speaker Assembly', 'Speaker', 'https://via.placeholder.com/300x300/1f2937/ffffff?text=P60+Pro+Speaker', 35.99, 'USD', 'Bottom speaker assembly for Huawei P60 Pro'),
('Huawei', 'Mate 60', 'Mate 60 Series', 'Huawei Mate 60 Wireless Charging Coil', 'Wireless Charging', 'https://via.placeholder.com/300x300/1f2937/ffffff?text=Mate+60+Wireless', 28.99, 'USD', 'Wireless charging coil for Huawei Mate 60');
