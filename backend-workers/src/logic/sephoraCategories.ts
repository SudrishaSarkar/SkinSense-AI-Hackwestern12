export const sephoraCategoryMap: Record<string, string> = {
  moisturizer: "skin-care",
  cream: "skin-care",
  cleanser: "skin-care",
  serum: "skin-care-treatment",
  sunscreen: "sun-care",
  toner: "skin-care",
  mask: "skin-care",
  // fallback category
  default: "skin-care",
};

export function detectCategory(productName: string): string {
  const lower = productName.toLowerCase();

  for (const keyword in sephoraCategoryMap) {
    if (lower.includes(keyword)) {
      return sephoraCategoryMap[keyword];
    }
  }
  return sephoraCategoryMap.default;
}
