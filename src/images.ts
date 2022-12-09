import shipImage from '../assets/spaceShips_007.png';
import projectileImage from '../assets/spaceMissiles_012.png';
import projectileTrailImage from '../assets/spaceEffects_002.png';

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject();
    image.src = src;
  });
}

export default class Images {

  public static SHIP: HTMLImageElement;
  public static PROJECTILE: HTMLImageElement;
  public static PROJECTILE_TRAIL: HTMLImageElement;

  public static async initialize(): Promise<void> {
    Images.SHIP = await loadImage(shipImage);
    Images.PROJECTILE = await loadImage(projectileImage);
    Images.PROJECTILE_TRAIL = await loadImage(projectileTrailImage);
  }
}