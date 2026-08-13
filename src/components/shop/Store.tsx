import { useEffect, useState } from "react";
import { BadgeCheck, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "./cart";
import {
  COLORS,
  OLD_PRICE,
  PRICE,
  PROVINCES,
  SIZES,
  SIZE_GUIDE,
  TESTIMONIALS,
  colorById,
  formatKz,
  type ColorId,
  type Size,
} from "./data";

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-4 py-20 sm:px-6 md:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export function Store() {
  const cart = useCart();
  const [color, setColor] = useState<ColorId>("preto");
  const [size, setSize] = useState<Size>("M");
  const [confirmed, setConfirmed] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    provincia: PROVINCES[0],
    municipio: "",
  });

  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHeroIndex((i) => (i + 1) % COLORS.length), 3000);
    return () => clearInterval(id);
  }, []);

  const heroTee = COLORS[heroIndex] ?? COLORS[0]!;

  const selected = colorById(color);

  const orderMessage = `Olá A MÁQUINA! Quero encomendar 1x Camiseta Original — Cor: ${selected.name}, Tamanho: ${size}. Total: ${formatKz(PRICE)} (entrega grátis).`;

  return (
    <div id="top">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
          <div className="reveal">
            <span className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-muted-foreground">
              <Truck className="h-3.5 w-3.5" /> ENTREGA GRÁTIS
            </span>
            <h1 className="font-graffiti mt-6 text-[clamp(2.75rem,10vw,6.5rem)] leading-[0.95]">
              VESTE A<br />
              MÁQUINA.
            </h1>
            <p className="mt-6 font-display text-lg tracking-tight text-muted-foreground sm:text-xl">
              A tua atitude. O teu estilo. A tua Máquina.
            </p>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Camisetas exclusivas A MÁQUINA disponíveis por tempo limitado.
            </p>

            <div className="mt-8 flex items-end gap-4">
              <span className="font-display text-5xl sm:text-6xl">{formatKz(PRICE)}</span>
              <span className="pb-2 text-lg text-muted-foreground line-through">
                {formatKz(OLD_PRICE)}
              </span>
            </div>

            <p className="mt-6 inline-block border border-border px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground">
              STOCK LIMITADO · ÚLTIMAS UNIDADES DESTA EDIÇÃO
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="hero" size="xl" onClick={() => scrollTo("comprar")}>
                Comprar agora
              </Button>
              <Button variant="outlineHero" size="xl" onClick={() => scrollTo("cores")}>
                Ver cores
              </Button>
            </div>
          </div>

          <div className="reveal relative">
            <img
              key={heroTee.id}
              src={heroTee.image}
              alt={`Camiseta A MÁQUINA cor ${heroTee.name}`}
              width={1024}
              height={1024}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="animate-fade-in w-full rounded-md object-cover"
            />
            {/* pré-carrega as outras cores para a troca ser instantânea */}
            <div aria-hidden className="hidden">
              {COLORS.map((c) => (
                <img key={c.id} src={c.image} alt="" width={1} height={1} decoding="async" />
              ))}
            </div>
            <div className="mt-5 flex justify-center gap-2">
              {COLORS.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setHeroIndex(i)}
                  aria-label={`Ver camiseta ${c.name}`}
                  className={`h-2 rounded-md transition-all duration-300 ${
                    i === heroIndex ? "w-8 bg-foreground" : "w-2 bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden border-y border-border bg-secondary/40 py-3">
          <div className="marquee-track flex w-max gap-8 whitespace-nowrap font-display text-sm tracking-[0.25em] text-muted-foreground">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex gap-8">
                {Array.from({ length: 6 }).map((__, j) => (
                  <span key={j}>A MÁQUINA · 12.000 KZ · ENTREGA GRÁTIS ·</span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CORES */}
      <Section id="cores">
        <h2 className="text-[clamp(2rem,6vw,3.5rem)] leading-none">ESCOLHE A TUA COR</h2>
        <p className="mt-3 text-sm text-muted-foreground">4 cores. Uma só atitude.</p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {COLORS.map((c) => {
            const active = c.id === color;
            return (
              <article
                key={c.id}
                className={`overflow-hidden rounded-md border bg-card transition-colors duration-200 ${
                  active ? "border-foreground" : "border-border"
                }`}
              >
                <button
                  onClick={() => setColor(c.id)}
                  className="group block w-full overflow-hidden"
                  aria-label={`Selecionar cor ${c.name}`}
                >
                  <img
                    src={c.image}
                    alt={`Camiseta A MÁQUINA ${c.name}`}
                    loading="lazy"
                    decoding="async"
                    width={1024}
                    height={1024}
                    className="aspect-square w-full object-cover"
                  />
                </button>
                <div className="space-y-3 p-3 sm:p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-display text-sm tracking-tight sm:text-lg">
                      {c.name}
                    </span>
                    <span
                      className="h-5 w-5 shrink-0 rounded-md border border-border sm:h-6 sm:w-6"
                      style={{ backgroundColor: c.swatch }}
                    />
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="whitespace-nowrap font-display text-base sm:text-xl">
                      {formatKz(PRICE)}
                    </span>
                    <span className="whitespace-nowrap text-[11px] text-muted-foreground line-through">
                      {formatKz(OLD_PRICE)}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* PROMOÇÃO */}
      <Section id="promocao" className="border-y border-border bg-secondary/30 text-center">
        <p className="font-display text-xs tracking-[0.35em] text-muted-foreground">PROMOÇÃO ESPECIAL</p>
        <h2 className="mt-4 text-[clamp(2.5rem,9vw,6rem)] leading-[0.9]">
          POR APENAS
          <br />
          12.000 KZ
        </h2>
        <p className="mt-6 font-display text-2xl tracking-tight">ENTREGA GRATUITA</p>
        <p className="mt-2 text-sm text-muted-foreground">Oferta promocional por tempo limitado.</p>
        <Button variant="hero" size="xl" className="mt-8" asChild>
          <a href={selected.checkoutUrl} target="_blank" rel="noreferrer">
            Quero a minha A MÁQUINA
          </a>
        </Button>
      </Section>

      {/* BENEFÍCIOS */}
      <Section id="colecao">
        <h2 className="text-[clamp(2rem,6vw,3.5rem)] leading-none">PORQUE A MÁQUINA?</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Design exclusivo", "Estampas próprias, produzidas em edições limitadas."],
            ["Estilo streetwear", "Corte moderno, caimento oversize e acabamento premium."],
            ["Várias cores", "Preto, rosa, rosa claro e branco."],
            ["Entrega gratuita", "Sem custos de entrega durante a promoção."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-md border border-border bg-card p-6">
              <BadgeCheck className="h-6 w-6 text-foreground" strokeWidth={1.5} />
              <h3 className="mt-4 text-lg tracking-tight">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* TAMANHOS */}
      <Section id="tamanhos" className="border-y border-border bg-secondary/30">
        <h2 className="text-[clamp(2rem,6vw,3.5rem)] leading-none">ENCONTRA O TEU TAMANHO</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`h-14 w-16 rounded-md border font-display text-lg transition-all duration-200 ${
                size === s
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-md border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card font-display tracking-wide">
              <tr>
                <th className="px-5 py-3">Tamanho</th>
                <th className="px-5 py-3">Peito</th>
                <th className="px-5 py-3">Comprimento</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE.map((row) => (
                <tr key={row.size} className="border-t border-border">
                  <td className="px-5 py-3 font-semibold">{row.size}</td>
                  <td className="px-5 py-3 text-muted-foreground">{row.chest}</td>
                  <td className="px-5 py-3 text-muted-foreground">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* COMPRA */}
      <Section id="comprar">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <img
              src={selected.image}
              alt={`Camiseta A MÁQUINA ${selected.name} selecionada`}
              loading="lazy"
              decoding="async"
              width={1024}
              height={1024}
              className="w-full rounded-md object-cover"
            />
          </div>

          <div>
            <h2 className="text-[clamp(2rem,6vw,3.25rem)] leading-none">FAZER PEDIDO</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              A MÁQUINA — Camiseta Original · pagamento na entrega ou por transferência.
            </p>

            <form
              className="mt-8 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                window.open(selected.checkoutUrl, "_blank", "noopener");
                setConfirmed(true);
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    required
                    placeholder="Ex.: João Manuel"
                    maxLength={100}
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Número de telefone</Label>
                  <Input
                    id="telefone"
                    required
                    placeholder="Ex.: 923 000 000"
                    inputMode="tel"
                    maxLength={20}
                    value={form.telefone}
                    onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="provincia">Província</Label>
                  <select
                    id="provincia"
                    value={form.provincia}
                    onChange={(e) => setForm({ ...form, provincia: e.target.value })}
                    className="mt-2 h-12 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="municipio">Município / Bairro</Label>
                  <Input
                    id="municipio"
                    required
                    placeholder="Ex.: Talatona, Benfica"
                    maxLength={120}
                    value={form.municipio}
                    onChange={(e) => setForm({ ...form, municipio: e.target.value })}
                    className="mt-2 h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="cor">Cor escolhida</Label>
                  <select
                    id="cor"
                    value={color}
                    onChange={(e) => setColor(e.target.value as ColorId)}
                    className="mt-2 h-12 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {COLORS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="tamanho">Tamanho</Label>
                  <select
                    id="tamanho"
                    value={size}
                    onChange={(e) => setSize(e.target.value as Size)}
                    className="mt-2 h-12 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-md border border-border bg-card p-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Entrega</span>
                  <span className="font-semibold">GRATUITA</span>
                </div>
                <div className="mt-3 flex items-center justify-between font-display text-2xl">
                  <span>Total</span>
                  <span>{formatKz(PRICE)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="flex-1"
                >
                  Finalizar pedido
                </Button>
                <Button
                  type="button"
                  variant="outlineHero"
                  size="xl"
                  onClick={() => cart.add(color, size, 1)}
                >
                  Adicionar ao carrinho
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Section>

      {/* PROVA SOCIAL */}
      <Section className="border-y border-border bg-secondary/30">
        <h2 className="text-[clamp(2rem,6vw,3.5rem)] leading-none">O QUE DIZEM</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Espaço reservado para avaliações reais dos nossos clientes.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-md border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={`Cliente ${t.name}`}
                  loading="lazy"
                  decoding="async"
                  width={816}
                  height={816}
                  className="h-11 w-11 shrink-0 rounded-md object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{t.name}</p>
                  <div className="mt-1 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s2) => (
                      <Star key={s2} className="h-3.5 w-3.5 fill-foreground text-foreground" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{t.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-border px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <div>
            <p className="font-display text-3xl tracking-tight">A MÁQUINA</p>
            <p className="mt-2 text-sm text-muted-foreground">Veste a tua atitude.</p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <ul className="space-y-2">
              {["Instagram", "TikTok"].map((l) => (
                <li key={l}>
                  <a href="#top" className="text-muted-foreground hover:text-foreground">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              {["Termos e Condições", "Política de Privacidade", "Política de Entrega"].map((l) => (
                <li key={l}>
                  <a href="#top" className="text-muted-foreground hover:text-foreground">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-7xl text-xs text-muted-foreground">
          © {new Date().getFullYear()} A MÁQUINA. Todos os direitos reservados.
        </p>
      </footer>

      {/* BARRA FIXA MOBILE */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-xl md:hidden">
        <div className="min-w-0">
          <p className="truncate font-display text-lg leading-none">{formatKz(PRICE)}</p>
          <p className="truncate text-[11px] tracking-widest text-muted-foreground">ENTREGA GRÁTIS</p>
        </div>
        <Button variant="hero" className="h-11 rounded-md px-8" asChild>
          <a href={selected.checkoutUrl} target="_blank" rel="noreferrer">
            Comprar
          </a>
        </Button>
      </div>

      {/* CONFIRMAÇÃO */}
      <Dialog open={confirmed} onOpenChange={setConfirmed}>
        <DialogContent className="border-border bg-card text-center sm:max-w-md">
          <DialogTitle className="font-display text-3xl tracking-tight">
            PEDIDO RECEBIDO! 🔥
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Obrigado por escolher A MÁQUINA. Recebemos o teu pedido e entraremos em contacto contigo
            pelo telefone/WhatsApp para confirmar os detalhes da entrega.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
