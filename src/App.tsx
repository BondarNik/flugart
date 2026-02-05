import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import CartDrawer from "./components/CartDrawer";
import Index from "./pages/Index";
import ProductPage from "./pages/ProductPage";
import SearchResults from "./pages/SearchResults";
import Checkout from "./pages/Checkout";
import Configurator from "./pages/Configurator";
import Instructions from "./pages/Instructions";
import InstructionsTaipan8 from "./pages/InstructionsTaipan8";
import InstructionsTaipan10 from "./pages/InstructionsTaipan10";
import InstructionsTaipan13 from "./pages/InstructionsTaipan13";
import InstructionsTaipan15 from "./pages/InstructionsTaipan15";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import About from "./pages/About";
import Delivery from "./pages/Delivery";
import Warranty from "./pages/Warranty";
import NotFound from "./pages/NotFound";
import PresenceTracker from "./components/PresenceTracker";
import LiveChat from "./components/LiveChat";

// Component to conditionally render LiveChat (hide on admin pages)
const LiveChatWrapper = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  if (isAdminPage) return null;
  return <LiveChat />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <FavoritesProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <PresenceTracker />
              <CartDrawer />
              <LiveChatWrapper />
              <Routes>
              <Route path="/" element={<Index />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/configurator" element={<Configurator />} />
                <Route path="/instructions" element={<Instructions />} />
                <Route path="/instructions-taipan-8" element={<InstructionsTaipan8 />} />
                <Route path="/instructions-taipan-10" element={<InstructionsTaipan10 />} />
                <Route path="/instructions-taipan-13" element={<InstructionsTaipan13 />} />
                <Route path="/instructions-taipan-15" element={<InstructionsTaipan15 />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-use" element={<TermsOfUse />} />
                <Route path="/about" element={<About />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/warranty" element={<Warranty />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </FavoritesProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
