import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Users, Home, Calendar, MessageSquare, DollarSign, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DashboardStats {
  total_users: number;
  total_listings: number;
  pending_listings: number;
  flagged_listings: number;
  total_bookings: number;
  pending_bookings: number;
  total_reviews: number;
  total_revenue: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from("admin_dashboard_stats")
          .select("*")
          .single();

        if (error) {
          console.error("Error fetching stats:", error);
        } else {
          setStats(data);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number | string; color: string }) => (
    <Card className="p-6 rounded-xl border-0 bg-secondary/50 hover:bg-secondary transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading statistics...</div>;
  }

  if (!stats) {
    return <div className="text-center text-destructive">Error loading statistics</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Users} 
          label="Total Users" 
          value={stats.total_users}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard 
          icon={Home} 
          label="Total Listings" 
          value={stats.total_listings}
          color="bg-green-100 text-green-600"
        />
        <StatCard 
          icon={Calendar} 
          label="Total Bookings" 
          value={stats.total_bookings}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard 
          icon={DollarSign} 
          label="Total Revenue" 
          value={formatCurrency(stats.total_revenue as any)}
          color="bg-amber-100 text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 rounded-xl border-0 bg-yellow-50">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-yellow-100">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Listings</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending_listings}</p>
              <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-xl border-0 bg-red-50">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-red-100">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Flagged Listings</p>
              <p className="text-3xl font-bold text-red-600">{stats.flagged_listings}</p>
              <p className="text-xs text-muted-foreground mt-1">Require review</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 rounded-xl border-0 bg-secondary/50">
        <h3 className="text-lg font-bold text-foreground mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Pending Bookings</p>
            <p className="text-2xl font-bold text-foreground">{stats.pending_bookings}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Reviews</p>
            <p className="text-2xl font-bold text-foreground">{stats.total_reviews}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Avg Price/Night</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency((stats.total_revenue as any) / Math.max(stats.total_bookings, 1))}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Approval Rate</p>
            <p className="text-2xl font-bold text-foreground">{stats.total_listings > 0 ? (((stats.total_listings - stats.pending_listings) / stats.total_listings) * 100).toFixed(0) : 0}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
