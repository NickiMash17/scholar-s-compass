import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "lg" | "sm";
  icon?: React.ReactNode;
}

const HeroButton = React.forwardRef<HTMLButtonElement, HeroButtonProps>(
  ({ className, variant = "primary", size = "default", children, icon, ...props }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-gradient-to-r from-amber-500 to-amber-400 text-navy-950 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30",
      secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80",
      ghost: "text-cream-100/80 border border-cream-100/20 hover:bg-cream-100/10 hover:border-cream-100/30",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm gap-2",
      default: "px-6 py-3 text-base gap-2",
      lg: "px-8 py-4 text-lg gap-3",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </motion.button>
    );
  }
);

HeroButton.displayName = "HeroButton";

export { HeroButton };
