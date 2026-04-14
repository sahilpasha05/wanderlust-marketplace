import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Listing } from "@/data/mockListings";

interface ListingCardProps {
  listing: Listing;
  index?: number;
}

const ListingCard = ({ listing, index = 0 }: ListingCardProps) => {
  const [liked, setLiked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { user } = useAuth();

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Sign in to save listings");
      return;
    }
    if (liked) {
      await supabase.from("wishlist").delete().eq("user_id", user.id).eq("listing_id", listing.id);
      setLiked(false);
      toast.success("Removed from wishlist");
    } else {
      await supabase.from("wishlist").insert({ user_id: user.id, listing_id: listing.id });
      setLiked(true);
      toast.success("Added to wishlist");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/listing/${listing.id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-muted">
          {!imgLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
          <img
            src={listing.images[0]}
            alt={listing.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
          >
            <Heart className={`w-4 h-4 transition-colors ${liked ? "fill-primary text-primary" : "text-foreground"}`} />
          </button>
          {listing.isSuperhost && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-medium text-foreground">
              Superhost
            </span>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground text-sm truncate pr-2">{listing.title}</h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 fill-foreground text-foreground" />
              <span className="text-sm font-medium">{listing.rating}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{listing.location}</p>
          <p className="text-sm">
            <span className="font-semibold text-foreground">${listing.price}</span>
            <span className="text-muted-foreground"> / night</span>
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ListingCard;
