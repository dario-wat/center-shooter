import { Game } from "./gameState";
import { Player } from "./game_objects/player";
import Images from "./images";

export function drawScore(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  score: number,
): void {
  ctx.font = '24px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(`Score: ${score.toFixed(0)}`, x, y);
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

export function drawEquippedWeapon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  player: Player,
): void {
  const size = 24;
  if (player.isLaserEquipped()) {
    ctx.drawImage(Images.LASER_HIT, x, y, size, size);
  } else {
    ctx.drawImage(Images.PROJECTILE, x, y, size, size);
  }
}

export function drawDifficultyMultiplier(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  difficulty: number,
): void {
  ctx.font = '24px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(`Difficulty: ${difficulty}`, x, y);
}