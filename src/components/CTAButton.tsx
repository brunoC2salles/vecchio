import type { AnchorHTMLAttributes } from "react";
import clsx from "clsx";

type CTAButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "solid" | "outline";
};

export function CTAButton({ variant = "solid", className, children, ...props }: CTAButtonProps) {
  return (
    <a
      className={clsx(
        "font-display inline-flex items-center justify-center rounded-sm px-7 py-3 text-lg tracking-wide transition-transform duration-200 hover:-translate-y-0.5",
        variant === "solid" && "bg-rosso text-paper",
        variant === "outline" && "border-2 border-paper text-paper",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
