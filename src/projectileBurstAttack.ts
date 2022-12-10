import { Player } from "./game_objects/player";

const DELAY = 500;

export class ProjectileBurstAttack {

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
      && Date.now() - this.lastShotTimestamp > DELAY
    ) {
      this.remainingShots--;
      this.lastShotTimestamp = Date.now();
      this.player.fireProjectileBurst();
    }
  }

  activate(): void {
    this.isActive = true;
  }

  isDone(): boolean {
    return this.remainingShots <= 0;
  }
}