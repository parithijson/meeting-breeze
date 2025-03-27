
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BreathingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isBreathing?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const BreathingButton: React.FC<BreathingButtonProps> = ({
  children,
  isBreathing = true,
  className,
  variant = "default",
  size = "default",
  ...props
}) => {
  return (
    <div className="relative">
      {isBreathing && (
        <div className="absolute inset-0 bg-primary/30 rounded-full animate-breathing blur-md" />
      )}
      <Button
        variant={variant}
        size={size}
        className={cn(
          "relative z-10 font-medium transition-all duration-300",
          isBreathing && "animate-pulse-soft",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </div>
  );
};

export default BreathingButton;
