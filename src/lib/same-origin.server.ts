import { getRequestHeader } from "@tanstack/react-start/server";

// Bloqueia envios feitos a partir de outros sites (CSRF simples).
export function isSameOrigin() {
  const origin = getRequestHeader("origin");
  const host = getRequestHeader("x-forwarded-host") ?? getRequestHeader("host");
  if (!origin || !host) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
