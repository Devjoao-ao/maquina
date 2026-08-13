import { ShoppingBag } from "lucide-react";
import { useCart } from "./cart";

const NAV = [
  { label: "COLEÇÃO", href: "#colecao" },
  { label: "CAMISETAS", href: "#cores" },
  { label: "TAMANHOS", href: "#tamanhos" },
  { label: "PROMOÇÕES", href: "#promocao" },
];

export function Header() {
  const { count, setOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="border-b border-border">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-[11px] font-semibold tracking-[0.16em] text-muted-foreground sm:px-6">
          PROMOÇÃO LIMITADA · 12.000 KZ EM VEZ DE 25.000 KZ · ENTREGA GRÁTIS
        </p>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" className="font-display text-lg tracking-tight sm:text-xl">
          A MÁQUINA
        </a>

        <nav className="flex items-center gap-3 overflow-x-auto sm:gap-6">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="whitespace-nowrap text-[10px] font-semibold tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground sm:text-xs"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
            onClick={() => setOpen(true)}
            aria-label="Abrir carrinho"
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-md transition-colors hover:bg-secondary"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-md bg-foreground text-[11px] font-bold text-background">
                {count}
              </span>
            )}
        </button>
      </div>
    </header>
  );
}
