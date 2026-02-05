import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Plane, Battery, Cable, Printer, Menu as MenuIcon, Phone, ChevronRight, Settings, Package, Radio } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import SearchBar from "./SearchBar";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const categories = [
    { name: t("uavKits"), icon: Package, slug: "БпАК" },
    { name: t("fpvDrones"), icon: Plane, slug: "FPV Дрони" },
    { name: t("groundStationsCategory"), icon: Radio, slug: "Наземні станції" },
    { name: t("batteries"), icon: Battery, slug: "Акумулятори" },
    { name: t("fiberSpools"), icon: Cable, slug: "Котушки з оптоволокном" },
    { name: t("printing3d"), icon: Printer, slug: "3D Друк" },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Burger Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10"
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon className="w-6 h-6" />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Slide-out Menu */}
      <div 
        className={`fixed top-0 right-0 h-[100dvh] w-[85%] max-w-sm bg-gradient-to-b from-[#0a1628] to-[#050d18] z-[101] transform transition-transform duration-300 ease-out md:hidden flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 shrink-0">
          <span className="text-lg font-bold text-white">{t("menu")}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10"
            onClick={closeMenu}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Search */}
          <div className="p-4 border-b border-cyan-500/20">
            <SearchBar onResultClick={closeMenu} />
          </div>

          {/* Categories */}
          <div className="p-4">
            <h3 className={`text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ transitionDelay: '100ms' }}>{t("catalog")}</h3>
            <nav className="space-y-1">
              <Link 
                to="/search" 
                onClick={closeMenu}
                className={`flex items-center justify-between p-3 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/10 transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{ transitionDelay: '150ms' }}
              >
                <div className="flex items-center gap-3">
                  <MenuIcon className="w-5 h-5 text-cyan-400" />
                  <span className="font-medium">{t("allProducts")}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-cyan-500/50" />
              </Link>
              {categories.map((category, index) => (
                <Link 
                  key={category.slug}
                  to={`/search?category=${encodeURIComponent(category.slug)}`}
                  onClick={closeMenu}
                  className={`flex items-center justify-between p-3 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/10 transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  style={{ transitionDelay: `${200 + index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="w-5 h-5 text-cyan-400" />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cyan-500/50" />
                </Link>
              ))}
              
              {/* Configurator Link */}
              <Link 
                to="/configurator" 
                onClick={closeMenu}
                className={`flex items-center justify-between p-3 rounded-lg text-slate-300 hover:text-white hover:bg-cyan-500/10 transition-all duration-300 mt-4 border-t border-cyan-500/20 pt-4 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{ transitionDelay: '450ms' }}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-cyan-400" />
                  <span className="font-medium">{t("configurator")}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-cyan-500/50" />
              </Link>
            </nav>
          </div>

          {/* Language Switcher */}
          <div className={`p-4 border-t border-cyan-500/20 transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ transitionDelay: '500ms' }}>
            <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">{t("language")}</h3>
            <div className="flex gap-2">
              <Button 
                variant={language === "uk" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("uk")}
                className={language === "uk" 
                  ? "flex-1 bg-cyan-500 hover:bg-cyan-600 text-white" 
                  : "flex-1 border-cyan-500/30 text-slate-300 hover:bg-cyan-500/10"
                }
              >
                <span className="mr-2">🇺🇦</span> Українська
              </Button>
              <Button 
                variant={language === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("en")}
                className={language === "en" 
                  ? "flex-1 bg-cyan-500 hover:bg-cyan-600 text-white" 
                  : "flex-1 border-cyan-500/30 text-slate-300 hover:bg-cyan-500/10"
                }
              >
                <span className="mr-2">🇬🇧</span> English
              </Button>
            </div>
          </div>

          {/* Social Media */}
          <div className={`p-4 border-t border-cyan-500/20 transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ transitionDelay: '550ms' }}>
            <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">{t("socialMedia")}</h3>
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/share/1AspSFo9s3/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/flugart_ua/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://t.me/flugart_ua" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default MobileMenu;
