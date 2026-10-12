import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowPathIcon, CheckIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { reverseGeocode } from "@/lib/geo.functions";
import type { LocationMatch } from "@/lib/angola";

type AngolaMatch = Extract<LocationMatch, { kind: "angola" }>;

/** Ponto exacto do cliente, enviado com o pedido para o entregador o encontrar. */
export type Coords = { lat: number; lon: number; precisao: number };

export type DetectState =
  | { s: "idle" }
  | { s: "unsupported" }
  | { s: "locating" }
  | { s: "detected"; match: AngolaMatch }
  | { s: "confirmed"; match: AngolaMatch }
  // Recusa: nunca voltamos a pedir autorização nesta visita.
  | { s: "denied" }
  | { s: "failed"; message: string };

// GPS para o entregador encontrar a morada; se demorar, tenta com a rede/Wi-Fi.
const GPS_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15_000,
  maximumAge: 60_000,
};
const NETWORK_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 12_000,
  maximumAge: 5 * 60_000,
};

const locate = (options: PositionOptions) =>
  new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, options),
  );

const isGeoError = (e: unknown): e is GeolocationPositionError =>
  typeof e === "object" && e !== null && "code" in e && "PERMISSION_DENIED" in e;

/**
 * Detecção da localização do cliente. As coordenadas ficam só em memória e seguem com
 * o pedido (para o entregador); a geocodificação recebe-as arredondadas.
 */
export function useLocationDetect(onDetected: (match: AngolaMatch) => void) {
  const geocode = useServerFn(reverseGeocode);
  const [state, setState] = useState<DetectState>({ s: "idle" });
  const [coords, setCoords] = useState<Coords | null>(null);
  const busy = useRef(false);
  const onDetectedRef = useRef(onDetected);
  onDetectedRef.current = onDetected;

  const detect = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setState({ s: "locating" });

    let pos: GeolocationPosition;
    try {
      pos = await locate(GPS_OPTIONS).catch((err: unknown) => {
        if (isGeoError(err) && err.code === err.PERMISSION_DENIED) throw err;
        return locate(NETWORK_OPTIONS);
      });
    } catch (err) {
      busy.current = false;
      if (isGeoError(err) && err.code === err.PERMISSION_DENIED) setState({ s: "denied" });
      else
        setState({
          s: "failed",
          message:
            isGeoError(err) && err.code === err.TIMEOUT
              ? "A localização demorou demasiado."
              : "Localização indisponível (o GPS ou a localização podem estar desligados).",
        });
      return;
    }

    const { latitude, longitude, accuracy } = pos.coords;
    // O ponto fica guardado mesmo que a identificação da zona falhe: o entregador usa-o.
    setCoords({
      lat: Number(latitude.toFixed(5)),
      lon: Number(longitude.toFixed(5)),
      precisao: Math.round(accuracy),
    });

    try {
      const result = await geocode({ data: { lat: latitude, lon: longitude } });
      if (!result.ok) {
        setState({
          s: "failed",
          message:
            result.reason === "sem-resultado"
              ? "Não conseguimos identificar a tua zona."
              : "O serviço de localização não respondeu.",
        });
      } else if (result.match.kind === "fora-de-angola") {
        setCoords(null);
        setState({ s: "failed", message: "A localização detectada não é em Angola." });
      } else {
        setState({ s: "detected", match: result.match });
        onDetectedRef.current(result.match);
      }
    } catch {
      setState({ s: "failed", message: "Sem ligação ao serviço de localização." });
    } finally {
      busy.current = false;
    }
  }, [geocode]);

  // Ao entrar: se o cliente já autorizou antes, detecta sem perguntar nada.
  // Caso contrário, o pedido do browser só aparece depois de ele carregar no botão
  // do ecrã de entrada — um pedido sem contexto parece suspeito e costuma ser bloqueado
  // para sempre.
  const [permission, setPermission] = useState<"unknown" | "prompt" | "granted">("unknown");
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!("geolocation" in navigator) || !window.isSecureContext) {
      setState({ s: "unsupported" });
      return;
    }
    const permissions = navigator.permissions?.query({ name: "geolocation" });
    if (!permissions) {
      setPermission("prompt");
      return;
    }
    permissions
      .then((p) => {
        // Já recusou antes: o browser não voltaria a perguntar.
        if (p.state === "denied") setState((cur) => (cur.s === "idle" ? { s: "denied" } : cur));
        else if (p.state === "granted") {
          setPermission("granted");
          void detect();
        } else setPermission("prompt");
      })
      .catch(() => setPermission("prompt"));
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

  return { state, coords, permission, detect, confirm, reset };
}

const placeLabel = (m: AngolaMatch) =>
  [m.localidade, m.municipio, m.provincia].filter(Boolean).join(", ");

export function LocationCard({
  state,
  onDetect,
  onConfirm,
  onCorrect,
  confirmedLabel,
  hasCoords,
}: {
  state: DetectState;
  /** O ponto GPS foi obtido (segue com o pedido para o entregador). */
  hasCoords: boolean;
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
            Activa a localização para o nosso entregador te encontrar com facilidade.
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
            Também podes escolher a província e o município abaixo.
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
            Localização confirmada: <span className="font-semibold">{confirmedLabel}</span>. O
            entregador vai ter o teu ponto no mapa.
          </span>
        </p>
      ) : state.s === "denied" ? (
        <p className="text-muted-foreground">Sem acesso à localização. {manual}</p>
      ) : state.s === "unsupported" ? (
        <p className="text-muted-foreground">{manual}</p>
      ) : (
        <>
          {hasCoords && (
            <p className="mb-1 flex items-center gap-2 font-semibold">
              <CheckIcon className="h-4 w-4 shrink-0" />
              Localização guardada para o entregador.
            </p>
          )}
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
 * Painel de entrada: a primeira coisa que o cliente vê ao abrir o site no telemóvel.
 * Mostra primeiro o benefício (entrega rápida), depois o pedido, e diz claramente para
 * que serve a localização. O produto continua visível por trás.
 */
export function LocationGate({
  state,
  permission,
  onDetect,
}: {
  state: DetectState;
  permission: "unknown" | "prompt" | "granted";
  onDetect: () => void;
}) {
  const [skipped, setSkipped] = useState(false);
  if (skipped || permission !== "prompt") return null;
  if (state.s !== "idle" && state.s !== "locating") return null;
  const locating = state.s === "locating";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-gate-title"
      className="fixed inset-0 z-50 flex items-end bg-foreground/40"
    >
      <div className="w-full rounded-t-2xl bg-background px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          A MÁQUINA
        </p>
        <h2 id="location-gate-title" className="mt-1.5 text-xl leading-tight">
          Recebe em casa, hoje ou amanhã
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Em Luanda, entregamos no mesmo dia ou no dia seguinte, conforme a hora da compra. Noutras
          províncias, confirmamos contigo o prazo.
        </p>

        <p className="mt-3 text-sm">
          Partilha a tua localização para vermos se entregamos na tua zona e para o entregador
          chegar até ti sem te ligar a pedir direcções.
        </p>
        <ul className="mt-2.5 space-y-1 text-[13px] text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
            Usamos a localização só para a entrega.
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
            Não pedimos pagamento nem dados bancários agora.
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
            Pagas por referência, no app do banco ou num ATM, só depois de confirmares o pedido.
          </li>
        </ul>

        <Button
          type="button"
          variant="hero"
          size="xl"
          className="mt-4 h-12 w-full text-sm"
          onClick={onDetect}
          disabled={locating}
          aria-busy={locating}
        >
          {locating ? (
            <>
              <ArrowPathIcon className="animate-spin" /> A localizar…
            </>
          ) : (
            <>
              <MapPinIcon /> Partilhar a minha localização
            </>
          )}
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {locating
            ? "Se o telemóvel perguntar, escolhe “Permitir”."
            : "O telemóvel vai pedir autorização. Escolhe “Permitir”."}
        </p>
        <button
          type="button"
          onClick={() => setSkipped(true)}
          className="mt-1 h-10 w-full text-[13px] font-medium underline underline-offset-4"
        >
          Ver o produto e escrever a morada à mão
        </button>
      </div>
    </div>
  );
}
