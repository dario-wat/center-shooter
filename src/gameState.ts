import { Meteor, Smoke } from './game_objects/meteor';
import { Player } from './game_objects/player';
import { MeteorSpawner } from './spawners/meteorSpawner';
import Images from './images';
import { ProjectileBurstAttack, RocketLaser } from './specialAttacks';
import { PowerupSpawner } from './spawners/powerupSpawner';
import { drawHud } from './drawHud';
import { collideLaserWithMeteors, collidePlayerWithMeteors, collideProjectilesAndMeteors } from './collisions';
import { Projectile } from './game_objects/projectile';
import { ProjectileBurstPowerup, RocketLaserPowerup, WeaponUpgradePowerup } from './game_objects/powerUps';

export abstract class Game {

  public static meteorSpawner: MeteorSpawner;
  public static powerupSpawner: PowerupSpawner;

  public static canvas: HTMLCanvasElement;
  public static ctx: CanvasRenderingContext2D;

  public static lastTimestamp: number = 0;

  public static gameOver: boolean = false;
  public static score: number = 0;

  // Special attacks
  public static projectileBurstAttack: ProjectileBurstAttack | null = null;

  // Game objects in the scene
  public static player: Player;
  public static projectiles: Projectile[] = [];
  public static meteors: Meteor[] = [];
  public static smokes: Smoke[] = [];
  public static projectileBurstPowerup: ProjectileBurstPowerup | null = null;
  public static rocketLaserPowerup: RocketLaserPowerup | null = null;
  public static weaponUpgradePowerup: WeaponUpgradePowerup | null = null;
  public static rocketLaser: RocketLaser | null = null;
}

export function initCanvas(): void {
  // Create canvas
  Game.canvas = document.getElementById('canvas') as HTMLCanvasElement;
  Game.canvas.width = window.innerWidth;
  Game.canvas.height = window.innerHeight;
  Game.ctx = Game.canvas.getContext('2d')!;
}

export function initGame(): void {
  Game.player = new Player(Game.canvas.width / 2, Game.canvas.height / 2);
  Game.meteorSpawner = new MeteorSpawner(Game.canvas.width, Game.canvas.height, Game.player);
  Game.powerupSpawner = new PowerupSpawner(Game.canvas.width, Game.canvas.height, Game.player);
}

function draw(): void {
  Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);

  // Tile background
  const pattern = Game.ctx.createPattern(Images.BLACK_BACKGROUND, 'repeat')!;
  Game.ctx.fillStyle = pattern;
  Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

  Game.projectiles.forEach(projectile => projectile.draw(Game.ctx));
  Game.meteors.forEach(meteor => meteor.draw(Game.ctx));
  Game.smokes.forEach(smoke => smoke.draw(Game.ctx));
  Game.player.draw(Game.ctx);
  Game.projectileBurstPowerup?.draw(Game.ctx);
  Game.rocketLaserPowerup?.draw(Game.ctx);
  Game.weaponUpgradePowerup?.draw(Game.ctx);
  Game.rocketLaser?.draw(Game.ctx);

  drawHud();
}

function update(dt: number): void {
  Game.player.update(dt);
  Game.projectiles.forEach(projectile => projectile.update(dt));
  Game.meteors.forEach(meteor => meteor.update(dt));
  Game.smokes.forEach(smoke => smoke.update(dt));
  Game.projectileBurstPowerup?.update(dt);
  Game.rocketLaserPowerup?.update(dt);
  Game.weaponUpgradePowerup?.update(dt);
  Game.rocketLaser?.update(dt);
}

function isOffScreen(x: number, y: number, size: number): boolean {
  const offScreenMargin = 100;
  return x + size < -offScreenMargin
    || x - size > Game.canvas.width + offScreenMargin
    || y + size < -offScreenMargin
    || y - size > Game.canvas.height + offScreenMargin;
}

function cleanup(): void {
  // Cleanup meteors that are off screen
  Game.meteors = Game.meteors.filter(meteor =>
    !isOffScreen(meteor.x, meteor.y, meteor.size())
  );

  // Clenaup projectiles that are off screen
  Game.projectiles = Game.projectiles.filter(projectile =>
    !isOffScreen(projectile.x, projectile.y, projectile.size)
  );

  // Cleanup dead smokes
  Game.smokes = Game.smokes.filter(smoke => !smoke.isDead());

  // Cleanup projectile burst
  if (Game.projectileBurstAttack?.isDone()) {
    Game.projectileBurstAttack = null;
  }

  if (
    Game.rocketLaser !== null
    && isOffScreen(Game.rocketLaser.x, Game.rocketLaser.y, RocketLaser.LENGTH)
  ) {
    Game.rocketLaser = null;
  }
}

function spawn(): void {
  // Run all spawners
  if (Game.meteorSpawner.shouldSpawn()) {
    Game.meteorSpawner.spawn();
  }

  // Spawn a powerup
  if (Game.powerupSpawner.shouldSpawn()) {
    Game.powerupSpawner.spawn();
  }

  Game.projectileBurstAttack?.use();
}

function collision(dt: number): void {
  collidePlayerWithMeteors();
  collideProjectilesAndMeteors();
  collideLaserWithMeteors(Game.player.laser, dt);
  if (Game.rocketLaser !== null) {
    collideLaserWithMeteors(Game.rocketLaser.laser, dt);
  }
}

export function runGameLoop(): void {
  requestAnimationFrame(runGameLoop);

  // TODO
  // if (Game.gameOver) {

  //   drawRoundRect(ctx, canvas.width / 2 - 200, canvas.height / 2 - 100, 400, 200, 20);

  //   ctx.font = '48px Arial';
  //   ctx.fillStyle = 'black';
  //   ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
  //   ctx.font = '24px Arial';
  //   ctx.fillText('Click to restart', canvas.width / 2 - 100, canvas.height / 2 + 50);


  //   return;
  // }

  // Update objects
  const dt = (Date.now() - Game.lastTimestamp) / 1000;
  update(dt);
  Game.lastTimestamp = Date.now();

  collision(dt);

  // Cleanup off screen objects
  cleanup();

  // Spawn has to be after cleanup otherwise we will clean up
  // newly spawned meteors
  // Game may cause bugs in the future if we start cleaning up
  // before meteors enter the screen
  spawn();

  // Draw objects
  draw();
}
