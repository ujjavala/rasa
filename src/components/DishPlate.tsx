import type { CSSProperties } from 'react';
import type { Dish } from '../types';
import { SERVING_LABELS, servingTemperature } from '../data/serving';
import './dish-plate.css';

export interface DishPlateProps {
  dish: Dish;
  compact?: boolean;
}

type PlateStyle = CSSProperties & {
  '--dish-base': string;
  '--dish-accent': string;
  '--dish-garnish': string;
};

const PORTIONS = Array.from({ length: 14 }, (_, index) => index);
const GARNISH = Array.from({ length: 10 }, (_, index) => index);
const STEAM = Array.from({ length: 5 }, (_, index) => index);
const EMBERS = Array.from({ length: 7 }, (_, index) => index);
const CONDENSATION = Array.from({ length: 8 }, (_, index) => index);
const MIST = Array.from({ length: 3 }, (_, index) => index);

/** A decorative dish portrait built entirely from CSS primitives. */
export default function DishPlate({ dish, compact = false }: Readonly<DishPlateProps>) {
  const { plate } = dish;
  const serving = servingTemperature(dish);
  const style: PlateStyle = {
    '--dish-base': plate.base,
    '--dish-accent': plate.accent,
    '--dish-garnish': plate.garnish,
  };

  return (
    <figure
      className={`dish-plate${compact ? ' dish-plate--compact' : ''}`}
      data-vessel={plate.vessel}
      data-form={plate.form}
      data-serving={serving}
      data-intensity={dish.intensity}
      style={style}
      role="figure"
      aria-label={`${dish.name}, ${SERVING_LABELS[serving].toLowerCase()}, served in a ${plate.vessel.replace('-', ' ')}`}
    >
      <div className="dish-plate__stage" aria-hidden="true">
        <span className="dish-plate__table-shadow" />

        <div className="dish-plate__vessel">
          <span className="dish-plate__handle dish-plate__handle--left" />
          <span className="dish-plate__handle dish-plate__handle--right" />
          <span className="dish-plate__vessel-body" />
          <span className="dish-plate__leaf-vein" />
          <span className="dish-plate__rim" />
          <span className="dish-plate__temperature-surface" />

          <div className="dish-plate__condensation">
            {CONDENSATION.map((drop) => (
              <span key={drop} />
            ))}
          </div>

          <div className="dish-plate__food">
            {PORTIONS.map((portion) => (
              <span className="dish-plate__portion" key={portion} />
            ))}
            <span className="dish-plate__glaze" />
            <div className="dish-plate__garnish">
              {GARNISH.map((piece) => (
                <span key={piece} />
              ))}
            </div>
          </div>
        </div>

        <div className="dish-plate__atmosphere" aria-hidden="true">
          <span className="dish-plate__warmth" />
          <div className="dish-plate__heat-haze">
            <span />
            <span />
          </div>
          <div className="dish-plate__steam">
            {STEAM.map((wisp) => (
              <span key={wisp} />
            ))}
          </div>
          <div className="dish-plate__embers">
            {EMBERS.map((ember) => (
              <span key={ember} />
            ))}
          </div>
          <div className="dish-plate__cold-mist">
            {MIST.map((cloud) => (
              <span key={cloud} />
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
