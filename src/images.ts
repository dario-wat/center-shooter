import shipImage from '../assets/playerShip2_red.png';
import projectileImage from '../assets/spaceMissiles_012.png';
import projectileTrailImage from '../assets/spaceEffects_002.png';
import smoke1Image from '../assets/spaceEffects_013.png';
import smoke2Image from '../assets/spaceEffects_014.png';
import smoke3Image from '../assets/spaceEffects_015.png';
import smoke4Image from '../assets/spaceEffects_016.png';
import meteor1Image from '../assets/spaceMeteors_001.png';
import meteor2Image from '../assets/spaceMeteors_002.png';
import meteor3Image from '../assets/spaceMeteors_003.png';
import meteor4Image from '../assets/spaceMeteors_004.png';
import laserImage from '../assets/laserRed16.png';
import laserHitImage from '../assets/laserRed08.png';
import playerLifeImage from '../assets/playerLife2_red.png';
import blackBackgroundImage from '../assets/black.png';
import powerupRedStarImage from '../assets/powerupRed_star.png';
import powerupBlueStarImage from '../assets/powerupBlue_star.png';
import powerupYellowBoltImage from '../assets/powerupYellow_bolt.png';
import rocketImage from '../assets/spaceRockets_001.png';
import buttonRedImage from '../assets/buttonRed.png';

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
  public static METEOR_1: HTMLImageElement;
  public static METEOR_2: HTMLImageElement;
  public static METEOR_3: HTMLImageElement;
  public static METEOR_4: HTMLImageElement;
  public static LASER: HTMLImageElement;
  public static LASER_HIT: HTMLImageElement;
  public static PLAYER_LIFE: HTMLImageElement;
  public static BLACK_BACKGROUND: HTMLImageElement;
  public static POWERUP_RED_STAR: HTMLImageElement;
  public static POWERUP_BLUE_STAR: HTMLImageElement;
  public static POWERUP_YELLOW_BOLT: HTMLImageElement;
  public static ROCKET: HTMLImageElement;
  public static BUTTON_RED: HTMLImageElement;

  public static async initialize(): Promise<void> {
    [
      Images.SHIP,
      Images.PROJECTILE,
      Images.PROJECTILE_TRAIL,
      Images.SMOKE_1,
      Images.SMOKE_2,
      Images.SMOKE_3,
      Images.SMOKE_4,
      Images.METEOR_1,
      Images.METEOR_2,
      Images.METEOR_3,
      Images.METEOR_4,
      Images.LASER,
      Images.LASER_HIT,
      Images.PLAYER_LIFE,
      Images.BLACK_BACKGROUND,
      Images.POWERUP_RED_STAR,
      Images.POWERUP_BLUE_STAR,
      Images.POWERUP_YELLOW_BOLT,
      Images.ROCKET,
      Images.BUTTON_RED,
    ] = await Promise.all([
      loadImage(shipImage),
      loadImage(projectileImage),
      loadImage(projectileTrailImage),
      loadImage(smoke1Image),
      loadImage(smoke2Image),
      loadImage(smoke3Image),
      loadImage(smoke4Image),
      loadImage(meteor1Image),
      loadImage(meteor2Image),
      loadImage(meteor3Image),
      loadImage(meteor4Image),
      loadImage(laserImage),
      loadImage(laserHitImage),
      loadImage(playerLifeImage),
      loadImage(blackBackgroundImage),
      loadImage(powerupRedStarImage),
      loadImage(powerupBlueStarImage),
      loadImage(powerupYellowBoltImage),
      loadImage(rocketImage),
      loadImage(buttonRedImage),
    ]);
  }
}