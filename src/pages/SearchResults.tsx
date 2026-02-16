import { useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { allProducts } from "@/data/products";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categoryTranslationKeys: Record<string, string> = {
  "FPV Дрони": "catFpvDrones",
  "Котушки": "fiberSpools",
  "БпАК": "uavKits",
  "Наземні станції": "groundStationsCategory",
  "Акумулятори": "batteries",
  "Котушки з оптоволокном": "fiberSpools",
  "3D Друк": "printing3d",
};

const searchKeywords: Record<string, string[]> = {
  "drone": ["дрон", "fpv", "тайпан", "мамба"],
  "drones": ["дрони", "fpv", "тайпан", "мамба"],
  "taipan": ["тайпан"],
  "mamba": ["мамба"],
  "thermal": ["тепловізійна", "тепловізор", "термальна"],
  "fiber": ["оптоволокно", "волокно", "котушка"],
  "optic": ["оптоволокно", "оптика"],
  "optical": ["оптоволокно"],
  "spool": ["котушка"],
  "carbon": ["карбон"],
  "rotary": ["поворотна"],
  "printer": ["принтер", "3d принтер", "друк"],
  "3d": ["3d принтер", "3d друк", "принтер"],
  "bambu": ["bambu", "bambu lab"],
  "creality": ["creality", "halot"],
  "battery": ["акумулятор", "батарея"],
  "batteries": ["акумулятори", "батареї"],
};

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const { t, language } = useLanguage();
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const results = useMemo(() => {
    let products = allProducts;
    
    if (query && query.length >= 2) {
      const lowerQuery = query.toLowerCase();
      
      products = allProducts.filter((product) => {
        const ukrainianName = product.name.toLowerCase();
        const englishName = product.nameEn.toLowerCase();
        const categoryName = product.category.toLowerCase();
        
        if (
          ukrainianName.includes(lowerQuery) ||
          englishName.includes(lowerQuery) ||
          categoryName.includes(lowerQuery)
        ) {
          return true;
        }
        
        for (const [key, values] of Object.entries(searchKeywords)) {
          if (lowerQuery.includes(key)) {
            for (const value of values) {
              if (ukrainianName.includes(value) || englishName.includes(value)) {
                return true;
              }
            }
          }
        }
        
        return false;
      });
    }
    
    if (category) {
      products = products.filter((p) => p.category === category);
    }

    // Apply sorting
    const sortedProducts = [...products];
    switch (sortBy) {
      case "price-asc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sortedProducts.sort((a, b) => {
          const nameA = language === 'en' ? a.nameEn : a.name;
          const nameB = language === 'en' ? b.nameEn : b.name;
          return nameA.localeCompare(nameB);
        });
        break;
      case "name-desc":
        sortedProducts.sort((a, b) => {
          const nameA = language === 'en' ? a.nameEn : a.name;
          const nameB = language === 'en' ? b.nameEn : b.name;
          return nameB.localeCompare(nameA);
        });
        break;
      default:
        break;
    }
    
    return sortedProducts;
  }, [query, category, sortBy, language]);

  const categories = [...new Set(allProducts.map((p) => p.category))];

  const getProductsText = (count: number) => {
    if (count === 1) return t("product");
    if (count >= 2 && count <= 4) return t("products234");
    return t("products5plus");
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case "price-asc":
        return t("priceAsc");
      case "price-desc":
        return t("priceDesc");
      case "name-asc":
        return t("nameAz");
      case "name-desc":
        return t("nameZa");
      default:
        return t("defaultSort");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <a href="/" className="hover:text-primary transition-colors">{t("home")}</a>
            <span>/</span>
            <span className="text-foreground">{t("search")}</span>
            {query && (
              <>
                <span>/</span>
                <span className="text-foreground">"{query}"</span>
              </>
            )}
          </nav>

          {/* Header with sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {query ? `${t("searchResults")}: "${query}"` : category ? t(categoryTranslationKeys[category] || category) : t("allProducts")}
              </h1>
              <p className="text-muted-foreground">
                {t("foundProducts")}: {results.length} {getProductsText(results.length)}
              </p>
            </div>
            
            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-[200px] bg-muted/30 border-border">
                  <SelectValue placeholder={getSortLabel("default")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    {getSortLabel("default")}
                  </SelectItem>
                  <SelectItem value="price-asc">
                    <span className="flex items-center gap-2">
                      <ArrowUp className="w-3 h-3" />
                      {getSortLabel("price-asc")}
                    </span>
                  </SelectItem>
                  <SelectItem value="price-desc">
                    <span className="flex items-center gap-2">
                      <ArrowDown className="w-3 h-3" />
                      {getSortLabel("price-desc")}
                    </span>
                  </SelectItem>
                  <SelectItem value="name-asc">
                    {getSortLabel("name-asc")}
                  </SelectItem>
                  <SelectItem value="name-desc">
                    {getSortLabel("name-desc")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar filters */}
            <aside className="w-full lg:w-64 shrink-0">
              <div className="bg-muted/30 rounded-2xl p-5">
                <h3 className="font-semibold text-foreground mb-4">{t("categories")}</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href={`/search${query ? `?q=${encodeURIComponent(query)}` : ""}`}
                      className={`block py-2 px-3 rounded-lg transition-colors ${
                        !category ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {t("allCategories")}
                    </a>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat}>
                      <a
                        href={`/search?${query ? `q=${encodeURIComponent(query)}&` : ""}category=${encodeURIComponent(cat)}`}
                        className={`block py-2 px-3 rounded-lg transition-colors ${
                          category === cat ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {t(categoryTranslationKeys[cat] || cat)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Results grid */}
            <div className="flex-1">
              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      image={product.image}
                      title={language === 'en' ? product.nameEn : product.name}
                      price={product.price}
                      oldPrice={product.oldPrice}
                      category={product.category}
                      badge={product.badge}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {t("nothingFound")}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {t("tryChangingSearch")}
                  </p>
                  <a
                    href="/"
                    className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors"
                  >
                    {t("toHome")}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
