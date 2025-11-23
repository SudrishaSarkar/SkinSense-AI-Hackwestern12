// src/routes/investment.ts
import type { Env } from "../types";
import { corsHeaders } from "../utils/cors";

export async function handleInvestment(
  request: Request,
  _env: Env
): Promise<Response> {
  let body: {
    initial?: number;
    monthly?: number;
    years?: number;
    annualRate?: number;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  const initial = body.initial ?? 0;
  const monthly = body.monthly ?? 0;
  const years = body.years ?? 0;
  const annualRate = body.annualRate ?? 0.05;

  const months = years * 12;
  const monthlyRate = annualRate / 12;

  let future = initial * Math.pow(1 + monthlyRate, months);
  for (let i = 0; i < months; i++) {
    future = future * (1 + monthlyRate) + monthly;
  }

  return new Response(
    JSON.stringify({
      initial,
      monthly,
      years,
      annualRate,
      future_value: future,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    }
  );
}
