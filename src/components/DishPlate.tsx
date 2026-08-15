import type { CSSProperties } from 'react';
import type { Dish } from '../types';
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
const STEAM = Array.from({ length: 3 }, (_, index) => index);

/** A decorative dish portrait built entirely from CSS primitives. */
export default function DishPlate({ dish, compact = false }: Readonly<DishPlateProps>) {
  const { plate } = dish;
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
      style={style}
      role="figure"
      aria-label={`${dish.name}, served in a ${plate.vessel.replace('-', ' ')}`}
    >
      <div className="dish-plate__stage" aria-hidden="true">
        <span className="dish-plate__table-shadow" />

        <div className="dish-plate__vessel">
          <span className="dish-plate__handle dish-plate__handle--left" />
          <span className="dish-plate__handle dish-plate__handle--right" />
          <span className="dish-plate__vessel-body" />
          <span className="dish-plate__leaf-vein" />
          <span className="dish-plate__rim" />

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

        {plate.steam && (
          <div className="dish-plate__steam">
            {STEAM.map((wisp) => (
              <span key={wisp} />
            ))}
          </div>
        )}
      </div>
    </figure>
  );
}
