import shipImage from '../assets/spaceShips_007.png';
import projectileImage from '../assets/spaceMissiles_012.png';
import projectileTrailImage from '../assets/spaceEffects_002.png';
import smoke1Image from '../assets/spaceEffects_013.png';
import smoke2Image from '../assets/spaceEffects_014.png';
import smoke3Image from '../assets/spaceEffects_015.png';
import smoke4Image from '../assets/spaceEffects_016.png';

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
  public static SMOKE_1: HTMLImageElement;
  public static SMOKE_2: HTMLImageElement;
  public static SMOKE_3: HTMLImageElement;
  public static SMOKE_4: HTMLImageElement;

  public static async initialize(): Promise<void> {
    Images.SHIP = await loadImage(shipImage);
    Images.PROJECTILE = await loadImage(projectileImage);
    Images.PROJECTILE_TRAIL = await loadImage(projectileTrailImage);
    Images.SMOKE_1 = await loadImage(smoke1Image);
    Images.SMOKE_2 = await loadImage(smoke2Image);
    Images.SMOKE_3 = await loadImage(smoke3Image);
    Images.SMOKE_4 = await loadImage(smoke4Image);
  }
}