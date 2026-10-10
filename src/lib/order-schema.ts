import { z } from "zod";
import { COLOR_IDS, PROVINCES, SIZES } from "@/components/shop/data";

// Telefone angolano: 9 dígitos começados por 9, com ou sem +244 / 244 / espaços.
export const normalizePhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  const local = digits.startsWith("244") ? digits.slice(3) : digits;
  return local;
};

const text = (min: number, max: number, message: string) =>
  z
    .string({ required_error: message })
    .trim()
    .min(min, message)
    .max(max, `Máximo de ${max} caracteres.`);

// Esquema partilhado: o mesmo é usado no formulário e no servidor.
export const orderSchema = z.object({
  nome: text(3, 100, "Indica o teu nome completo.").refine(
    (v) => v.split(/\s+/).length >= 2,
    "Indica o nome e o apelido.",
  ),
  telefone: z
    .string({ required_error: "Indica o teu número de telefone." })
    .transform(normalizePhone)
    .refine((v) => /^9\d{8}$/.test(v), "Número inválido. Usa 9 dígitos, ex.: 923 456 789."),
  provincia: z.enum(PROVINCES, { errorMap: () => ({ message: "Escolhe a província." }) }),
  municipio: text(2, 80, "Indica o município."),
  bairro: text(2, 80, "Indica o bairro ou zona."),
  endereco: text(5, 200, "Indica a rua, casa ou um ponto de referência."),
  cor: z.enum(COLOR_IDS, { errorMap: () => ({ message: "Escolhe uma cor válida." }) }),
  tamanho: z.enum(SIZES, { errorMap: () => ({ message: "Escolhe o tamanho." }) }),
  quantidade: z.literal(1),
  // Gerado no browser por tentativa de pedido; permite ao destino ignorar duplicados.
  pedidoId: z.string().regex(/^[A-Z0-9]{8}$/),
  // Campo escondido (anti-spam). Pessoas reais deixam-no vazio.
  website: z.string().max(0).optional(),
});

export type OrderInput = z.input<typeof orderSchema>;
export type Order = z.output<typeof orderSchema>;
export type OrderField = keyof Order;

export type SubmitOrderResult =
  | { ok: true; pedidoId: string; checkoutUrl: string }
  | { ok: false; error: string; fieldErrors?: Partial<Record<OrderField, string>> };

export const newOrderId = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
};
