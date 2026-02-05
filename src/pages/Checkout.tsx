import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Truck, Banknote, ChevronLeft, Loader2 } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, totalSavings, clearCart } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    deliveryMethod: "personal",
    city: "",
    warehouse: "",
    address: "",
    paymentMethod: "cash-on-delivery",
    comment: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = t("enterName");
    if (!formData.lastName.trim()) newErrors.lastName = t("enterSurname");
    if (!formData.phone.trim()) newErrors.phone = t("enterPhoneNumber");
    if (!formData.email.trim()) {
      newErrors.email = t("enterEmail");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("invalidEmail");
    }
    if (!formData.city.trim()) newErrors.city = t("enterCity");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast({
        title: t("error"),
        description: t("fillAllFields"),
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Generate order number
      const { data: orderNumber } = await supabase.rpc("generate_order_number");

      // Prepare order items
      const orderItems = items.map((item) => ({
        id: item.id,
        name: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      // Insert order
      const { error } = await supabase.from("orders").insert({
        order_number: orderNumber || `FLG-${Date.now()}`,
        customer_first_name: formData.firstName,
        customer_last_name: formData.lastName,
        customer_phone: formData.phone,
        customer_email: formData.email,
        delivery_method: formData.deliveryMethod,
        city: formData.city,
        warehouse: formData.deliveryMethod === "nova-poshta" ? formData.warehouse : null,
        address: formData.deliveryMethod === "courier" ? formData.address : null,
        payment_method: formData.paymentMethod,
        comment: formData.comment || null,
        items: orderItems,
        total_price: totalPrice,
        total_savings: totalSavings,
      });

      if (error) throw error;

      toast({
        title: t("orderPlaced"),
        description: t("willContactYou"),
      });
      
      clearCart();
      navigate("/");
    } catch (error) {
      console.error("Order error:", error);
      toast({
        title: t("error"),
        description: "Помилка при оформленні замовлення",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-16 px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">{t("cartEmpty")}</h1>
          <p className="text-muted-foreground mb-6">{t("addProductsToOrder")}</p>
          <Button onClick={() => navigate("/")} className="btn-teal rounded-lg">
            {t("toHome")}
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <a href="/" className="hover:text-primary transition-colors">{t("home")}</a>
            <span>/</span>
            <span className="text-foreground">{t("orderCheckout")}</span>
          </nav>

          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t("goBack")}
          </button>

          <h1 className="text-3xl font-bold text-foreground mb-8">{t("orderCheckout")}</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Info */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">{t("contactInfo")}</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t("firstName")} *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder={t("enterFirstName")}
                        className={errors.firstName ? "border-destructive" : ""}
                      />
                      {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t("lastName")} *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder={t("enterLastName")}
                        className={errors.lastName ? "border-destructive" : ""}
                      />
                      {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("phone")} *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+380 XX XXX XX XX"
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("email")} *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">{t("deliveryMethod")}</h2>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-primary bg-primary/5">
                    <Truck className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{t("deliveryDiscussedPersonally")}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">{t("city")} *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder={t("enterCity")}
                        className={errors.city ? "border-destructive" : ""}
                      />
                      {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">{t("paymentMethod")}</h2>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-primary bg-primary/5">
                    <Banknote className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{t("paymentOnReceipt")}</p>
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-6">{t("orderComment")}</h2>
                  <Textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder={t("additionalInfo")}
                    rows={4}
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                  <h2 className="text-xl font-semibold text-foreground mb-6">{t("yourOrder")}</h2>
                  
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 rounded-lg object-cover bg-muted"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-2">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.quantity} {t("pcs")}</p>
                          {item.price === -1 ? (
                            <p className="text-sm font-medium text-orange-400 mt-1">
                              {t("dependsOnOrder")}
                            </p>
                          ) : (
                            <p className="text-sm font-semibold text-foreground mt-1">
                              {(item.price * item.quantity).toLocaleString()} ₴
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    {totalSavings > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t("discount")}:</span>
                        <span className="font-medium text-primary">-{totalSavings.toLocaleString()} ₴</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("delivery")}:</span>
                      <span className="font-medium text-foreground">{t("deliveryCost")}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-lg font-semibold text-foreground">{t("total")}:</span>
                      <span className="text-2xl font-bold text-foreground">{totalPrice.toLocaleString()} ₴</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-teal rounded-lg h-12 text-base font-semibold mt-6"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Оформлення...
                      </>
                    ) : (
                      t("confirmOrder")
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    {t("agreeToTerms")}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
