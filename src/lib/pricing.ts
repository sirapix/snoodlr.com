export const PLAN_PRICES_USD = {
  essential: 30,
  business: 85
} as const;

export type PricedPlan = keyof typeof PLAN_PRICES_USD;

export function monthlyPriceLabel(plan: PricedPlan) {
  return `$${PLAN_PRICES_USD[plan]}`;
}
