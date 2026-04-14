-- Admin Activity Log Table
CREATE TABLE public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  changes JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view activity logs" ON public.admin_activity_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Listings Approval Column (for moderation)
ALTER TABLE public.listings 
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS flagged BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS flag_reason TEXT;

-- Function to log admin activities
CREATE OR REPLACE FUNCTION public.log_admin_activity(
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_changes JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO admin_activity_logs (admin_id, action, entity_type, entity_id, changes)
  VALUES (auth.uid(), p_action, p_entity_type, p_entity_id, p_changes);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- View for admin dashboard stats
CREATE OR REPLACE VIEW public.admin_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM public.profiles) as total_users,
  (SELECT COUNT(*) FROM public.listings) as total_listings,
  (SELECT COUNT(*) FROM public.listings WHERE is_approved = false) as pending_listings,
  (SELECT COUNT(*) FROM public.listings WHERE flagged = true) as flagged_listings,
  (SELECT COUNT(*) FROM public.bookings) as total_bookings,
  (SELECT COUNT(*) FROM public.bookings WHERE status = 'pending') as pending_bookings,
  (SELECT COUNT(*) FROM public.reviews) as total_reviews,
  (SELECT COALESCE(SUM(total_price), 0) FROM public.bookings WHERE status = 'confirmed') as total_revenue;

-- Ensure the admin role exists in user_roles
-- This is handled by application logic when assigning admin role
