// Create canvas
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

abstract class AnimatedObject {

  abstract draw(): void;

  abstract update(dt: number): void;
}

class Player extends AnimatedObject {

  constructor(
    public x: number,
    public y: number,
    private size: number,
    private color: string = '#ababab',
  ) {
    super();
  }

  draw(): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(dt: number): void {
  }
}

class Projectile extends AnimatedObject {

  constructor(
    private x: number,
    private y: number,
    private size: number,
    private velocity: number,
    private angle: number,
    private color: string = 'red',
  ) {
    super();
  }

  draw(): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(dt: number): void {
    // Move projectile given velocity and angle
    this.x += this.velocity * Math.cos(this.angle) * dt;
    this.y += this.velocity * Math.sin(this.angle) * dt;
  }
}

let mostRecentTimestamp = Date.now();

let player = new Player(canvas.width / 2, canvas.height / 2, 50);

let projectiles: Projectile[] = [];

// Spawn projectiles on mouse click
canvas.addEventListener('click', (event) => {
  // New projectile at player position moving towards the mouse click
  const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
  const projectile = new Projectile(player.x, player.y, 5, 0.1, angle);

  projectiles.push(projectile);
});


function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  projectiles.forEach((projectile) => {
    projectile.update(Date.now() - mostRecentTimestamp);
    projectile.draw();
  });
  // console.log(Date.now() - mostRecentTimestamp);
  mostRecentTimestamp = Date.now();
}

animate();