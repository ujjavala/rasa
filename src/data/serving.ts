import type { Dish } from '../types';

export type ServingTemperature = 'piping-hot' | 'warm' | 'cool' | 'chilled';

const CHILLED_DISHES = new Set([
  'Jigarthanda',
  'Sol Kadhi',
  'Black Carrot Kanji',
  'Pakhala Bhata',
  'Curd Rice',
  'Bathua Raita',
]);

const COOL_DISHES = new Set([
  'Rasgulla',
  'Gongura Pachadi',
  'Dhokla',
  'Mango Pickle',
  'Bhel Puri',
  'Bhut Jolokia Chutney',
]);

export function servingTemperature(dish: Dish): ServingTemperature {
  if (CHILLED_DISHES.has(dish.name)) return 'chilled';
  if (COOL_DISHES.has(dish.name)) return 'cool';
  if (dish.plate.steam) return 'piping-hot';
  return 'warm';
}

export const SERVING_LABELS: Record<ServingTemperature, string> = {
  'piping-hot': 'Piping hot',
  warm: 'Served warm',
  cool: 'Served cool',
  chilled: 'Chilled',
};
