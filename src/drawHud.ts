import Images from "./images";

export function drawScore(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  score: number,
): void {
  ctx.font = '24px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(`Score: ${score}`, x, y);
}

export function drawLives(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  lives: number,
): void {
  const lifeSize = 24;
  const lifePadding = 10;
  for (let i = 0; i < lives; i++) {
    ctx.drawImage(
      Images.SHIP,
      x + i * (lifeSize + lifePadding),
      y,
      lifeSize,
      lifeSize,
    );
  }
}

export function drawProjectileBurstPower(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
): void {
  const powerSize = 24;
  ctx.drawImage(
    Images.POWERUP_RED_STAR,
    x,
    y,
    powerSize,
    powerSize,
  );
}

export function drawWeaponUpgradeRemainingTime(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  remainingTime: number,
): void {
  const powerSize = 24;
  const correctionY = 4;
  ctx.drawImage(
    Images.POWERUP_YELLOW_BOLT,
    x,
    y - powerSize + correctionY,
    powerSize,
    powerSize,
  );

  const timeLeftX = 35;
  ctx.font = '24px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(
    (remainingTime / 1000).toFixed(1),
    x + timeLeftX,
    y,
  );
}