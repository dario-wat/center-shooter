import { FORCE_POWERUP } from "../config";
import { Game } from "../gameState";
import { ProjectileBurstPowerup, WeaponUpgradePowerup } from "../game_objects/gameObjects";
import { Player } from "../game_objects/player";
import { euclDistance } from "../util";

export class PowerupSpawner {

  private static readonly MIN_TIME_BETWEEN_SPAWNS = 15000;
  private static readonly MAX_TIME_BETWEEN_SPAWNS = 30000;

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
      PowerupSpawner.MAX_TIME_BETWEEN_SPAWNS
      - PowerupSpawner.MIN_TIME_BETWEEN_SPAWNS
    )
      + PowerupSpawner.MIN_TIME_BETWEEN_SPAWNS;
  }

  private shouldSpawnProjectileBurst(): boolean {
    return Game.projectileBurstAttack === null
      && Game.projectileBurstPowerup === null;
  }

  private shouldSpawnWeaponUpgrade(): boolean {
    return Game.weaponUpgradePowerup === null
      && !this.player.isWeaponUpgraded();
  }

  shouldSpawn(): boolean {
    return (this.shouldSpawnProjectileBurst() || this.shouldSpawnWeaponUpgrade())
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

    if (!this.shouldSpawnProjectileBurst()) {
      Game.weaponUpgradePowerup = new WeaponUpgradePowerup(x, y);
      return;
    }
    if (!this.shouldSpawnWeaponUpgrade()) {
      Game.projectileBurstPowerup = new ProjectileBurstPowerup(x, y);
      return;
    }

    if (Math.random() < 0.5) {
      Game.projectileBurstPowerup = new ProjectileBurstPowerup(x, y);
    } else {
      Game.weaponUpgradePowerup = new WeaponUpgradePowerup(x, y);
    }
  }
}
