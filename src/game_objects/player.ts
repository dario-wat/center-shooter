import { drawCircle } from '../util';
import Images from '../images';
import { DEBUG_COLLISIONS } from '../config';
import { AnimatedObject } from './animatedObject';

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