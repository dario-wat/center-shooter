import { Laser } from "./player";

export interface CanFitLaser {

  getLaserDps(): number;

  getLaserPosition(): { x: number, y: number };

  getLaserAngle(): number;
}