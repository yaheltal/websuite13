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
import { Send, CheckCircle2, MessageSquare, Phone, Mail } from "lucide-react";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge variant="secondary" className="mb-4">צור קשר</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" data-testid="text-contact-title">
            בואו נבנה משהו
            <br />
            <span className="text-gradient">מדהים ביחד</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            ספרו לנו על הפרויקט שלכם ונחזור אליכם תוך 24 שעות
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
            <div className="rounded-xl border border-border/50 bg-card p-6 md:p-8">
              {mutation.isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center gap-4"
                  data-testid="contact-success"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold">תודה על פנייתכם!</h3>
                  <p className="text-muted-foreground">נחזור אליכם בהקדם האפשרי</p>
                  <Button
                    variant="outline"
                    onClick={() => mutation.reset()}
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
                          <FormLabel>הודעה</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="ספרו לנו על הפרויקט שלכם, מה אתם מחפשים..."
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
                      className="w-full bg-gradient-to-l from-gold to-gold-dark text-black font-bold border-0"
                      disabled={mutation.isPending}
                      data-testid="button-submit-contact"
                    >
                      {mutation.isPending ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
            className="lg:col-span-2 space-y-6"
          >
            <div className="rounded-xl border border-border/50 bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-md bg-gold/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">WhatsApp</h3>
                  <p className="text-xs text-muted-foreground">זמינים בשעות העבודה</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground" dir="ltr" data-testid="text-whatsapp">+972-54-123-4567</p>
            </div>

            <div className="rounded-xl border border-border/50 bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-md bg-electric/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-electric" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">טלפון</h3>
                  <p className="text-xs text-muted-foreground">א׳-ה׳ 9:00-18:00</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground" dir="ltr" data-testid="text-phone">+972-3-123-4567</p>
            </div>

            <div className="rounded-xl border border-border/50 bg-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-md bg-gold/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">אימייל</h3>
                  <p className="text-xs text-muted-foreground">נחזור אליכם תוך 24 שעות</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground" dir="ltr" data-testid="text-email">hello@webcraft.co.il</p>
            </div>

            <div className="rounded-xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-6">
              <h3 className="font-bold mb-2 text-sm">למה לעבוד איתנו?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">&#x2022;</span>
                  <span>ניסיון של 8+ שנים בפיתוח אתרים</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">&#x2022;</span>
                  <span>100+ פרויקטים שהושלמו בהצלחה</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">&#x2022;</span>
                  <span>תמיכה טכנית צמודה אחרי ההשקה</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">&#x2022;</span>
                  <span>אחריות מלאה על כל פרויקט</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
