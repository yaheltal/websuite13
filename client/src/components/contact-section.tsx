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
            {[
              {
                icon: MessageSquare,
                title: "WhatsApp",
                subtitle: t("contact.whatsapp.subtitle"),
                value: "054-796-6616",
                href: "https://wa.me/972547966616?text=%D7%94%D7%99%D7%99%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A9%D7%9E%D7%95%D7%A2%20%D7%A2%D7%9C%20%D7%94%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99%D7%9D%20%D7%A9%D7%9C%D7%9B%D7%9D",
                iconBg: "bg-green-500/10",
                iconColor: "text-green-600",
                testId: "link-contact-whatsapp",
              },
              {
                icon: Phone,
                title: t("contact.phone"),
                subtitle: t("contact.phone.subtitle"),
                value: "054-796-6616",
                href: "tel:+972547966616",
                iconBg: "bg-blue-500/10",
                iconColor: "text-blue-500",
                testId: "link-contact-phone",
              },
              {
                icon: Mail,
                title: t("contact.email"),
                subtitle: t("contact.email.subtitle"),
                value: "websuite153@gmail.com",
                href: "mailto:websuite153@gmail.com",
                iconBg: "bg-purple-500/10",
                iconColor: "text-purple-500",
                testId: "link-contact-email",
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="block rounded-xl border border-border/50 bg-card p-5 shadow-sm hover:border-border hover:shadow-md transition-all group cursor-pointer"
                data-testid={item.testId}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-charcoal">{item.title}</h3>
                    <p className="text-xs text-charcoal-light">{item.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-charcoal-light group-hover:text-charcoal transition-colors" dir="ltr">{item.value}</p>
              </a>
            ))}

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
