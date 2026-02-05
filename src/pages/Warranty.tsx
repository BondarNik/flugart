import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Clock, AlertTriangle, CheckCircle, XCircle, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Warranty = () => {
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
            {t("warrantyPageTitle")}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {t("warrantyPageSubtitle")}
          </p>
        </div>

        {/* Warranty period highlight */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-500/40 rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-cyan-500/20">
                <Shield className="w-12 h-12 text-cyan-400" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">{t("warrantyPeriod")}</h2>
            <p className="text-cyan-300 text-lg">{t("warrantyPeriodText")}</p>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* General terms */}
          <div className="bg-slate-800/30 border border-cyan-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <Clock className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t("warrantyTermsTitle")}</h2>
            </div>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                {t("warrantyTerm1")}
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                {t("warrantyTerm2")}
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></span>
                {t("warrantyTerm3")}
              </li>
            </ul>
          </div>

          {/* What's covered */}
          <div className="bg-slate-800/30 border border-cyan-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-green-500/20">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t("warrantyCoveredTitle")}</h2>
            </div>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                {t("warrantyCovered1")}
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                {t("warrantyCovered2")}
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                {t("warrantyCovered3")}
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                {t("warrantyCovered4")}
              </li>
            </ul>
          </div>

          {/* What's not covered */}
          <div className="bg-slate-800/30 border border-red-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-red-500/20">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t("warrantyNotCoveredTitle")}</h2>
            </div>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                {t("warrantyNotCovered1")}
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                {t("warrantyNotCovered2")}
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                {t("warrantyNotCovered3")}
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                {t("warrantyNotCovered4")}
              </li>
            </ul>
          </div>

          {/* How to claim */}
          <div className="bg-slate-800/30 border border-cyan-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <AlertTriangle className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t("warrantyClaimTitle")}</h2>
            </div>
            <ol className="space-y-3 text-slate-300 list-decimal list-inside">
              <li>{t("warrantyClaim1")}</li>
              <li>{t("warrantyClaim2")}</li>
              <li>{t("warrantyClaim3")}</li>
              <li>{t("warrantyClaim4")}</li>
            </ol>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 border border-cyan-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-cyan-500/20">
                <Mail className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t("warrantyContactTitle")}</h2>
            </div>
            <p className="text-slate-300 mb-4">
              {t("warrantyContactTextEmail")}
            </p>
            <a 
              href="mailto:flugart.d@gmail.com" 
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
            >
              <Mail className="w-4 h-4" />
              flugart.d@gmail.com
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Warranty;
