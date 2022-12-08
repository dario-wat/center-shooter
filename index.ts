import { Enemy, Player, Projectile } from './animatedObjects';
import { EnemySpawner } from './enemySpawner';

// Create canvas
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Game {

  private readonly enemySpawner: EnemySpawner;

  private lastTimestamp: number = 0;

  public projectiles: Projectile[] = [];
  private enemies: Enemy[] = [];

  constructor(
    public readonly player: Player,
  ) {
    this.enemySpawner = new EnemySpawner(canvas.width, canvas.height, player);
  }

  run() {
    requestAnimationFrame(this.run.bind(this));

    // Detect collision between player and enemies
    const playerDead = this.enemies.some(enemy => {
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < this.player.size + enemy.size;
    });
    console.log('Dead: ', playerDead ? 'Yes' : 'No');

    // Remove enemies and projectiles that collide
    const enemiesAndProjectiles = arrayCrossProduct(this.enemies, this.projectiles);
    enemiesAndProjectiles.forEach(([enemy, projectile]) => {
      const dx = enemy.x - projectile.x;
      const dy = enemy.y - projectile.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < enemy.size + projectile.size) {
        // Remove enemy and projectile
        if (enemy.shouldReduceSize()) {
          enemy.reduceSize();
        } else {
          this.enemies = this.enemies.filter(e => e !== enemy);
        }
        this.projectiles = this.projectiles.filter(p => p !== projectile);
      }
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.enemySpawner.shouldSpawn()) {
      this.enemies.push(this.enemySpawner.spawn());
    }

    const dt = (Date.now() - this.lastTimestamp) / 1000;

    // Update and draw objects
    this.player.draw(ctx);
    this.projectiles.forEach(projectile => {
      projectile.update(dt);
      projectile.draw(ctx);
    });
    this.enemies.forEach(enemy => {
      enemy.update(dt);
      enemy.draw(ctx);
    });

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

    this.lastTimestamp = Date.now();
  }
}

let game = new Game(new Player(canvas.width / 2, canvas.height / 2, 50));

function arrayCrossProduct<A, B>(array1: A[], array2: B[]): [A, B][] {
  const result: [A, B][] = [];
  for (const item1 of array1) {
    for (const item2 of array2) {
      result.push([item1, item2]);
    }
  }
  return result;
}


// Spawn projectiles on mouse click
canvas.addEventListener('mousedown', (event) => {
  // New projectile at player position moving towards the mouse click
  const angle = Math.atan2(event.clientY - game.player.y, event.clientX - game.player.x);
  const projectile = new Projectile(game.player.x, game.player.y, 5, 300, angle);

  // TODO needs to be cleaned up
  game.projectiles.push(projectile);
});

game.run();