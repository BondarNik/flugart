import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DroneBackground from "@/components/DroneBackground";
import { ArrowLeft, CheckCircle, AlertTriangle, Plane, Settings, Rocket, Navigation } from "lucide-react";
import { Link } from "react-router-dom";

const Instructions = () => {
  const { t } = useLanguage();

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
          {t("goBack")}
        </Link>

        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Settings className="w-6 h-6 text-cyan-400" />
          </div>
          {t("instructionTitle")}
        </h1>

        {/* Introduction */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6 mb-8">
          <p className="text-slate-300 leading-relaxed">
            {t("instructionIntro")}
          </p>
        </div>

        {/* UAV Checklist */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-cyan-400" />
            {t("checkUavCompleteness")}
          </h2>
          <div className="bg-[#0d1d35]/80 border border-slate-700/50 rounded-xl p-5">
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                {t("uavItem1")}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                {t("uavItem2")}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                {t("uavItem3")}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                {t("uavItem4")}
              </li>
            </ul>
          </div>
        </section>

        {/* Ground Station Checklist */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-cyan-400" />
            {t("checkStationCompleteness")}
          </h2>
          <div className="bg-[#0d1d35]/80 border border-slate-700/50 rounded-xl p-5">
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                {t("stationItem1")}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                {t("stationItem2")}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                {t("stationItem3")}
              </li>
            </ul>
          </div>
        </section>

        {/* Preparation for Operation */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            {t("prepareForOperation")}
          </h2>
          <div className="bg-[#0d1d35]/80 border border-slate-700/50 rounded-xl p-5">
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></span>
                <span>{t("prepareStep1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></span>
                <span>{t("prepareStep2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></span>
                <span>{t("prepareStep3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></span>
                <span>{t("prepareStep4")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></span>
                <span>{t("prepareStep5")}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Controller Settings */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            {t("controllerSettings")}
          </h2>
          <div className="bg-[#0d1d35]/80 border border-slate-700/50 rounded-xl p-5">
            <p className="text-slate-300 mb-4">{t("controllerSettingsIntro")}</p>
            <div className="bg-[#050d18] rounded-lg p-4 font-mono text-sm space-y-2">
              <p className="text-cyan-300">CH1-CH4 – {t("channelAETR")}</p>
              <p className="text-cyan-300">AUX1 – {t("channelARM")}</p>
              <p className="text-cyan-300">AUX2 – {t("channelModes")}</p>
              <p className="text-cyan-300">AUX3 – {t("channelActivation")}</p>
            </div>
          </div>
        </section>

        {/* Pre-Flight Preparation */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-cyan-400" />
            {t("preFlightPrep")}
          </h2>
          <div className="bg-[#0d1d35]/80 border border-slate-700/50 rounded-xl p-5">
            <p className="text-slate-300 mb-4">{t("preFlightIntro")}</p>
            <p className="text-slate-300 mb-4">{t("preFlightPlace")}</p>
            
            <h3 className="text-white font-medium mb-3 mt-6">{t("spoolPrep")}</h3>
            <ul className="space-y-2 text-slate-300 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">○</span>
                <span>{t("spoolStep1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">○</span>
                <span>{t("spoolStep2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-semibold">(!) </span>
                <span className="text-orange-300">{t("spoolStep3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-semibold">(!) </span>
                <span className="text-orange-300">{t("spoolStep4")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-semibold">(!) </span>
                <span className="text-red-300">{t("spoolStep5")}</span>
              </li>
            </ul>

            <ul className="space-y-3 text-slate-300 mt-6">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></span>
                <span>{t("connectionStep1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></span>
                <span>{t("connectionStep2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></span>
                <span>{t("connectionStep3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2"></span>
                <span>{t("connectionStep4")}</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Takeoff */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Plane className="w-5 h-5 text-cyan-400" />
            {t("takeoffTitle")}
          </h2>
          <div className="bg-[#0d1d35]/80 border border-slate-700/50 rounded-xl p-5">
            <p className="text-slate-300 leading-relaxed">
              {t("takeoffText")}
            </p>
          </div>
        </section>

        {/* In-Flight Control */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-cyan-400" />
            {t("flightControlTitle")}
          </h2>
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/30 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <p className="text-orange-200 leading-relaxed">
                {t("flightControlWarning")}
              </p>
            </div>
          </div>
        </section>

        {/* Final Message */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 rounded-2xl p-8 text-center">
          <p className="text-xl text-cyan-300 font-medium">
            {t("happyFlight")}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Instructions;