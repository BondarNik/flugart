import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Share2, Check, Truck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { allProducts } from "@/data/products";

const categoryTranslationKeys: Record<string, string> = {
  "FPV Дрони": "catFpvDrones",
  "Котушки": "fiberSpools",
  "БпАК": "uavKits",
  "Наземні станції": "groundStationsCategory",
  "Акумулятори": "catBatteries",
  "Котушки з оптоволокном": "fiberSpools",
};

const ProductPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { addItem } = useCart();
  const { t, language } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = allProducts.find((p) => String(p.id) === id) || allProducts[0];
  const isProductFavorite = isFavorite(String(product.id));
  const productTitle = language === 'en' ? product.nameEn : product.name;
  const productDescription = language === 'en' ? (product.descriptionEn || product.description) : product.description;
  const images = product.images || [product.image];
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  const isMamba = product.name.includes("МАМБА") || product.name.includes("MAMBA");
  const isTaipan8 = (product.name.includes("ТАЙПАН") || product.name.includes("TAIPAN")) && (product.name.includes('8"') || product.name.includes('8"'));
  const isTaipan10 = (product.name.includes("ТАЙПАН") || product.name.includes("TAIPAN")) && (product.name.includes('10"') || product.name.includes('10"'));
  const isTaipan13 = (product.name.includes("ТАЙПАН") || product.name.includes("TAIPAN")) && (product.name.includes('13"') || product.name.includes('13"'));
  const isTaipan15 = (product.name.includes("ТАЙПАН") || product.name.includes("TAIPAN")) && (product.name.includes('15"') || product.name.includes('15"'));

  // Spec label translations
  const specLabelTranslations: Record<string, string> = {
    "Політний стек": "Flight Stack",
    "Двигуни": "Motors",
    "Рама": "Frame",
    "Відеопередавач": "Video Transmitter",
    "Відеокамера": "Camera",
    "Приймач": "Receiver",
    "Пропелери": "Propellers",
    "Акумулятор": "Battery",
    "Антена": "Antenna",
    "Оптоволокно": "Fiber Optic",
    "Довжина": "Length",
    "Корпус": "Case",
    "Кріплення": "Mount",
    // Kit specs
    'БпЛА "ТАЙПАН"': 'UAV "TAIPAN"',
    'БпЛА "МАМБА"': 'UAV "MAMBA"',
    "Акумуляторні батареї": "Batteries",
    "Наземна станція управління": "Ground control station",
    "Пульт управління": "Remote control",
    "Окуляри FPV": "FPV goggles",
    "Засоби контролю та обслуговування (ЗІП)": "Maintenance and control kit (spare parts)",
    "Зарядний пристрій": "Charger",
    "Транспортувальна тара": "Transport containers",
    "Катушка з оптоволокном": "Fiber optic spool",
    "Засоби технічного обслуговування": "Maintenance kit",
  };

  const translateSpecLabel = (label: string): string => {
    if (language === 'uk') return label;
    return specLabelTranslations[label] || label;
  };

  const translateSpecValue = (value: string): string => {
    if (language === 'uk') return value;
    return value
      .replace(/дюймів|дюйм/g, "inch")
      .replace(/карбон/g, "carbon")
      .replace(/або інші/g, "or other")
      .replace(/шт\./g, "pcs.")
      .replace(/шт/g, "pcs")
      .replace(/ком\./g, "set")
      .replace(/комплект/g, "set")
      .replace(/або/g, "or")
      .replace(/Друкований на 3D принтері/g, "3D printed")
      .replace(/Планка з двома фіксаторами швидкого монтування/g, "Plate with two quick-mount fixators")
      .replace(/Денна камера/g, "Day camera")
      .replace(/Тепловізійна камера/g, "Thermal camera")
      .replace(/Термальна камера/g, "Thermal camera")
      .replace(/Сутінкова камера/g, "Low-light camera")
      .replace(/Подвійний приймач/g, "Dual receiver")
      .replace(/обертання/g, "rotation")
      .replace(/Клевер/g, "Clover");
  };

  const translateFeature = (feature: string): string => {
    if (language === 'uk') return feature;
    
    const featureTranslations: Record<string, string> = {
      // Frame translations
      "Карбонова рама 8 дюймів": "8 inch carbon frame",
      "Карбонова рама 10 дюймів": "10 inch carbon frame",
      "Карбонова рама 13 дюймів": "13 inch carbon frame",
      "Карбонова рама 15 дюймів": "15 inch carbon frame",
      // Camera translations
      "Денна камера Caddx Ratel 2": "Day camera Caddx Ratel 2",
      "Тепловізійна камера": "Thermal camera",
      "Сутінкова камера Run Cam Phoenix 2": "Low-light camera Run Cam Phoenix 2",
      "Покращена видимість в умовах низької освітленості": "Improved visibility in low-light conditions",
      "Покращена видимість вночі": "Improved night visibility",
      // VTX translations
      "Потужний відеопередавач 2500mW": "Powerful 2500mW VTX",
      // Range/flight translations
      "Збільшена дальність польоту": "Extended flight range",
      "Максимальна дальність": "Maximum range",
      "Дальні місії": "Long-range missions",
      // Receiver translations
      "Подвійний приймач diversity": "Dual diversity receiver",
      "Стабільніший зв'язок": "More stable connection",
      "Стабільний зв'язок на великих відстанях": "Stable connection at long distances",
      // Night/thermal operations
      "Нічний режим роботи": "Night mode operation",
      "Нічні місії": "Night missions",
      "Нічні операції": "Night operations",
      "Всепогодні операції": "All-weather operations",
      // Rotary camera
      "Поворотна камера +20°/-90°": "Rotary camera +20°/-90°",
      "Покращений кут огляду": "Improved viewing angle",
      "Поворотна тепловізійна камера": "Rotary thermal camera",
      "Поворотна сутінкова камера": "Rotary low-light camera",
      "Кут обертання +20°/-90°": "Rotation angle +20°/-90°",
      // Motors
      "Потужні двигуни Flash Hobby 4312": "Powerful Flash Hobby 4312 motors",
      // Fiber optic
      "Оптоволоконний зв'язок 10 км": "10km fiber optic link",
      "Оптоволокно 10 км": "10km fiber optic",
      "Оптоволокно 15 км": "15km fiber optic",
      "Оптоволокно 20 км": "20km fiber optic",
      "Оптоволокно 25 км": "25km fiber optic",
      "Стабільний сигнал без перешкод": "Stable interference-free signal",
      "Стабільний зв'язок без перешкод": "Stable interference-free connection",
      "Тепловізор + оптоволокно 10 км": "Thermal + 10km fiber optic",
      "Тепловізор + оптоволокно 15 км": "Thermal + 15km fiber optic",
      "Тепловізор + оптоволокно 20 км": "Thermal + 20km fiber optic",
      "Тепловізор + оптоволокно 25 км": "Thermal + 25km fiber optic",
      // Fiber spool features
      "Максимальна дальність 20 км": "Maximum range 20km",
      "Максимальна дальність 25 км": "Maximum range 25km",
      "Збільшена дальність 15 км": "Extended range 15km",
      "Збільшена дальність 20 км": "Extended range 20km",
      "Швидке монтування": "Quick mount",
      "3D друкований корпус": "3D printed case",
      // Flight stack
      "Потужний політний стек Argus 80A": "Powerful Argus 80A flight stack",
      // Battery
      "Подвійний акумулятор": "Dual battery",
      "Акумулятор 6s3p 15000mAh": "6s3p 15000mAh battery",
      "Акумулятор 8s3p до 15000mAh": "8s3p up to 15000mAh battery",
      "Акумулятор 8s6p 30000mAh": "8s6p 30000mAh battery",
      // Kit features
      "Повний комплект для бойових операцій": "Complete kit for combat operations",
      "Наземна станція управління": "Ground control station",
      "FPV окуляри": "FPV goggles",
      "Експлуатаційна документація": "Operational documentation",
      "Гарантійний талон та сертифікат якості": "Warranty card and quality certificate",
      "Оптоволоконний зв'язок до 25 км": "Fiber optic communication up to 25 km",
    };
    
    return featureTranslations[feature] || feature;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    addItem({
      id: String(product.id),
      title: productTitle,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      category: product.category,
    }, quantity);
    toast({
      title: t("addedToCart"),
      description: `${productTitle} x ${quantity} ${t("pcs")}`,
    });
  };

  const handleBuyNow = () => {
    addItem({
      id: String(product.id),
      title: productTitle,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      category: product.category,
    }, quantity);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-6 md:py-10">
        <div className="container mx-auto">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">{t("home")}</Link>
            <span>/</span>
            <span className="hover:text-primary transition-colors cursor-pointer">{t(categoryTranslationKeys[product.category] || product.category)}</span>
            <span>/</span>
            <span className="text-foreground">{productTitle}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-background">
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-yellow-400 text-black text-sm font-bold px-4 py-1.5 rounded-lg z-10 shadow-md">
                    {product.badge}
                  </span>
                )}
                {discount > 0 && (
                  <span className={`absolute top-4 ${product.badge ? 'left-4 top-14' : 'left-4'} bg-sale text-primary-foreground text-sm font-bold px-3 py-1.5 rounded-lg z-10`}>
                    -{discount}%
                  </span>
                )}
                <img src={images[currentImageIndex]} alt={productTitle} className="w-full h-full object-contain" />
                
                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background backdrop-blur-sm rounded-full flex items-center justify-center text-foreground transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 hover:bg-background backdrop-blur-sm rounded-full flex items-center justify-center text-foreground transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-sm font-medium text-primary">{t(categoryTranslationKeys[product.category] || product.category)}</span>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mt-1">{productTitle}</h1>
              </div>

              {product.price === -1 ? (
                product.category !== "3D Друк" && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl md:text-2xl font-medium text-foreground">{t("estimatedPrice")}:</span>
                    <span className="text-xl md:text-2xl font-bold text-orange-400">{t("dependsOnOrder")}</span>
                  </div>
                )
              ) : (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl md:text-4xl font-bold text-foreground">{product.price.toLocaleString()} ₴</span>
                  {product.oldPrice && <span className="text-xl text-muted-foreground line-through">{product.oldPrice.toLocaleString()} ₴</span>}
                </div>
              )}

              {product.price !== -1 && (
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="text-primary font-medium">{t("inStock")}</span>
                </div>
              )}

              <p className="text-muted-foreground leading-relaxed">{productDescription}</p>

              {product.category !== "3D Друк" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-foreground">{t("quantity")}:</span>
                    <div className="flex items-center border border-border rounded-lg">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors">-</button>
                      <span className="w-12 text-center font-semibold">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition-colors">+</button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleBuyNow} className="flex-1 btn-teal rounded-lg h-12 text-base font-semibold">{t("buyNow")}</Button>
                    <Button onClick={handleAddToCart} variant="outline" className="flex-1 rounded-lg h-12 text-base font-semibold border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      <ShoppingCart className="w-5 h-5 mr-2" />{t("addToCart")}
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Button variant="ghost" size="sm" className={isProductFavorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"}
                    onClick={() => { toggleFavorite({ id: String(product.id), title: productTitle, price: product.price, oldPrice: product.oldPrice, image: product.image, category: product.category }); toast({ title: isProductFavorite ? t("removedFromFavorites") : t("addedToFavorites"), description: productTitle }); }}>
                    <Heart className={`w-4 h-4 mr-2 ${isProductFavorite ? "fill-current" : ""}`} />{isProductFavorite ? t("inFavorites") : t("addToFavorites")}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={async () => {
                    const url = window.location.href;
                    try {
                      if (navigator.share) {
                        await navigator.share({ title: productTitle, url });
                      } else {
                        await navigator.clipboard.writeText(url);
                        toast({ title: t("linkCopied"), description: productTitle });
                      }
                    } catch (err) {
                      try {
                        await navigator.clipboard.writeText(url);
                        toast({ title: t("linkCopied"), description: productTitle });
                      } catch {
                        toast({ title: t("linkCopied"), description: url });
                      }
                    }
                }}><Share2 className="w-4 h-4 mr-2" />{t("share")}</Button>
                </div>

                {isMamba && (
                  <Link to="/instructions" className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/30 hover:from-orange-500/20 hover:to-orange-600/10 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                      <FileText className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-orange-400">{language === 'en' ? 'Operating Instructions' : 'Інструкція з експлуатації'}</div>
                      <div className="text-sm text-muted-foreground">{language === 'en' ? 'Read before use' : 'Ознайомтесь перед використанням'}</div>
                    </div>
                  </Link>
                )}

                {isTaipan8 && (
                  <Link to="/instructions-taipan-8" className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/30 hover:from-orange-500/20 hover:to-orange-600/10 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                      <FileText className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-orange-400">{language === 'en' ? 'Operating Instructions' : 'Інструкція з експлуатації'}</div>
                      <div className="text-sm text-muted-foreground">{language === 'en' ? 'Read before use' : 'Ознайомтесь перед використанням'}</div>
                    </div>
                  </Link>
                )}

                {isTaipan10 && (
                  <Link to="/instructions-taipan-10" className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/30 hover:from-orange-500/20 hover:to-orange-600/10 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                      <FileText className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-orange-400">{language === 'en' ? 'Operating Instructions' : 'Інструкція з експлуатації'}</div>
                      <div className="text-sm text-muted-foreground">{language === 'en' ? 'Read before use' : 'Ознайомтесь перед використанням'}</div>
                    </div>
                  </Link>
                )}

                {isTaipan13 && (
                  <Link to="/instructions-taipan-13" className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/30 hover:from-orange-500/20 hover:to-orange-600/10 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                      <FileText className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-orange-400">{language === 'en' ? 'Operating Instructions' : 'Інструкція з експлуатації'}</div>
                      <div className="text-sm text-muted-foreground">{language === 'en' ? 'Read before use' : 'Ознайомтесь перед використанням'}</div>
                    </div>
                  </Link>
                )}

                {isTaipan15 && (
                  <Link to="/instructions-taipan-15" className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/30 hover:from-orange-500/20 hover:to-orange-600/10 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                      <FileText className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-orange-400">{language === 'en' ? 'Operating Instructions' : 'Інструкція з експлуатації'}</div>
                      <div className="text-sm text-muted-foreground">{language === 'en' ? 'Read before use' : 'Ознайомтесь перед використанням'}</div>
                    </div>
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-teal-light flex items-center justify-center"><Truck className="w-5 h-5 text-primary" /></div>
                <div><div className="text-sm font-medium text-foreground">{t("delivery")}</div><div className="text-xs text-muted-foreground">{t("allUkraine")}</div></div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          {product.specs && product.specs.length > 0 && (
            <div className="mt-12 bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">{t("specifications")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(language === 'en' && product.specsEn ? product.specsEn : product.specs).map((spec, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">{language === 'en' && product.specsEn ? spec.label : translateSpecLabel(spec.label)}</span>
                    <span className="text-foreground font-medium">{language === 'en' && product.specsEn ? spec.value : translateSpecValue(spec.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="mt-6 bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">{t("features")}</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(language === 'en' && product.featuresEn ? product.featuresEn : product.features).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {language === 'en' && product.featuresEn ? feature : translateFeature(feature)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductPage;
