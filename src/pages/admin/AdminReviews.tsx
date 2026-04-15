import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

interface ReviewWithDetails extends Tables<"reviews"> {
  listings?: Tables<"listings">;
  profiles?: { name: string; email: string };
  reviewer_name?: string;
}

const dummyReviews: ReviewWithDetails[] = [
  {
    id: "dummy-review-1",
    user_id: "dummy-user-saad-1",
    listing_id: "9ae0c280-40c3-4748-9410-ed36306050a6",
    rating: 5,
    comment: "Amazing stay! Everything was clean and well organized.",
    created_at: new Date().toISOString(),
    reviewer_name: "saad",
  },
  {
    id: "dummy-review-2",
    user_id: "dummy-user-ansh-1",
    listing_id: "9ae0c280-40c3-4748-9410-ed36306050a6",
    rating: 4,
    comment: "Great experience overall, just minor issues but nothing major.",
    created_at: new Date().toISOString(),
    reviewer_name: "ansh",
  },
  {
    id: "dummy-review-3",
    user_id: "dummy-user-saad-2",
    listing_id: "9ae0c280-40c3-4748-9410-ed36306050a6",
    rating: 3,
    comment: "Decent place, but could improve on maintenance.",
    created_at: new Date().toISOString(),
    reviewer_name: "saad",
  },
  {
    id: "dummy-review-4",
    user_id: "dummy-user-ansh-2",
    listing_id: "9ae0c280-40c3-4748-9410-ed36306050a6",
    rating: 5,
    comment: "Loved the ambience and location. Would definitely recommend!",
    created_at: new Date().toISOString(),
    reviewer_name: "ansh",
  },
];

const AdminReviews = () => {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("*, listings(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews([...(dummyReviews as ReviewWithDetails[]), ...(data || [])]);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews(dummyReviews);
      toast.error("Failed to load reviews, showing demo reviews");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;

    try {
      setDeletingId(reviewId);
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      toast.success("Review deleted");
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReviews = reviews.filter(
    (review) =>
      review.listings?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${
            star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Input
          placeholder="Search by listing or comment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-xl"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <Card key={review.id} className="p-6 rounded-xl border-0 bg-secondary/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1">
                    {review.reviewer_name || review.profiles?.name || "Guest"}
                  </p>
                  <p className="font-semibold text-foreground mb-1">
                    {review.listings?.title || "Listing deleted"}
                  </p>
                  <div className="flex items-center gap-3">
                    <RatingStars rating={review.rating} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="rounded-lg h-8"
                  onClick={() => deleteReview(review.id)}
                  disabled={deletingId === review.id}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              {review.comment && (
                <p className="text-sm text-muted-foreground bg-secondary rounded-lg p-3 mt-3">
                  "{review.comment}"
                </p>
              )}
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No reviews found
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        Showing {filteredReviews.length} of {reviews.length} reviews
      </div>
    </div>
  );
};

export default AdminReviews;
