export const APP_NAME = 'FoodBridge';

export const DIETARY_RESTRICTIONS = [
  { label: 'Vegetarian', value: 'VEGETARIAN' },
  { label: 'Halal', value: 'HALAL' },
  { label: 'Vegan', value: 'VEGAN' },
  { label: 'Gluten-Free', value: 'GLUTEN_FREE' },
  { label: 'Nut-Free', value: 'NUT_FREE' }
];

export const URGENCY_LEVELS = {
  NORMAL: 'NORMAL',
  URGENT: 'URGENT',
  HIGH: 'HIGH'
} as const;
