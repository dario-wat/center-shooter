import { drawCircle } from './util';

import ship from '../assets/spaceShips_007.png';

export abstract class AnimatedObject {

  abstract draw(ctx: CanvasRenderingContext2D): void;

  abstract update(dt: number): void;
}

export class Player extends AnimatedObject {

  private sprite: HTMLImageElement;

  constructor(
    public x: number,
    public y: number,
    public size: number,
  ) {
    super();
    // TODO await
    this.loadImage();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    // drawCircle(ctx, this.x, this.y, this.size, this.color);
    if (!this.sprite) {
      return;
    }
    ctx.drawImage(
      this.sprite,
      this.x - this.size,
      this.y - this.size,
      2 * this.size,
      2 * this.size,
    );
  }

  update(_dt: number): void {
    // Do nothing
  }

  loadImage(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sprite = new Image();
      this.sprite.onload = () => resolve();
      this.sprite.onerror = () => reject();
      this.sprite.src = 'https://img.favpng.com/2/21/25/spaceshiptwo-spacecraft-sprite-spaceshipone-portable-network-graphics-png-favpng-rrk1zrdCAcwz6C86q05B28r18.jpg';
      // this.sprite.src = 'assets/spaceShips_007.png';
    });
  }
}

export class Projectile extends AnimatedObject {

  constructor(
    public x: number,
    public y: number,
    public size: number,
    private velocity: number,
    private angle: number,
    private color: string = 'black',
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