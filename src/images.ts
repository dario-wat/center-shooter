import shipImage from '../assets/spaceShips_007.png';
import projectileImage from '../assets/spaceMissiles_012.png';

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

  public static async initialize(): Promise<void> {
    Images.SHIP = await loadImage(shipImage);
    Images.PROJECTILE = await loadImage(projectileImage);
  }
}