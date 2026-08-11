import teePreto from "@/assets/tee-preta.jpg";
import teeRosa from "@/assets/tee-rosa.jpg";
import teeRosaClaro from "@/assets/tee-rosa-claro.jpg";
import teeBranco from "@/assets/tee-branca.jpg";
import cliente1 from "@/assets/cliente-1.jpg";
import cliente2 from "@/assets/cliente-2.jpg";
import cliente3 from "@/assets/cliente-3.jpg";

export const PRICE = 12000;
export const OLD_PRICE = 25000;
export const WHATSAPP_NUMBER = "244900000000";

export type ColorId = "preto" | "rosa" | "rosa-claro" | "branco";

export const COLORS: {
  id: ColorId;
  name: string;
  image: string;
  swatch: string;
  checkoutUrl: string;
}[] = [
  {
    id: "preto",
    name: "PRETO",
    image: teePreto,
    swatch: "oklch(0.18 0 0)",
    checkoutUrl: "https://bbcheckout.lovable.app/checkout/bd6c59dc-f9cf-473f-afd5-3025e844bee6",
  },
  {
    id: "rosa",
    name: "ROSA",
    image: teeRosa,
    swatch: "oklch(0.72 0.19 350)",
    checkoutUrl: "https://bbcheckout.lovable.app/checkout/7e51b0c8-05e9-4fef-8feb-3f2b9810d5a6",
  },
  {
    id: "rosa-claro",
    name: "ROSA CLARO",
    image: teeRosaClaro,
    swatch: "oklch(0.9 0.06 350)",
    checkoutUrl: "https://bbcheckout.lovable.app/checkout/ba0bdde3-2ca7-4157-bff5-462f93132ef4",
  },
  {
    id: "branco",
    name: "BRANCO",
    image: teeBranco,
    swatch: "oklch(0.98 0 0)",
    checkoutUrl: "https://bbcheckout.lovable.app/checkout/d01d2ce1-8820-4dd6-81d8-117436135a0a",
  },
];


export const TESTIMONIALS = [
  {
    name: "Milton Kiala",
    avatar: cliente1,
    text: "Qualidade top, o tecido é grosso e o caimento oversize é perfeito. Chegou em 2 dias em Luanda.",
  },
  {
    name: "Nadia Bumba",
    avatar: cliente2,
    text: "Comprei a rosa e amei! A estampa não desbota e o conforto é outro nível.",
  },
  {
    name: "Sofia Almeida",
    avatar: cliente3,
    text: "Entrega gratuita e atendimento rápido. Já encomendei a segunda camiseta.",
  },
];

export const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof SIZES)[number];

export const SIZE_GUIDE = [
  { size: "S", chest: "96 cm", length: "68 cm" },
  { size: "M", chest: "102 cm", length: "70 cm" },
  { size: "L", chest: "108 cm", length: "72 cm" },
  { size: "XL", chest: "114 cm", length: "74 cm" },
  { size: "XXL", chest: "120 cm", length: "76 cm" },
];

export const PROVINCES = [
  "Luanda",
  "Benguela",
  "Huambo",
  "Huíla",
  "Cabinda",
  "Malanje",
  "Namibe",
  "Uíge",
  "Cuanza Norte",
  "Cuanza Sul",
  "Bié",
  "Moxico",
  "Zaire",
  "Bengo",
  "Lunda Norte",
  "Lunda Sul",
  "Cunene",
  "Cuando Cubango",
];

export const formatKz = (value: number) =>
  `${value.toLocaleString("pt-AO").replace(/\u00a0/g, ".")} Kz`;

export const colorById = (id: ColorId) => COLORS.find((c) => c.id === id)!;

export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
