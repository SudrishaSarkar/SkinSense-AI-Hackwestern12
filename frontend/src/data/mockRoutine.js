export function mockRoutine(analysis, lifestyle) {
  const oily = analysis?.oiliness === "high";

  const goals = [
    "reduce redness",
    "support barrier repair",
    oily ? "balance sebum" : "maintain hydration",
  ];

  return {
    goals,
    am: [
      "Gentle, non-stripping gel cleanser",
      "Hydrating antioxidant serum (niacinamide, vitamin C derivative)",
      oily ? "Lightweight, oil-free moisturizer" : "Barrier-supporting cream",
      "Broad-spectrum SPF 30+ with a lightweight finish",
    ],
    pm: [
      "Oil cleanser or balm for makeup/sunscreen",
      "Gentle water-based cleanser",
      "Leave-on chemical exfoliant 1–2x/week (PHA/BHA depending on tolerance)",
      "Ceramide-rich moisturizer for barrier support",
      "Targeted spot treatment on active breakouts if needed",
    ],
    usageNotes:
      "Introduce new actives slowly and patch test on a small area for 24 hours. Adjust frequency based on how calm or reactive your skin feels.",
  };
}
