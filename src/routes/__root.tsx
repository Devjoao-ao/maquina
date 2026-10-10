import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { FB_PIXEL_ID, FB_PIXEL_SCRIPT } from "../lib/pixel";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "A MÁQUINA — Streetwear Angolano" },
      { name: "description", content: "Camisetas A MÁQUINA por 12.000 Kz com entrega grátis." },
      { name: "author", content: "A MÁQUINA" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://connect.facebook.net" },
    ],
    // Píxel do Facebook: código base em todas as páginas.
    scripts: [{ children: FB_PIXEL_SCRIPT }],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <HeadContent />
      </head>
      <body>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        <div className="desktop-block min-h-screen items-center justify-center bg-background px-6">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold text-foreground">Abre no teu telemóvel</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Este site está disponível apenas em telemóveis. Abre este link no teu telemóvel para
              fazeres a tua encomenda.
            </p>
          </div>
        </div>
        <div className="site-content">{children}</div>
        <Scripts />
      </body>
    </html>
  );
}

/*
 * Protecção contra capturas de ecrã em telemóvel. Os browsers não permitem
 * bloquear o print do sistema; o melhor possível é esconder o conteúdo sempre
 * que a página perde o foco (multitarefa, centro de controlo, ferramentas de
 * captura) e impedir guardar/copiar imagens e texto com toque longo.
 */
function useScreenshotGuard() {
  useEffect(() => {
    const root = document.documentElement;
    const hide = () => root.classList.add("screen-guard");
    const show = () => {
      if (document.visibilityState === "visible" && document.hasFocus()) {
        root.classList.remove("screen-guard");
      }
    };
    const onVisibility = () => (document.visibilityState === "hidden" ? hide() : show());
    const prevent = (e: Event) => e.preventDefault();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", hide);
    window.addEventListener("focus", show);
    window.addEventListener("pagehide", hide);
    window.addEventListener("pageshow", show);
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dragstart", prevent);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", hide);
      window.removeEventListener("focus", show);
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("pageshow", show);
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dragstart", prevent);
    };
  }, []);
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useScreenshotGuard();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
