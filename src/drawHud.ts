import { DEBUG_DIFFICULTY } from "./config";
import { Game } from "./gameState";
import { Player } from "./game_objects/player";
import Images from "./images";

function drawScore(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  score: number,
): void {
  ctx.font = '24px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(`Score: ${score.toFixed(0)}`, x, y);
}

function drawLives(
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

function drawPowerup(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  image: HTMLImageElement,
): void {
  const powerSize = 24;
  ctx.drawImage(
    image,
    x,
    y,
    powerSize,
    powerSize,
  );
}

function drawWeaponUpgradeRemainingTime(
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

function drawEquippedWeapon(
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

function drawDifficultyMultiplier(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  difficulty: number,
): void {
  ctx.font = '24px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(`Difficulty: ${difficulty}`, x, y);
}

export function drawHud(): void {
  const uiXOffset = 20;
  const uiYOffset = 40;

  drawScore(Game.ctx, uiXOffset, uiYOffset, Game.score);

  const lifeY = 20;
  drawLives(Game.ctx, uiXOffset, uiYOffset + lifeY, Game.player.lives);

  const equippedWeaponY = 65;
  drawEquippedWeapon(Game.ctx, uiXOffset, uiYOffset + equippedWeaponY, Game.player);

  // Draw projectile burst power
  if (
    Game.projectileBurstAttack !== null
    && !Game.projectileBurstAttack.isActive
  ) {
    const powerY = 110;
    drawPowerup(Game.ctx, uiXOffset, uiYOffset + powerY, Images.POWERUP_RED_STAR);
  }

  if (
    Game.rocketLaser !== null
    && !Game.rocketLaser.isActive
  ) {
    const powerY = 110;
    const powerX = 40;
    drawPowerup(Game.ctx, uiXOffset + powerX, uiYOffset + powerY, Images.POWERUP_BLUE_STAR);
  }

  // Draw weapon upgrade remaining time
  if (Game.player.isWeaponUpgraded()) {
    const weaponUpgradeX = 180;
    drawWeaponUpgradeRemainingTime(
      Game.ctx,
      uiXOffset + weaponUpgradeX,
      uiYOffset,
      Game.player.getWeaponUpgradeTimeLeft(),
    );
  }

  if (DEBUG_DIFFICULTY) {
    const difficultyMultiplierXOffset = 300;
    drawDifficultyMultiplier(
      Game.ctx,
      Game.canvas.width - difficultyMultiplierXOffset,
      uiYOffset,
      Game.meteorSpawner.getDifficultyMultiplier(),
    );
  }
}