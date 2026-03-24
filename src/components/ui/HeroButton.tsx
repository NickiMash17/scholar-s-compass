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
    const baseStyles = "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 font-mono uppercase tracking-wider";
    
    const variants = {
      primary: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110 glow-neon",
      secondary: "bg-card text-foreground border border-primary/30 hover:border-primary/50 hover:bg-primary/5",
      ghost: "text-muted-foreground border border-border hover:bg-muted hover:text-foreground hover:border-primary/30",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs gap-2",
      default: "px-6 py-3 text-xs gap-2",
      lg: "px-8 py-4 text-sm gap-3",
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
