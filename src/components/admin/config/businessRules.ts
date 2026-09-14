export const businessRules = {
  inactivityThresholdDays: 90,
  agentReviewRatingThreshold: 2,
  referralReward: 600,
  lateDeliverySlaHours: 24,
  buyerRejectionWindowHours: 48,
  matchingWeights: {
    product: 0.24,
    quantity: 0.2,
    quality: 0.18,
    location: 0.15,
    price: 0.13,
    reliability: 0.1,
  },
  priceReference: {
    minimumMarginPercent: 6,
    overrideRequiresReason: true,
  },
  riskThresholds: { low: 25, medium: 50, high: 75, critical: 90 },
};

export const estimatedDisclaimer = "Sample / estimated data for prototype review";
