import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart";

const NAV = [
  { label: "COLEÇÃO", href: "#colecao" },
  { label: "CAMISETAS", href: "#cores" },
  { label: "TAMANHOS", href: "#tamanhos" },
  { label: "PROMOÇÕES", href: "#promocao" },
];

export function Header() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 sm:px-6">
        <a href="#top" className="font-display text-xl tracking-tight sm:text-2xl">
          A MÁQUINA
        </a>

        <nav className="hidden justify-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-xs font-semibold tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setOpen(true)}
            aria-label="Abrir carrinho"
            className="relative grid h-10 w-10 place-items-center rounded-none transition-colors hover:bg-secondary"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-none bg-accent text-[11px] font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenu((v) => !v)}
            aria-label="Abrir menu"
            className="grid h-10 w-10 place-items-center rounded-none transition-colors hover:bg-secondary lg:hidden"
          >
            {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menu && (
        <nav className="border-t border-border bg-background px-4 pb-6 pt-2 lg:hidden">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenu(false)}
              className="block border-b border-border py-3 font-display text-lg tracking-tight"
            >
              {item.label}
            </a>
          ))}
          <Button
            variant="hero"
            size="xl"
            className="mt-5 w-full"
            onClick={() => {
              setMenu(false);
              document.getElementById("comprar")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Comprar agora
          </Button>
        </nav>
      )}
    </header>
  );
}
