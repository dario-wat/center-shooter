import { Meteor, Smoke } from './game_objects/gameObjects';
import { Laser, LaserHit, Player, Projectile } from './game_objects/player';
import { MeteorSpawner } from './meteorSpawner';
import { arrayCrossProduct, drawRoundRect, euclDistance, intersectRayAndCircle } from './util';
import Images from './images';

// Create canvas
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function isOffScreen(x: number, y: number, size: number): boolean {
  return x + size < 0 || x - size > canvas.width || y + size < 0 || y - size > canvas.height;
}

class Game {

  private readonly meteorSpawner: MeteorSpawner;

  private lastTimestamp: number = 0;

  public gameOver: boolean = false;
  public score: number = 0;

  // Game objects in the scene
  public player: Player;
  public projectiles: Projectile[] = [];
  public meteors: Meteor[] = [];
  public smokes: Smoke[] = [];

  constructor() {
    this.player = new Player(canvas.width / 2, canvas.height / 2);
    this.meteorSpawner = new MeteorSpawner(canvas.width, canvas.height, this.player);
  }

  draw(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Tile background
    const pattern = ctx.createPattern(Images.BLACK_BACKGROUND, 'repeat')!;
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.projectiles.forEach(projectile => projectile.draw(ctx));
    this.meteors.forEach(meteor => meteor.draw(ctx));
    this.smokes.forEach(smoke => smoke.draw(ctx));
    this.player.draw(ctx);

    // Draw score
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${this.score}`, 20, 40);
  }

  update(dt: number): void {
    this.player.update(dt);
    this.projectiles.forEach(projectile => projectile.update(dt));
    this.meteors.forEach(meteor => meteor.update(dt));
    this.smokes.forEach(smoke => smoke.update(dt));
  }

  cleanup(): void {
    // Cleanup meteors that are off screen
    this.meteors = this.meteors.filter(meteor =>
      !isOffScreen(meteor.x, meteor.y, meteor.size())
    );

    // Clenaup projectiles that are off screen
    this.projectiles = this.projectiles.filter(projectile =>
      !isOffScreen(projectile.x, projectile.y, projectile.size)
    );

    // Cleanup dead smokes
    this.smokes = this.smokes.filter(smoke => !smoke.isDead());
  }

  spawn(): void {
    // Run all spawners
    if (this.meteorSpawner.shouldSpawn()) {
      this.meteors.push(this.meteorSpawner.spawn());
    }
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



async function main(): Promise<void> {
  await Images.initialize();

  let game = new Game();

  // Activate laser while mouse is down
  canvas.addEventListener('mousedown', (event) => {
    if (event.button === 2) {
      return;
    }
    if (game.player.isLaserEquipped()) {
      game.player.laser.isActive = true;
    }
  });
  canvas.addEventListener('mouseup', (event) => {
    game.player.laser.isActive = false;
  });

  // Spawn projectiles on mouse click
  canvas.addEventListener('mousedown', (event) => {
    // Ignore right click
    if (event.button === 2) {
      return;
    }
    // if (game.gameOver) {
    //   game = new Game();
    //   game.run();
    //   return;
    // }

    // New projectile at player position moving towards the mouse click
    if (game.player.isProjectileEquipped()) {
      const projectile = game.player.fireProjectile();
      game.projectiles.push(projectile);
    }
  });

  // Player faces the mouse position
  canvas.addEventListener('mousemove', (event) => {
    game.player.angle = Math.atan2(event.clientY - game.player.y, event.clientX - game.player.x);
  });

  // Change weapon on right click
  canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    game.player.changeWeapon();
  });

  game.run();
}

main();