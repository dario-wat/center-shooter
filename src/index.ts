import { Enemy, Player, Projectile } from './animatedObjects';
import { EnemySpawner } from './enemySpawner';
import { arrayCrossProduct, drawRoundRect } from './util';


// Create canvas
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Game {

  private readonly enemySpawner: EnemySpawner;

  private lastTimestamp: number = 0;

  public gameOver: boolean = false;
  private score: number = 0;
  public projectiles: Projectile[] = [];
  private enemies: Enemy[] = [];

  constructor(
    public readonly player: Player,
  ) {
    this.enemySpawner = new EnemySpawner(canvas.width, canvas.height, player);
  }

  draw(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.player.draw(ctx);
    this.projectiles.forEach(projectile => projectile.draw(ctx));
    this.enemies.forEach(enemy => enemy.draw(ctx));

    // Draw score
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${this.score}`, 20, 40);

  }

  update(dt: number): void {
    this.player.update(dt);
    this.projectiles.forEach(projectile => projectile.update(dt));
    this.enemies.forEach(enemy => enemy.update(dt));
  }

  cleanup(): void {
    // Cleanup enemies that are off screen
    this.enemies = this.enemies.filter(enemy =>
      enemy.x + enemy.size > 0
      && enemy.x - enemy.size < canvas.width
      && enemy.y + enemy.size > 0
      && enemy.y - enemy.size < canvas.height,
    );

    // Clenaup projectiles that are off screen
    this.projectiles = this.projectiles.filter(projectile =>
      projectile.x + projectile.size > 0
      && projectile.x - projectile.size < canvas.width
      && projectile.y + projectile.size > 0
      && projectile.y - projectile.size < canvas.height,
    );
  }

  spawn(): void {
    // Run all spawners
    if (this.enemySpawner.shouldSpawn()) {
      this.enemies.push(this.enemySpawner.spawn());
    }
  }

  collision(): void {
    // Detect collision between player and enemies
    const playerDead = this.enemies.some(enemy => {
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < this.player.size + enemy.size;
    });
    this.gameOver = playerDead;

    // Detect collision between enemies and projectiles
    const enemiesAndProjectiles = arrayCrossProduct(this.enemies, this.projectiles);
    enemiesAndProjectiles.forEach(([enemy, projectile]) => {
      const dx = enemy.x - projectile.x;
      const dy = enemy.y - projectile.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < enemy.size + projectile.size) {
        // If the projectile hits the enemy increase the score
        this.score += 10;

        // Remove or downsize the enemy
        if (enemy.shouldReduceSize()) {
          enemy.reduceSize();
        } else {
          this.enemies = this.enemies.filter(e => e !== enemy);
        }

        // Remove the projectile
        this.projectiles = this.projectiles.filter(p => p !== projectile);
      }
    });
  }

  run() {
    requestAnimationFrame(this.run.bind(this));

    if (this.gameOver) {

      drawRoundRect(ctx, canvas.width / 2 - 200, canvas.height / 2 - 100, 400, 200, 20);

      ctx.font = '48px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
      ctx.font = '24px Arial';
      ctx.fillText('Click to restart', canvas.width / 2 - 100, canvas.height / 2 + 50);


      return;
    }

    // Update objects
    this.update((Date.now() - this.lastTimestamp) / 1000);
    this.lastTimestamp = Date.now();

    this.collision();

    // Cleanup off screen objects
    this.cleanup();

    // Spawn has to be after cleanup otherwise we will clean up
    // newly spawned enemies
    // This may cause bugs in the future if we start cleaning up
    // before enemies enter the screen
    this.spawn();

    // Draw objects
    this.draw();
  }
}

let game = new Game(new Player(canvas.width / 2, canvas.height / 2, 50));

// Spawn projectiles on mouse click
canvas.addEventListener('mousedown', (event) => {
  if (game.gameOver) {
    game = new Game(new Player(canvas.width / 2, canvas.height / 2, 50));
    game.run();
    return;
  }

  // New projectile at player position moving towards the mouse click
  const angle = Math.atan2(event.clientY - game.player.y, event.clientX - game.player.x);
  const projectile = new Projectile(game.player.x, game.player.y, 5, 300, angle);

  game.projectiles.push(projectile);
});

game.run();