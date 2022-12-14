import Images from "../images";
import { euclDistance } from "../util";
import { AnimatedObject } from "./animatedObject";

abstract class Powerup extends AnimatedObject {

  private static readonly MIN_SIZE = 15;
  private static readonly MAX_SIZE = 25;

  private isIncreasing: boolean = true;

  abstract readonly image: HTMLImageElement;

  constructor(
    public x: number,
    public y: number,
    public size: number = Powerup.MIN_SIZE,
  ) {
    super();
  }

  isClicked(x: number, y: number): boolean {
    return euclDistance(this.x, this.y, x, y) < this.size
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.image,
      this.x - this.size,
      this.y - this.size,
      this.size * 2,
      this.size * 2,
    );
  }

  update(_dt: number): void {
    const sizeDelta = 0.3;
    if (this.isIncreasing) {
      this.size += sizeDelta;
      if (this.size >= Powerup.MAX_SIZE) {
        this.isIncreasing = false;
      }
    } else {
      this.size -= sizeDelta;
      if (this.size <= Powerup.MIN_SIZE) {
        this.isIncreasing = true;
      }
    }
  }
}

export class ProjectileBurstPowerup extends Powerup {

  readonly image = Images.POWERUP_RED_STAR;
}

export class WeaponUpgradePowerup extends Powerup {

  readonly image = Images.POWERUP_YELLOW_BOLT;
}

export class RocketLaserPowerup extends Powerup {

  readonly image = Images.POWERUP_BLUE_STAR;
}