import { Player } from "./game_objects/player";

export class ProjectileBurstPower {

  private static readonly DELAY = 500;

  private remainingShots: number = 3;
  private lastShotTimestamp: number = 0;
  public isActive: boolean = false;

  constructor(
    private player: Player,
  ) { }

  use(): void {
    if (
      this.isActive
      && this.remainingShots > 0
      && Date.now() - this.lastShotTimestamp > ProjectileBurstPower.DELAY
    ) {
      this.remainingShots--;
      this.lastShotTimestamp = Date.now();

      // TODO
      // this.player.fireProjectileBurst();
    }
  }

  activate(): void {
    this.isActive = true;
  }

  isDead(): boolean {
    return this.remainingShots <= 0;
  }
}