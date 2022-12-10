import Images from '../images';
import { AnimatedObject } from './animatedObject';

export class Meteor extends AnimatedObject {

  public static readonly SMALL_SIZE = 20;
  public static readonly MEDIUM_SIZE = 35;
  public static readonly LARGE_SIZE = 50;

  public static readonly SMALL_HP_LIMIT = 0;
  public static readonly MEDIUM_HP_LIMIT = 40;
  public static readonly LARGE_HP_LIMIT = 70;

  public static readonly SMALL_HP = 30;
  public static readonly MEDIUM_HP = 65;
  public static readonly LARGE_HP = 100;

  private meteorType: number;  // 0, 1, 2, 3

  constructor(
    public x: number,
    public y: number,
    private hp: number,
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

    const size = this.size();
    ctx.drawImage(
      meteorImage,
      this.x - size,
      this.y - size,
      size * 2,
      size * 2,
    );
  }

  update(dt: number): void {
    this.x += this.velocity * Math.cos(this.angle) * dt;
    this.y += this.velocity * Math.sin(this.angle) * dt;
  }

  takeDamage(damage: number): void {
    this.hp -= damage;
  }

  size(): number {
    return this.hp >= Meteor.LARGE_HP_LIMIT
      ? Meteor.LARGE_SIZE
      : this.hp >= Meteor.MEDIUM_HP_LIMIT
        ? Meteor.MEDIUM_SIZE
        : Meteor.SMALL_SIZE;
  }

  isDead(): boolean {
    return this.hp <= 0;
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