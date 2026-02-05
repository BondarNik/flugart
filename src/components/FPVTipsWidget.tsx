import React, { useState, useEffect } from 'react';
import { Lightbulb, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const FPVTipsWidget: React.FC = () => {
  const { language } = useLanguage();
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const tips = {
    uk: [
      {
        title: "Перевірка перед польотом",
        tip: "Завжди перевіряйте пропелери на тріщини та пошкодження перед кожним польотом. Навіть маленька тріщина може призвести до аварії.",
        category: "Безпека"
      },
      {
        title: "Оптимальна температура батареї",
        tip: "Батареї Flugart найкраще працюють при температурі 20-25°C. У холодну погоду прогрійте батарею перед польотом до 15°C мінімум.",
        category: "Батареї"
      },
      {
        title: "Правило 30%",
        tip: "Завжди залишайте мінімум 30% заряду батареї для безпечного повернення. Враховуйте вітер — він може сповільнити повернення.",
        category: "Політ"
      },
      {
        title: "Калібрування компаса",
        tip: "Калібруйте компас кожного разу, коли летите в новому місці або після транспортування дрона на велику відстань.",
        category: "Налаштування"
      },
      {
        title: "Уникайте магнітних перешкод",
        tip: "Тримайтеся подалі від металевих конструкцій, ліній електропередач та великих металевих об'єктів — вони впливають на компас.",
        category: "Безпека"
      },
      {
        title: "Перший політ на новому місці",
        tip: "На новому місці спочатку зробіть короткий тестовий політ на невеликій висоті, щоб перевірити сигнал та поведінку дрона.",
        category: "Політ"
      },
      {
        title: "Зберігання батарей",
        tip: "Зберігайте батареї Flugart при заряді 40-60%. Повністю заряджені або розряджені батареї швидше деградують.",
        category: "Батареї"
      },
      {
        title: "Вітер та політ",
        tip: "Максимальна безпечна швидкість вітру для FPV — 10 м/с. При сильнішому вітрі краще відкласти політ.",
        category: "Погода"
      },
      {
        title: "Резервний план",
        tip: "Завжди майте план дій на випадок втрати сигналу. Налаштуйте RTH (Return to Home) на безпечну висоту.",
        category: "Безпека"
      },
      {
        title: "Чистка після польоту",
        tip: "Після польоту очищуйте дрон від пилу та бруду. Особливу увагу приділіть моторам та системі охолодження.",
        category: "Обслуговування"
      },
      {
        title: "Оптоволокно та температура",
        tip: "При використанні оптоволокна уникайте різких перегинів кабелю — це може пошкодити волокно, особливо при низьких температурах.",
        category: "Оптоволокно"
      },
      {
        title: "Тренування на симуляторі",
        tip: "Регулярно тренуйтесь на FPV симуляторі. Це безкоштовний спосіб покращити навички без ризику пошкодити обладнання.",
        category: "Тренування"
      }
    ],
    en: [
      {
        title: "Pre-flight Check",
        tip: "Always inspect propellers for cracks and damage before each flight. Even a small crack can lead to a crash.",
        category: "Safety"
      },
      {
        title: "Optimal Battery Temperature",
        tip: "Flugart batteries perform best at 20-25°C. In cold weather, warm the battery to at least 15°C before flying.",
        category: "Batteries"
      },
      {
        title: "The 30% Rule",
        tip: "Always keep at least 30% battery charge for safe return. Consider wind — it can slow down your return journey.",
        category: "Flight"
      },
      {
        title: "Compass Calibration",
        tip: "Calibrate the compass every time you fly in a new location or after transporting the drone over long distances.",
        category: "Settings"
      },
      {
        title: "Avoid Magnetic Interference",
        tip: "Stay away from metal structures, power lines, and large metal objects — they affect the compass readings.",
        category: "Safety"
      },
      {
        title: "First Flight at New Location",
        tip: "At a new location, first do a short test flight at low altitude to check signal and drone behavior.",
        category: "Flight"
      },
      {
        title: "Battery Storage",
        tip: "Store Flugart batteries at 40-60% charge. Fully charged or discharged batteries degrade faster.",
        category: "Batteries"
      },
      {
        title: "Wind and Flight",
        tip: "Maximum safe wind speed for FPV is 10 m/s. In stronger winds, it's better to postpone the flight.",
        category: "Weather"
      },
      {
        title: "Backup Plan",
        tip: "Always have an action plan for signal loss. Set RTH (Return to Home) to a safe altitude.",
        category: "Safety"
      },
      {
        title: "Post-flight Cleaning",
        tip: "After flying, clean the drone from dust and dirt. Pay special attention to motors and cooling system.",
        category: "Maintenance"
      },
      {
        title: "Fiber Optic and Temperature",
        tip: "When using fiber optic, avoid sharp cable bends — this can damage the fiber, especially at low temperatures.",
        category: "Fiber Optic"
      },
      {
        title: "Simulator Training",
        tip: "Practice regularly on FPV simulators. It's a free way to improve skills without risking equipment damage.",
        category: "Training"
      }
    ]
  };

  const translations = {
    uk: {
      title: "Порада дня",
      nextTip: "Наступна",
      prevTip: "Попередня",
      tipOf: "з"
    },
    en: {
      title: "Tip of the Day",
      nextTip: "Next",
      prevTip: "Previous",
      tipOf: "of"
    }
  };

  const t = translations[language];
  const currentTips = tips[language];

  // Set random tip on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * currentTips.length);
    setCurrentTipIndex(randomIndex);
  }, []);

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % currentTips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + currentTips.length) % currentTips.length);
  };

  const randomTip = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * currentTips.length);
    } while (newIndex === currentTipIndex && currentTips.length > 1);
    setCurrentTipIndex(newIndex);
  };

  const currentTip = currentTips[currentTipIndex];

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Безпека': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Safety': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Батареї': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Batteries': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Політ': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Flight': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Налаштування': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Settings': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Погода': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Weather': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Обслуговування': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Maintenance': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Оптоволокно': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Fiber Optic': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Тренування': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'Training': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 relative z-20 h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            {t.title}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={randomTip}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-yellow-400"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Category Badge */}
          <span className={`inline-block px-2 py-0.5 rounded-full text-xs border ${getCategoryColor(currentTip.category)}`}>
            {currentTip.category}
          </span>

          {/* Tip Title */}
          <h3 className="font-semibold text-foreground">
            {currentTip.title}
          </h3>

          {/* Tip Content */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentTip.tip}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevTip}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t.prevTip}
          </Button>
          
          <span className="text-xs text-muted-foreground">
            {currentTipIndex + 1} {t.tipOf} {currentTips.length}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextTip}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            {t.nextTip}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FPVTipsWidget;
