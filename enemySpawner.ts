import { Enemy, Player } from './animatedObjects';

const MIN_INTERVAL = 500;
const MAX_INTERVAL = 2000;

const MIN_VELOCITY = 50;
const MAX_VELOCITY = 200;

const SMALL_SIZE = 10;
const MEDIUM_SIZE = 15;
const LARGE_SIZE = 20;

const SMALL_PROBABILITY = 0.5;
const MEDIUM_PROBABILITY = 0.35;
const LARGE_PROBABILITY = 0.15;

const COLORS = ['red', 'blue', 'green', 'yellow'];

export class EnemySpawner {

  private lastSpawnTimestamp: number = 0;
  private nextSpawnInterval: number = 0;

  constructor(
    private canvasWidth: number,
    private canvasHeight: number,
    private readonly player: Player,
  ) {
  }

  shouldSpawn(): boolean {
    return Date.now() - this.lastSpawnTimestamp > this.nextSpawnInterval;
  }

  spawn(): Enemy {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const velocity = Math.random() * (MAX_VELOCITY - MIN_VELOCITY) + MIN_VELOCITY;
    const size = getSize();

    // Spawn at random point off screen
    const side = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    switch (side) {
      case 0: // Top
        x = Math.random() * this.canvasWidth;
        y = -size;
        break;
      case 1: // Right
        x = this.canvasWidth + size;
        y = Math.random() * this.canvasHeight;
        break;
      case 2: // Bottom
        x = Math.random() * this.canvasWidth;
        y = this.canvasHeight + size;
        break;
      case 3: // Left
        x = -size;
        y = Math.random() * this.canvasHeight;
        break;
    }

    const angle = Math.atan2(this.player.y - y, this.player.x - x);

    this.lastSpawnTimestamp = Date.now();
    this.nextSpawnInterval = Math.random() * (MAX_INTERVAL - MIN_INTERVAL) + MIN_INTERVAL;

    return new Enemy(x, y, size, velocity, angle, color);
  }
}

function getSize(): number {
  const probability = Math.random();
  if (probability < SMALL_PROBABILITY) {
    return SMALL_SIZE;
  }
  if (probability < SMALL_PROBABILITY + MEDIUM_PROBABILITY) {
    return MEDIUM_SIZE;
  }
  return LARGE_SIZE;
};