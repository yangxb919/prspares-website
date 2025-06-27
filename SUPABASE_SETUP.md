# Supabase Database Setup Guide

## 1. Environment Variables Configuration

Add your Supabase configuration to the `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 2. Database Table Structure

### 2.1 Product Related Tables

#### `products` Table
```sql
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_desc TEXT,
  description TEXT,
  regular_price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  stock_status TEXT DEFAULT 'instock',
  images JSONB,
  status TEXT DEFAULT 'draft',
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `product_categories` Table
```sql
CREATE TABLE product_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `product_to_category` Table (Relation Table)
```sql
CREATE TABLE product_to_category (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  category_id BIGINT REFERENCES product_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);
```

### 2.2 Blog Related Tables

#### `posts` Table
```sql
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES auth.users(id),
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `profiles` Table (User Profiles)
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 3. Sample Data

### 3.1 Product Category Data
```sql
INSERT INTO product_categories (name, slug, description) VALUES
('Screens', 'screens', 'Mobile phone screens and displays'),
('Batteries', 'batteries', 'Mobile phone batteries'),
('Charging Ports', 'charging-ports', 'Charging ports and connectors'),
('Cameras', 'cameras', 'Camera modules and components'),
('Small Parts', 'small-parts', 'Small components and parts'),
('Repair Tools', 'tools', 'Professional repair tools');
```

### 3.2 Sample Product Data
```sql
INSERT INTO products (name, slug, short_desc, regular_price, sale_price, status, images, meta) VALUES
(
  'iPhone 15 Pro OLED Screen Assembly',
  'iphone-15-pro-oled-screen',
  'Original quality iPhone 15 Pro OLED display with True Tone and 3D Touch support.',
  299.00,
  259.00,
  'publish',
  '["https://picsum.photos/seed/iphone-15-screen/400/300"]',
  '{"features": ["Original OLED", "True Tone", "3D Touch", "Waterproof Seal"]}'
);
```

### 3.3 Sample Blog Post Data
```sql
INSERT INTO posts (title, slug, excerpt, content, status, published_at, meta) VALUES
(
  'iPhone 15 Complete Screen Replacement Guide',
  'iphone-15-screen-replacement-guide',
  'Detailed iPhone 15 screen replacement guide with professional tips and common pitfall prevention methods.',
  'This is a detailed iPhone 15 screen replacement tutorial...',
  'publish',
  NOW(),
  '{"category": "screen-repair", "cover_image": "https://picsum.photos/seed/iphone-15-screen/800/600"}'
);
```

## 4. Permission Settings (RLS - Row Level Security)

### 4.1 Enable RLS
```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_to_category ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### 4.2 Set Public Read Permissions
```sql
-- Products table public read
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (status = 'publish');

-- Product categories public read
CREATE POLICY "Product categories are viewable by everyone" ON product_categories
  FOR SELECT USING (true);

-- Product category relations public read
CREATE POLICY "Product category relations are viewable by everyone" ON product_to_category
  FOR SELECT USING (true);

-- Published posts public read
CREATE POLICY "Published posts are viewable by everyone" ON posts
  FOR SELECT USING (status = 'publish');

-- User profiles public read
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);
```

## 5. Get Supabase Configuration Information

1. Login to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Click "Settings" > "API" in the left menu
4. Copy the following information:
   - Project URL (use as `NEXT_PUBLIC_SUPABASE_URL`)
   - anon public key (use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## 6. Test Connection

After configuration, you can visit the following pages to test the connection:
- `/products/debug` - View product data debug information
- `/products` - View product list
- `/blog` - View blog article list

## 7. Common Issues

### Q: Page shows "No Products Found" or "No Repair Guides Found"
A: Check the following points:
1. Are environment variables correctly configured
2. Are database tables created
3. Is there data with status 'publish'
4. Are RLS permissions correctly set

### Q: Console shows permission errors
A: Make sure RLS policies are correctly set to allow anonymous users to read published content.

### Q: Images cannot be displayed
A: Check if the JSON format of the `images` field is correct and contains valid image URLs.
