export abstract class AnimatedObject {

  abstract draw(ctx: CanvasRenderingContext2D): void;

  abstract update(dt: number): void;
}

export class Player extends AnimatedObject {

  constructor(
    public x: number,
    public y: number,
    private size: number,
    private color: string = '#ababab',
  ) {
    super();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
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
    private color: string = 'green',
  ) {
    super();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(dt: number): void {
    this.x += this.velocity * Math.cos(this.angle) * dt;
    this.y += this.velocity * Math.sin(this.angle) * dt;
  }
}

export class Enemy extends AnimatedObject {

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
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(dt: number): void {
    this.x += this.velocity * Math.cos(this.angle) * dt;
    this.y += this.velocity * Math.sin(this.angle) * dt;
  }
}