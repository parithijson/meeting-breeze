
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "subtle";
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = "default",
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-xl backdrop-blur-md transition-all duration-300",
        variant === "default" && "bg-white/50 border border-white/20 shadow-sm",
        variant === "elevated" && "bg-white/60 border border-white/30 shadow-md",
        variant === "subtle" && "bg-white/30 border border-white/10 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
