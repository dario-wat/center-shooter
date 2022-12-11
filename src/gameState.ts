import { Meteor, ProjectileBurstPowerup, Smoke, WeaponUpgradePowerup } from './game_objects/gameObjects';
import { Laser, LaserHit, Player, Projectile } from './game_objects/player';
import { MeteorSpawner } from './spawners/meteorSpawner';
import { arrayCrossProduct, drawRoundRect, euclDistance, intersectRayAndCircle } from './util';
import Images from './images';
import { ProjectileBurstAttack } from './specialAttacks';
import { PowerupSpawner } from './spawners/powerupSpawner';
import { drawLives, drawProjectileBurstPower, drawScore, drawWeaponUpgradeRemainingTime } from './drawHud';

export class Game {

  private static game: Game;

  private readonly meteorSpawner: MeteorSpawner;
  private readonly powerupSpawner: PowerupSpawner;

  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private lastTimestamp: number = 0;

  public gameOver: boolean = false;
  public score: number = 0;

  // Powers
  public projectileBurstAttack: ProjectileBurstAttack | null = null;

  // Game objects in the scene
  public player: Player;
  public projectiles: Projectile[] = [];
  public meteors: Meteor[] = [];
  public smokes: Smoke[] = [];
  public projectileBurstPowerup: ProjectileBurstPowerup | null = null;
  public weaponUpgradePowerup: WeaponUpgradePowerup | null = null;

  private constructor() {
    // Create canvas
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d')!;

    this.player = new Player(this.canvas.width / 2, this.canvas.height / 2);
    this.meteorSpawner = new MeteorSpawner(this.canvas.width, this.canvas.height, this.player);
    this.powerupSpawner = new PowerupSpawner(this.canvas.width, this.canvas.height, this.player);
  }

  public static get(): Game {
    if (!Game.game) {
      Game.game = new Game();
    }
    return Game.game;
  }

  draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Tile background
    const pattern = this.ctx.createPattern(Images.BLACK_BACKGROUND, 'repeat')!;
    this.ctx.fillStyle = pattern;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.projectiles.forEach(projectile => projectile.draw(this.ctx));
    this.meteors.forEach(meteor => meteor.draw(this.ctx));
    this.smokes.forEach(smoke => smoke.draw(this.ctx));
    this.player.draw(this.ctx);
    this.projectileBurstPowerup?.draw(this.ctx);
    this.weaponUpgradePowerup?.draw(this.ctx);

    const uiXOffset = 20;
    const uiYOffset = 40;

    drawScore(this.ctx, uiXOffset, uiYOffset, this.score);

    const lifeY = 20;
    drawLives(this.ctx, uiXOffset, uiYOffset + lifeY, this.player.lives);

    // Draw projectile burst power
    if (
      this.projectileBurstAttack !== null
      && !this.projectileBurstAttack.isActive
    ) {
      const powerY = 65;
      drawProjectileBurstPower(this.ctx, uiXOffset, uiYOffset + powerY);
    }

    // Draw weapon upgrade remaining time
    if (this.player.isWeaponUpgraded()) {
      const weaponUpgradeX = 180;
      drawWeaponUpgradeRemainingTime(
        this.ctx,
        uiXOffset + weaponUpgradeX,
        uiYOffset,
        this.player.getWeaponUpgradeTimeLeft(),
      );
    }
  }

  update(dt: number): void {
    this.player.update(dt);
    this.projectiles.forEach(projectile => projectile.update(dt));
    this.meteors.forEach(meteor => meteor.update(dt));
    this.smokes.forEach(smoke => smoke.update(dt));
    this.projectileBurstPowerup?.update(dt);
    this.weaponUpgradePowerup?.update(dt);
  }

  isOffScreen(x: number, y: number, size: number): boolean {
    const margin = 200;   // Biggest meteor is around 100px
    return x < -margin
      || x > this.canvas.width + margin
      || y < -margin
      || y > this.canvas.height + margin;
  }

  cleanup(): void {
    // Cleanup meteors that are off screen
    this.meteors = this.meteors.filter(meteor =>
      !this.isOffScreen(meteor.x, meteor.y, meteor.size())
    );

    // Clenaup projectiles that are off screen
    this.projectiles = this.projectiles.filter(projectile =>
      !this.isOffScreen(projectile.x, projectile.y, projectile.size)
    );

    // Cleanup dead smokes
    this.smokes = this.smokes.filter(smoke => !smoke.isDead());

    // Cleanup projectile burst
    if (this.projectileBurstAttack?.isDone()) {
      this.projectileBurstAttack = null;
    }
  }

  spawn(): void {
    // Run all spawners
    if (this.meteorSpawner.shouldSpawn()) {
      this.meteorSpawner.spawn();
    }

    // Spawn a powerup
    if (this.powerupSpawner.shouldSpawn()) {
      this.powerupSpawner.spawn();
    }

    this.projectileBurstAttack?.use();
  }

  collision(): void {
    // Detect collision between player and meteors
    const meteorPlayerHits = this.meteors.filter(meteor => {
      const distance = euclDistance(this.player.x, this.player.y, meteor.x, meteor.y);
      return distance < this.player.size + meteor.size();
    });
    if (meteorPlayerHits.length > 0) {
      // Remove meteors that hit the player
      this.meteors = this.meteors.filter(meteor => !meteorPlayerHits.includes(meteor));
      meteorPlayerHits.forEach(meteor => {
        this.smokes.push(new Smoke(meteor.x, meteor.y));
      });
      this.score += meteorPlayerHits.length * 10;
      this.player.hit();
    }
    this.gameOver = this.player.isDead();

    // Detect collision between meteors and projectiles
    const meteorsAndProjectiles = arrayCrossProduct(this.meteors, this.projectiles);
    meteorsAndProjectiles.forEach(([meteor, projectile]) => {
      const dx = meteor.x - projectile.x;
      const dy = meteor.y - projectile.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < meteor.size() + projectile.size) {
        // If the projectile hits the meteor increase the score
        this.score += 10;

        meteor.takeDamage(Projectile.DAMAGE);
        // Remove or downsize the meteor
        if (meteor.isDead()) {
          // Add smoke where the meteor was
          this.smokes.push(new Smoke(meteor.x, meteor.y));
          this.meteors = this.meteors.filter(m => m !== meteor);
        }

        // Remove the projectile
        this.projectiles = this.projectiles.filter(p => p !== projectile);
      }
    });


    // Collision between laser and meteors
    this.player.laser.hit = null;
    let distanceToMeteor = Infinity;
    let meteorToHit: Meteor | null = null;
    if (this.player.isLaserFiring()) {
      this.meteors.forEach(meteor => {
        // Circle and line intersection
        const intersection = intersectRayAndCircle(
          this.player.x, this.player.y, this.player.angle,
          meteor.x, meteor.y, meteor.size(),
        );
        if (intersection !== null) {
          const distance = euclDistance(this.player.x, this.player.y, intersection.x, intersection.y);
          if (distance < distanceToMeteor) {
            this.player.laser.hit = new LaserHit(intersection.x, intersection.y);
            distanceToMeteor = distance;
            meteorToHit = meteor;
          }
        }
      });
    }

    meteorToHit?.takeDamage(Laser.DPS / 60);
    if (meteorToHit?.isDead()) {
      this.meteors = this.meteors.filter(m => m !== meteorToHit);
      this.smokes.push(new Smoke(meteorToHit.x, meteorToHit.y));
    }
  }

  run() {
    requestAnimationFrame(this.run.bind(this));

    // if (this.gameOver) {

    //   drawRoundRect(ctx, canvas.width / 2 - 200, canvas.height / 2 - 100, 400, 200, 20);

    //   ctx.font = '48px Arial';
    //   ctx.fillStyle = 'black';
    //   ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
    //   ctx.font = '24px Arial';
    //   ctx.fillText('Click to restart', canvas.width / 2 - 100, canvas.height / 2 + 50);


    //   return;
    // }

    // Update objects
    this.update((Date.now() - this.lastTimestamp) / 1000);
    this.lastTimestamp = Date.now();

    this.collision();

    // Cleanup off screen objects
    this.cleanup();

    // Spawn has to be after cleanup otherwise we will clean up
    // newly spawned meteors
    // This may cause bugs in the future if we start cleaning up
    // before meteors enter the screen
    this.spawn();

    // Draw objects
    this.draw();
  }
}