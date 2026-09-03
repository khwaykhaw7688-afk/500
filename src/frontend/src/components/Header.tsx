import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { BookOpen, Layers, PenLine } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "คำศัพท์", icon: Layers, end: true },
  { to: "/flashcards", label: "บัตรคำ", icon: BookOpen, end: false },
  { to: "/writing", label: "ฝึกเขียน", icon: PenLine, end: false },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-card shadow-subtle">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3 transition-smooth hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          data-ocid="header.brand"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-subtle">
            <span className="font-display text-lg font-bold">中</span>
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-sm font-semibold leading-tight sm:text-base">
              สุดยอดปรมาจารย์ คำศัพท์ภาษาจีน
            </span>
            <span className="block text-xs text-muted-foreground">
              500 คำศัพท์พื้นฐาน
            </span>
          </span>
        </Link>

        <nav
          aria-label="โหมดหลัก"
          className="flex items-center gap-1 rounded-lg bg-muted p-1"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.end }}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "hover:bg-accent hover:text-accent-foreground",
                "text-muted-foreground",
              )}
              activeProps={{
                className:
                  "bg-card text-foreground shadow-subtle hover:bg-card",
              }}
              data-ocid={`header.tab.${item.label}`}
            >
              <item.icon className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
