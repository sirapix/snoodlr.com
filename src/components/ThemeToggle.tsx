import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import type { SiteLang } from "../lib/links";

export default function ThemeToggle({ lang = "en" }: { lang?: SiteLang }) {
  const [dark, setDark] = useState(true);
  const label = dark
    ? lang === "ar" ? "التبديل إلى الوضع الفاتح" : "Switch to light mode"
    : lang === "ar" ? "التبديل إلى الوضع الداكن" : "Switch to dark mode";

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const shouldUseDark = stored ? stored === "dark" : true;
    setDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
    document.documentElement.style.colorScheme = shouldUseDark ? "dark" : "light";
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    document.documentElement.style.colorScheme = next ? "dark" : "light";
  }

  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-surface/60 text-foreground transition-colors hover:bg-accent"
      onClick={toggleTheme}
    >
      {dark ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}
