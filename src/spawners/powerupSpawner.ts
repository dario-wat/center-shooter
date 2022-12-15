import { FORCE_POWERUP } from "../config";
import { Game } from "../gameState";
import { Player } from "../game_objects/player";
import { ProjectileBurstPowerup, RocketLaserPowerup, WeaponUpgradePowerup } from "../game_objects/powerUps";
import { euclDistance } from "../util";

export class PowerupSpawner {

  private static readonly MIN_TIME_BETWEEN_SPAWNS = 10000;
  private static readonly MAX_TIME_BETWEEN_SPAWNS = 24000;

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

  private shouldSpawnRocketLaser(): boolean {
    return Game.rocketLaser === null
      && Game.rocketLaserPowerup === null;
  }

  shouldSpawn(): boolean {
    return (
      this.shouldSpawnProjectileBurst()
      || this.shouldSpawnWeaponUpgrade()
      || this.shouldSpawnRocketLaser()
    )
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

    // Randomly choose powerup
    // This logic is not that great, but it works
    const powerupChance = 0.33;
    const powerup = Math.random();
    if (this.shouldSpawnProjectileBurst() && powerup < powerupChance) {
      Game.projectileBurstPowerup = new ProjectileBurstPowerup(x, y);
    } else if (this.shouldSpawnWeaponUpgrade() && powerup < powerupChance * 2) {
      Game.weaponUpgradePowerup = new WeaponUpgradePowerup(x, y);
    } else if (this.shouldSpawnRocketLaser()) {
      Game.rocketLaserPowerup = new RocketLaserPowerup(x, y);
    }
  }
}
