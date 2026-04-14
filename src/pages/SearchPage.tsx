import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { mockListings, categories } from "@/data/mockListings";
import ListingCard from "@/components/ListingCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const amenitiesList = ["WiFi", "Pool", "Kitchen", "Air conditioning", "Free parking", "Hot tub", "Fireplace", "Beach access"];

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  const filtered = useMemo(() => {
    return mockListings.filter((l) => {
      if (query && !l.title.toLowerCase().includes(query.toLowerCase()) && !l.location.toLowerCase().includes(query.toLowerCase()) && !l.country.toLowerCase().includes(query.toLowerCase()))
        return false;
      if (l.price < priceRange[0] || l.price > priceRange[1]) return false;
      if (selectedCategory && l.category !== selectedCategory) return false;
      if (minRating && l.rating < minRating) return false;
      if (selectedAmenities.length > 0 && !selectedAmenities.every((a) => l.amenities.includes(a))) return false;
      return true;
    });
  }, [query, priceRange, selectedCategory, selectedAmenities, minRating]);

  const toggleAmenity = (a: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedCategory(null);
    setSelectedAmenities([]);
    setMinRating(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                {query ? `Results for "${query}"` : "Explore all stays"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">{filtered.length} properties found</p>
            </div>
            <Button variant="outline" className="rounded-full gap-2" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Categories bar */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.id
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex gap-8">
            {/* Filters sidebar */}
            {showFilters && (
              <div className="hidden md:block w-64 shrink-0">
                <div className="sticky top-24 space-y-6 p-5 bg-secondary rounded-2xl">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold text-foreground">Filters</h3>
                    <button onClick={clearFilters} className="text-xs text-primary hover:underline">Clear all</button>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Price range: ${priceRange[0]} – ${priceRange[1]}
                    </label>
                    <Slider
                      min={0}
                      max={1000}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">Min rating</label>
                    <div className="flex gap-2">
                      {[0, 4, 4.5, 4.8].map((r) => (
                        <button
                          key={r}
                          onClick={() => setMinRating(r)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            minRating === r ? "bg-foreground text-background" : "bg-background text-foreground"
                          }`}
                        >
                          {r === 0 ? "Any" : `${r}+`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">Amenities</label>
                    <div className="space-y-2.5">
                      {amenitiesList.map((a) => (
                        <label key={a} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={selectedAmenities.includes(a)}
                            onCheckedChange={() => toggleAmenity(a)}
                          />
                          <span className="text-sm text-foreground">{a}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results grid */}
            <div className="flex-1">
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-lg font-medium text-foreground mb-2">No results found</p>
                  <p className="text-muted-foreground text-sm mb-4">Try adjusting your filters or search query</p>
                  <Button variant="outline" className="rounded-full" onClick={clearFilters}>Clear filters</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((l, i) => (
                    <ListingCard key={l.id} listing={l} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchPage;
