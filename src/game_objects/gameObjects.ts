import Images from '../images';
import { AnimatedObject } from './animatedObject';

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