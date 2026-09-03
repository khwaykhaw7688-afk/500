import { Header } from "@/components/Header";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left">
          <p className="text-sm text-muted-foreground">
            สุดยอดปรมาจารย์ คำศัพท์ภาษาจีน 500 คำ
          </p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. สร้างด้วยความรักโดย{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary transition-smooth hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              data-ocid="footer.link"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
