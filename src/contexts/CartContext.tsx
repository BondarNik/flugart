import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  quantity: number;
  category?: string;
}

type DrawerTab = "cart" | "favorites";

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  totalSavings: number;
  hasCustomPriceItems: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeTab: DrawerTab;
  setActiveTab: (tab: DrawerTab) => void;
  openDrawer: (tab?: DrawerTab) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DrawerTab>("cart");

  const openDrawer = (tab: DrawerTab = "cart") => {
    setActiveTab(tab);
    setIsCartOpen(true);
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    openDrawer("cart");
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    // Exclude items with price -1 (price on request) from total
    if (item.price === -1) return sum;
    return sum + item.price * item.quantity;
  }, 0);
  const totalSavings = items.reduce((sum, item) => {
    // Exclude items with price -1 from savings calculation
    if (item.price === -1) return sum;
    const saving = item.oldPrice ? (item.oldPrice - item.price) * item.quantity : 0;
    return sum + saving;
  }, 0);
  const hasCustomPriceItems = items.some(item => item.price === -1);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        totalSavings,
        hasCustomPriceItems,
        isCartOpen,
        setIsCartOpen,
        activeTab,
        setActiveTab,
        openDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
