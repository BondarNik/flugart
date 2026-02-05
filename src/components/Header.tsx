import { Menu, Phone, ShoppingCart, ChevronDown, Plane, Battery, Cable, Printer, Globe, Heart, Settings, Package, Radio } from "lucide-react";
import flugartIcon from "@/assets/flugart-icon.png";
import { Button } from "./ui/button";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useLanguage } from "@/contexts/LanguageContext";
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Header = () => {
  const { totalItems, openDrawer } = useCart();
  const { favoritesCount } = useFavorites();
  const { language, setLanguage, t } = useLanguage();

  const categories = [
    { name: t("uavKits"), icon: Package, slug: "БпАК" },
    { name: t("fpvDrones"), icon: Plane, slug: "FPV Дрони" },
    { name: t("groundStationsCategory"), icon: Radio, slug: "Наземні станції" },
    { name: t("batteries"), icon: Battery, slug: "Акумулятори" },
    { name: t("fiberSpools"), icon: Cable, slug: "Котушки з оптоволокном" },
    { name: t("printing3d"), icon: Printer, slug: "3D Друк" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#0a1628] via-[#0d1d35] to-[#0a1628] backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-cyan-500/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={flugartIcon} alt="Flugart" className="h-9 w-auto transition-transform group-hover:scale-105" />
            <span className="text-xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent tracking-wide">Flugart</span>
          </Link>

          {/* Catalog Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hidden md:flex items-center gap-2 rounded-full px-5 py-2 bg-gradient-to-r from-cyan-500/20 to-cyan-400/10 border-cyan-400/40 text-cyan-300 hover:from-cyan-500/30 hover:to-cyan-400/20 hover:text-white hover:border-cyan-400/60 transition-all duration-300 shadow-sm shadow-cyan-500/10">
                <Menu className="w-4 h-4" />
                <span className="font-medium">{t("catalog")}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-[#0a1628] border border-cyan-900/50 shadow-xl shadow-cyan-500/10 z-50">
              <DropdownMenuItem asChild className="text-slate-300 hover:text-cyan-400 focus:text-cyan-400 focus:bg-cyan-500/10">
                <Link to="/search" className="flex items-center gap-3 px-3 py-2.5 cursor-pointer">
                  <Menu className="w-4 h-4 text-cyan-400" />
                  <span className="font-medium">{t("allProducts")}</span>
                </Link>
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem key={category.slug} asChild className="text-slate-300 hover:text-cyan-400 focus:text-cyan-400 focus:bg-cyan-500/10">
                  <Link 
                    to={`/search?category=${encodeURIComponent(category.slug)}`} 
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer"
                  >
                    <category.icon className="w-4 h-4 text-cyan-400" />
                    <span>{category.name}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Configurator Link */}
          <Link 
            to="/configurator" 
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-cyan-300 hover:text-white hover:bg-cyan-500/20 transition-all duration-300 font-medium"
          >
            <Settings className="w-4 h-4" />
            <span>{t("configurator")}</span>
          </Link>

          {/* Search */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 px-2">
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 bg-[#0a1628] border border-cyan-900/50 shadow-xl shadow-cyan-500/10 z-50">
                <DropdownMenuItem 
                  onClick={() => setLanguage("uk")}
                  className={`text-slate-300 hover:text-cyan-400 focus:text-cyan-400 focus:bg-cyan-500/10 cursor-pointer ${language === "uk" ? "text-cyan-400 bg-cyan-500/10" : ""}`}
                >
                  <span className="mr-2">🇺🇦</span>
                  Українська
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage("en")}
                  className={`text-slate-300 hover:text-cyan-400 focus:text-cyan-400 focus:bg-cyan-500/10 cursor-pointer ${language === "en" ? "text-cyan-400 bg-cyan-500/10" : ""}`}
                >
                  <span className="mr-2">🇬🇧</span>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>


            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-all"
              onClick={() => openDrawer("favorites")}
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center bg-red-500 text-white">
                  {favoritesCount}
                </span>
              )}
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all"
              onClick={() => openDrawer("cart")}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center bg-cyan-500 text-white animate-pulse">
                  {totalItems}
                </span>
              )}
            </Button>

            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
