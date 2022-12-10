import { Meteor } from './game_objects/gameObjects';
import { Player } from './game_objects/player';

const MIN_INTERVAL = 500;
const MAX_INTERVAL = 2000;

const MIN_VELOCITY = 50;
const MAX_VELOCITY = 200;

const MIN_HP = 20;
const MAX_HP = 100;

export class MeteorSpawner {

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

  spawn(): Meteor {
    const velocity = Math.random() * (MAX_VELOCITY - MIN_VELOCITY) + MIN_VELOCITY;
    const hp = Math.random() * (MAX_HP - MIN_HP) + MIN_HP;

    // Spawn at random point off screen
    const side = Math.floor(Math.random() * 4);
    const offset = 100; // Spawn off screen by 100px
    let x = 0;
    let y = 0;
    switch (side) {
      case 0: // Top
        x = Math.random() * this.canvasWidth;
        y = -offset;
        break;
      case 1: // Right
        x = this.canvasWidth + offset;
        y = Math.random() * this.canvasHeight;
        break;
      case 2: // Bottom
        x = Math.random() * this.canvasWidth;
        y = this.canvasHeight + offset;
        break;
      case 3: // Left
        x = -offset;
        y = Math.random() * this.canvasHeight;
        break;
    }

    const angle = Math.atan2(this.player.y - y, this.player.x - x);

    this.lastSpawnTimestamp = Date.now();
    this.nextSpawnInterval = Math.random() * (MAX_INTERVAL - MIN_INTERVAL) + MIN_INTERVAL;

    return new Meteor(x, y, hp, velocity, angle);
  }
}