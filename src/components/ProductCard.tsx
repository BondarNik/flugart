import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductCardProps {
  id?: number | string;
  image: string;
  category?: string;
  title?: string;
  price: number;
  oldPrice?: number;
  badge?: string;
}

const categoryTranslationKeys: Record<string, string> = {
  "FPV Дрони": "catFpvDrones",
  "Котушки": "fiberSpools",
  "БпАК": "uavKits",
  "Наземні станції": "groundStationsCategory",
};

const ProductCard = ({ id = 1, image, category, title = "", price, oldPrice, badge }: ProductCardProps) => {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const productId = String(id);
  const isProductFavorite = isFavorite(productId);
  
  
  const translatedCategory = category ? t(categoryTranslationKeys[category] || category) : undefined;

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/product/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: t("linkCopied"), description: title });
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast({ title: t("linkCopied"), description: title });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id: productId, image, category, title, price, oldPrice });
    toast({
      title: t("addedToCart"),
      description: title,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    toggleFavorite({
      id: productId,
      title,
      price,
      oldPrice,
      image,
      category: category || "",
    });
    toast({
      title: isProductFavorite ? t("removedFromFavorites") : t("addedToFavorites"),
      description: title,
    });
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="bg-card rounded-xl p-4 product-card-hover border border-border group flex flex-col h-full relative">
      {/* Badge */}
      {badge && (
        <div className="absolute top-2 left-2 z-30 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded shadow-md">
          {badge}
        </div>
      )}
      {/* Action Buttons - Outside the Link */}
      <div className="absolute top-6 right-6 z-20 flex gap-2">
        <button
          onClick={handleShare}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 bg-background/80 text-muted-foreground hover:bg-background hover:text-primary"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleToggleFavorite}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            isProductFavorite 
              ? "bg-red-500 text-white" 
              : "bg-background/80 text-muted-foreground hover:bg-background hover:text-red-500"
          } ${isAnimating ? "scale-125" : "scale-100"}`}
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-300 ${
              isProductFavorite ? "fill-current" : ""
            } ${isAnimating ? "animate-pulse" : ""}`} 
          />
        </button>
      </div>

      {/* Image */}
      <Link to={`/product/${id}`} className="block relative h-48 mb-4 overflow-hidden rounded-lg bg-background">
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-sale text-primary-foreground text-xs font-bold px-2 py-1 rounded-md z-10">
            -{discount}%
          </span>
        )}
        
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        {/* Category - fixed height */}
        <div className="h-5 mb-1">
          {translatedCategory && (
            <span className="text-xs font-medium text-primary">{translatedCategory}</span>
          )}
        </div>
        
        {/* Title - fixed height with vertical scroll */}
        <Link to={`/product/${id}`} className="block h-10 mb-2 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <h3 className="font-semibold text-foreground text-sm leading-tight hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        {/* Stock availability - hide for price on request products */}
        {price !== -1 && (
          <div className="text-xs text-primary font-medium mb-2">
            ✓ {t("inStock") || "В наявності"}
          </div>
        )}

        {/* Price - fixed height */}
        <div className="flex items-center gap-2 min-h-7 mb-2">
          {price === -1 ? (
            category !== "3D Друк" && (
              <span className="text-sm font-medium">
                {t("estimatedPrice")}: <span className="text-orange-400">{t("dependsOnOrder")}</span>
              </span>
            )
          ) : (
            <>
              <span className="text-lg font-bold text-foreground">
                {price.toLocaleString()} ₴
              </span>
              {oldPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {oldPrice.toLocaleString()} ₴
                </span>
              )}
            </>
          )}
        </div>

        {/* Add to Cart - pushed to bottom, hidden for 3D printing category */}
        {category !== "3D Друк" && (
          <div className="mt-auto">
            <Button onClick={handleAddToCart} className="w-full btn-teal rounded-lg font-semibold">
              <ShoppingCart className="w-4 h-4 mr-2" />
              {t("addToCart")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
