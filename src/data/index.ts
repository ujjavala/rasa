import type { Dish, Festival, Rasa, RasaId, Region, RegionId, Spice } from '../types';
import { rasas } from './rasas';
import { dishes } from './dishes';
import { regions } from './regions';
import { festivals } from './festivals';
import { spices } from './spices';

export { rasas, dishes, regions, festivals, spices };

export const rasaById = (id: RasaId): Rasa => rasas.find((r) => r.id === id)!;

export const regionById = (id: RegionId): Region => regions.find((r) => r.id === id)!;

export const dishesByRasa = (id: RasaId): Dish[] => dishes.filter((d) => d.rasa === id);

export const dishesTouchingRasa = (id: RasaId): Dish[] =>
  dishes.filter((d) => d.rasa === id || d.secondaryRasa?.includes(id));

export const dishesByRegion = (id: RegionId): Dish[] => dishes.filter((d) => d.region === id);

export const festivalsByRasa = (id: RasaId): Festival[] => festivals.filter((f) => f.rasa === id);

export const spicesByRasa = (id: RasaId): Spice[] => spices.filter((s) => s.rasa === id);
