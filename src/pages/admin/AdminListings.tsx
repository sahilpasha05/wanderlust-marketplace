import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, Eye, Flag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

interface ListingWithHost extends Tables<"listings"> {
  host_profile?: { name: string; email: string };
}

const AdminListings = () => {
  const [listings, setListings] = useState<ListingWithHost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toggleId, setToggleId] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (err) {
      console.error("Error fetching listings:", err);
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (listingId: string, isPublished: boolean) => {
    try {
      setToggleId(listingId);
      const { error } = await supabase
        .from("listings")
        .update({ is_published: !isPublished })
        .eq("id", listingId);

      if (error) throw error;

      setListings((prev) =>
        prev.map((l) =>
          l.id === listingId ? { ...l, is_published: !isPublished } : l
        )
      );

      toast.success(
        `Listing ${!isPublished ? "published" : "unpublished"}`
      );
    } catch (err) {
      console.error("Error toggling published status:", err);
      toast.error("Failed to update listing");
    } finally {
      setToggleId(null);
    }
  };

  const toggleFlagged = async (listingId: string, flagged: boolean) => {
    try {
      setToggleId(listingId);
      const { error } = await supabase
        .from("listings")
        .update({ flagged: !flagged })
        .eq("id", listingId);

      if (error) throw error;

      setListings((prev) =>
        prev.map((l) =>
          l.id === listingId ? { ...l, flagged: !flagged } : l
        )
      );

      toast.success(
        `Listing ${!flagged ? "flagged" : "unflagged"}`
      );
    } catch (err) {
      console.error("Error toggling flag:", err);
      toast.error("Failed to update listing");
    } finally {
      setToggleId(null);
    }
  };

  const deleteListing = async (listingId: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;

    try {
      setDeletingId(listingId);
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listingId);

      if (error) throw error;

      setListings((prev) => prev.filter((l) => l.id !== listingId));
      toast.success("Listing deleted");
    } catch (err) {
      console.error("Error deleting listing:", err);
      toast.error("Failed to delete listing");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredListings = listings.filter(
    (listing) =>
      listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading listings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Input
          placeholder="Search by title, location, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-xl"
        />
      </div>

      <Card className="rounded-xl border-0 bg-secondary/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground">Flags</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <tr key={listing.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground text-sm max-w-xs truncate">
                        {listing.title}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">
                        {listing.city}, {listing.country}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">
                        {formatCurrency(listing.price_per_night)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`border-0 cursor-pointer ${
                          listing.is_published
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                        onClick={() =>
                          togglePublished(listing.id, listing.is_published || false)
                        }
                      >
                        {listing.is_published ? "Published" : "Unpublished"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {listing.flagged ? (
                        <Badge className="bg-red-100 text-red-700 border-0 cursor-pointer">
                          <Flag className="w-3 h-3 mr-1" />
                          Flagged
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg h-8"
                        onClick={() =>
                          toggleFlagged(listing.id, listing.flagged || false)
                        }
                        disabled={toggleId === listing.id}
                      >
                        <Flag className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-lg h-8"
                        onClick={() => deleteListing(listing.id)}
                        disabled={deletingId === listing.id}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No listings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="text-xs text-muted-foreground">
        Showing {filteredListings.length} of {listings.length} listings
      </div>
    </div>
  );
};

export default AdminListings;
