import { Meteor, Player, Projectile, Smoke } from './animatedObjects';
import { MeteorSpawner } from './meteorSpawner';
import { arrayCrossProduct, drawRoundRect } from './util';
import Images from './images';

// Create canvas
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Game {

  private readonly meteorSpawner: MeteorSpawner;

  private lastTimestamp: number = 0;

  public gameOver: boolean = false;
  public score: number = 0;
  public player: Player
  public projectiles: Projectile[] = [];
  public meteors: Meteor[] = [];
  public smokes: Smoke[] = [];

  constructor() {
    this.player = new Player(canvas.width / 2, canvas.height / 2);
    this.meteorSpawner = new MeteorSpawner(canvas.width, canvas.height, this.player);
  }

  draw(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#202020';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.player.draw(ctx);
    this.projectiles.forEach(projectile => projectile.draw(ctx));
    this.meteors.forEach(meteor => meteor.draw(ctx));
    this.smokes.forEach(smoke => smoke.draw(ctx));

    // Draw score
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${this.score}`, 20, 40);

  }

  update(dt: number): void {
    this.player.update(dt);
    this.projectiles.forEach(projectile => projectile.update(dt));
    this.meteors.forEach(meteor => meteor.update(dt));
  }

  cleanup(): void {
    // Cleanup meteors that are off screen
    this.meteors = this.meteors.filter(meteor =>
      meteor.x + meteor.size > 0
      && meteor.x - meteor.size < canvas.width
      && meteor.y + meteor.size > 0
      && meteor.y - meteor.size < canvas.height,
    );

    // Clenaup projectiles that are off screen
    this.projectiles = this.projectiles.filter(projectile =>
      projectile.x + projectile.size > 0
      && projectile.x - projectile.size < canvas.width
      && projectile.y + projectile.size > 0
      && projectile.y - projectile.size < canvas.height,
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
    const playerDead = this.meteors.some(meteor => {
      const dx = this.player.x - meteor.x;
      const dy = this.player.y - meteor.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < this.player.size + meteor.size;
    });
    this.gameOver = playerDead;

    // Detect collision between meteors and projectiles
    const meteorsAndProjectiles = arrayCrossProduct(this.meteors, this.projectiles);
    meteorsAndProjectiles.forEach(([meteor, projectile]) => {
      const dx = meteor.x - projectile.x;
      const dy = meteor.y - projectile.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < meteor.size + projectile.size) {
        // If the projectile hits the meteor increase the score
        this.score += 10;

        // Remove or downsize the meteor
        if (meteor.shouldReduceSize()) {
          meteor.reduceSize();
        } else {
          // Add smoke where the meteor was
          this.smokes.push(new Smoke(meteor.x, meteor.y));
          this.meteors = this.meteors.filter(m => m !== meteor);
        }

        // Remove the projectile
        this.projectiles = this.projectiles.filter(p => p !== projectile);
      }
    });
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

  // Spawn projectiles on mouse click
  canvas.addEventListener('mousedown', (event) => {
    if (game.gameOver) {
      game = new Game();
      game.run();
      return;
    }

    // New projectile at player position moving towards the mouse click
    const angle = Math.atan2(event.clientY - game.player.y, event.clientX - game.player.x);
    const projectile = new Projectile(game.player.x, game.player.y, 300, angle);

    game.projectiles.push(projectile);
  });

  // Player faces the mouse position
  canvas.addEventListener('mousemove', (event) => {
    game.player.angle = Math.atan2(event.clientY - game.player.y, event.clientX - game.player.x);
  });


  game.run();
}

main();