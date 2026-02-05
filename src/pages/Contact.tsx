import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MapPin, Send, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DroneBackground from "@/components/DroneBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    name: z.string().trim().min(1, { message: t("enterName") }).max(100),
    email: z.string().trim().email({ message: t("invalidEmail") }).max(255),
    phone: z.string().trim().min(1, { message: t("enterPhoneNumber") }).max(20),
    message: z.string().trim().min(1, { message: t("enterMessage") }).max(1000),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("contact_requests").insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      });

      if (error) throw error;

      toast({
        title: t("messageSent"),
        description: t("willContactYou"),
      });
      
      form.reset();
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        title: t("error"),
        description: "Помилка при відправці повідомлення",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#050d18] text-foreground relative">
      <DroneBackground />
      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-cyan-400 transition-colors">
            {t("home")}
          </Link>
          <span>/</span>
          <span className="text-foreground">{t("contactPage")}</span>
        </nav>

        {/* Back button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("goBack")}
        </Link>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {t("contactPage")}
          </h1>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            {t("contactDescription")}
          </p>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                {t("sendMessage")}
              </h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("yourName")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={t("enterName")} 
                            {...field}
                            className="bg-background/50 border-border/50 focus:border-cyan-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("email")}</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder={t("enterEmail")} 
                            {...field}
                            className="bg-background/50 border-border/50 focus:border-cyan-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("phone")}</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel"
                            placeholder={t("enterPhone")} 
                            {...field}
                            className="bg-background/50 border-border/50 focus:border-cyan-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("yourMessage")}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={t("enterMessage")} 
                            rows={5}
                            {...field}
                            className="bg-background/50 border-border/50 focus:border-cyan-500 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("sending")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        {t("sendButton")}
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Contact Cards */}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-6">{t("contactInfo")}</h2>
                
                <div className="space-y-5">
                  <a 
                    href="mailto:flugart.d@gmail.com" 
                    className="flex items-start gap-4 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors group"
                  >
                    <div className="p-3 rounded-lg bg-cyan-500/20">
                      <Mail className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-sm text-cyan-400 mb-1">Email</div>
                      <div className="text-lg font-medium group-hover:text-cyan-300 transition-colors">
                        flugart.d@gmail.com
                      </div>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-500/10 border border-slate-500/20">
                    <div className="p-3 rounded-lg bg-slate-500/20">
                      <MapPin className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-1">{t("addressLabel")}</div>
                      <div className="text-lg font-medium">{t("location")}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">{t("socialMedia")}</h3>
                <div className="flex gap-3">
                  <a 
                    href="https://www.facebook.com/share/1AspSFo9s3/?mibextid=wwXIfr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                  >
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://www.instagram.com/flugart_ua?igsh=MWswcmczeGY1djYzMA==" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 transition-colors"
                  >
                    <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://t.me/flugart_ua" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 transition-colors"
                  >
                    <svg className="w-5 h-5 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
