import { drawCircle } from './util';
import Images from './images';
import { DEBUG_COLLISIONS } from './config';

export abstract class AnimatedObject {

  abstract draw(ctx: CanvasRenderingContext2D): void;

  abstract update(dt: number): void;
}

export class Player extends AnimatedObject {

  constructor(
    public x: number,
    public y: number,
    public size: number,
  ) {
    super();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      Images.SHIP,
      this.x - this.size,
      this.y - this.size,
      2 * this.size,
      2 * this.size,
    );

    if (DEBUG_COLLISIONS) {
      drawCircle(ctx, this.x, this.y, this.size, null, 'blue');
    }
  }

  update(_dt: number): void {
    // Do nothing
  }
}

export class Projectile extends AnimatedObject {

  constructor(
    public x: number,
    public y: number,
    public size: number,
    private velocity: number,
    private angle: number,
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

export class Enemy extends AnimatedObject {

  public static readonly SMALL_SIZE = 20;
  public static readonly MEDIUM_SIZE = 35;
  public static readonly LARGE_SIZE = 50;

  constructor(
    public x: number,
    public y: number,
    public size: number,
    private velocity: number,
    private angle: number,
    private color: string = 'red',
  ) {
    super();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    drawCircle(ctx, this.x, this.y, this.size, this.color);
  }

  update(dt: number): void {
    this.x += this.velocity * Math.cos(this.angle) * dt;
    this.y += this.velocity * Math.sin(this.angle) * dt;
  }

  shouldReduceSize(): boolean {
    // Otherwise it should die
    return this.size > Enemy.SMALL_SIZE;
  }

  reduceSize(): void {
    if (this.size === Enemy.LARGE_SIZE) {
      this.size = Enemy.MEDIUM_SIZE;
    } else if (this.size === Enemy.MEDIUM_SIZE) {
      this.size = Enemy.SMALL_SIZE;
    } else {
      // Enemy is already small, so remove it
    }
  }
}