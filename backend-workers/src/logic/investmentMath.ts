/**
 * Calculate future value of monthly savings with compound interest
 * @param monthlySavings - Amount saved per month
 * @param years - Number of years
 * @param annualInterestRate - Annual interest rate (e.g., 0.05 for 5%)
 * @returns Future value
 */
export function calculateFutureValue(
  monthlySavings: number,
  years: number,
  annualInterestRate: number = 0.05
): number {
  const monthlyRate = annualInterestRate / 12;
  const months = years * 12;

  if (monthlyRate === 0) {
    return monthlySavings * months;
  }

  // Future value of annuity formula
  const futureValue =
    monthlySavings *
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

  return futureValue;
}

