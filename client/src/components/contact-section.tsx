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
                        href="https://wa.me/972547966616?text=%D7%94%D7%99%D7%99%2C%20%D7%94%D7%A9%D7%90%D7%A8%D7%AA%D7%99%20%D7%A4%D7%A8%D7%98%D7%99%D7%9D%20%D7%91%D7%90%D7%AA%D7%A8%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%97%D7%96%D7%A8%D7%94"
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
            <div className="grid grid-cols-2 gap-3 auto-rows-auto">
              <a
                href="https://wa.me/972547966616?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A2%D7%9C%20%D7%94%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99%D7%9D%20%D7%A9%D7%9C%D7%9B%D7%9D"
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 relative overflow-hidden rounded-2xl p-6 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(160deg, #20b858 0%, #128c3e 100%)",
                }}
                data-testid="link-contact-whatsapp"
              >
                <svg className="absolute -bottom-8 -left-8 w-40 h-40 opacity-[0.08]" viewBox="0 0 100 100" fill="white">
                  <circle cx="50" cy="50" r="50" />
                </svg>
                <svg className="absolute top-3 left-4 w-20 h-20 opacity-[0.06]" viewBox="0 0 100 100" fill="white">
                  <rect x="10" y="10" width="80" height="80" rx="20" />
                </svg>
                <div className="relative flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform duration-300">
                    <MessageSquare className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-white text-lg mb-0.5">WhatsApp</h3>
                    <p className="text-white/60 text-xs mb-2">{t("contact.whatsapp.subtitle")}</p>
                    <span className="inline-block text-white/90 text-sm font-bold tracking-wider bg-white/10 rounded-lg px-3 py-1" dir="ltr">054-796-6616</span>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                    <ArrowLeft className="w-4 h-4 text-white/80" />
                  </div>
                </div>
              </a>

              <a
                href="tel:+972547966616"
                className="col-span-1 relative overflow-hidden rounded-2xl p-5 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(150deg, hsl(225 75% 52%) 0%, hsl(255 65% 45%) 100%)",
                }}
                data-testid="link-contact-phone"
              >
                <svg className="absolute -top-6 -right-6 w-28 h-28 opacity-[0.06]" viewBox="0 0 100 100" fill="white">
                  <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" />
                </svg>
                <div className="relative flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:-rotate-12 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm mb-0.5">{t("contact.phone")}</h3>
                    <p className="text-white/50 text-[10px] mb-2">{t("contact.phone.subtitle")}</p>
                    <span className="text-white/90 text-xs font-bold tracking-wide" dir="ltr">054-796-6616</span>
                  </div>
                </div>
              </a>

              <a
                href="mailto:websuite153@gmail.com"
                className="col-span-1 relative overflow-hidden rounded-2xl p-5 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(150deg, hsl(180 65% 38%) 0%, hsl(195 60% 32%) 100%)",
                }}
                data-testid="link-contact-email"
              >
                <svg className="absolute -bottom-5 -left-5 w-24 h-24 opacity-[0.07]" viewBox="0 0 100 100" fill="white">
                  <rect x="5" y="20" width="90" height="60" rx="12" />
                </svg>
                <div className="relative flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-sm mb-0.5">{t("contact.email")}</h3>
                    <p className="text-white/50 text-[10px] mb-2">{t("contact.email.subtitle")}</p>
                    <span className="text-white/90 text-[10px] font-bold" dir="ltr">websuite153@gmail.com</span>
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
