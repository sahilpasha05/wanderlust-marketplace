import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { categories, mockListings, testimonials } from "@/data/mockListings";
import ListingCard from "@/components/ListingCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredListings = activeCategory
    ? mockListings.filter((l) => l.category === activeCategory)
    : mockListings;

  const handleSearch = () => {
    navigate(`/search?q=${encodeURIComponent(searchLocation)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Travel destination" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/20 to-foreground/60" />
        </div>
        <div className="relative z-10 container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-background mb-4 leading-tight">
              Find your next
              <br />
              <span className="text-primary-foreground">adventure</span>
            </h1>
            <p className="text-lg md:text-xl text-background/80 max-w-xl mx-auto mb-8">
              Discover unique stays and experiences in stunning destinations around the world.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-background rounded-2xl p-2 shadow-xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-secondary transition-colors">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Where to?"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-secondary transition-colors border-l border-border">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Any week</span>
              </div>
              <div className="hidden md:flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-secondary transition-colors border-l border-border">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Guests</span>
              </div>
              <Button onClick={handleSearch} size="lg" className="rounded-xl px-6">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-8 border-b border-border">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                activeCategory === cat.id
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="container py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Featured stays</h2>
            <p className="text-muted-foreground mt-1">Hand-picked properties for an unforgettable experience</p>
          </div>
          <Button variant="outline" className="rounded-full hidden md:flex" onClick={() => navigate("/search")}>
            View all
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Loved by travelers worldwide</h2>
            <p className="text-muted-foreground mt-2">See what our community has to say</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background rounded-2xl p-6 shadow-card"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 md:py-20">
        <div className="bg-foreground rounded-3xl p-8 md:p-16 text-center">
          <h2 className="text-2xl md:text-4xl font-display font-bold text-background mb-4">
            Ready to host on Wanderlust?
          </h2>
          <p className="text-background/70 mb-8 max-w-md mx-auto">
            Share your space with travelers from around the world and start earning.
          </p>
          <Button size="lg" className="rounded-full px-8">
            Start hosting
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
