import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowPathIcon, CheckIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { reverseGeocode } from "@/lib/geo.functions";
import type { LocationMatch } from "@/lib/angola";

type AngolaMatch = Extract<LocationMatch, { kind: "angola" }>;

export type DetectState =
  | { s: "idle" }
  | { s: "unsupported" }
  | { s: "locating" }
  | { s: "detected"; match: AngolaMatch }
  | { s: "confirmed"; match: AngolaMatch }
  // Recusa: nunca voltamos a pedir autorização nesta visita.
  | { s: "denied" }
  | { s: "failed"; message: string };

const GEO_OPTIONS: PositionOptions = {
  // Precisão de rede/Wi-Fi chega para a província e o município; não exige GPS.
  enableHighAccuracy: false,
  timeout: 12_000,
  maximumAge: 5 * 60_000,
};

/**
 * Detecção da localização a pedido do cliente. As coordenadas só existem dentro de
 * `detect()`: vão para o servidor (que as arredonda) e não ficam guardadas.
 */
export function useLocationDetect(onDetected: (match: AngolaMatch) => void) {
  const geocode = useServerFn(reverseGeocode);
  const [state, setState] = useState<DetectState>({ s: "idle" });
  const busy = useRef(false);
  const onDetectedRef = useRef(onDetected);
  onDetectedRef.current = onDetected;

  const detect = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    setState({ s: "locating" });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const result = await geocode({
            data: { lat: pos.coords.latitude, lon: pos.coords.longitude },
          });
          if (!result.ok) {
            setState({
              s: "failed",
              message:
                result.reason === "sem-resultado"
                  ? "Não conseguimos identificar a tua zona."
                  : "O serviço de localização não respondeu.",
            });
          } else if (result.match.kind === "fora-de-angola") {
            setState({
              s: "failed",
              message: "A localização detectada não é em Angola.",
            });
          } else {
            setState({ s: "detected", match: result.match });
            onDetectedRef.current(result.match);
          }
        } catch {
          setState({ s: "failed", message: "Sem ligação ao serviço de localização." });
        } finally {
          busy.current = false;
        }
      },
      (err) => {
        busy.current = false;
        if (err.code === err.PERMISSION_DENIED) setState({ s: "denied" });
        else if (err.code === err.TIMEOUT)
          setState({ s: "failed", message: "A localização demorou demasiado." });
        else
          setState({
            s: "failed",
            message: "Localização indisponível (o GPS ou a localização podem estar desligados).",
          });
      },
      GEO_OPTIONS,
    );
  }, [geocode]);

  // Em telemóvel, pede a localização logo ao entrar no site (o desktop está bloqueado).
  const autoAsked = useRef(false);
  useEffect(() => {
    if (autoAsked.current) return;
    autoAsked.current = true;
    if (!("geolocation" in navigator) || !window.isSecureContext) {
      setState({ s: "unsupported" });
      return;
    }
    const isPhone = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const permissions = navigator.permissions?.query({ name: "geolocation" });
    if (!permissions) {
      if (isPhone) detect();
      return;
    }
    permissions
      .then((p) => {
        // Já recusou antes: o browser não voltaria a perguntar.
        if (p.state === "denied") setState((cur) => (cur.s === "idle" ? { s: "denied" } : cur));
        else if (isPhone) detect();
      })
      .catch(() => {
        if (isPhone) detect();
      });
  }, [detect]);

  const confirm = useCallback(
    () => setState((cur) => (cur.s === "detected" ? { s: "confirmed", match: cur.match } : cur)),
    [],
  );

  // Alteração manual: a detecção deixa de valer, mas sem voltar a pedir autorização.
  const reset = useCallback(
    () => setState((cur) => (cur.s === "detected" || cur.s === "confirmed" ? { s: "idle" } : cur)),
    [],
  );

  return { state, detect, confirm, reset };
}

const placeLabel = (m: AngolaMatch) =>
  [m.localidade, m.municipio, m.provincia].filter(Boolean).join(", ");

export function LocationCard({
  state,
  onDetect,
  onConfirm,
  onCorrect,
  confirmedLabel,
}: {
  state: DetectState;
  /** O que está escolhido no formulário (a fonte de verdade depois de confirmar). */
  confirmedLabel: string;
  onDetect: () => void;
  onConfirm: () => void;
  onCorrect: () => void;
}) {
  const manual = "Escolhe a província e o município abaixo.";

  return (
    <div className="mt-5 rounded-md border border-border px-4 py-3.5 text-sm" aria-live="polite">
      {state.s === "idle" || state.s === "locating" ? (
        <>
          <p className="font-semibold">Vamos entregar o teu pedido onde estiveres.</p>
          <p className="mt-1 text-muted-foreground">
            Identifica a tua localização para vermos as opções de entrega na tua região.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-3 h-11 w-full sm:w-auto"
            onClick={onDetect}
            disabled={state.s === "locating"}
            aria-busy={state.s === "locating"}
          >
            {state.s === "locating" ? (
              <>
                <ArrowPathIcon className="animate-spin" /> A detectar…
              </>
            ) : (
              <>
                <MapPinIcon /> Detectar a minha localização
              </>
            )}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Opcional. Também podes escolher a província e o município abaixo.
          </p>
        </>
      ) : state.s === "detected" ? (
        <>
          {state.match.provincia ? (
            <>
              <p className="flex items-start gap-2">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Parece que estás em{" "}
                  <span className="font-semibold">{placeLabel(state.match)}</span>.
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                É uma estimativa
                {state.match.alternativas.length > 0 &&
                  ` (também pode ser ${state.match.alternativas.join(" ou ")})`}
                . Confirma ou corrige.
                {!state.match.municipio && " Escolhe o teu município abaixo."}
              </p>
              <div className="mt-3 flex gap-2">
                <Button type="button" variant="hero" className="h-10 flex-1" onClick={onConfirm}>
                  Está correcto
                </Button>
                <Button type="button" variant="outline" className="h-10 flex-1" onClick={onCorrect}>
                  Corrigir
                </Button>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">
              Não conseguimos confirmar a tua província
              {state.match.alternativas.length > 0 &&
                ` (pode ser ${state.match.alternativas.join(" ou ")})`}
              . {manual}
            </p>
          )}
          <p className="mt-2 text-[11px] text-muted-foreground">Mapa © OpenStreetMap</p>
        </>
      ) : state.s === "confirmed" ? (
        <p className="flex items-center gap-2">
          <CheckIcon className="h-4 w-4 shrink-0" />
          <span>
            Localização confirmada: <span className="font-semibold">{confirmedLabel}</span>.
          </span>
        </p>
      ) : state.s === "denied" ? (
        <p className="text-muted-foreground">Sem acesso à localização. {manual}</p>
      ) : state.s === "unsupported" ? (
        <p className="text-muted-foreground">{manual}</p>
      ) : (
        <>
          <p className="text-muted-foreground">
            {state.message} {manual}
          </p>
          <button
            type="button"
            onClick={onDetect}
            className="mt-2 text-xs underline underline-offset-4"
          >
            Tentar outra vez
          </button>
        </>
      )}
    </div>
  );
}

/**
 * Ecrã de entrada: a primeira coisa que o cliente vê é o pedido de localização.
 * Fecha sozinho quando a localização é detectada, recusada ou indisponível.
 */
export function LocationGate({ state, onDetect }: { state: DetectState; onDetect: () => void }) {
  const [skipped, setSkipped] = useState(false);
  if (skipped || (state.s !== "idle" && state.s !== "locating")) return null;
  const locating = state.s === "locating";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-gate-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 px-6 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-foreground text-background">
          <MapPinIcon className="h-7 w-7" />
        </span>
        <h2 id="location-gate-title" className="mt-5 text-2xl">
          Activa a tua localização
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Assim vemos as opções de entrega na tua zona. Quando o telemóvel perguntar, escolhe
          “Permitir”.
        </p>
        <Button
          type="button"
          variant="hero"
          size="xl"
          className="mt-6 h-14 w-full text-sm"
          onClick={onDetect}
          disabled={locating}
          aria-busy={locating}
        >
          {locating ? (
            <>
              <ArrowPathIcon className="animate-spin" /> A detectar…
            </>
          ) : (
            <>
              <MapPinIcon /> Activar localização
            </>
          )}
        </Button>
        <button
          type="button"
          onClick={() => setSkipped(true)}
          className="mt-4 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Agora não
        </button>
      </div>
    </div>
  );
}
