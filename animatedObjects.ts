export abstract class AnimatedObject {

  abstract draw(ctx: CanvasRenderingContext2D): void;

  abstract update(dt: number): void;
}

export class Player extends AnimatedObject {

  constructor(
    public x: number,
    public y: number,
    public size: number,
    private color: string = '#ababab',
  ) {
    super();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    drawCircle(ctx, this.x, this.y, this.size, this.color);
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

function drawCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
): void {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2, false);
  ctx.fillStyle = color;
  ctx.fill();
}