import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { COLORS, PRICE, SIZES, colorById, formatKz, type ColorId, type Size } from "./data";

export type CartItem = {
  id: string;
  color: ColorId;
  size: Size;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  add: (color: ColorId, size: Size, qty?: number) => void;
  update: (id: string, patch: Partial<Omit<CartItem, "id">>) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    return {
      items,
      open,
      setOpen,
      count,
      subtotal: count * PRICE,
      add: (color, size, qty = 1) => {
        setItems((prev) => {
          const found = prev.find((i) => i.color === color && i.size === size);
          if (found) {
            return prev.map((i) => (i.id === found.id ? { ...i, qty: i.qty + qty } : i));
          }
          return [...prev, { id: `${color}-${size}-${Date.now()}`, color, size, qty }];
        });
        setOpen(true);
      },
      update: (id, patch) =>
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, ...patch, qty: Math.max(1, patch.qty ?? i.qty) } : i)),
        ),
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      clear: () => setItems([]),
    };
  }, [items, open]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <CartDrawer />
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

function CartDrawer() {
  const { items, open, setOpen, update, remove, subtotal, count } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 border-border bg-card p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border p-6">
          <SheetTitle className="font-display text-2xl tracking-tight">
            CARRINHO ({count})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">O teu carrinho está vazio.</p>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <img
                    src={colorById(item.color).image}
                    alt={`Camiseta A MÁQUINA ${colorById(item.color).name}`}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="h-24 w-24 shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-semibold">A MÁQUINA — Camiseta Original</p>
                      <button
                        onClick={() => remove(item.id)}
                        aria-label="Remover produto"
                        className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <select
                        value={item.color}
                        onChange={(e) => update(item.id, { color: e.target.value as ColorId })}
                        aria-label="Cor"
                        className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                      >
                        {COLORS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <select
                        value={item.size}
                        onChange={(e) => update(item.id, { size: e.target.value as Size })}
                        aria-label="Tamanho"
                        className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                      >
                        {SIZES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-md border border-border">
                        <button
                          className="px-2 py-1"
                          aria-label="Diminuir"
                          onClick={() => update(item.id, { qty: item.qty - 1 })}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.qty}</span>
                        <button
                          className="px-2 py-1"
                          aria-label="Aumentar"
                          onClick={() => update(item.id, { qty: item.qty + 1 })}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-bold">{formatKz(item.qty * PRICE)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border p-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatKz(subtotal)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Entrega</span>
            <span className="font-semibold">GRÁTIS</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 font-display text-xl">
            <span>TOTAL</span>
            <span>{formatKz(subtotal)}</span>
          </div>
          <Button
            variant="hero"
            size="xl"
            className="mt-5 w-full"
            disabled={items.length === 0}
            onClick={() => {
              setOpen(false);
              document.getElementById("comprar")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            FINALIZAR COMPRA
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
