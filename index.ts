import { Enemy, Player, Projectile } from './animatedObjects';
import { EnemySpawner } from './enemySpawner';

// Create canvas
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mostRecentTimestamp = Date.now();
let mostRecentEnemySpawn = Date.now();

let player = new Player(canvas.width / 2, canvas.height / 2, 50);
let projectiles: Projectile[] = [];
let enemies: Enemy[] = [];

const enemySpawner = new EnemySpawner(canvas.width, canvas.height, player);

function arrayCrossProduct<A, B>(array1: A[], array2: B[]): [A, B][] {
  const result: [A, B][] = [];
  for (const item1 of array1) {
    for (const item2 of array2) {
      result.push([item1, item2]);
    }
  }
  return result;
}

function animate() {
  requestAnimationFrame(animate);

  // Detect collision between player and enemies
  const playerDead = enemies.some(enemy => {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < player.size + enemy.size;
  });
  console.log('Dead: ', playerDead ? 'Yes' : 'No');

  // Remove enemies and projectiles that collide
  const enemiesAndProjectiles = arrayCrossProduct(enemies, projectiles);
  enemiesAndProjectiles.forEach(([enemy, projectile]) => {
    const dx = enemy.x - projectile.x;
    const dy = enemy.y - projectile.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < enemy.size + projectile.size) {
      // Remove enemy and projectile
      enemies = enemies.filter(e => e !== enemy);
      projectiles = projectiles.filter(p => p !== projectile);
    }
  });

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (enemySpawner.shouldSpawn()) {
    enemies.push(enemySpawner.spawn());
  }

  const dt = (Date.now() - mostRecentTimestamp) / 1000;

  // Update and draw objects
  player.draw(ctx);
  projectiles.forEach(projectile => {
    projectile.update(dt);
    projectile.draw(ctx);
  });
  enemies.forEach(enemy => {
    enemy.update(dt);
    enemy.draw(ctx);
  });

  // Cleanup enemies that are off screen
  enemies = enemies.filter(enemy =>
    enemy.x + enemy.size > 0
    && enemy.x - enemy.size < canvas.width
    && enemy.y + enemy.size > 0
    && enemy.y - enemy.size < canvas.height,
  );

  // Clenaup projectiles that are off screen
  projectiles = projectiles.filter(projectile =>
    projectile.x + projectile.size > 0
    && projectile.x - projectile.size < canvas.width
    && projectile.y + projectile.size > 0
    && projectile.y - projectile.size < canvas.height,
  );

  mostRecentTimestamp = Date.now();
}

// Spawn projectiles on mouse click
canvas.addEventListener('mousedown', (event) => {
  // New projectile at player position moving towards the mouse click
  const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
  const projectile = new Projectile(player.x, player.y, 5, 100, angle);

  // TODO needs to be cleaned up
  projectiles.push(projectile);
});

animate();