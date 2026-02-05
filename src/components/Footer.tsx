import { Phone, Mail, MapPin, Facebook, Instagram, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 bg-gradient-to-b from-[#0a1628] to-[#050d18] text-white py-16 border-t border-cyan-500/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Logo & Description */}
          <div className="space-y-4">
            <a href="/" className="inline-block">
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">Flugart</span>
            </a>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t("footerDescription")}
            </p>
            {/* Social moved here */}
            <div className="flex gap-3 pt-2">
              <a href="https://www.facebook.com/share/1AspSFo9s3/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 group">
                <Facebook className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
              </a>
              <a href="https://www.instagram.com/flugart_ua/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 group">
                <Instagram className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
              </a>
              <a href="https://t.me/flugart_ua" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 group">
                <Send className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-5 text-white text-sm uppercase tracking-wider">{t("footerCatalog")}</h4>
            <ul className="space-y-3">
              <li><a href="/search?category=БпАК" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"></span>{t("uavKits")}</a></li>
              <li><a href="/search?category=FPV%20Дрони" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"></span>{t("fpvDrones")}</a></li>
              <li><a href="/search?category=Наземні%20станції" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"></span>{t("groundStationsCategory")}</a></li>
              <li><a href="/search?category=Акумулятори" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"></span>{t("footerBatteriesCustom")}</a></li>
              <li><a href="/search?category=Котушки%20з%20оптоволокном" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"></span>{t("fiberSpools")}</a></li>
              <li><a href="/search?category=3D%20Друк" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"></span>{t("printing3d")}</a></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold mb-5 text-white text-sm uppercase tracking-wider">{t("footerInfo")}</h4>
            <ul className="space-y-3">
              <li><a href="/about" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"></span>{t("footerAbout")}</a></li>
              <li><a href="/delivery" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"></span>{t("footerDelivery")}</a></li>
              <li><a href="/warranty" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"></span>{t("footerWarranty")}</a></li>
              <li><a href="/contact" className="text-slate-400 hover:text-cyan-300 transition-colors text-sm flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors"></span>{t("contactPage")}</a></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-semibold mb-5 text-white text-sm uppercase tracking-wider">{t("footerContacts")}</h4>
            <ul className="space-y-4">
              <li>
              <a href="mailto:flugart.d@gmail.com" className="flex items-center gap-3 text-slate-400 hover:text-cyan-300 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-sm">flugart.d@gmail.com</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-slate-400 text-sm">{t("location")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            {t("footerRights")}
          </p>
          <div className="flex gap-6">
            <a href="/privacy-policy" className="text-slate-500 hover:text-cyan-400 transition-colors text-sm">
              {t("footerPrivacy")}
            </a>
            <a href="/terms-of-use" className="text-slate-500 hover:text-cyan-400 transition-colors text-sm">
              {t("footerTerms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
