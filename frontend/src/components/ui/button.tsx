"use client";

import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    // Basic styling, can be expanded with variants and sizes later
    const baseStyle =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

    // Simplified variant handling for now
    const variantStyle =
      {
        default: "bg-deep-red text-light-cream hover:bg-deep-red/90",
        outline:
          "border border-dark-teal bg-transparent hover:bg-light-teal hover:text-dark-teal",
        // Add other variants as needed
      }[variant] || "bg-deep-red text-light-cream hover:bg-deep-red/80";

    const sizeStyle =
      {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      }[size] || "h-10 py-2 px-4";

    return (
      <button
        className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
