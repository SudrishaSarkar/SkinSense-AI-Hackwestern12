import type { Env } from "../types";
import { calculateFutureValue } from "../logic/investmentMath";

interface InvestmentRequest {
  monthly_savings: number;
  years: number;
  interest_rate?: number;
}

export async function handleInvestment(request: Request, env: Env) {
  const body = (await request.json()) as InvestmentRequest;
  
  const monthlySavings = body.monthly_savings || 0;
  const years = body.years || 1;
  const interestRate = body.interest_rate || 0.05; // 5% default

  const projectedValue = calculateFutureValue(monthlySavings, years, interestRate);

  const result = {
    monthly_savings: monthlySavings,
    projected_value: projectedValue,
    years: years,
    explanation: `If you save $${monthlySavings} per month for ${years} year(s) at ${(interestRate * 100).toFixed(1)}% annual interest, you'll have approximately $${projectedValue.toFixed(2)}.`,
  };

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
}

