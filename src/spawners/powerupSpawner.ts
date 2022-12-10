import { FORCE_POWERUP } from "../config";
import { Game } from "../gameState";
import { ProjectileBurstPowerup } from "../game_objects/gameObjects";
import { Player } from "../game_objects/player";
import { euclDistance } from "../util";

export class ProjectileBurstPowerupSpawner {

  private static readonly MIN_TIME_BETWEEN_SPAWNS = 30000;
  private static readonly MAX_TIME_BETWEEN_SPAWNS = 60000;

  private lastSpawnTimestamp: number;
  private nextSpawnInterval: number = 0;

  constructor(
    private canvasWidth: number,
    private canvasHeight: number,
    private readonly player: Player,
  ) {
    // Prevent spawning immediately
    this.lastSpawnTimestamp = Date.now();
    this.resetNextSpawnInterval();
  }

  resetNextSpawnInterval(): void {
    this.nextSpawnInterval = Math.random() * (
      ProjectileBurstPowerupSpawner.MAX_TIME_BETWEEN_SPAWNS
      - ProjectileBurstPowerupSpawner.MIN_TIME_BETWEEN_SPAWNS
    )
      + ProjectileBurstPowerupSpawner.MIN_TIME_BETWEEN_SPAWNS;
  }

  shouldSpawn(): boolean {
    return Game.get().projectileBurstPower === null
      && Game.get().projectileBurstPowerup === null
      && (
        FORCE_POWERUP
        || Date.now() - this.lastSpawnTimestamp > this.nextSpawnInterval
      );
  }

  spawn(): void {
    this.lastSpawnTimestamp = Date.now();
    this.resetNextSpawnInterval();

    const padding = 100;
    let x, y;
    while (true) {
      x = Math.random() * (this.canvasWidth - padding * 2) + padding;
      y = Math.random() * (this.canvasHeight - padding * 2) + padding;

      // If too close to player, try again
      if (euclDistance(x, y, this.player.x, this.player.y) > this.player.size * 2) {
        break;
      }
    }

    Game.get().projectileBurstPowerup = new ProjectileBurstPowerup(x, y);
  }
}