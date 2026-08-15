import type { RasaId } from '../types';

export interface ExplorerDetails {
  name: string;
  epithet: string;
  greeting: string;
  accessory: 'satchel' | 'leaf' | 'shell' | 'chilli' | 'sprig' | 'cup';
}

export const EXPLORERS: Record<RasaId, ExplorerDetails> = {
  madhura: { name: 'Guddi', epithet: 'Culinary Archivist', greeting: 'Begin with nourishment. Grain, milk and jaggery carry histories older than the recipes that name them.', accessory: 'satchel' },
  amla: { name: 'Ami', epithet: 'Fermentation Botanist', greeting: 'Follow the souring fruit: kokum, tamarind and bamboo tell us exactly where the landscape has changed.', accessory: 'leaf' },
  lavana: { name: 'Neer', epithet: 'Coastal Navigator', greeting: 'Salt is geography made edible. Read the pans, mountain seams and fermented shores.', accessory: 'shell' },
  katu: { name: 'Tara', epithet: 'Spice Route Chronicler', greeting: 'Heat has a provenance. Pepper, mustard and chilli arrived by different roads and belong to different centuries.', accessory: 'chilli' },
  tikta: { name: 'Nima', epithet: 'Ethnobotanical Elder', greeting: 'Bitterness is knowledge preserved—medicinal leaves, forest greens and the discipline of a first course.', accessory: 'sprig' },
  kashaya: { name: 'Jamu', epithet: 'Tea & Tannin Cartographer', greeting: 'Astringency marks the quiet border between flavour and touch. Let the palate reveal the route.', accessory: 'cup' },
};
