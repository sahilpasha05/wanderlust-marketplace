import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Heart, Share, MapPin, Users, BedDouble, Bath, ChevronLeft, Check, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { mockListings } from "@/data/mockListings";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ListingDetail = () => {
  const { id } = useParams();
  const listing = mockListings.find((l) => l.id === id);
  const [liked, setLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Listing not found</h1>
          <Link to="/" className="text-primary hover:underline text-sm">Back to home</Link>
        </div>
      </div>
    );
  }

  const nights = checkIn && checkOut ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) : 3;
  const subtotal = listing.price * nights;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="container max-w-6xl">
          {/* Back nav */}
          <Link to="/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to search
          </Link>

          {/* Title */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">{listing.title}</h1>
              <div className="flex items-center gap-3 mt-2 text-sm">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-foreground" />
                  <span className="font-medium">{listing.rating}</span>
                  <span className="text-muted-foreground">({listing.reviewCount} reviews)</span>
                </span>
                {listing.isSuperhost && (
                  <span className="px-2 py-0.5 bg-secondary rounded-full text-xs font-medium">Superhost</span>
                )}
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  {listing.location}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="rounded-full gap-1.5">
                <Share className="w-4 h-4" /> Share
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full gap-1.5"
                onClick={() => setLiked(!liked)}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-primary text-primary" : ""}`} /> Save
              </Button>
            </div>
          </div>

          {/* Image gallery */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-10">
            <div className="md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto">
              <img
                src={listing.images[selectedImage]}
                alt={listing.title}
                className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              />
            </div>
            {listing.images.slice(1, 5).map((img, i) => (
              <div key={i} className="hidden md:block aspect-[4/3]">
                <img
                  src={img}
                  alt={`${listing.title} ${i + 2}`}
                  loading="lazy"
                  onClick={() => setSelectedImage(i + 1)}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Host info */}
              <div className="flex items-center justify-between pb-8 border-b border-border">
                <div>
                  <h2 className="text-xl font-display font-semibold text-foreground">Hosted by {listing.hostName}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {listing.maxGuests} guests · {listing.bedrooms} bedrooms · {listing.beds} beds · {listing.bathrooms} baths
                  </p>
                </div>
                <img src={listing.hostAvatar} alt={listing.hostName} className="w-14 h-14 rounded-full object-cover border-2 border-background shadow-medium" />
              </div>

              {/* Quick facts */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Users, label: `${listing.maxGuests} guests` },
                  { icon: BedDouble, label: `${listing.bedrooms} bedrooms` },
                  { icon: Bath, label: `${listing.bathrooms} bathrooms` },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{label}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="pb-8 border-b border-border">
                <h3 className="text-lg font-display font-semibold text-foreground mb-3">About this place</h3>
                <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
              </div>

              {/* Amenities */}
              <div className="pb-8 border-b border-border">
                <h3 className="text-lg font-display font-semibold text-foreground mb-4">What this place offers</h3>
                <div className="grid grid-cols-2 gap-3">
                  {listing.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-3 py-2">
                      <Check className="w-4 h-4 text-success" />
                      <span className="text-sm text-foreground">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-24 bg-background border border-border rounded-2xl p-6 shadow-large"
              >
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-2xl font-display font-bold text-foreground">${listing.price}</span>
                  <span className="text-muted-foreground text-sm">/ night</span>
                </div>

                <div className="border border-border rounded-xl overflow-hidden mb-4">
                  <div className="grid grid-cols-2">
                    <div className="p-3 border-r border-border">
                      <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Check-in</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full text-sm bg-transparent outline-none mt-0.5 text-foreground"
                      />
                    </div>
                    <div className="p-3">
                      <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Check-out</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full text-sm bg-transparent outline-none mt-0.5 text-foreground"
                      />
                    </div>
                  </div>
                  <div className="p-3 border-t border-border">
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Guests</label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full text-sm bg-transparent outline-none mt-0.5 text-foreground"
                    >
                      {Array.from({ length: listing.maxGuests }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button size="lg" className="w-full rounded-xl mb-4">
                  Reserve
                </Button>

                <p className="text-xs text-center text-muted-foreground mb-4">You won't be charged yet</p>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">${listing.price} × {nights} nights</span>
                    <span className="text-foreground">${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service fee</span>
                    <span className="text-foreground">${serviceFee}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">${total}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListingDetail;
