import { useState } from "react";
import { Check, ChevronRight, ShoppingCart, RotateCcw, Info, Heart, Phone, MessageCircle, MapPin, Package } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// TAIPAN images - using catalog photos
import taipan8Image from "@/assets/drones/taipan-8-dark.jpg";
import taipan10Image from "@/assets/drones/taipan-10-day-styled.jpg";
import taipan13Image from "@/assets/drones/taipan-13-day-styled.jpg";
import taipan15Image from "@/assets/drones/taipan-15-day-styled.jpg";

// MAMBA images - using catalog photos
import mamba10Image from "@/assets/drones/mamba-10-day-styled.jpg";
import mamba13Image from "@/assets/drones/mamba-13-10km-styled.jpg";
import mamba15Image from "@/assets/drones/mamba-15-day-20km-styled.jpg";

type DroneSeries = "taipan" | "mamba";
type TaipanSize = "8" | "10" | "13" | "15";
type MambaSize = "10" | "13" | "15";
type DroneSize = TaipanSize | MambaSize;
type CameraType = "day" | "thermal" | "lowlight" | "diversity";
type FiberLength = "none" | "10" | "15" | "20" | "25";
type RotaryCamera = boolean;
type FlightStack = "hakrc" | "speedybee" | "argus";
type Motors = "brotherhobby" | "tmotor" | "xing";
type Battery = "6s2p" | "6s3p" | "6s4p";

interface ConfigOption {
  id: string;
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
  image?: string;
}

// Configuration specifications based on real data (MAMBA only)
interface MambaConfig {
  id: string;
  fiberLength: number; // km
  spoolWeight: number; // kg
  battery: string;
  batteryCount: number;
  payloadRange: string; // e.g. "1-1.5"
  actualDistance: number; // km
}

// All configurations for MAMBA drones by size (from the spec table)
const mambaConfigurations: Record<MambaSize, MambaConfig[]> = {
  "10": [
    { id: "10-1", fiberLength: 10, spoolWeight: 1.2, battery: "8s2p 15000 mAh", batteryCount: 1, payloadRange: "1-1.5", actualDistance: 9.5 },
    { id: "10-2", fiberLength: 15, spoolWeight: 1.5, battery: "8s2p 15000 mAh", batteryCount: 2, payloadRange: "1.5-2", actualDistance: 14.5 },
  ],
  "13": [
    { id: "13-1", fiberLength: 15, spoolWeight: 1.5, battery: "8s3p 15000 mAh", batteryCount: 1, payloadRange: "1-1.5", actualDistance: 14 },
    { id: "13-2", fiberLength: 15, spoolWeight: 1.5, battery: "8s2p 20000 mAh", batteryCount: 2, payloadRange: "2", actualDistance: 14.5 },
    { id: "13-3", fiberLength: 20, spoolWeight: 1.9, battery: "8s3p 30000 mAh", batteryCount: 2, payloadRange: "2", actualDistance: 19.5 },
  ],
  "15": [
    { id: "15-1", fiberLength: 20, spoolWeight: 1.9, battery: "8s3p 30000 mAh", batteryCount: 2, payloadRange: "2", actualDistance: 19.5 },
    { id: "15-2", fiberLength: 25, spoolWeight: 2.3, battery: "8s3p 30000 mAh", batteryCount: 2, payloadRange: "1.5", actualDistance: 24.5 },
  ],
};

const taipanImages: Record<TaipanSize, string> = {
  "8": taipan8Image,
  "10": taipan10Image,
  "13": taipan13Image,
  "15": taipan15Image,
};

const mambaImages: Record<MambaSize, string> = {
  "10": mamba10Image,
  "13": mamba13Image,
  "15": mamba15Image,
};

const Configurator = () => {
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const { addToFavorites, isFavorite, removeFromFavorites } = useFavorites();
  const { toast } = useToast();

  const [droneSeries, setDroneSeries] = useState<DroneSeries | null>(null);
  const [droneSize, setDroneSize] = useState<DroneSize | null>(null);
  const [cameraType, setCameraType] = useState<CameraType | null>(null);
  const [selectedMambaConfig, setSelectedMambaConfig] = useState<string | null>(null);
  const [rotaryCamera, setRotaryCamera] = useState<RotaryCamera>(false);
  const [flightStack, setFlightStack] = useState<FlightStack>("hakrc");
  const [motors, setMotors] = useState<Motors>("brotherhobby");
  const [battery, setBattery] = useState<Battery | null>(null);
  const [step, setStep] = useState(1);

  const seriesOptions: ConfigOption[] = [
    { id: "taipan", name: "ТАЙПАН", nameEn: "ТАЙПАН", description: "Універсальна серія 8\"-15\"", descriptionEn: "Universal series 8\"-15\"", image: taipan10Image },
    { id: "mamba", name: "МАМБА", nameEn: "МАМБА", description: "З оптоволокном 10\"-15\"", descriptionEn: "With fiber optic 10\"-15\"", image: mamba13Image },
  ];

  const taipanSizes: ConfigOption[] = [
    { id: "8", name: '8" ТАЙПАН', nameEn: '8" ТАЙПАН', description: "Компактний, маневрений", descriptionEn: "Compact, maneuverable", image: taipan8Image },
    { id: "10", name: '10" ТАЙПАН', nameEn: '10" ТАЙПАН', description: "Універсальний розмір", descriptionEn: "Universal size", image: taipan10Image },
    { id: "13", name: '13" ТАЙПАН', nameEn: '13" ТАЙПАН', description: "Дальні місії", descriptionEn: "Long-range missions", image: taipan13Image },
    { id: "15", name: '15" ТАЙПАН', nameEn: '15" ТАЙПАН', description: "Максимальна дальність", descriptionEn: "Maximum range", image: taipan15Image },
  ];

  const mambaSizes: ConfigOption[] = [
    { id: "10", name: '10" МАМБА', nameEn: '10" МАМБА', description: "Оптоволокно 10-15 км", descriptionEn: "Fiber optic 10-15 km", image: mamba10Image },
    { id: "13", name: '13" МАМБА', nameEn: '13" МАМБА', description: "Оптоволокно 15-20 км", descriptionEn: "Fiber optic 15-20 km", image: mamba13Image },
    { id: "15", name: '15" МАМБА', nameEn: '15" МАМБА', description: "Оптоволокно 20-25 км", descriptionEn: "Fiber optic 20-25 km", image: mamba15Image },
  ];

  const cameraTypes: ConfigOption[] = [
    { id: "day", name: "Денна камера", nameEn: "Day Camera", description: "Caddx Ratel 2", descriptionEn: "Caddx Ratel 2" },
    { id: "thermal", name: "Тепловізійна камера", nameEn: "Thermal Camera", description: "Для нічних операцій", descriptionEn: "For night operations" },
    { id: "lowlight", name: "Сутінкова камера", nameEn: "Low-Light Camera", description: "Run Cam Phoenix 2", descriptionEn: "Run Cam Phoenix 2" },
  ];

  const rotaryOption: ConfigOption = {
    id: "rotary",
    name: "Поворотна камера (+20°/-90°)",
    nameEn: "Rotary Camera (+20°/-90°)",
    description: "Покращений кут огляду",
    descriptionEn: "Improved viewing angle"
  };

  const flightStacks: ConfigOption[] = [
    { id: "hakrc", name: "HAKRCF 405v2", nameEn: "HAKRCF 405v2", description: "Стандартний надійний стек", descriptionEn: "Standard reliable stack" },
    { id: "speedybee", name: "SpeedyBee F405 V4", nameEn: "SpeedyBee F405 V4", description: "Bluetooth налаштування", descriptionEn: "Bluetooth configuration" },
    { id: "argus", name: "Argus 80A", nameEn: "Argus 80A", description: "Потужний, для важких дронів", descriptionEn: "Powerful, for heavy drones" },
  ];

  const motorsOptions: Record<DroneSize, ConfigOption[]> = {
    "8": [
      { id: "brotherhobby", name: "Brothers Hobby 2812 900KV", nameEn: "Brothers Hobby 2812 900KV", description: "Стандарт", descriptionEn: "Standard" },
      { id: "tmotor", name: "T-Motor F60 Pro V", nameEn: "T-Motor F60 Pro V", description: "Преміум якість", descriptionEn: "Premium quality" },
      { id: "xing", name: "iFlight XING2 2812", nameEn: "iFlight XING2 2812", description: "Легкі та ефективні", descriptionEn: "Light and efficient" },
    ],
    "10": [
      { id: "brotherhobby", name: "Brothers Hobby 3115 900KV", nameEn: "Brothers Hobby 3115 900KV", description: "Стандарт", descriptionEn: "Standard" },
      { id: "tmotor", name: "T-Motor U8 Lite", nameEn: "T-Motor U8 Lite", description: "Максимальна ефективність", descriptionEn: "Maximum efficiency" },
      { id: "xing", name: "iFlight XING2 3110", nameEn: "iFlight XING2 3110", description: "Баланс ціни та якості", descriptionEn: "Balance of price and quality" },
    ],
    "13": [
      { id: "brotherhobby", name: "Brothers Hobby 4014 400KV", nameEn: "Brothers Hobby 4014 400KV", description: "Стандарт", descriptionEn: "Standard" },
      { id: "tmotor", name: "T-Motor U10 II", nameEn: "T-Motor U10 II", description: "Для професіоналів", descriptionEn: "For professionals" },
      { id: "xing", name: "iFlight XING2 4214", nameEn: "iFlight XING2 4214", description: "Потужні та надійні", descriptionEn: "Powerful and reliable" },
    ],
    "15": [
      { id: "brotherhobby", name: "Brothers Hobby 4114 400KV", nameEn: "Brothers Hobby 4114 400KV", description: "Стандарт", descriptionEn: "Standard" },
      { id: "tmotor", name: "T-Motor U13 II", nameEn: "T-Motor U13 II", description: "Топова продуктивність", descriptionEn: "Top performance" },
      { id: "xing", name: "iFlight XING2 4314", nameEn: "iFlight XING2 4314", description: "Великий крутний момент", descriptionEn: "High torque" },
    ],
  };

  const batteryOptions: Record<DroneSize, ConfigOption[]> = {
    "8": [
      { id: "6s2p", name: "6S2P 8000mAh", nameEn: "6S2P 8000mAh", description: "Стандарт для 8\"", descriptionEn: "Standard for 8\"" },
      { id: "6s3p", name: "6S3P 12000mAh", nameEn: "6S3P 12000mAh", description: "Збільшений час польоту", descriptionEn: "Extended flight time" },
    ],
    "10": [
      { id: "6s3p", name: "6S3P 15000mAh", nameEn: "6S3P 15000mAh", description: "Стандарт для 10\"", descriptionEn: "Standard for 10\"" },
      { id: "6s4p", name: "6S4P 20000mAh", nameEn: "6S4P 20000mAh", description: "Максимальна ємність", descriptionEn: "Maximum capacity" },
    ],
    "13": [
      { id: "6s3p", name: "6S3P 18000mAh", nameEn: "6S3P 18000mAh", description: "Стандарт для 13\"", descriptionEn: "Standard for 13\"" },
      { id: "6s4p", name: "6S4P 24000mAh", nameEn: "6S4P 24000mAh", description: "Для дальніх місій", descriptionEn: "For long-range missions" },
    ],
    "15": [
      { id: "6s4p", name: "6S4P 28000mAh", nameEn: "6S4P 28000mAh", description: "Стандарт для 15\"", descriptionEn: "Standard for 15\"" },
    ],
  };

  const getCurrentDroneImage = () => {
    if (!droneSize) return "/placeholder.svg";
    if (droneSeries === "mamba") {
      return mambaImages[droneSize as MambaSize];
    }
    return taipanImages[droneSize as TaipanSize];
  };

  // Get selected MAMBA configuration
  const getSelectedMambaConfig = (): MambaConfig | null => {
    if (droneSeries !== "mamba" || !droneSize || !selectedMambaConfig) return null;
    return mambaConfigurations[droneSize as MambaSize]?.find(c => c.id === selectedMambaConfig) || null;
  };

  const mambaConfig = getSelectedMambaConfig();

  const getConfigId = () => {
    return `config-${droneSeries}-${droneSize}-${cameraType}-${flightStack}-${motors}-${battery}-${selectedMambaConfig}-${rotaryCamera}`;
  };

  const getConfigSummary = () => {
    const parts: string[] = [];
    if (droneSeries && droneSize) {
      parts.push(`${droneSize}" ${droneSeries.toUpperCase()}`);
    }
    if (cameraType) {
      const camera = cameraTypes.find(c => c.id === cameraType);
      if (camera) parts.push(language === 'en' ? camera.nameEn : camera.name);
    }
    if (rotaryCamera && droneSeries === "taipan" && droneSize === "10") {
      parts.push(language === 'en' ? "Rotary" : "Поворотна");
    }
    if (mambaConfig) {
      parts.push(language === 'en' ? `Fiber ${mambaConfig.fiberLength}km` : `Оптоволокно ${mambaConfig.fiberLength}км`);
    }
    return parts.join(" + ");
  };

  const getConfigName = () => {
    return `${language === 'en' ? 'Custom FPV Drone' : 'FPV дрон на замовлення'}: ${getConfigSummary()}`;
  };

  const handleAddToCart = () => {
    if (!droneSeries || !droneSize || !cameraType) return;
    
    const configName = getConfigName();
    
    addItem({
      id: `config-${Date.now()}`,
      title: configName,
      price: -1,
      image: getCurrentDroneImage(),
      category: "FPV Дрони",
    }, 1);

    toast({
      title: t("addedToCart"),
      description: configName,
    });
  };

  const handleSaveToFavorites = () => {
    if (!droneSeries || !droneSize || !cameraType) return;
    
    const configId = getConfigId();
    const configName = getConfigName();
    
    if (isFavorite(configId)) {
      removeFromFavorites(configId);
      toast({
        title: language === 'en' ? 'Removed from favorites' : 'Видалено з обраного',
        description: configName,
      });
    } else {
      addToFavorites({
        id: configId,
        title: configName,
        price: -1,
        image: getCurrentDroneImage(),
        category: language === 'en' ? 'Custom Configuration' : 'Користувацька конфігурація',
      });
      toast({
        title: language === 'en' ? 'Added to favorites' : 'Додано в обране',
        description: configName,
      });
    }
  };

  const isConfigFavorite = () => {
    if (!droneSeries || !droneSize || !cameraType) return false;
    return isFavorite(getConfigId());
  };

  const handleReset = () => {
    setDroneSeries(null);
    setDroneSize(null);
    setCameraType(null);
    setSelectedMambaConfig(null);
    setRotaryCamera(false);
    setFlightStack("hakrc");
    setMotors("brotherhobby");
    setBattery(null);
    setStep(1);
  };

  const handleSeriesChange = (series: DroneSeries) => {
    setDroneSeries(series);
    setDroneSize(null);
    setSelectedMambaConfig(null);
    setRotaryCamera(false);
  };

  const handleDroneSizeChange = (size: DroneSize) => {
    setDroneSize(size);
    setMotors("brotherhobby");
    const defaultBattery = batteryOptions[size][0]?.id as Battery;
    setBattery(defaultBattery);
    
    // Set default config for MAMBA
    if (droneSeries === "mamba") {
      const defaultConfig = mambaConfigurations[size as MambaSize]?.[0]?.id || null;
      setSelectedMambaConfig(defaultConfig);
    } else {
      setSelectedMambaConfig(null);
    }
  };

  const canProceed = (currentStep: number) => {
    if (currentStep === 1) return droneSeries !== null;
    if (currentStep === 2) return droneSize !== null;
    if (currentStep === 3) return cameraType !== null;
    return true;
  };

  const stepTitles = {
    1: { uk: "Виберіть серію дрона", en: "Select Drone Series" },
    2: { uk: "Виберіть розмір дрона", en: "Select Drone Size" },
    3: { uk: "Виберіть тип камери", en: "Select Camera Type" },
    4: { uk: "Компоненти дрона", en: "Drone Components" },
    5: { uk: "Додаткові опції", en: "Additional Options" },
    6: { uk: "Підсумок замовлення", en: "Order Summary" },
  };

  const getDroneSizeOptions = () => {
    return droneSeries === "mamba" ? mambaSizes : taipanSizes;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {language === 'en' ? 'Drone Configurator' : 'Конфігуратор дронів'}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Build your perfect FPV drone by selecting components step by step'
                : 'Зберіть свій ідеальний FPV дрон, обираючи компоненти крок за кроком'}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-center">
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <div key={s} className="flex items-center">
                  <button
                    onClick={() => canProceed(s - 1) && setStep(s)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step === s
                        ? "bg-primary text-primary-foreground scale-110"
                        : step > s
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s ? <Check className="w-5 h-5" /> : s}
                  </button>
                  {s < 6 && (
                    <ChevronRight className={`w-5 h-5 mx-1 md:mx-2 ${step > s ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Config Area */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl">
                    {stepTitles[step as keyof typeof stepTitles][language]}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Step 1: Drone Series */}
                  {step === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {seriesOptions.map((series) => (
                        <button
                          key={series.id}
                          onClick={() => handleSeriesChange(series.id as DroneSeries)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            droneSeries === series.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50 hover:bg-muted/50"
                          }`}
                        >
                          <div className="w-full h-40 mb-3 rounded-lg overflow-hidden bg-muted/30">
                            <img 
                              src={series.image} 
                              alt={language === 'en' ? series.nameEn : series.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xl font-bold text-foreground">
                              {language === 'en' ? series.nameEn : series.name}
                            </span>
                            {droneSeries === series.id && <Check className="w-5 h-5 text-primary" />}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {language === 'en' ? series.descriptionEn : series.description}
                          </p>
                          {series.id === "mamba" && (
                            <Badge className="mt-2 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                              {language === 'en' ? 'With Fiber Optic' : 'З оптоволокном'}
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Step 2: Drone Size */}
                  {step === 2 && droneSeries && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getDroneSizeOptions().map((size) => (
                        <button
                          key={size.id}
                          onClick={() => handleDroneSizeChange(size.id as DroneSize)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            droneSize === size.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50 hover:bg-muted/50"
                          }`}
                        >
                          <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-muted/30">
                            <img 
                              src={size.image} 
                              alt={language === 'en' ? size.nameEn : size.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-lg font-bold text-foreground">
                              {language === 'en' ? size.nameEn : size.name}
                            </span>
                            {droneSize === size.id && <Check className="w-5 h-5 text-primary" />}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {language === 'en' ? size.descriptionEn : size.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Step 3: Camera Type */}
                  {step === 3 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {cameraTypes.map((camera) => (
                        <button
                          key={camera.id}
                          onClick={() => setCameraType(camera.id as CameraType)}
                          className={`p-6 rounded-xl border-2 transition-all text-left ${
                            cameraType === camera.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50 hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-lg font-bold text-foreground">
                              {language === 'en' ? camera.nameEn : camera.name}
                            </span>
                            {cameraType === camera.id && <Check className="w-5 h-5 text-primary" />}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {language === 'en' ? camera.descriptionEn : camera.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Step 4: Components */}
                  {step === 4 && droneSize && (
                    <div className="space-y-8">
                      {/* Flight Stack */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          {language === 'en' ? 'Flight Stack' : 'Політний стек'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {flightStacks.map((stack) => (
                            <button
                              key={stack.id}
                              onClick={() => setFlightStack(stack.id as FlightStack)}
                              className={`p-4 rounded-xl border-2 transition-all text-left ${
                                flightStack === stack.id
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50 hover:bg-muted/50"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-foreground text-sm">
                                  {language === 'en' ? stack.nameEn : stack.name}
                                </span>
                                {flightStack === stack.id && <Check className="w-4 h-4 text-primary" />}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {language === 'en' ? stack.descriptionEn : stack.description}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Motors */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          {language === 'en' ? 'Motors' : 'Двигуни'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {motorsOptions[droneSize].map((motor) => (
                            <button
                              key={motor.id}
                              onClick={() => setMotors(motor.id as Motors)}
                              className={`p-4 rounded-xl border-2 transition-all text-left ${
                                motors === motor.id
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50 hover:bg-muted/50"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-foreground text-sm">
                                  {language === 'en' ? motor.nameEn : motor.name}
                                </span>
                                {motors === motor.id && <Check className="w-4 h-4 text-primary" />}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {language === 'en' ? motor.descriptionEn : motor.description}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Battery */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          {language === 'en' ? 'Battery' : 'Акумулятор'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {batteryOptions[droneSize].map((bat) => (
                            <button
                              key={bat.id}
                              onClick={() => setBattery(bat.id as Battery)}
                              className={`p-4 rounded-xl border-2 transition-all text-left ${
                                battery === bat.id
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50 hover:bg-muted/50"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-foreground">
                                  {language === 'en' ? bat.nameEn : bat.name}
                                </span>
                                {battery === bat.id && <Check className="w-4 h-4 text-primary" />}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {language === 'en' ? bat.descriptionEn : bat.description}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Additional Options */}
                  {step === 5 && (
                    <div className="space-y-6">
                      {/* Rotary Camera - only for TAIPAN 10" */}
                      {droneSeries === "taipan" && droneSize === "10" && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            {language === 'en' ? 'Rotary Camera' : 'Поворотна камера'}
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                {language === 'en' ? 'Available only for TAIPAN 10"' : 'Доступно тільки для TAIPAN 10"'}
                              </TooltipContent>
                            </Tooltip>
                          </h3>
                          <button
                            onClick={() => setRotaryCamera(!rotaryCamera)}
                            className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                              rotaryCamera
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-lg font-bold text-foreground">
                                {language === 'en' ? rotaryOption.nameEn : rotaryOption.name}
                              </span>
                              {rotaryCamera && <Check className="w-5 h-5 text-primary" />}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {language === 'en' ? rotaryOption.descriptionEn : rotaryOption.description}
                            </p>
                          </button>
                        </div>
                      )}

                      {/* MAMBA Configuration Selection */}
                      {droneSeries === "mamba" && droneSize && (
                        <div>
                          <h3 className="text-lg font-semibold mb-4">
                            {language === 'en' ? 'Select Configuration' : 'Виберіть конфігурацію'}
                          </h3>
                          <div className="space-y-4">
                            {mambaConfigurations[droneSize as MambaSize].map((config) => (
                              <button
                                key={config.id}
                                onClick={() => setSelectedMambaConfig(config.id)}
                                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                  selectedMambaConfig === config.id
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-foreground text-lg">
                                      {config.fiberLength} {language === 'en' ? 'km' : 'км'}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      ({config.spoolWeight} {language === 'en' ? 'kg spool' : 'кг котушка'})
                                    </span>
                                  </div>
                                  {selectedMambaConfig === config.id && <Check className="w-5 h-5 text-primary" />}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="text-muted-foreground">
                                    {language === 'en' ? 'Battery:' : 'АКБ:'} 
                                    <span className="text-foreground ml-1">
                                      {config.batteryCount > 1 ? `${config.batteryCount} шт ` : ''}{config.battery}
                                    </span>
                                  </div>
                                  <div className="text-muted-foreground">
                                    {language === 'en' ? 'Payload:' : 'Вантаж:'} 
                                    <span className="text-foreground ml-1">{config.payloadRange} {language === 'en' ? 'kg' : 'кг'}</span>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No additional options message */}
                      {droneSeries === "taipan" && droneSize !== "10" && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>{language === 'en' ? 'No additional options for this configuration' : 'Додаткових опцій для цієї конфігурації немає'}</p>
                          <p className="text-sm mt-2">{language === 'en' ? 'Continue to summary' : 'Продовжуйте до підсумку'}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 6: Summary */}
                  {step === 6 && (
                    <div className="space-y-6">
                      {droneSize && (
                        <div className="w-full h-64 rounded-xl overflow-hidden bg-muted/30 mb-6">
                          <img 
                            src={getCurrentDroneImage()} 
                            alt={language === 'en' ? 'Your configured drone' : 'Ваш налаштований дрон'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                        <h3 className="text-lg font-semibold">
                          {language === 'en' ? 'Your Configuration' : 'Ваша конфігурація'}
                        </h3>
                        
                        {droneSeries && droneSize && (
                          <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-muted-foreground">{language === 'en' ? 'Drone' : 'Дрон'}</span>
                            <span className="font-medium">{droneSize}" {droneSeries.toUpperCase()}</span>
                          </div>
                        )}

                        {cameraType && (
                          <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-muted-foreground">{language === 'en' ? 'Camera' : 'Камера'}</span>
                            <span className="font-medium">{language === 'en' ? cameraTypes.find(c => c.id === cameraType)?.nameEn : cameraTypes.find(c => c.id === cameraType)?.name}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-muted-foreground">{language === 'en' ? 'Flight Stack' : 'Політний стек'}</span>
                          <span className="font-medium">{language === 'en' ? flightStacks.find(s => s.id === flightStack)?.nameEn : flightStacks.find(s => s.id === flightStack)?.name}</span>
                        </div>

                        {droneSize && (
                          <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-muted-foreground">{language === 'en' ? 'Motors' : 'Двигуни'}</span>
                            <span className="font-medium">{language === 'en' ? motorsOptions[droneSize].find(m => m.id === motors)?.nameEn : motorsOptions[droneSize].find(m => m.id === motors)?.name}</span>
                          </div>
                        )}

                        {droneSize && battery && (
                          <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-muted-foreground">{language === 'en' ? 'Battery' : 'Акумулятор'}</span>
                            <span className="font-medium">{language === 'en' ? batteryOptions[droneSize].find(b => b.id === battery)?.nameEn : batteryOptions[droneSize].find(b => b.id === battery)?.name}</span>
                          </div>
                        )}

                        {rotaryCamera && droneSeries === "taipan" && droneSize === "10" && (
                          <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-muted-foreground">{language === 'en' ? 'Rotary Camera' : 'Поворотна камера'}</span>
                            <span className="font-medium">+20°/-90°</span>
                          </div>
                        )}

                        {droneSeries === "mamba" && mambaConfig && (
                          <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-muted-foreground">{language === 'en' ? 'Fiber Optic' : 'Оптоволокно'}</span>
                            <span className="font-medium">{mambaConfig.fiberLength} {language === 'en' ? 'km' : 'км'}</span>
                          </div>
                        )}
                      </div>

                      {/* Distance Specifications for MAMBA */}
                      {mambaConfig && (
                        <div className="bg-primary/5 rounded-xl p-6">
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            {language === 'en' ? 'Flight Specifications' : 'Характеристики польоту'}
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-border/50">
                              <span className="text-muted-foreground">{language === 'en' ? 'Spool length / weight' : 'Довжина котушки / вага'}</span>
                              <span className="font-medium">{mambaConfig.fiberLength} {language === 'en' ? 'km' : 'км'} ({mambaConfig.spoolWeight} {language === 'en' ? 'kg' : 'кг'})</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/50">
                              <span className="text-muted-foreground">{language === 'en' ? 'Battery' : 'Живлення дрона'}</span>
                              <span className="font-medium">{mambaConfig.batteryCount > 1 ? `${mambaConfig.batteryCount} шт ` : ''}{mambaConfig.battery}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/50">
                              <span className="text-muted-foreground">{language === 'en' ? 'Payload' : 'Вантаж БЧ'}</span>
                              <span className="font-medium">{mambaConfig.payloadRange} {language === 'en' ? 'kg' : 'кг'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 text-center space-y-4">
                        <p className="text-lg font-semibold text-foreground">
                          {language === 'en' 
                            ? 'For current prices, please contact us:' 
                            : 'Актуальні ціни уточнюйте:'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                          <span className="flex items-center gap-2 text-primary font-medium">
                            <MessageCircle className="w-5 h-5" />
                            {language === 'en' ? 'Contact us in chat' : 'Зв\'яжіться з нами в чаті'}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          onClick={handleSaveToFavorites}
                          variant="outline"
                          className={`flex-1 h-14 text-lg gap-2 ${isConfigFavorite() ? 'border-red-500 text-red-500' : ''}`}
                          disabled={!droneSeries || !droneSize || !cameraType}
                        >
                          <Heart className={`w-5 h-5 ${isConfigFavorite() ? 'fill-red-500' : ''}`} />
                          {isConfigFavorite() 
                            ? (language === 'en' ? 'Saved' : 'Збережено')
                            : (language === 'en' ? 'Save' : 'Зберегти')}
                        </Button>
                        <Button 
                          onClick={handleAddToCart} 
                          className="flex-1 h-14 text-lg btn-teal"
                          disabled={!droneSeries || !droneSize || !cameraType}
                        >
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          {language === 'en' ? 'Add to Cart' : 'До кошика'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => step > 1 ? setStep(step - 1) : handleReset()}
                      className="gap-2"
                    >
                      {step === 1 ? (
                        <>
                          <RotateCcw className="w-4 h-4" />
                          {language === 'en' ? 'Reset' : 'Скинути'}
                        </>
                      ) : (
                        language === 'en' ? 'Back' : 'Назад'
                      )}
                    </Button>
                    {step < 6 && (
                      <Button
                        onClick={() => setStep(step + 1)}
                        disabled={!canProceed(step)}
                        className="gap-2"
                      >
                        {language === 'en' ? 'Continue' : 'Далі'}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Current Selection */}
            <div className="lg:col-span-1">
              <Card className="bg-card border-border sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {language === 'en' ? 'Current Selection' : 'Поточний вибір'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {droneSize && (
                    <div className="w-full h-40 rounded-lg overflow-hidden bg-muted/30">
                      <img 
                        src={getCurrentDroneImage()} 
                        alt="Selected drone"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'en' ? 'Series' : 'Серія'}:</span>
                      <span className="font-medium">{droneSeries?.toUpperCase() || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'en' ? 'Size' : 'Розмір'}:</span>
                      <span className="font-medium">{droneSize ? `${droneSize}"` : '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{language === 'en' ? 'Camera' : 'Камера'}:</span>
                      <span className="font-medium">
                        {cameraType 
                          ? (language === 'en' 
                              ? cameraTypes.find(c => c.id === cameraType)?.nameEn 
                              : cameraTypes.find(c => c.id === cameraType)?.name)
                          : '—'}
                      </span>
                    </div>
                    {droneSeries === "mamba" && mambaConfig && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{language === 'en' ? 'Fiber' : 'Оптоволокно'}:</span>
                        <span className="font-medium text-cyan-400">
                          {mambaConfig.fiberLength} {language === 'en' ? 'km' : 'км'}
                        </span>
                      </div>
                    )}
                    {droneSeries === "taipan" && rotaryCamera && droneSize === "10" && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{language === 'en' ? 'Rotary' : 'Поворотна'}:</span>
                        <span className="font-medium text-cyan-400">+20°/-90°</span>
                      </div>
                    )}
                  </div>

                  {/* Distance Specifications for MAMBA in sidebar */}
                  {mambaConfig && (
                    <div className="pt-4 border-t border-border space-y-3">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-cyan-400" />
                        {language === 'en' ? 'Flight Specs' : 'Характеристики'}
                      </h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Package className="w-4 h-4" />
                          {language === 'en' ? 'Payload' : 'Вантаж'}:
                        </span>
                        <span className="font-medium">
                          {mambaConfig.payloadRange} {language === 'en' ? 'kg' : 'кг'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border">
                    <div className="text-center text-muted-foreground text-sm">
                      {language === 'en' ? 'Price on request' : 'Ціна за запитом'}
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="w-full gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {language === 'en' ? 'Start Over' : 'Почати спочатку'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Configurator;
