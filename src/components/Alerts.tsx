import { cn } from "@/lib/utiils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

type AlertVariant = "info" | "danger" | "success" | "warning" | "dark";

interface AlertProps {
  variant: AlertVariant;
  desc: string;
  duration?: number;
  onClose?: () => void;
}

const variantStyles: Record<
  AlertVariant,
  { text: string; border: string; bg: string; bar: string }
> = {
  info: {
    text: "text-blue-800 dark:text-blue-400",
    border: "border-blue-300 dark:border-blue-800",
    bg: "bg-blue-50 dark:bg-gray-800",
    bar: "bg-blue-500",
  },
  danger: {
    text: "text-red-800 dark:text-red-400",
    border: "border-red-300 dark:border-red-800",
    bg: "bg-red-50 dark:bg-gray-800",
    bar: "bg-red-500",
  },
  success: {
    text: "text-green-800 dark:text-green-400",
    border: "border-green-300 dark:border-green-800",
    bg: "bg-green-50 dark:bg-gray-800",
    bar: "bg-green-500",
  },
  warning: {
    text: "text-yellow-800 dark:text-yellow-300",
    border: "border-yellow-300 dark:border-yellow-800",
    bg: "bg-yellow-50 dark:bg-gray-800",
    bar: "bg-yellow-500",
  },
  dark: {
    text: "text-gray-800 dark:text-gray-300",
    border: "border-gray-300 dark:border-gray-600",
    bg: "bg-gray-50 dark:bg-gray-800",
    bar: "bg-gray-500",
  },
};

const Alerts: React.FC<AlertProps> = ({
  variant,
  desc,
  duration = 5000,
  onClose,
}) => {
  const styles = variantStyles[variant];
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // trigger exit animation
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        onClose?.();
      }}
    >
      {isVisible && (
        <motion.div
          key="alert"
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ duration: 0.4 }}
          className={cn(
            "fixed top-4 right-4 z-50 w-80 shadow-lg rounded-lg overflow-hidden",
            styles.border,
            styles.bg,
            styles.text
          )}
          role="alert"
        >
          <div className="flex items-center p-4">
            <svg
              className="shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <div className="flex-1">{desc}</div>
            <button
              onClick={() => setIsVisible(false)} // langsung exit anim
              className="ml-3 text-lg font-bold leading-none cursor-pointer"
            >
              ×
            </button>
          </div>

          {/* Progress bar */}
          <motion.div
            className={cn("h-1", styles.bar)}
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alerts;
