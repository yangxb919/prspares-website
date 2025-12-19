const { createClient } = require('@supabase/supabase-js');

// Hardcode credentials from .env.local
const supabaseUrl = 'https://prspares.zeabur.app';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample author ID (you can change this to match your actual author ID)
const AUTHOR_ID = '08bb22e4-3607-431c-b046-b7062c29a0be';

const samplePosts = [
  {
    title: 'Getting Started with iPhone Screen Repair',
    slug: 'getting-started-iphone-screen-repair',
    excerpt: 'Learn the basics of iPhone screen repair with our comprehensive guide for beginners.',
    content: `# Getting Started with iPhone Screen Repair

iPhone screen repair is one of the most common repairs in the mobile device industry. This guide will walk you through the essential steps and tools needed to successfully repair an iPhone screen.

## Tools You'll Need

- Pentalobe screwdriver
- Phillips screwdriver
- Suction cup
- Plastic opening tools
- Tweezers
- Heat gun or hair dryer

## Step-by-Step Process

1. **Power off the device** - Always ensure the iPhone is completely powered off before starting any repair.
2. **Remove the pentalobe screws** - Located at the bottom of the device near the charging port.
3. **Apply heat** - Gently heat the edges of the screen to soften the adhesive.
4. **Create an opening** - Use the suction cup and plastic tools to carefully separate the screen.
5. **Disconnect the battery** - This is a critical safety step.
6. **Remove screen connectors** - Carefully disconnect the display cables.
7. **Install new screen** - Reverse the process with your replacement screen.

## Safety Tips

- Always work in a clean, well-lit environment
- Keep track of all screws and small parts
- Be gentle with ribbon cables
- Test the new screen before fully reassembling

With practice and patience, iPhone screen repair becomes a valuable skill that can save time and money.`,
    status: 'publish',
    published_at: new Date('2024-01-15').toISOString(),
    created_at: new Date('2024-01-15').toISOString(),
    author_id: AUTHOR_ID,
    meta: {
      category: 'Repair Guides',
      tags: ['iPhone', 'Screen Repair', 'Tutorial'],
      featured_image: 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=800'
    }
  },
  {
    title: 'Top 10 Essential Tools for Mobile Repair',
    slug: 'top-10-essential-tools-mobile-repair',
    excerpt: 'Discover the must-have tools every mobile repair technician should have in their toolkit.',
    content: `# Top 10 Essential Tools for Mobile Repair

Having the right tools is crucial for successful mobile device repairs. Here are the top 10 essential tools every repair technician should have.

## 1. Precision Screwdriver Set

A quality precision screwdriver set with various bits is essential for working with the tiny screws found in mobile devices.

## 2. Plastic Opening Tools

These prevent damage to device casings and screens during disassembly.

## 3. Suction Cups

Essential for safely removing screens without causing damage.

## 4. Tweezers

Precision tweezers help handle small components and screws.

## 5. Heat Gun

Used to soften adhesives for easier screen removal.

## 6. Anti-Static Mat

Protects sensitive electronic components from static discharge.

## 7. Magnifying Glass or Microscope

Helps inspect small components and solder joints.

## 8. Multimeter

Essential for diagnosing electrical issues.

## 9. Soldering Iron

For advanced repairs involving component-level work.

## 10. Cleaning Solutions

Isopropyl alcohol and cleaning tools for maintaining device cleanliness.

Investing in quality tools will make your repair work easier, faster, and more professional.`,
    status: 'publish',
    published_at: new Date('2024-01-20').toISOString(),
    created_at: new Date('2024-01-20').toISOString(),
    author_id: AUTHOR_ID,
    meta: {
      category: 'Tools & Equipment',
      tags: ['Tools', 'Equipment', 'Repair'],
      featured_image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800'
    }
  },
  {
    title: 'Understanding OLED vs LCD Displays',
    slug: 'understanding-oled-vs-lcd-displays',
    excerpt: 'A comprehensive comparison of OLED and LCD display technologies in modern smartphones.',
    content: `# Understanding OLED vs LCD Displays

When it comes to smartphone displays, OLED and LCD are the two dominant technologies. Understanding their differences is crucial for repair technicians and consumers alike.

## LCD Technology

LCD (Liquid Crystal Display) has been the standard for years:

- **Pros**: More affordable, good color accuracy, longer lifespan
- **Cons**: Lower contrast ratio, thicker profile, requires backlight

## OLED Technology

OLED (Organic Light-Emitting Diode) is newer and more advanced:

- **Pros**: Perfect blacks, higher contrast, thinner, more energy efficient
- **Cons**: More expensive, potential burn-in, shorter lifespan

## Repair Considerations

### LCD Repairs
- Generally less expensive
- More readily available parts
- Easier to work with

### OLED Repairs
- Higher cost of replacement parts
- Requires more careful handling
- Better visual quality for customers

## Which is Better?

The answer depends on your priorities:
- **Budget-conscious**: LCD
- **Best visual quality**: OLED
- **Longevity**: LCD
- **Modern flagship experience**: OLED

Both technologies have their place in the market, and understanding their differences helps you provide better service to your customers.`,
    status: 'publish',
    published_at: new Date('2024-02-01').toISOString(),
    created_at: new Date('2024-02-01').toISOString(),
    author_id: AUTHOR_ID,
    meta: {
      category: 'Technical Knowledge',
      tags: ['OLED', 'LCD', 'Display Technology'],
      featured_image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800'
    }
  },
  {
    title: 'How to Diagnose Battery Issues',
    slug: 'how-to-diagnose-battery-issues',
    excerpt: 'Learn to identify and diagnose common battery problems in smartphones and tablets.',
    content: `# How to Diagnose Battery Issues

Battery problems are among the most common issues customers face with their mobile devices. Here's how to properly diagnose them.

## Common Symptoms

1. **Rapid battery drain**
2. **Device won't charge**
3. **Battery swelling**
4. **Random shutdowns**
5. **Overheating during charging**

## Diagnostic Steps

### 1. Check Battery Health

Most devices have built-in battery health indicators:
- iOS: Settings > Battery > Battery Health
- Android: Settings > Battery > Battery Usage

### 2. Test Charging Port

- Inspect for debris or damage
- Try different cables and chargers
- Check for loose connections

### 3. Monitor Temperature

- Normal charging temperature: 20-45°C
- Excessive heat indicates a problem

### 4. Check for Software Issues

- Update to latest OS version
- Check for battery-draining apps
- Perform a soft reset

### 5. Physical Inspection

- Look for battery swelling
- Check for corrosion
- Inspect charging port

## When to Replace

Replace the battery if:
- Health is below 80%
- Physical swelling is present
- Charging issues persist after cleaning
- Device is more than 2 years old

## Safety Warning

⚠️ Never puncture or bend a lithium-ion battery. Swollen batteries should be handled with extreme care and disposed of properly.

Proper battery diagnosis ensures customer satisfaction and device safety.`,
    status: 'publish',
    published_at: new Date('2024-02-10').toISOString(),
    created_at: new Date('2024-02-10').toISOString(),
    author_id: AUTHOR_ID,
    meta: {
      category: 'Troubleshooting',
      tags: ['Battery', 'Diagnostics', 'Troubleshooting'],
      featured_image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800'
    }
  },
  {
    title: 'Water Damage Repair: A Complete Guide',
    slug: 'water-damage-repair-complete-guide',
    excerpt: 'Everything you need to know about repairing water-damaged mobile devices.',
    content: `# Water Damage Repair: A Complete Guide

Water damage is one of the most challenging repairs in mobile device servicing. This guide covers everything you need to know.

## Immediate Actions

When a customer brings in a water-damaged device:

1. **Do NOT turn it on** if it's off
2. **Remove the battery** if possible
3. **Remove SIM and SD cards**
4. **Dry external surfaces**
5. **Document the damage**

## Assessment Process

### Visual Inspection
- Check liquid damage indicators (LDIs)
- Look for corrosion on ports
- Inspect for water inside camera lens

### Internal Inspection
- Open the device carefully
- Check for corrosion on logic board
- Inspect battery for swelling
- Look for mineral deposits

## Cleaning Process

### Materials Needed
- Isopropyl alcohol (90%+ concentration)
- Soft brush
- Ultrasonic cleaner (optional)
- Compressed air
- Lint-free cloths

### Steps
1. Disassemble completely
2. Brush away visible corrosion
3. Clean with isopropyl alcohol
4. Use ultrasonic cleaner if available
5. Dry thoroughly
6. Inspect under magnification

## Component Testing

After cleaning:
- Test battery voltage
- Check charging circuit
- Test display connection
- Verify button functionality
- Test cameras and sensors

## Success Factors

Water damage repair success depends on:
- **Time**: Faster service = better results
- **Water type**: Fresh water is better than salt water
- **Duration**: Less exposure time = better outcome
- **Device condition**: Newer devices fare better

## Prevention Tips for Customers

- Use waterproof cases
- Avoid using devices near water
- Keep devices away from humidity
- Consider water-resistant models

Remember: Not all water-damaged devices can be saved, but proper technique maximizes success rates.`,
    status: 'publish',
    published_at: new Date('2024-02-15').toISOString(),
    created_at: new Date('2024-02-15').toISOString(),
    author_id: AUTHOR_ID,
    meta: {
      category: 'Repair Guides',
      tags: ['Water Damage', 'Repair', 'Advanced'],
      featured_image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800'
    }
  }
];

async function seedPosts() {
  console.log('\n🌱 Seeding Sample Blog Posts\n');
  console.log('='.repeat(60));
  
  try {
    console.log(`\n📝 Inserting ${samplePosts.length} sample posts...\n`);
    
    const { data, error } = await supabase
      .from('posts')
      .insert(samplePosts)
      .select();
    
    if (error) {
      console.error('❌ Error inserting posts:', error);
      return;
    }
    
    console.log(`✅ Successfully inserted ${data.length} posts!\n`);
    console.log('='.repeat(60));
    console.log('\n📊 Inserted Posts:\n');
    
    data.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Status: ${post.status}`);
      console.log(`   Published: ${post.published_at}`);
      console.log('');
    });
    
    console.log('='.repeat(60));
    console.log('\n✅ Seeding complete! Refresh your admin page to see the posts.\n');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

seedPosts();

