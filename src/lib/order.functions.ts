import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { PRODUCT_NAME, colorById } from "@/components/shop/data";
import { orderSchema, type OrderField, type SubmitOrderResult } from "./order-schema";

/**
 * Regista os dados de entrega antes do pagamento.
 *
 * O projecto não tem base de dados: o pedido é enviado (POST JSON) para o destino
 * configurado em ORDER_WEBHOOK_URL — por ex. Google Apps Script/Sheets, Make, Zapier.
 * Opcional: ORDER_WEBHOOK_SECRET é enviado no cabeçalho "x-order-secret".
 * Sem destino configurado o pedido é validado e o cliente segue para o pagamento, sem registo.
 */
export const submitOrder = createServerFn({ method: "POST" })
  .validator((data: unknown) => data)
  .handler(async ({ data }): Promise<SubmitOrderResult> => {
    if (!isSameOrigin()) {
      return { ok: false, error: "Pedido recusado." };
    }

    const parsed = orderSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<OrderField, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as OrderField | undefined;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      // Honeypot preenchido: resposta genérica, sem pistas.
      if (fieldErrors.website) return { ok: false, error: "Pedido recusado." };
      return { ok: false, error: "Revê os campos assinalados.", fieldErrors };
    }

    const order = parsed.data;
    const variant = colorById(order.cor);
    if (!variant.checkoutUrl) {
      return { ok: false, error: `A cor ${variant.name} não está disponível de momento.` };
    }

    const webhookUrl = process.env["ORDER_WEBHOOK_URL"];
    if (!webhookUrl) {
      console.warn(`[pedido] ${order.pedidoId} validado sem registo (ORDER_WEBHOOK_URL vazio).`);
      return { ok: true, pedidoId: order.pedidoId, checkoutUrl: variant.checkoutUrl };
    }

    // Preço e nome vêm sempre do servidor, nunca do browser.
    const payload = {
      pedidoId: order.pedidoId,
      criadoEm: new Date().toISOString(),
      estado: "aguarda_pagamento",
      produto: PRODUCT_NAME,
      cor: variant.id,
      corNome: variant.name,
      tamanho: order.tamanho,
      quantidade: order.quantidade,
      precoUnitario: variant.price,
      total: variant.price * order.quantidade,
      cliente: { nome: order.nome, telefone: `+244${order.telefone}` },
      entrega: {
        provincia: order.provincia,
        municipio: order.municipio,
        bairro: order.bairro,
        endereco: order.endereco,
      },
      checkoutUrl: variant.checkoutUrl,
    };

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(process.env["ORDER_WEBHOOK_SECRET"]
            ? { "x-order-secret": process.env["ORDER_WEBHOOK_SECRET"] }
            : {}),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) {
        // Não registar dados pessoais nos logs: só o id e o estado.
        console.error(`[pedido] destino respondeu ${res.status} para ${order.pedidoId}`);
        return { ok: false, error: "Não foi possível registar o pedido. Tenta novamente." };
      }
    } catch (error) {
      console.error(`[pedido] falha ao enviar ${order.pedidoId}:`, (error as Error).message);
      return { ok: false, error: "Não foi possível registar o pedido. Tenta novamente." };
    }

    return { ok: true, pedidoId: order.pedidoId, checkoutUrl: variant.checkoutUrl };
  });

// Bloqueia envios feitos a partir de outros sites (CSRF simples).
function isSameOrigin() {
  const origin = getRequestHeader("origin");
  const host = getRequestHeader("x-forwarded-host") ?? getRequestHeader("host");
  if (!origin || !host) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
