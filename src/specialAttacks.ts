import { Game } from "./gameState";
import { AnimatedObject } from "./game_objects/animatedObject";
import { CanFitLaser, Laser } from "./game_objects/laser";
import { Player } from "./game_objects/player";
import Images from "./images";

export class ProjectileBurstAttack {

  private static readonly DELAY = 500;

  private remainingShots: number = 3;
  private lastShotTimestamp: number = 0;
  public isActive: boolean = false;

  constructor(
    private player: Player,
  ) { }

  use(): void {
    if (
      this.isActive
      && this.remainingShots > 0
      && Date.now() - this.lastShotTimestamp > ProjectileBurstAttack.DELAY
    ) {
      this.remainingShots--;
      this.lastShotTimestamp = Date.now();
      this.player.fireProjectileBurst();
    }
  }

  activate(): void {
    this.isActive = true;
  }

  isDone(): boolean {
    return this.remainingShots <= 0;
  }
}

export class RocketLaser extends AnimatedObject implements CanFitLaser {

  private static readonly ANGLE = 3 * Math.PI / 2;
  private static readonly OFFSET_X = 200;
  public static readonly LENGTH = 180;
  private static readonly WIDTH = 60;
  private static readonly VELOCITY = 50;
  private static readonly LASER_DPS = 360;

  public x: number;
  public y: number;
  private isLeft: boolean;
  private laser: Laser;

  constructor() {
    super();

    // Start x is random left or right
    this.isLeft = Math.random() < 0.5;
    this.x = this.isLeft
      ? RocketLaser.OFFSET_X
      : Game.canvas.width - RocketLaser.OFFSET_X;
    this.y = Game.canvas.height + RocketLaser.LENGTH / 2;
    this.laser = new Laser(this);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // Rotate to angle
    ctx.translate(this.x, this.y);
    ctx.rotate(RocketLaser.ANGLE + Math.PI / 2);

    ctx.drawImage(
      Images.ROCKET,
      0,
      0,
      RocketLaser.WIDTH,
      RocketLaser.LENGTH,
    );

    // Reset rotation
    ctx.rotate(-RocketLaser.ANGLE - Math.PI / 2);
    ctx.translate(-this.x, -this.y);

    this.laser.draw(ctx);
    this.laser.activate();
  }

  update(dt: number): void {
    this.x += Math.cos(RocketLaser.ANGLE) * RocketLaser.VELOCITY * dt;
    this.y += Math.sin(RocketLaser.ANGLE) * RocketLaser.VELOCITY * dt;
  }

  getLaserDps(): number {
    return RocketLaser.LASER_DPS;
  }

  getLaserPosition(): { x: number; y: number; } {
    return {
      x: this.x + RocketLaser.WIDTH / 2,
      y: this.y + RocketLaser.LENGTH / 2,
    };
  }

  getLaserAngle(): number {
    const rotation = this.isLeft ? 1 : -1;
    return RocketLaser.ANGLE + rotation * Math.PI / 2;
  }

  isLaserEquipped(): boolean {
    return true;
  }
}