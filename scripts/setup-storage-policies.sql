-- Enable public access for storage buckets
-- This allows authenticated and anonymous users to upload and read images

-- Product Images Bucket Policies
INSERT INTO storage.policies (name, bucket_id, definition, check_definition)
VALUES
  ('Public Access', 'product-images', 'true', 'true'),
  ('Public Upload', 'product-images', 'true', 'true')
ON CONFLICT (bucket_id, name) DO UPDATE
SET definition = EXCLUDED.definition, check_definition = EXCLUDED.check_definition;

-- Post Images Bucket Policies
INSERT INTO storage.policies (name, bucket_id, definition, check_definition)
VALUES
  ('Public Access', 'post-images', 'true', 'true'),
  ('Public Upload', 'post-images', 'true', 'true')
ON CONFLICT (bucket_id, name) DO UPDATE
SET definition = EXCLUDED.definition, check_definition = EXCLUDED.check_definition;

-- Avatars Bucket Policies
INSERT INTO storage.policies (name, bucket_id, definition, check_definition)
VALUES
  ('Public Access', 'avatars', 'true', 'true'),
  ('Public Upload', 'avatars', 'true', 'true')
ON CONFLICT (bucket_id, name) DO UPDATE
SET definition = EXCLUDED.definition, check_definition = EXCLUDED.check_definition;
