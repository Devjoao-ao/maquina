import { createFileRoute } from "@tanstack/react-router";
import { CartProvider } from "@/components/shop/cart";
import { Header } from "@/components/shop/Header";
import { Store } from "@/components/shop/Store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A MÁQUINA — Camisetas Streetwear por 12.000 Kz" },
      {
        name: "description",
        content:
          "Camisetas originais A MÁQUINA por 12.000 Kz com entrega gratuita em Angola. Preto, rosa, rosa claro e branco. Tamanhos S a XXL.",
      },
      { property: "og:title", content: "A MÁQUINA — Veste a tua atitude" },
      {
        property: "og:description",
        content: "Camisetas streetwear A MÁQUINA por 12.000 Kz com entrega grátis.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <CartProvider>
      <Header />
      <main className="pb-24 md:pb-0">
        <Store />
      </main>
    </CartProvider>
  );
}
