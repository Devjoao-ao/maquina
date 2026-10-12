import { createServerFn } from "@tanstack/react-start";
import { PRODUCT_NAME, colorById } from "@/components/shop/data";
import { orderSchema, type OrderField, type SubmitOrderResult } from "./order-schema";
import { coverageFor } from "./delivery";
import { isSameOrigin } from "./same-origin.server";

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

    // A cobertura é sempre decidida no servidor, com a mesma configuração da página.
    const coverage = coverageFor(order.provincia, order.municipio);
    const confirmada = coverage.estado === "confirmada";
    const success: SubmitOrderResult = confirmada
      ? {
          ok: true,
          pedidoId: order.pedidoId,
          cobertura: "confirmada",
          checkoutUrl: variant.checkoutUrl,
        }
      : { ok: true, pedidoId: order.pedidoId, cobertura: "a-confirmar" };

    const webhookUrl = process.env["ORDER_WEBHOOK_URL"];
    if (!webhookUrl) {
      if (!confirmada) {
        // Sem registo, a equipa nunca veria o pedido: não prometer um contacto que não acontece.
        console.warn(
          `[pedido] ${order.pedidoId} recusado: entrega a confirmar sem ORDER_WEBHOOK_URL.`,
        );
        return {
          ok: false,
          error: `Ainda não conseguimos receber pedidos para ${order.provincia} pelo site. Tenta mais tarde.`,
        };
      }
      console.warn(`[pedido] ${order.pedidoId} validado sem registo (ORDER_WEBHOOK_URL vazio).`);
      return success;
    }

    // Preço e nome vêm sempre do servidor, nunca do browser.
    // O formulário nunca marca o pagamento como feito: isso só acontece após verificação.
    const payload = {
      pedidoId: order.pedidoId,
      criadoEm: new Date().toISOString(),
      estado: confirmada ? "aguarda_pagamento" : "aguarda_confirmacao_entrega",
      estadoPagamento: confirmada ? "pendente" : "nao_iniciado",
      destino: `${order.provincia} — ${order.municipio}`,
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
        referencia: order.referencia,
        origemLocalizacao: order.origemLocalizacao,
        // Ponto exacto para o entregador (abre no Google Maps).
        localizacao: order.localizacao
          ? {
              lat: order.localizacao.lat,
              lon: order.localizacao.lon,
              precisaoMetros: order.localizacao.precisao,
              mapa: `https://www.google.com/maps?q=${order.localizacao.lat},${order.localizacao.lon}`,
            }
          : null,
        cobertura: coverage.estado,
        metodo: confirmada ? coverage.zona.metodo : null,
        custo: confirmada ? coverage.zona.custo : null,
        prazo: confirmada ? coverage.zona.prazo : null,
      },
      // Só há link de pagamento quando a entrega está confirmada.
      checkoutUrl: confirmada ? variant.checkoutUrl : null,
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

    return success;
  });
