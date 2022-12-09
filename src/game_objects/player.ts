import { drawCircle } from '../util';
import Images from '../images';
import { DEBUG_COLLISIONS } from '../config';
import { AnimatedObject } from './animatedObject';

export class Player extends AnimatedObject {

  public laser: Laser;

  constructor(
    public x: number,
    public y: number,
    public size: number = 50,
    public angle: number = 0,
  ) {
    super();
    this.laser = new Laser(this);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);

    ctx.drawImage(
      Images.SHIP,
      -this.size,
      -this.size,
      2 * this.size,
      2 * this.size,
    );

    ctx.rotate(-this.angle - Math.PI / 2);
    ctx.translate(-this.x, -this.y);

    if (DEBUG_COLLISIONS) {
      drawCircle(ctx, this.x, this.y, this.size, null, 'blue');
    }

    this.laser.draw(ctx);
  }

  update(dt: number): void {
    // Player has no updates so only update the laser
    this.laser.update(dt);
  }

  // Spawns new projectile in the direction where the player is facing
  fireProjectile(velocity: number): Projectile {
    return new Projectile(
      this.x,
      this.y,
      velocity,
      this.angle,
    );
  }
}

export class Projectile extends AnimatedObject {

  constructor(
    public x: number,
    public y: number,
    private velocity: number,
    private angle: number,
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

export class Laser extends AnimatedObject {

  public isActive: boolean = false;

  constructor(private player: Player) {
    super();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.isActive) {
      return;
    }

    ctx.translate(this.player.x, this.player.y);
    ctx.rotate(this.player.angle - Math.PI / 2);

    // Draw laser to the edge of the screen
    const laserLength = 1000;
    const laserWidth = 10;
    ctx.drawImage(
      Images.LASER,
      -5,   // No clue why, but need this to center the laser
      this.player.size,
      laserWidth,
      this.player.size + laserLength,
    );

    ctx.rotate(-this.player.angle + Math.PI / 2);
    ctx.translate(-this.player.x, -this.player.y);

  }

  update(_dt: number): void {
    // Do nothing
  }
}