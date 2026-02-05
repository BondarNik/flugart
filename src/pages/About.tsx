import { Link } from "react-router-dom";
import { ArrowLeft, Target, Users, Award, Wrench, Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#050d18]">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("goBack")}
        </Link>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("aboutPageTitle")}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {t("aboutPageSubtitle")}
          </p>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Company intro */}
          <div className="bg-slate-800/30 border border-cyan-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <Target className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t("aboutMissionTitle")}</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {t("aboutMissionText")}
            </p>
          </div>

          {/* History */}
          <div className="bg-slate-800/30 border border-cyan-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <Calendar className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t("aboutHistoryTitle")}</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {t("aboutHistoryText")}
            </p>
          </div>

          {/* What we do */}
          <div className="bg-slate-800/30 border border-cyan-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <Wrench className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t("aboutServicesTitle")}</h2>
            </div>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                {t("aboutService1")}
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                {t("aboutService2")}
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                {t("aboutService3")}
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                {t("aboutService4")}
              </li>
            </ul>
          </div>

          {/* Team */}
          <div className="bg-slate-800/30 border border-cyan-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t("aboutTeamTitle")}</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {t("aboutTeamText")}
            </p>
          </div>

          {/* Values */}
          <div className="bg-slate-800/30 border border-cyan-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <Award className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t("aboutValuesTitle")}</h2>
            </div>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                {t("aboutValue1")}
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                {t("aboutValue2")}
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                {t("aboutValue3")}
              </li>
            </ul>
          </div>

          {/* Location */}
          <div className="bg-slate-800/30 border border-cyan-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <MapPin className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t("aboutLocationTitle")}</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {t("aboutLocationText")}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
