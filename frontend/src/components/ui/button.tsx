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

    // Define styles for all variants mentioned in ButtonProps
    const variantStyles: { [key: string]: string } = {
      default: "bg-deep-red text-light-cream hover:bg-deep-red/90",
      destructive: "bg-red-600 text-light-cream hover:bg-red-700/90", // Basic destructive style
      outline:
        "border border-dark-teal bg-transparent hover:bg-light-teal hover:text-dark-teal",
      secondary: "bg-muted-teal text-dark-teal hover:bg-muted-teal/80", // Basic secondary style
      ghost: "hover:bg-light-teal hover:text-dark-teal", // Basic ghost style
      link: "text-deep-red underline-offset-4 hover:underline", // Basic link style
    };

    const currentVariantStyle = variantStyles[variant] || variantStyles.default;

    const sizeStyle =
      {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      }[size] || "h-10 py-2 px-4";

    return (
      <button
        className={`${baseStyle} ${currentVariantStyle} ${sizeStyle} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
