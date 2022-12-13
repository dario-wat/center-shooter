import { DEBUG_COLLISIONS } from "../config";
import Images from "../images";
import { drawCircle } from "../util";
import { AnimatedObject } from "./animatedObject";

export class Projectile extends AnimatedObject {

  public static readonly DAMAGE = 35;

  constructor(
    public x: number,
    public y: number,
    private angle: number,
    private velocity: number = 300,
    public size: number = 10,
  ) {
    super();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);

    const scaleProjectileHoriz = 0.8;
    ctx.drawImage(
      Images.PROJECTILE,
      -this.size * scaleProjectileHoriz,
      -this.size,
      this.size * 2.0 * scaleProjectileHoriz,
      this.size * 2.0,
    );

    const scaleTrailHoriz = 0.6;
    const scaleTrailVert = 1.5;
    ctx.drawImage(
      Images.PROJECTILE_TRAIL,
      -this.size * scaleTrailHoriz,
      this.size,
      this.size * 2.0 * scaleTrailHoriz,
      this.size * 2.0 * scaleTrailVert,
    );

    ctx.rotate(-this.angle - Math.PI / 2);
    ctx.translate(-this.x, -this.y);

    if (DEBUG_COLLISIONS) {
      drawCircle(ctx, this.x, this.y, this.size, null, 'red');
    }
  }

  update(dt: number): void {
    this.x += this.velocity * Math.cos(this.angle) * dt;
    this.y += this.velocity * Math.sin(this.angle) * dt;
  }
}