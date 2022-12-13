import Images from "../images";
import { euclDistance } from "../util";
import { AnimatedObject } from "./animatedObject";

const DPS_SIZE_THRESHOLD = 300;

export interface CanFitLaser {

  getLaserDps(): number;

  getLaserPosition(): { x: number, y: number };

  getLaserAngle(): number;

  isLaserEquipped(): boolean;
}

export class Laser extends AnimatedObject {

  private static readonly WIDTH_S = 10;
  private static readonly WIDTH_L = 30;

  public isActive: boolean = false;
  public hit: LaserHit | null = null;

  constructor(private canFitLaser: CanFitLaser) {
    super();
  }

  activate(): void {
    this.isActive = true;
  }

  isFiring(): boolean {
    return this.isActive && this.canFitLaser.isLaserEquipped();
  }

  getDps(): number {
    return this.canFitLaser.getLaserDps();
  }

  getPosition(): { x: number; y: number; } {
    return this.canFitLaser.getLaserPosition();
  }

  getAngle(): number {
    return this.canFitLaser.getLaserAngle();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.isActive) {
      return;
    }

    const position = this.canFitLaser.getLaserPosition();
    const angle = this.canFitLaser.getLaserAngle();

    ctx.translate(position.x, position.y);
    ctx.rotate(angle - Math.PI / 2);

    // Draw laser to the edge of the screen or to the hit point
    const laserLength = this.hit
      ? euclDistance(this.hit.x, this.hit.y, position.x, position.y)
      : 2000;
    const laserWidth = this.getDps() > DPS_SIZE_THRESHOLD
      ? Laser.WIDTH_L
      : Laser.WIDTH_S;

    // TODO need laser offset
    ctx.drawImage(
      Images.LASER,
      - laserWidth / 2,
      0,
      laserWidth,
      laserLength,
    );

    ctx.rotate(-angle + Math.PI / 2);
    ctx.translate(-position.x, -position.y);

    this.hit?.draw(ctx);
  }

  update(dt: number): void {
    // Do nothing for laser, update the laser hit
    this.hit?.update(dt);
  }
}

export class LaserHit extends AnimatedObject {

  private static readonly SIZE = 20;
  private static readonly UPGRADED_SIZE = 40;

  constructor(
    public x: number,
    public y: number,
    private laser: Laser,
  ) {
    super();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const size = this.laser.getDps() > DPS_SIZE_THRESHOLD
      ? LaserHit.UPGRADED_SIZE
      : LaserHit.SIZE;
    ctx.drawImage(
      Images.LASER_HIT,
      this.x - size,
      this.y - size,
      size * 2,
      size * 2,
    );
  }

  update(dt: number): void {
    // Do nothing
  }
}