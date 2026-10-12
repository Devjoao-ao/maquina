import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { matchLocation, placeFromNominatim, type LocationMatch } from "./angola";
import { isSameOrigin } from "./same-origin.server";

/**
 * Geocodificação inversa (coordenadas -> província/município) via Nominatim (OpenStreetMap).
 *
 * - Só corre quando o cliente carrega em "Detectar a minha localização" e autoriza.
 * - Aqui as coordenadas são arredondadas (~100 m) antes de sair do servidor e não são
 *   registadas nos logs. O ponto exacto só segue com o pedido, para o entregador.
 * - Política do Nominatim: máx. 1 pedido/s e User-Agent identificável. Para tráfego alto,
 *   aponta GEOCODER_URL para outra instância compatível (mesma API /reverse).
 */
const coordsSchema = z.object({
  lat: z.number().finite().min(-90).max(90),
  lon: z.number().finite().min(-180).max(180),
});

export type ReverseGeocodeResult =
  | { ok: true; match: LocationMatch }
  | { ok: false; reason: "invalido" | "sem-resultado" | "servico-indisponivel" };

export const reverseGeocode = createServerFn({ method: "POST" })
  .validator((data: unknown) => data)
  .handler(async ({ data }): Promise<ReverseGeocodeResult> => {
    if (!isSameOrigin()) return { ok: false, reason: "invalido" };
    const parsed = coordsSchema.safeParse(data);
    if (!parsed.success) return { ok: false, reason: "invalido" };

    const lat = parsed.data.lat.toFixed(3);
    const lon = parsed.data.lon.toFixed(3);
    const base = process.env["GEOCODER_URL"] || "https://nominatim.openstreetmap.org";
    const url = `${base.replace(/\/$/, "")}/reverse?format=jsonv2&zoom=14&addressdetails=1&accept-language=pt&lat=${lat}&lon=${lon}`;

    try {
      const res = await fetch(url, {
        headers: {
          "user-agent": "AMaquina-Loja/1.0 (detecção de localização para entregas)",
          accept: "application/json",
        },
        signal: AbortSignal.timeout(6_000),
      });
      if (!res.ok) {
        console.error(`[geo] serviço respondeu ${res.status}`);
        return { ok: false, reason: "servico-indisponivel" };
      }
      const body = (await res.json()) as { address?: Record<string, unknown>; error?: unknown };
      if (!body.address) return { ok: false, reason: "sem-resultado" };
      return { ok: true, match: matchLocation(placeFromNominatim(body.address)) };
    } catch (error) {
      console.error("[geo] falha na geocodificação:", (error as Error).message);
      return { ok: false, reason: "servico-indisponivel" };
    }
  });
