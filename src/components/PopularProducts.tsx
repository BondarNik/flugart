import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { allProducts } from "@/data/products";

const PopularProducts = () => {
  const { t, language } = useLanguage();
  
  // Get first 6 products for popular section
  const popularProducts = allProducts.slice(0, 6);
  
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t("popularProducts")}
          </h2>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {popularProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              id={String(product.id)}
              image={product.image}
              title={language === 'en' ? product.nameEn : product.name}
              price={product.price}
              oldPrice={product.oldPrice}
              category={product.category}
              badge={product.badge}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
