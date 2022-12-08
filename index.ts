import { Enemy, Player, Projectile } from './animatedObjects';

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


function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Spawn enemies every 1 second
  if (Date.now() - mostRecentEnemySpawn > 1000) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const angle = Math.atan2(player.y - y, player.x - x);
    const enemy = new Enemy(x, y, 50, 100, angle);

    enemies.push(enemy);
    mostRecentEnemySpawn = Date.now();
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