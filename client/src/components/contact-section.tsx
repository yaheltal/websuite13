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
import { Send, CheckCircle2, MessageSquare, Phone, Mail, Clock, Award } from "lucide-react";

const serviceOptions = [
  { value: "business-card", label: "כרטיס ביקור דיגיטלי" },
  { value: "landing-page", label: "דף נחיתה" },
  { value: "ecommerce", label: "חנות אונליין מלאה" },
  { value: "other", label: "אחר" },
];

export function ContactSection() {
  const { toast } = useToast();

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

  const mutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "הודעה נשלחה בהצלחה!",
        description: "נחזור אליכם בהקדם האפשרי",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "שגיאה בשליחה",
        description: "אנא נסו שוב מאוחר יותר",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    mutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 md:py-32 relative" data-testid="section-contact">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sand/20 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge variant="secondary" className="mb-4 bg-copper/8 text-copper-dark border-copper/15">צור קשר</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-charcoal" data-testid="text-contact-title">
            בואו נבנה משהו
            <br />
            <span className="text-copper">יוצא דופן ביחד</span>
          </h2>
          <p className="text-charcoal-light text-lg max-w-xl mx-auto">
            ספרו לנו על הפרויקט שלכם — נחזור אליכם תוך 24 שעות עם הצעה מותאמת
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center gap-4"
                  data-testid="contact-success"
                >
                  <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-sage-dark" />
                  </div>
                  <h3 className="text-xl font-extrabold text-charcoal">תודה על פנייתכם!</h3>
                  <p className="text-charcoal-light">נחזור אליכם בהקדם האפשרי עם הצעה מותאמת</p>
                  <Button
                    variant="outline"
                    onClick={() => mutation.reset()}
                    className="border-copper/20 text-copper"
                    data-testid="button-send-another"
                  >
                    שלחו הודעה נוספת
                  </Button>
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
                            <FormLabel>שם מלא</FormLabel>
                            <FormControl>
                              <Input placeholder="הזינו את שמכם" {...field} data-testid="input-name" />
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
                            <FormLabel>אימייל</FormLabel>
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
                            <FormLabel>טלפון (אופציונלי)</FormLabel>
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
                            <FormLabel>שירות מבוקש</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-service">
                                  <SelectValue placeholder="בחרו שירות" />
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
                          <FormLabel>ספרו לנו על הפרויקט</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="מה אתם מחפשים? מה חשוב לכם? כל פרט עוזר לנו להתאים את ההצעה..."
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
                          שולח...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          שלחו הודעה
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
                subtitle: "זמינים בשעות העבודה",
                value: "+972-54-123-4567",
                iconBg: "bg-copper/10",
                iconColor: "text-copper",
              },
              {
                icon: Phone,
                title: "טלפון",
                subtitle: "א׳-ה׳ 9:00-18:00",
                value: "+972-3-123-4567",
                iconBg: "bg-sage/20",
                iconColor: "text-sage-dark",
              },
              {
                icon: Mail,
                title: "אימייל",
                subtitle: "נחזור אליכם תוך 24 שעות",
                value: "hello@webcraft.co.il",
                iconBg: "bg-copper/10",
                iconColor: "text-copper",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border/50 bg-card p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-charcoal">{item.title}</h3>
                    <p className="text-xs text-charcoal-light">{item.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-charcoal-light" dir="ltr">{item.value}</p>
              </div>
            ))}

            <div className="rounded-xl border border-copper/15 bg-gradient-to-br from-copper/[0.03] to-sand-light p-5">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-copper" />
                <h3 className="font-extrabold text-sm text-charcoal">למה WebCraft?</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-charcoal-light">
                {[
                  "איכות בוטיק במחירים תחרותיים",
                  "8+ שנות ניסיון בפיתוח",
                  "100+ פרויקטים שהושלמו בהצלחה",
                  "תמיכה טכנית צמודה אחרי ההשקה",
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
