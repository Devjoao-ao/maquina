import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/shop/Header";
import { Store } from "@/components/shop/Store";
import { PRICE, formatKz, isColorId, type ColorId } from "@/components/shop/data";

// Link directo para uma cor: /?cor=preto | rosa | rosa-claro | branco
// Valores desconhecidos são ignorados (fica a cor por defeito).
type Search = { cor?: ColorId };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): Search =>
    isColorId(search["cor"]) ? { cor: search["cor"] } : {},
  head: () => ({
    meta: [
      { title: `A MÁQUINA — Camiseta Original por ${formatKz(PRICE)}` },
      {
        name: "description",
        content: `Camiseta original A MÁQUINA por ${formatKz(PRICE)}. Preto, rosa, rosa claro e branco. Tamanhos S a XXL. Entrega no teu endereço.`,
      },
      { property: "og:title", content: "A MÁQUINA — Camiseta Original" },
      {
        property: "og:description",
        content: `Escolhe a tua cor e encomenda por ${formatKz(PRICE)}.`,
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Header />
      <main>
        <Store />
      </main>
    </>
  );
}
