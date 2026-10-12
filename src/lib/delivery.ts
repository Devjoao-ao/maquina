import { MUNICIPIOS, type Provincia } from "./angola";

/**
 * Zonas de entrega com cobertura CONFIRMADA pela equipa.
 *
 * Para abrir uma nova zona, acrescenta aqui uma entrada — o resto da página adapta-se.
 * - municipios: null = toda a província; ou a lista de municípios abrangidos.
 * - custo / prazo: null = não mostrar (nunca inventar valores).
 *
 * Províncias/municípios fora desta lista continuam a poder enviar pedido, mas ficam
 * "a confirmar": a equipa verifica a entrega e só depois o cliente paga.
 */
export type DeliveryZone = {
  municipios: readonly string[] | null;
  metodo: string;
  /** Custo em Kz; 0 = grátis; null = não definido. */
  custo: number | null;
  prazo: string | null;
};

export const DELIVERY_ZONES: Partial<Record<Provincia, DeliveryZone>> = {
  Luanda: {
    municipios: null,
    metodo: "Entrega ao domicílio",
    custo: null,
    prazo: "no mesmo dia ou no dia seguinte, conforme a hora da compra",
  },
};

export type Coverage =
  | { estado: "confirmada"; zona: DeliveryZone }
  | { estado: "a-confirmar" }
  | { estado: "incompleta" };

export function coverageFor(provincia: Provincia | null, municipio: string | null): Coverage {
  if (!provincia) return { estado: "incompleta" };
  const zona = DELIVERY_ZONES[provincia];
  if (!zona) return { estado: "a-confirmar" };
  // Cobertura só de alguns municípios: precisa do município para decidir.
  if (zona.municipios === null) return { estado: "confirmada", zona };
  if (!municipio) return { estado: "incompleta" };
  return zona.municipios.includes(municipio)
    ? { estado: "confirmada", zona }
    : { estado: "a-confirmar" };
}

// Avisa se uma zona usar um município fora da lista oficial (nunca ficaria confirmada).
for (const [provincia, zona] of Object.entries(DELIVERY_ZONES) as [Provincia, DeliveryZone][]) {
  for (const m of zona.municipios ?? []) {
    if (!MUNICIPIOS[provincia].includes(m)) {
      console.error(`[entrega] zona inválida: ${m} não pertence a ${provincia}.`);
    }
  }
}
