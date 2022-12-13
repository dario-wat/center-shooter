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
  fillColor: string | null = null,
  strokeCollor: string | null = null,
): void {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2, false);

  if (fillColor !== null) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }

  if (strokeCollor !== null) {
    ctx.strokeStyle = strokeCollor;
    ctx.stroke();
  }
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

// Finds an intersection between a ray and a circle and returns the closest
// intersection point. If there is no intersection, returns null.
export function intersectRayAndCircle(
  lineStartX: number,
  lineStartY: number,
  lineAngle: number,
  circleX: number,
  circleY: number,
  circleRadius: number,
): { x: number, y: number } | null {
  const lineEndX = lineStartX + 10000 * Math.cos(lineAngle);
  const lineEndY = lineStartY + 10000 * Math.sin(lineAngle);

  const a = lineEndX - lineStartX;
  const b = lineStartX - circleX;
  const c = lineEndY - lineStartY;
  const d = lineStartY - circleY;

  const e = a * a + c * c;
  const f = 2 * (a * b + c * d);
  const g = b * b + d * d - circleRadius * circleRadius;

  const discriminant = f * f - 4 * e * g;
  if (discriminant < 0) {
    return null;
  }

  const t1 = (-f + Math.sqrt(discriminant)) / (2 * e);
  const t2 = (-f - Math.sqrt(discriminant)) / (2 * e);

  if (t1 >= 0 && t1 <= 1 || t2 >= 0 && t2 <= 1) {
    return { x: lineStartX + a * t2, y: lineStartY + c * t2 };
  }

  return null;
}

export function euclDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}