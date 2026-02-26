import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

export function AiChatWidget() {
  const [, navigate] = useLocation();

  return (
    <motion.button
      onClick={() => navigate("/onboarding")}
      className="fixed bottom-24 left-4 sm:left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-copper to-copper-dark text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      data-testid="button-open-chat"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-background animate-pulse" />
    </motion.button>
  );
}
