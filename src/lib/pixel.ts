// Píxel do Facebook (Meta). O código base é injectado em __root.tsx.
export const FB_PIXEL_ID = "1639791784443358";

// Código base oficial do Meta, com PageView.
export const FB_PIXEL_SCRIPT = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FB_PIXEL_ID}');
fbq('track', 'PageView');`;

type StandardEvent = "ViewContent" | "InitiateCheckout" | "AddPaymentInfo";

type ProductParams = {
  content_ids: string[];
  content_name: string;
  content_type: "product";
  value: number;
  currency: "AOA";
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Envia um evento padrão. Nunca envia dados pessoais (nome, telefone, morada).
 * `eventID` permite ao Meta ignorar duplicados do mesmo pedido.
 */
export function trackPixel(event: StandardEvent, params: ProductParams, eventID?: string) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  try {
    if (eventID) window.fbq("track", event, params, { eventID });
    else window.fbq("track", event, params);
  } catch {
    // O píxel nunca pode impedir uma encomenda.
  }
}
