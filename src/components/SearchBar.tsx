import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { searchProducts, allProducts, Product } from "@/data/products";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchBarProps {
  onResultClick?: () => void;
}

const SearchBar = ({ onResultClick }: SearchBarProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    
    // Search in both Ukrainian names and translated names
    const filtered = allProducts.filter((product) => {
      const ukrainianName = product.name.toLowerCase();
      const translatedName = t(product.nameKey).toLowerCase();
      const category = product.category.toLowerCase();
      const translatedCategory = t(getCategoryKey(product.category)).toLowerCase();
      
      return (
        ukrainianName.includes(lowerQuery) ||
        translatedName.includes(lowerQuery) ||
        category.includes(lowerQuery) ||
        translatedCategory.includes(lowerQuery) ||
        matchesKeywords(lowerQuery, product)
      );
    });
    
    setResults(filtered.slice(0, 5));
    setSelectedIndex(-1);
  }, [query, t]);

  const getCategoryKey = (category: string): string => {
    const keys: Record<string, string> = {
      "FPV Дрони": "catFpvDrones",
      "Акумулятори": "catBatteries",
      "Оптоволокно": "catFiberOptic",
      "3D Друк": "cat3dPrinting",
    };
    return keys[category] || category;
  };

  const matchesKeywords = (query: string, product: Product): boolean => {
    const keywords: Record<string, string[]> = {
      "drone": ["дрон", "fpv"],
      "drones": ["дрони", "fpv"],
      "battery": ["акумулятор", "батарея"],
      "batteries": ["акумулятори"],
      "fiber": ["оптоволокно", "волокно"],
      "optic": ["оптоволокно", "оптика"],
      "optical": ["оптоволокно"],
      "spool": ["котушка"],
      "3d": ["3d друк"],
      "print": ["друк"],
      "printing": ["друк"],
    };
    
    for (const [key, values] of Object.entries(keywords)) {
      if (query.includes(key)) {
        const productName = product.name.toLowerCase();
        const productCategory = product.category.toLowerCase();
        for (const value of values) {
          if (productName.includes(value) || productCategory.includes(value)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelectProduct(results[selectedIndex].id);
      } else if (query.length >= 2) {
        handleSearchAll();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleSelectProduct = (productId: number) => {
    navigate(`/product/${productId}`);
    setIsOpen(false);
    setQuery("");
    onResultClick?.();
  };

  const handleSearchAll = () => {
    if (query.length >= 2) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery("");
      onResultClick?.();
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div ref={containerRef} className="relative">
      {!isOpen ? (
        <button
          onClick={handleOpen}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="text-sm hidden lg:block">{t("searchPlaceholder")}</span>
        </button>
      ) : (
        <div className="relative">
          <div className="flex items-center gap-2 bg-[#0a1628] border border-cyan-500/50 rounded-full px-4 py-2 min-w-[280px] lg:min-w-[350px]">
            <Search className="w-4 h-4 text-cyan-400 shrink-0" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={t("searchProductsPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 text-sm text-white placeholder:text-slate-400"
            />
            <button
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
              className="text-slate-400 hover:text-cyan-400 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Autocomplete dropdown */}
          {query.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a1628] border border-cyan-900/50 rounded-xl shadow-xl shadow-cyan-500/10 overflow-hidden z-50">
              {results.length > 0 ? (
                <>
                  <ul className="py-2 max-h-[300px] overflow-y-auto">
                    {results.map((product, index) => (
                      <li key={product.id}>
                        <button
                          onClick={() => handleSelectProduct(product.id)}
                          className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-cyan-500/10 transition-colors ${
                            selectedIndex === index ? "bg-cyan-500/10" : ""
                          }`}
                        >
                          <img 
                            src={product.image} 
                            alt={t(product.nameKey)} 
                            className="w-12 h-12 object-cover rounded-lg bg-slate-800 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{t(product.nameKey)}</p>
                            <p className="text-xs text-slate-400">{t(getCategoryKey(product.category))}</p>
                          </div>
                          <span className="text-sm font-semibold text-cyan-400 shrink-0">
                            {product.price === -1 ? t("priceOnRequest") : `${product.price.toLocaleString()} ₴`}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleSearchAll}
                    className="w-full px-4 py-3 text-sm font-medium text-cyan-400 border-t border-cyan-900/50 hover:bg-cyan-500/10 transition-colors"
                  >
                    {t("showAllResults")} →
                  </button>
                </>
              ) : (
                <div className="p-4">
                  <p className="text-sm text-slate-400 text-center">
                    {t("nothingFoundFor")} "{query}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
