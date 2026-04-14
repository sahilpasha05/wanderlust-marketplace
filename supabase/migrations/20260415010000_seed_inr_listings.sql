-- Seed sample INR listings using an existing auth user as host
WITH host AS (
  SELECT id FROM auth.users ORDER BY created_at LIMIT 1
)
INSERT INTO public.listings (
  id,
  host_id,
  title,
  description,
  location,
  city,
  country,
  category,
  price_per_night,
  max_guests,
  bedrooms,
  beds,
  bathrooms,
  images,
  amenities,
  is_published,
  is_approved,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  host.id,
  'Goa Beachfront Villa with Private Pool',
  'A luxe Goa villa right on the beach, with a private pool, spacious terraces, and direct sunset access.',
  'Calangute Beach, Goa',
  'Goa',
  'India',
  'beach',
  11800,
  8,
  4,
  4,
  4,
  ARRAY[
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200'
  ],
  ARRAY['WiFi', 'Private pool', 'Kitchen', 'Beach access', 'Breakfast included'],
  true,
  true,
  now(),
  now()
FROM host
UNION ALL
SELECT
  gen_random_uuid(),
  host.id,
  'Mumbai Sky Loft with Arabian Sea View',
  'A modern sky loft with sweeping Arabian Sea views, premium furnishings, and easy access to South Mumbai.',
  'Nariman Point, Mumbai',
  'Mumbai',
  'India',
  'city',
  7200,
  4,
  2,
  2,
  2,
  ARRAY[
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200'
  ],
  ARRAY['WiFi', 'Air conditioning', 'Gym access', 'City view', '24/7 concierge'],
  true,
  true,
  now(),
  now()
FROM host
UNION ALL
SELECT
  gen_random_uuid(),
  host.id,
  'Udaipur Lake Palace Suite',
  'A romantic suite with dramatic lake views, traditional decor, and a private balcony overlooking the city palace.',
  'Lake Pichola, Udaipur',
  'Udaipur',
  'India',
  'heritage',
  10500,
  2,
  1,
  1,
  1,
  ARRAY[
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200'
  ],
  ARRAY['WiFi', 'Lake view', 'Breakfast included', 'Private balcony', 'Room service'],
  true,
  true,
  now(),
  now()
FROM host
UNION ALL
SELECT
  gen_random_uuid(),
  host.id,
  'Cozy Delhi Apartment near Connaught Place',
  'A bright, centrally located apartment steps from Connaught Place, perfect for city explorers and business travelers.',
  'Connaught Place, New Delhi',
  'New Delhi',
  'India',
  'city',
  4200,
  3,
  2,
  2,
  2,
  ARRAY[
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200'
  ],
  ARRAY['WiFi', 'Kitchen', 'Air conditioning', 'Washer', 'Central location'],
  true,
  true,
  now(),
  now()
FROM host;
