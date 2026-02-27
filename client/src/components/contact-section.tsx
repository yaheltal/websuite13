import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Send, CheckCircle2, MessageSquare, Phone, Mail, Clock, Award, ArrowLeft, Sparkles, Zap, FileText } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function ContactSection() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { t, lang } = useI18n();

  const serviceOptions = [
    { value: "business-card", label: t("contact.service.card") },
    { value: "landing-page", label: t("contact.service.landing") },
    { value: "ecommerce", label: t("contact.service.ecommerce") },
    { value: "other", label: t("contact.service.other") },
  ];

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  const [emailFailed, setEmailFailed] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return res.json();
    },
    onSuccess: (result: any) => {
      if (result.fallback) {
        setEmailFailed(true);
      }
    },
    onError: () => {
      toast({
        title: t("contact.error.title"),
        description: t("contact.error.desc"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    setEmailFailed(false);
    mutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 md:py-32 relative" data-testid="section-contact">
      <div className="absolute inset-0 bg-background/30 rounded-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge variant="secondary" className="mb-4 bg-copper/8 text-copper-dark border-copper/15">{t("contact.badge")}</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-charcoal" data-testid="text-contact-title">
            {t("contact.title1")}
            <br />
            <span className="text-copper">{t("contact.title2")}</span>
          </h2>
          <p className="text-charcoal-light text-lg max-w-xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="rounded-xl border border-border/50 bg-card p-6 md:p-8 shadow-sm">
              {mutation.isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                  data-testid="contact-success"
                >
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", damping: 15 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                    style={{ background: "linear-gradient(135deg, hsl(160 60% 92%), hsl(170 50% 88%))" }}
                  >
                    <CheckCircle2 className="w-10 h-10" style={{ color: "hsl(160 55% 42%)" }} />
                  </motion.div>

                  <h3 className="text-2xl font-extrabold text-charcoal mb-3" data-testid="text-success-title">
                    {t("contact.success.title")}
                  </h3>
                  <p className="text-charcoal-light mb-6 max-w-sm mx-auto leading-relaxed">
                    {t("contact.success.desc")}
                  </p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-copper/[0.04] to-sand-light border-2 border-copper/20 rounded-2xl p-5 mb-6 w-full max-w-sm text-right"
                  >
                    <div className="space-y-3">
                      {[
                        { icon: Clock, text: t("contact.success.item1") },
                        { icon: Zap, text: t("contact.success.item2") },
                        { icon: FileText, text: t("contact.success.item3") },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-lg bg-copper/10 flex items-center justify-center flex-shrink-0">
                            <item.icon className="w-4 h-4 text-copper" />
                          </div>
                          <span className="text-sm text-charcoal">{item.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {emailFailed && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 w-full max-w-sm text-right"
                      data-testid="fallback-whatsapp-notice"
                    >
                      <p className="text-sm text-blue-800 mb-3">
                        {t("contact.fallback")}
                      </p>
                      <a
                        href="https://wa.me/972547966616?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%A4%D7%95%D7%A0%D7%94%20%D7%93%D7%A8%D7%9A%20%D7%90%D7%AA%D7%A8%20WebSuite%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%A0%D7%95%D7%A1%D7%A4%D7%99%D7%9D%20%D7%A2%D7%9C%20%D7%94%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99%D7%9D%20%D7%A9%D7%9C%D7%9B%D7%9D"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition-colors"
                        data-testid="link-whatsapp-fallback"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {t("contact.fallback.cta")}
                      </a>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col items-center gap-3 w-full max-w-sm"
                  >
                    <Button
                      onClick={() => navigate("/onboarding")}
                      className="w-full bg-gradient-to-l from-copper to-copper-dark text-white px-8 py-6 text-lg font-bold rounded-2xl shadow-md hover:shadow-lg transition-shadow"
                      data-testid="button-continue-onboarding"
                    >
                      <Sparkles className="w-5 h-5 ml-2" />
                      {t("contact.success.cta")}
                      <ArrowLeft className="w-5 h-5 mr-2" />
                    </Button>
                    <button
                      onClick={() => { mutation.reset(); setEmailFailed(false); }}
                      className="text-sm text-charcoal-light hover:text-charcoal transition-colors"
                      data-testid="button-send-another"
                    >
                      {t("contact.success.dismiss")}
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" data-testid="form-contact">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contact.name")} <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder={t("contact.name.placeholder")} {...field} data-testid="input-name" />
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
                            <FormLabel>{t("contact.email")} <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="name@example.com" dir="ltr" {...field} data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contact.phone")} <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="054-1234567" dir="ltr" {...field} value={field.value || ""} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contact.service")} <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-service">
                                  <SelectValue placeholder={t("contact.service.placeholder")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {serviceOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.message")} <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t("contact.message.placeholder")}
                              className="min-h-[120px] resize-none"
                              {...field}
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-l from-copper to-copper-dark text-white font-extrabold border-0 shadow-md"
                      disabled={mutation.isPending}
                      data-testid="button-submit-contact"
                    >
                      {mutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t("contact.sending")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          {t("contact.submit")}
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-5"
          >
            <div className="grid grid-cols-5 gap-3 auto-rows-auto">
              <a
                href="https://wa.me/972547966616?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A0%D7%99%20%D7%A4%D7%95%D7%A0%D7%94%20%D7%93%D7%A8%D7%9A%20%D7%90%D7%AA%D7%A8%20WebSuite%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%A0%D7%95%D7%A1%D7%A4%D7%99%D7%9D%20%D7%A2%D7%9C%20%D7%94%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99%D7%9D%20%D7%A9%D7%9C%D7%9B%D7%9D"
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-5 relative overflow-hidden rounded-2xl p-6 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(160deg, #20b858 0%, #128c3e 100%)",
                }}
                data-testid="link-contact-whatsapp"
              >
                <svg className="absolute -bottom-10 -left-10 w-44 h-44 opacity-[0.06]" viewBox="0 0 48 48" fill="white">
                  <path d="M24 4C12.95 4 4 12.95 4 24c0 3.52.92 6.83 2.52 9.72L4 44l10.55-2.77A19.87 19.87 0 0024 44c11.05 0 20-8.95 20-20S35.05 4 24 4z"/>
                </svg>
                <svg className="absolute top-2 left-6 w-16 h-16 opacity-[0.05]" viewBox="0 0 48 48" fill="white">
                  <path d="M34 6H14a4 4 0 00-4 4v28a4 4 0 004 4h20a4 4 0 004-4V10a4 4 0 00-4-4zM24 40a2 2 0 110-4 2 2 0 010 4z"/>
                </svg>
                <div className="relative flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                      <path d="M16 3C8.82 3 3 8.82 3 16c0 2.45.68 4.74 1.86 6.7L3 29l6.5-1.7A12.9 12.9 0 0016 29c7.18 0 13-5.82 13-13S23.18 3 16 3z" fill="white" fillOpacity="0.15"/>
                      <path d="M16 5C9.92 5 5 9.92 5 16c0 2.15.62 4.16 1.7 5.86l-1.12 4.1 4.2-1.1A10.94 10.94 0 0016 27c6.08 0 11-4.92 11-11S22.08 5 16 5z" stroke="white" strokeWidth="1.5" fill="none"/>
                      <path d="M12.5 10.5c-.3-.67-.62-.68-.9-.7h-.77c-.27 0-.7.1-1.07.52s-1.4 1.37-1.4 3.33 1.44 3.86 1.64 4.13c.2.27 2.78 4.43 6.86 6.04 3.4 1.34 4.1 1.07 4.83 1 .74-.07 2.38-.97 2.72-1.9.33-.94.33-1.74.23-1.91-.1-.17-.37-.27-.77-.47s-2.38-1.17-2.75-1.31c-.37-.13-.64-.2-.9.2-.27.4-1.04 1.3-1.27 1.57-.23.27-.47.3-.87.1s-1.7-.63-3.23-2c-1.2-1.06-2-2.38-2.23-2.78-.23-.4-.02-.62.18-.82.18-.18.4-.47.6-.7.2-.24.27-.4.4-.67.14-.27.07-.5-.03-.7-.1-.2-.9-2.17-1.24-2.97z" fill="white"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-white text-lg mb-0.5">{lang === "he" ? "דברו איתנו עכשיו" : "Chat With Us Now"}</h3>
                    <p className="text-white/60 text-xs">{t("contact.whatsapp.subtitle")}</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 group-hover:-translate-x-1 transition-all duration-300">
                    <ArrowLeft className="w-4 h-4 text-white/80" />
                  </div>
                </div>
              </a>

              <a
                href="tel:+972547966616"
                className="col-span-3 relative overflow-hidden rounded-2xl p-5 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(150deg, hsl(225 75% 52%) 0%, hsl(255 65% 45%) 100%)",
                }}
                data-testid="link-contact-phone"
              >
                <svg className="absolute -top-4 -right-4 w-24 h-24 opacity-[0.06]" viewBox="0 0 48 48" fill="white">
                  <circle cx="24" cy="24" r="18" strokeWidth="3" stroke="white" fill="none" opacity="0.5"/>
                  <path d="M24 6a18 18 0 0118 18" strokeWidth="3" stroke="white" fill="none" opacity="0.3"/>
                </svg>
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
                      <rect x="8" y="2" width="16" height="28" rx="4" stroke="white" strokeWidth="1.5" fill="white" fillOpacity="0.1"/>
                      <circle cx="16" cy="26" r="1.5" fill="white" opacity="0.7"/>
                      <rect x="12" y="5" width="8" height="1" rx="0.5" fill="white" opacity="0.4"/>
                      <path d="M6 14c-1.5-1-2.5-2-2.5-3.5S4.5 8 6 7.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
                      <path d="M4 16c-2.5-1.5-4-3.5-4-6s1.5-4.5 4-6" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.35"/>
                      <path d="M26 14c1.5-1 2.5-2 2.5-3.5S27.5 8 26 7.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
                      <path d="M28 16c2.5-1.5 4-3.5 4-6s-1.5-4.5-4-6" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.35"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm mb-0.5">{t("contact.phone")}</h3>
                    <p className="text-white/50 text-[10px]">{t("contact.phone.subtitle")}</p>
                  </div>
                </div>
              </a>

              <a
                href="mailto:websuite153@gmail.com"
                className="col-span-2 relative overflow-hidden rounded-2xl p-5 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(150deg, hsl(180 65% 38%) 0%, hsl(195 60% 32%) 100%)",
                }}
                data-testid="link-contact-email"
              >
                <svg className="absolute -bottom-6 -left-4 w-28 h-28 opacity-[0.06]" viewBox="0 0 48 48" fill="white">
                  <path d="M6 12l18 13 18-13v24H6z"/>
                </svg>
                <div className="relative flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
                      <rect x="3" y="7" width="26" height="18" rx="3" stroke="white" strokeWidth="1.5" fill="white" fillOpacity="0.08"/>
                      <path d="M3 10l13 9 13-9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="25" cy="9" r="5" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1"/>
                      <path d="M24 8v2.5h2" stroke="white" strokeWidth="0.8" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm mb-0.5">{t("contact.email")}</h3>
                    <p className="text-white/50 text-[10px]">{t("contact.email.subtitle")}</p>
                  </div>
                </div>
              </a>
            </div>

            <div className="rounded-xl border border-copper/15 bg-gradient-to-br from-copper/[0.03] to-sand-light p-5">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-copper" />
                <h3 className="font-extrabold text-sm text-charcoal">{t("contact.why")}</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-charcoal-light">
                {[
                  t("contact.why.1"),
                  t("contact.why.2"),
                  t("contact.why.3"),
                  t("contact.why.4"),
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-copper mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
