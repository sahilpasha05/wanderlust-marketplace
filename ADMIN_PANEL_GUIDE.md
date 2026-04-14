# Admin Panel Setup Guide

## Database Migration

The new admin panel requires running the following SQL migration. Run this in your Supabase SQL editor:

### File: `supabase/migrations/20260415000000_admin_tables.sql`

This migration includes:

1. **Admin Activity Log Table** - Tracks all admin actions
2. **Listing columns** - Adds approval and flagging features
3. **Admin dashboard view** - Aggregates statistics

## Existing Database Tables

Your current database has these tables:

- `profiles` - User information and profiles
- `user_roles` - User roles (admin, host, user)
- `listings` - Property listings
- `bookings` - Booking records
- `reviews` - User reviews
- `wishlist` - User wishlists

## SQL Queries Reference

### 1. Assign Admin Role to a User

```sql
-- Replace 'user_uuid' with actual user ID
INSERT INTO public.user_roles (user_id, role) 
VALUES ('user_uuid', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### 2. View All Admins

```sql
SELECT p.name, p.email, ur.role, p.created_at
FROM public.profiles p
JOIN public.user_roles ur ON p.user_id = ur.user_id
WHERE ur.role = 'admin'
ORDER BY p.created_at DESC;
```

### 3. Get Dashboard Statistics

```sql
SELECT 
  (SELECT COUNT(*) FROM public.profiles) as total_users,
  (SELECT COUNT(*) FROM public.listings) as total_listings,
  (SELECT COUNT(*) FROM public.listings WHERE is_approved = false) as pending_listings,
  (SELECT COUNT(*) FROM public.listings WHERE flagged = true) as flagged_listings,
  (SELECT COUNT(*) FROM public.bookings) as total_bookings,
  (SELECT COUNT(*) FROM public.bookings WHERE status = 'pending') as pending_bookings,
  (SELECT COUNT(*) FROM public.reviews) as total_reviews,
  (SELECT COALESCE(SUM(total_price), 0) FROM public.bookings WHERE status = 'confirmed') as total_revenue;
```

### 4. Get All Activity Logs

```sql
SELECT * FROM public.admin_activity_logs
ORDER BY created_at DESC
LIMIT 100;
```

### 5. Flag a Listing as Inappropriate

```sql
UPDATE public.listings
SET flagged = true, flag_reason = 'Reason for flagging'
WHERE id = 'listing_id';
```

### 6. Unflag a Listing

```sql
UPDATE public.listings
SET flagged = false, flag_reason = NULL
WHERE id = 'listing_id';
```

### 7. Approve/Publish a Listing

```sql
UPDATE public.listings
SET is_published = true
WHERE id = 'listing_id';
```

### 8. Unpublish a Listing

```sql
UPDATE public.listings
SET is_published = false
WHERE id = 'listing_id';
```

### 9. Change User Role

```sql
-- Delete old role
DELETE FROM public.user_roles
WHERE user_id = 'user_id';

-- Insert new role
INSERT INTO public.user_roles (user_id, role)
VALUES ('user_id', 'admin'); -- or 'host' or 'user'
```

### 10. Get All Users with Their Roles

```sql
SELECT 
  p.id,
  p.name,
  p.email,
  ur.role,
  p.created_at
FROM public.profiles p
LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id
ORDER BY p.created_at DESC;
```

### 11. Get Revenue by Date

```sql
SELECT 
  DATE(b.created_at) as date,
  COUNT(*) as bookings,
  COALESCE(SUM(b.total_price), 0) as revenue
FROM public.bookings b
WHERE b.status = 'confirmed'
GROUP BY DATE(b.created_at)
ORDER BY date DESC;
```

### 12. Get Top Listings by Bookings

```sql
SELECT 
  l.id,
  l.title,
  l.location,
  COUNT(b.id) as booking_count,
  COUNT(r.id) as review_count,
  AVG(r.rating) as avg_rating
FROM public.listings l
LEFT JOIN public.bookings b ON l.id = b.listing_id
LEFT JOIN public.reviews r ON l.id = r.listing_id
GROUP BY l.id, l.title, l.location
ORDER BY booking_count DESC
LIMIT 10;
```

### 13. Delete a Listing (Admin)

```sql
DELETE FROM public.listings
WHERE id = 'listing_id';
```

### 14. Update Booking Status

```sql
UPDATE public.bookings
SET status = 'confirmed' -- or 'pending', 'cancelled'
WHERE id = 'booking_id';
```

## Quick Start Steps

1. **Run the migration**
   - Go to Supabase SQL Editor
   - Paste `/supabase/migrations/20260415000000_admin_tables.sql`
   - Execute the query

2. **Assign yourself as admin** (replace with your actual user ID)
   ```sql
   INSERT INTO public.user_roles (user_id, role) 
   VALUES ('your-user-id', 'admin');
   ```

3. **Access admin panel**
   - Navigate to `/admin` on your application
   - You should now have full admin access

## Admin Panel Routes

- `GET /admin` - Main admin dashboard with statistics
- Tabs available:
  - **Dashboard** - Overview and statistics
  - **Users** - Manage users and assign roles
  - **Listings** - Approve/flag/delete listings
  - **Bookings** - Manage booking status
  - **Reviews** - Moderate reviews
  - **Logs** - View admin activity logs

## Admin Panel Features

### Dashboard
- Total users, listings, bookings
- Total revenue
- Pending listings count
- Flagged listings count
- Quick stats and metrics

### Users Management
- View all users
- Search by name or email
- Assign/change roles (admin, host, user)
- View join date

### Listings Management
- View all listings
- Search by title or location
- Publish/unpublish listings
- Flag/unflag inappropriate listings
- Delete listings

### Bookings Management
- View all bookings
- Filter by status (pending, confirmed, cancelled)
- Update booking status
- Delete bookings

### Reviews Management
- View all reviews with ratings
- Search by listing or comment
- Delete inappropriate reviews

### Activity Logs
- View all admin actions
- Filter by action, entity, or admin ID
- Track changes made to database

## Row Level Security (RLS)

The admin panel respects Supabase RLS policies. Only users with the 'admin' role can:
- View activity logs
- Access the admin panel

Regular users cannot access admin operations at the database level, even if they try to bypass the UI.

## Notes

- Always verify admin status before critical operations
- Activity logs are created automatically when admins make changes
- Deleted listings are soft-deleted in the booking/reviews (via CASCADE delete)
- All timestamps are in UTC
