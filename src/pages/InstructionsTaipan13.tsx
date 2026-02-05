import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DroneBackground from "@/components/DroneBackground";
import { ArrowLeft, Settings, Cpu, Radio, AlertTriangle, Info } from "lucide-react";
import { Link } from "react-router-dom";
import fcatBoardImage from "@/assets/instructions/taipan-13-fcat-board.jpg";
import motorsImage from "@/assets/instructions/taipan-13-motors.jpg";

const InstructionsTaipan13 = () => {
  const { language } = useLanguage();

  const content = {
    uk: {
      backButton: "Назад",
      pageTitle: "Інструкція ТАЙПАН 13\"",
      intro: "Коротка загальна інструкція до FPV системи 13 дюймів на радіо керуванні.",
      
      // Section 1
      section1Title: "1. Основні загальні характеристики дрона",
      maxPayload: "Максимальне корисне навантаження:",
      maxPayloadValue: "4 кг",
      flightRange: "Дальність польоту з корисним вантажем:",
      flightRangeValue: "до 20 км",
      operationalRange: "Операційна дальність дії:",
      operationalRangeValue: "до 10 км",
      flightTime: "Час польоту з максимально корисним вантажем:",
      flightTimeValue: "18 хв",
      maxAltitude: "Максимальна висота польоту:",
      maxAltitudeValue: "до 1000 м",
      cruiseSpeed: "Крейсерська швидкість руху:",
      cruiseSpeedValue: "70 км/год",
      windLoad: "Допустиме вітрове навантаження:",
      windLoadValue: "до 12 м/сек",
      recommendedBattery: "Рекомендований АКБ:",
      recommendedBatteryValue: "30 000 mAh 8s6p",
      propeller: "Пропеллер:",
      propellerValue: "13х9х3",
      tempRange: "Температурний режим роботи дрона:",
      tempRangeValue: "від –20 до +50 °C",
      batteryTemp: "Температурний режим роботи АКБ:",
      batteryTempValue: "від –20 до +50 °C",
      batteryTempNote: "Довготривале перебування АКБ при мінусовій температурі зменшує його енергоефективність та тривалість роботи. Зберігати заряджені АКБ необхідно в теплих умовах. Елементи АКБ є вибухонебезпечні, легкозаймисті, слід зберігати в залізному ящику окремо від усього обладнання.",
      chargingCurrent: "АКБ 8s6p слід заряджати струмом:",
      chargingCurrentValue: "6А",

      // Battery options table
      batteryOptionsTitle: "Варіанти акумуляторів та дальність:",
      batteryOption1: "8S4P 20000 mAh",
      batteryOption1Range: "до 10 км",
      batteryOption2: "8S5P 25000 mAh",
      batteryOption2Range: "до 15 км",
      batteryOption3: "8S6P 30000 mAh",
      batteryOption3Range: "до 20 км",

      // Section 2
      section2Title: "2. Напрямок руху моторів",
      motorDirection: "№ 2CCW та № 4CW на камеру, 1CW та 3CCW від польотного контроллера.",

      // Section 3
      section3Title: "3. Радіо частина",
      bindPhrase: "Стандартна бінд фраза від приймача керування RX або TX:",
      bindPhraseValue: "«12345678»",
      warning1: "Категорично заборонено вмикати живлення дрону без антени на відео передавачі, що призводить до виведення з ладу приладу.",
      warning2: "Категорично заборонено підносити увімкнений будь-який відео передавач дрону, навіть на мінімальній потужності, близько до відео приймача. При тестуванні VTX на дроні слід тримати його подалі від приймача відео VRX від 5 метрів і більше.",

      // Section 4
      section4Title: "4. Загальні застереження та рекомендації",
      recommendation1: "При зміні прошивки дрону, наприклад на MILERLS, зберігай Dump для відновлення налаштувань.",
      recommendation2: "Дрони обладнані платами ініціації «FCAT» що є досить простими в експлуатації. Працюють як самостійний прилад так і від сигнального дроту що припаяний і налаштований на польотний контроллер.",
      recommendation3: "Надпис «рух» на платі ініціації означає напрямок руху плати на дроні в повітрі.",
      recommendation4: "Плати обладнані системами запобіжників що захищають від випадкових увімкнених тумблерів на пульті під час подачі живлення на дрон, захист від невірно припаяних дротів, захист вмикається навіть коли невірно налаштований AUX, а плата підʼєднана до польотного контроллера.",
      recommendation5: "Див. інструкції плати ініціації в окремому вкладищі.",
      recommendation6: "Рекомендовано тестувати плати за допомогою електро сірників.",
    },
    en: {
      backButton: "Back",
      pageTitle: "TAIPAN 13\" Instructions",
      intro: "Brief general instructions for the 13-inch FPV radio-controlled system.",
      
      // Section 1
      section1Title: "1. Main Drone Specifications",
      maxPayload: "Maximum payload:",
      maxPayloadValue: "4 kg",
      flightRange: "Flight range with payload:",
      flightRangeValue: "up to 20 km",
      operationalRange: "Operational range:",
      operationalRangeValue: "up to 10 km",
      flightTime: "Flight time with maximum payload:",
      flightTimeValue: "18 min",
      maxAltitude: "Maximum flight altitude:",
      maxAltitudeValue: "up to 1000 m",
      cruiseSpeed: "Cruising speed:",
      cruiseSpeedValue: "70 km/h",
      windLoad: "Allowable wind load:",
      windLoadValue: "up to 12 m/s",
      recommendedBattery: "Recommended battery:",
      recommendedBatteryValue: "30,000 mAh 8s6p",
      propeller: "Propeller:",
      propellerValue: "13x9x3",
      tempRange: "Drone operating temperature:",
      tempRangeValue: "from –20 to +50 °C",
      batteryTemp: "Battery operating temperature:",
      batteryTempValue: "from –20 to +50 °C",
      batteryTempNote: "Prolonged exposure of the battery to sub-zero temperatures reduces its energy efficiency and operating time. Charged batteries should be stored in warm conditions. Battery cells are explosive and flammable, store in a metal box separately from all equipment.",
      chargingCurrent: "8s6p battery should be charged at:",
      chargingCurrentValue: "6A",

      // Battery options table
      batteryOptionsTitle: "Battery options and range:",
      batteryOption1: "8S4P 20000 mAh",
      batteryOption1Range: "up to 10 km",
      batteryOption2: "8S5P 25000 mAh",
      batteryOption2Range: "up to 15 km",
      batteryOption3: "8S6P 30000 mAh",
      batteryOption3Range: "up to 20 km",

      // Section 2
      section2Title: "2. Motor Rotation Direction",
      motorDirection: "Motor #2 CCW and #4 CW toward camera, #1 CW and #3 CCW from flight controller.",

      // Section 3
      section3Title: "3. Radio Section",
      bindPhrase: "Standard bind phrase for RX or TX receiver:",
      bindPhraseValue: "\"12345678\"",
      warning1: "It is strictly forbidden to power on the drone without an antenna on the video transmitter, as this will damage the device.",
      warning2: "It is strictly forbidden to bring any powered video transmitter, even at minimum power, close to the video receiver. When testing VTX on the drone, keep it at least 5 meters away from the VRX video receiver.",

      // Section 4
      section4Title: "4. General Warnings and Recommendations",
      recommendation1: "When changing drone firmware, for example to MILERLS, save the Dump to restore settings.",
      recommendation2: "Drones are equipped with \"FCAT\" initiation boards that are fairly simple to operate. They work both as a standalone device and from a signal wire soldered and configured to the flight controller.",
      recommendation3: "The \"movement\" label on the initiation board indicates the direction of board movement on the drone in flight.",
      recommendation4: "The boards are equipped with safety systems that protect against accidentally activated switches on the remote during drone power-up, protection against incorrectly soldered wires, protection activates even when AUX is incorrectly configured while the board is connected to the flight controller.",
      recommendation5: "See initiation board instructions in separate attachment.",
      recommendation6: "It is recommended to test boards using electric matches.",
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#050d18] relative">
      <DroneBackground />
      <Header />
      
      <main className="relative z-10 container mx-auto px-4 py-12 max-w-4xl">
        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backButton}
        </Link>

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Settings className="w-6 h-6 text-cyan-400" />
          </div>
          {t.pageTitle}
        </h1>

        {/* Introduction */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6 mb-8">
          <p className="text-slate-300 leading-relaxed">
            {t.intro}
          </p>
        </div>

        {/* Section 1: Main Specifications */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            {t.section1Title}
          </h2>
          <div className="bg-[#0d1d35]/80 border border-slate-700/50 rounded-xl p-5">
            <div className="grid gap-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                <span className="text-slate-400">{t.maxPayload}</span>
                <span className="text-cyan-300 font-medium">{t.maxPayloadValue}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                <span className="text-slate-400">{t.flightRange}</span>
                <span className="text-cyan-300 font-medium">{t.flightRangeValue}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                <span className="text-slate-400">{t.operationalRange}</span>
                <span className="text-cyan-300 font-medium">{t.operationalRangeValue}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                <span className="text-slate-400">{t.flightTime}</span>
                <span className="text-cyan-300 font-medium">{t.flightTimeValue}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                <span className="text-slate-400">{t.maxAltitude}</span>
                <span className="text-cyan-300 font-medium">{t.maxAltitudeValue}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                <span className="text-slate-400">{t.cruiseSpeed}</span>
                <span className="text-cyan-300 font-medium">{t.cruiseSpeedValue}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                <span className="text-slate-400">{t.windLoad}</span>
                <span className="text-cyan-300 font-medium">{t.windLoadValue}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                <span className="text-slate-400">{t.recommendedBattery}</span>
                <span className="text-cyan-300 font-medium">{t.recommendedBatteryValue}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                <span className="text-slate-400">{t.propeller}</span>
                <span className="text-cyan-300 font-medium">{t.propellerValue}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                <span className="text-slate-400">{t.tempRange}</span>
                <span className="text-cyan-300 font-medium">{t.tempRangeValue}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-700/30">
                <span className="text-slate-400">{t.batteryTemp}</span>
                <span className="text-cyan-300 font-medium">{t.batteryTempValue}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-400">{t.chargingCurrent}</span>
                <span className="text-cyan-300 font-medium">{t.chargingCurrentValue}</span>
              </div>
            </div>
            
            {/* Battery warning note */}
            <div className="mt-4 bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-orange-200 text-sm leading-relaxed">
                  {t.batteryTempNote}
                </p>
              </div>
            </div>

            {/* Battery options table */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-3">{t.batteryOptionsTitle}</h3>
              <div className="bg-[#050d18] rounded-lg overflow-hidden">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-slate-700/30">
                      <td className="px-4 py-3 text-slate-300">{t.batteryOption1}</td>
                      <td className="px-4 py-3 text-cyan-300 font-medium text-right">{t.batteryOption1Range}</td>
                    </tr>
                    <tr className="border-b border-slate-700/30">
                      <td className="px-4 py-3 text-slate-300">{t.batteryOption2}</td>
                      <td className="px-4 py-3 text-cyan-300 font-medium text-right">{t.batteryOption2Range}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-300">{t.batteryOption3}</td>
                      <td className="px-4 py-3 text-cyan-300 font-medium text-right">{t.batteryOption3Range}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Motor Direction */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            {t.section2Title}
          </h2>
          <div className="bg-[#0d1d35]/80 border border-slate-700/50 rounded-xl p-5">
            <div className="bg-[#050d18] rounded-lg p-4 font-mono text-sm mb-4">
              <p className="text-cyan-300">{t.motorDirection}</p>
            </div>
            {/* Motor direction diagram */}
            <div className="flex justify-center">
              <img 
                src={motorsImage} 
                alt="Motor rotation direction" 
                className="max-w-xs h-auto rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Radio Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400" />
            {t.section3Title}
          </h2>
          <div className="bg-[#0d1d35]/80 border border-slate-700/50 rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">{t.bindPhrase}</span>
              <span className="text-cyan-300 font-mono font-medium">{t.bindPhraseValue}</span>
            </div>
            
            {/* Warnings */}
            <div className="space-y-3 mt-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-200 text-sm leading-relaxed">
                    {t.warning1}
                  </p>
                </div>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-200 text-sm leading-relaxed">
                    {t.warning2}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Recommendations */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-400" />
            {t.section4Title}
          </h2>
          <div className="bg-[#0d1d35]/80 border border-slate-700/50 rounded-xl p-5">
            <ul className="space-y-4 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                <span>{t.recommendation1}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                <span>{t.recommendation2}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                <span>{t.recommendation3}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                <span>{t.recommendation4}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                <span>{t.recommendation5}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                <span>{t.recommendation6}</span>
              </li>
            </ul>
            
            {/* FCAT board image */}
            <div className="flex justify-center mt-6">
              <img 
                src={fcatBoardImage} 
                alt="FCAT initiation board" 
                className="max-w-full h-auto rounded-lg border border-slate-700/50"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default InstructionsTaipan13;
