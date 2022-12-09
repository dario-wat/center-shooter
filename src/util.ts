export function arrayCrossProduct<A, B>(array1: A[], array2: B[]): [A, B][] {
  const result: [A, B][] = [];
  for (const item1 of array1) {
    for (const item2 of array2) {
      result.push([item1, item2]);
    }
  }
  return result;
}

export function drawCircle(
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

export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number = 5,
  fill: boolean = false,
  stroke: boolean = true
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
}