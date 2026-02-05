import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, Heart, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useLanguage } from "@/contexts/LanguageContext";

const CartDrawer = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    totalSavings,
    isCartOpen,
    setIsCartOpen,
    addItem,
    activeTab,
    setActiveTab,
  } = useCart();
  const { favorites, removeFromFavorites, favoritesCount } = useFavorites();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  const handleAddToCartFromFavorites = (item: typeof favorites[0]) => {
    addItem({
      id: item.id,
      title: item.title,
      price: item.price,
      oldPrice: item.oldPrice,
      image: item.image,
      category: item.category,
    }, 1);
    removeFromFavorites(item.id);
    setActiveTab("cart");
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "cart" | "favorites")} className="flex flex-col h-full">
          <div className="px-6 pt-6 pb-2">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="cart" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                {t("cart")} ({totalItems})
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                {t("favorites")} ({favoritesCount})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Cart Tab */}
          <TabsContent value="cart" className="flex-1 flex flex-col mt-0 px-6">
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {t("cartEmpty")}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {t("addProductsToOrder")}
                </p>
                <Button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-teal rounded-lg"
                >
                  {t("continueShopping")}
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-end py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    {t("clear")}
                  </Button>
                </div>
                
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-3 bg-muted/50 rounded-xl"
                      >
                        {/* Image */}
                        <Link
                          to={`/product/${item.id}`}
                          onClick={() => setIsCartOpen(false)}
                          className="w-20 h-20 rounded-lg overflow-hidden bg-background shrink-0"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.id}`}
                            onClick={() => setIsCartOpen(false)}
                            className="font-medium text-sm text-foreground line-clamp-2 hover:text-primary transition-colors"
                          >
                            {item.title}
                          </Link>
                          
                          <div className="flex items-center gap-2 mt-1">
                            {item.price === -1 ? (
                              <span className="text-xs font-medium text-orange-400">
                                {t("dependsOnOrder")}
                              </span>
                            ) : (
                              <>
                                <span className="font-bold text-foreground">
                                  {item.price.toLocaleString()} ₴
                                </span>
                                {item.oldPrice && (
                                  <span className="text-xs text-muted-foreground line-through">
                                    {item.oldPrice.toLocaleString()} ₴
                                  </span>
                                )}
                              </>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-border rounded-lg bg-background">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 mt-auto border-t border-border space-y-4 pb-6">
                  {totalSavings > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("yourSavings")}:</span>
                      <span className="font-semibold text-primary">
                        -{totalSavings.toLocaleString()} ₴
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("total")}:</span>
                    <span className="text-2xl font-bold text-foreground">
                      {totalPrice.toLocaleString()} ₴
                    </span>
                  </div>

                  <Button 
                    onClick={handleCheckout}
                    className="w-full btn-teal rounded-lg h-12 text-base font-semibold"
                  >
                    {t("checkout")}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full rounded-lg h-10"
                  >
                    {t("continueShopping")}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="px-6 overflow-y-auto h-full">
            {favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Heart className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {t("favoritesEmpty")}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {t("addProductsToFavorites")}
                </p>
                <Button
                  onClick={() => setIsCartOpen(false)}
                  className="btn-teal rounded-lg"
                >
                  {t("continueShopping")}
                </Button>
              </div>
            ) : (
              <div className="space-y-3 pb-6">
                {favorites.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-muted/50 rounded-xl"
                    >
                      {/* Image */}
                      <Link
                        to={`/product/${item.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="w-20 h-20 rounded-lg overflow-hidden bg-background shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.id}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-medium text-sm text-foreground line-clamp-2 hover:text-primary transition-colors"
                        >
                          {item.title}
                        </Link>
                        
                        <div className="flex items-center gap-2 mt-1">
                          {item.price === -1 ? (
                            <span className="text-xs font-medium text-orange-400">
                              {t("dependsOnOrder")}
                            </span>
                          ) : (
                            <>
                              <span className="font-bold text-foreground">
                                {item.price.toLocaleString()} ₴
                              </span>
                              {item.oldPrice && (
                                <span className="text-xs text-muted-foreground line-through">
                                  {item.oldPrice.toLocaleString()} ₴
                                </span>
                              )}
                            </>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-2">
                          <Button
                            size="sm"
                            onClick={() => handleAddToCartFromFavorites(item)}
                            className="btn-teal h-8 text-xs"
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            {t("addToCart")}
                          </Button>
                          <button
                            onClick={() => removeFromFavorites(item.id)}
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
