import { Link } from "react-router-dom";
import { Globe, Instagram, Twitter, Facebook } from "lucide-react";

const Footer = () => {
  const links = {
    Explore: ["Search", "Categories", "Popular Destinations", "Last Minute Deals"],
    Hosting: ["Become a Host", "Host Resources", "Community Forum", "Responsible Hosting"],
    Support: ["Help Center", "Safety", "Cancellation Policy", "Accessibility"],
    Company: ["About Us", "Careers", "Press", "Blog"],
  };

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-display font-bold text-foreground">Wanderlust</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover unique stays and experiences around the world.
            </p>
            <div className="flex gap-3 mt-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-foreground mb-3 text-sm">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2026 Wanderlust. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Sitemap"].map((item) => (
              <a key={item} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
