import type { SiteLang } from "./links";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "md" | "lg" | "card";

const sizes: Record<ButtonSize, string> = {
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
  card: "h-11 px-5 text-sm"
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]",
  secondary: "border border-border-strong bg-surface/60 font-medium text-foreground transition-colors hover:bg-surface"
};

export function buttonClasses({
  variant = "primary",
  size = "lg",
  block = false,
  className = ""
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  className?: string;
}) {
  return [
    "inline-flex shrink-0 items-center justify-center rounded-full leading-none disabled:cursor-wait disabled:opacity-70",
    sizes[size],
    variants[variant],
    block ? "w-full" : "",
    className
  ]
    .filter(Boolean)
    .join(" ");
}

export function buttonLabelClasses(lang: SiteLang = "en") {
  return ["block", lang === "ar" ? "translate-y-[3px]" : ""].filter(Boolean).join(" ");
}
