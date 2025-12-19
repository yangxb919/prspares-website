import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://prspares.zeabur.app'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorageBuckets() {
  console.log('Setting up storage buckets...')

  const buckets = [
    { name: 'product-images', public: true },
    { name: 'post-images', public: true },
    { name: 'avatars', public: true }
  ]

  for (const bucket of buckets) {
    console.log(`\nCreating bucket: ${bucket.name}`)

    // Create bucket
    const { data, error } = await supabase.storage.createBucket(bucket.name, {
      public: bucket.public,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
    })

    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`✓ Bucket ${bucket.name} already exists`)
      } else {
        console.error(`✗ Error creating bucket ${bucket.name}:`, error.message)
        continue
      }
    } else {
      console.log(`✓ Created bucket: ${bucket.name}`)
    }

    // Set up RLS policies for public read access
    if (bucket.public) {
      console.log(`Setting up public access for ${bucket.name}...`)

      // Note: Storage policies are managed through SQL, not the JS client
      // We'll need to run SQL commands separately
      console.log(`✓ Bucket ${bucket.name} is set to public`)
    }
  }

  console.log('\n✓ Storage buckets setup complete!')
}

setupStorageBuckets().catch(console.error)
