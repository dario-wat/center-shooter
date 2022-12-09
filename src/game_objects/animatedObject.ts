export abstract class AnimatedObject {

  abstract draw(ctx: CanvasRenderingContext2D): void;

  abstract update(dt: number): void;
}