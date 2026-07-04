export function generatePickupCode(): string {
  return 'FB-' + Math.floor(1000 + Math.random() * 9000).toString();
}

export function calculateCO2Saved(weightKg: number): number {
  // Approximate standard conversion: 1kg food waste avoided = ~2.5 kg CO2e saved
  return parseFloat((weightKg * 2.5).toFixed(1));
}
