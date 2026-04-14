import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, Globe, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-background/95 backdrop-blur-md shadow-soft border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className={`text-xl font-display font-bold ${scrolled || !isHome ? "text-foreground" : "text-background"}`}>
            Wanderlust
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { to: "/", label: "Home" },
            { to: "/search", label: "Explore" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                scrolled || !isHome
                  ? "text-foreground hover:bg-secondary"
                  : "text-background/90 hover:text-background hover:bg-background/10"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/search"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all text-sm ${
              scrolled || !isHome
                ? "border-border bg-secondary hover:shadow-medium text-muted-foreground"
                : "border-background/30 bg-background/10 backdrop-blur-sm text-background/80 hover:bg-background/20"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search destinations...</span>
          </Link>
          <Button variant="outline" size="sm" className={`rounded-full ${scrolled || !isHome ? "" : "border-background/30 text-background bg-background/10 hover:bg-background/20"}`}>
            <User className="w-4 h-4 mr-1" />
            Sign in
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 rounded-lg ${scrolled || !isHome ? "text-foreground" : "text-background"}`}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="container py-4 flex flex-col gap-2">
              <Link to="/" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl hover:bg-secondary text-sm font-medium">Home</Link>
              <Link to="/search" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl hover:bg-secondary text-sm font-medium">Explore</Link>
              <Button variant="default" size="sm" className="mt-2 rounded-full">
                <User className="w-4 h-4 mr-1" />
                Sign in
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
