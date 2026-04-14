import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Heart, Settings, MapPin, LogOut, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [bookings, setBookings] = useState<(Tables<"bookings"> & { listings: Tables<"listings"> | null })[]>([]);
  const [wishlist, setWishlist] = useState<(Tables<"wishlist"> & { listings: Tables<"listings"> | null })[]>([]);
  const [name, setName] = useState(profile?.name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    supabase
      .from("bookings")
      .select("*, listings(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setBookings(data as any);
      });

    supabase
      .from("wishlist")
      .select("*, listings(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setWishlist(data as any);
      });
  }, [user]);

  useEffect(() => {
    setName(profile?.name || "");
    setBio(profile?.bio || "");
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name, bio })
      .eq("user_id", user.id);
    if (error) toast.error("Failed to update profile");
    else toast.success("Profile updated!");
    setSaving(false);
  };

  const removeFromWishlist = async (id: string) => {
    const { error } = await supabase.from("wishlist").delete().eq("id", id);
    if (!error) {
      setWishlist((prev) => prev.filter((w) => w.id !== id));
      toast.success("Removed from wishlist");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold mb-2">Sign in to view your dashboard</h1>
            <Link to="/auth">
              <Button className="rounded-full mt-4">Sign in</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Welcome back{profile?.name ? `, ${profile.name}` : ""}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">{profile?.email}</p>
            </div>
            <Button variant="outline" className="rounded-full gap-2" onClick={signOut}>
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          </div>

          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="bg-secondary rounded-xl p-1">
              <TabsTrigger value="bookings" className="rounded-lg gap-2 data-[state=active]:bg-background">
                <Calendar className="w-4 h-4" /> Bookings
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="rounded-lg gap-2 data-[state=active]:bg-background">
                <Heart className="w-4 h-4" /> Wishlist
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-lg gap-2 data-[state=active]:bg-background">
                <Settings className="w-4 h-4" /> Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              {bookings.length === 0 ? (
                <div className="text-center py-16 bg-secondary rounded-2xl">
                  <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-display font-semibold text-foreground mb-1">No bookings yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Start exploring and book your first stay</p>
                  <Link to="/search"><Button className="rounded-full">Explore stays</Button></Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => (
                    <div key={b.id} className="bg-background border border-border rounded-2xl p-5 flex gap-4">
                      {b.listings?.images?.[0] && (
                        <img src={b.listings.images[0]} alt="" className="w-24 h-24 rounded-xl object-cover shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{b.listings?.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5" /> {b.listings?.location}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-muted-foreground">{b.check_in} → {b.check_out}</span>
                          <span className="font-medium text-foreground">${b.total_price}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            b.status === "confirmed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                          }`}>
                            {b.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="wishlist">
              {wishlist.length === 0 ? (
                <div className="text-center py-16 bg-secondary rounded-2xl">
                  <Heart className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-display font-semibold text-foreground mb-1">No saved stays</h3>
                  <p className="text-sm text-muted-foreground mb-4">Heart a listing to save it here</p>
                  <Link to="/search"><Button className="rounded-full">Browse stays</Button></Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((w) => (
                    <div key={w.id} className="bg-background border border-border rounded-2xl overflow-hidden">
                      {w.listings?.images?.[0] && (
                        <img src={w.listings.images[0]} alt="" className="w-full h-40 object-cover" />
                      )}
                      <div className="p-4">
                        <h3 className="font-medium text-foreground text-sm truncate">{w.listings?.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{w.listings?.location}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-semibold">${w.listings?.price_per_night}/night</span>
                          <Button variant="ghost" size="sm" className="text-xs rounded-full" onClick={() => removeFromWishlist(w.id)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings">
              <div className="bg-secondary rounded-2xl p-6 space-y-5 max-w-md">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Bio</label>
                  <Input value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself" className="rounded-xl" />
                </div>
                <Button className="rounded-xl" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
