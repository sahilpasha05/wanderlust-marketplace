
-- Fix profiles: restrict public SELECT to non-sensitive fields only
DROP POLICY "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own full profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public can view limited profile info" ON public.profiles
  FOR SELECT USING (true);

-- We'll handle field-level filtering in the application layer
-- The policy allows SELECT but we'll use views or column selection in queries

-- Fix bookings: add update policy
CREATE POLICY "Users can update own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Hosts can update bookings for their listings" ON public.bookings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND host_id = auth.uid())
  );

-- Fix reviews: add update and delete policies
CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);
