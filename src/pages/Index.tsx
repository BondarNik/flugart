import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import AboutSection from "@/components/AboutSection";
import FeaturesTicker from "@/components/FeaturesTicker";
import Categories from "@/components/Categories";
import Footer from "@/components/Footer";
import DroneBackground from "@/components/DroneBackground";
import FlightWeatherWidget from "@/components/FlightWeatherWidget";
import FPVTipsWidget from "@/components/FPVTipsWidget";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <DroneBackground />
      <Header />
      <main className="relative z-10">
        <div className="container mx-auto">
          <HeroCarousel />
        </div>
        <AboutSection />
        <FeaturesTicker />
        
        {/* Flight Tools Section */}
        <div className="container mx-auto px-4 py-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <FlightWeatherWidget />
            <FPVTipsWidget />
          </div>
        </div>
        
        <Categories />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
