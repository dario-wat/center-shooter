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
    public size: number = 50,
    public angle: number = 0,
  ) {
    super();
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
  }

  update(_dt: number): void {
    // Do nothing
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

export class Meteor extends AnimatedObject {

  public static readonly SMALL_SIZE = 20;
  public static readonly MEDIUM_SIZE = 35;
  public static readonly LARGE_SIZE = 50;

  private meteorType: number;  // 0, 1, 2, 3

  constructor(
    public x: number,
    public y: number,
    public size: number,
    private velocity: number,
    private angle: number,
  ) {
    super();
    this.meteorType = Math.floor(Math.random() * 4);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    let meteorImage: HTMLImageElement;
    switch (this.meteorType) {
      case 0:
        meteorImage = Images.METEOR_1;
        break;
      case 1:
        meteorImage = Images.METEOR_2;
        break;
      case 2:
        meteorImage = Images.METEOR_3;
        break;
      case 3:
        meteorImage = Images.METEOR_4;
        break;
      default:
        meteorImage = Images.METEOR_1;
        break;
    }

    ctx.drawImage(
      meteorImage,
      this.x - this.size,
      this.y - this.size,
      this.size * 2,
      this.size * 2,
    );
  }

  update(dt: number): void {
    this.x += this.velocity * Math.cos(this.angle) * dt;
    this.y += this.velocity * Math.sin(this.angle) * dt;
  }

  shouldReduceSize(): boolean {
    // Otherwise it should die
    return this.size > Meteor.SMALL_SIZE;
  }

  reduceSize(): void {
    if (this.size === Meteor.LARGE_SIZE) {
      this.size = Meteor.MEDIUM_SIZE;
    } else if (this.size === Meteor.MEDIUM_SIZE) {
      this.size = Meteor.SMALL_SIZE;
    } else {
      // Enemy is already small, so remove it
    }
  }
}

export class Smoke extends AnimatedObject {

  private createdTimestamp: number;
  private smokeType: number;  // 0, 1, 2, 3

  constructor(
    public x: number,
    public y: number,
    public size: number = 20,
    public ttl: number = 1000,  // Default to 1 second
  ) {
    super();
    this.createdTimestamp = Date.now();
    this.smokeType = Math.floor(Math.random() * 4);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.isDead()) {
      return;
    }

    let smokeImage: HTMLImageElement;
    switch (this.smokeType) {
      case 0:
        smokeImage = Images.SMOKE_1;
        break;
      case 1:
        smokeImage = Images.SMOKE_2;
        break;
      case 2:
        smokeImage = Images.SMOKE_3;
        break;
      case 3:
        smokeImage = Images.SMOKE_4;
        break;
      default:
        smokeImage = Images.SMOKE_1;
        break;
    }

    ctx.drawImage(
      smokeImage,
      this.x - this.size,
      this.y - this.size,
      this.size * 2,
      this.size * 2,
    );
  }

  update(dt: number): void {
    // Do nothing
  }

  isDead(): boolean {
    return Date.now() - this.createdTimestamp > this.ttl;
  }
}