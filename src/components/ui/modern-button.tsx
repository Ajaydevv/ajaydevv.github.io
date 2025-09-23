import React from 'react';
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

export interface ModernButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          // Modern effects
          "transform-gpu hover:scale-[1.02] active:scale-[0.98]",
          "shadow-lg hover:shadow-xl",
          // Variant styles
          variant === "default" && [
            "bg-gradient-to-r from-blog-primary via-blog-primary to-blog-accent",
            "text-white hover:from-blog-primary/90 hover:via-blog-primary/90 hover:to-blog-accent/90",
            "shadow-blog-primary/25 hover:shadow-blog-primary/40",
            "relative overflow-hidden",
            "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:via-transparent before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
          ],
          variant === "outline" && [
            "border-2 border-blog-primary/30 bg-transparent text-blog-primary",
            "hover:border-blog-primary hover:bg-blog-primary/10",
            "shadow-blog-primary/10 hover:shadow-blog-primary/25"
          ],
          variant === "ghost" && [
            "bg-transparent text-blog-primary hover:bg-blog-primary/10",
            "shadow-none hover:shadow-md hover:shadow-blog-primary/20"
          ],
          // Size styles
          size === "default" && "h-11 px-6 py-2",
          size === "sm" && "h-9 px-4 py-1 text-sm",
          size === "lg" && "h-12 px-8 py-3 text-lg",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

ModernButton.displayName = "ModernButton";

export { ModernButton };