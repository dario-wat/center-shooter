import { drawCircle } from '../util';
import Images from '../images';
import { DEBUG_COLLISIONS, INVINCIBILITY } from '../config';
import { AnimatedObject } from './animatedObject';
import { Game } from '../gameState';
import { CanFitLaser, Laser } from './laser';
import { Projectile } from './projectile';

enum WeaponType {
  LASER,
  PROJECTILE,
}

export class Player extends AnimatedObject implements CanFitLaser {

  private static readonly INVINCIBILITY_DURATION = 2000;
  private static readonly WEAPON_UPGRADE_TIME = 10000;

  public static readonly LASER_DPS = 180;
  public static readonly LASER_UPGRADED_DPS = 360;

  private activeWeapon: WeaponType = WeaponType.PROJECTILE;
  public weaponUpgradeStartTime: number = 0;
  public lives: number = 3;
  private lastHitTimestamp: number = 0;

  // Game objects
  public laser: Laser;

  constructor(
    public x: number,
    public y: number,
    public size: number = 50,
    public angle: number = 0,
  ) {
    super();
    this.laser = new Laser(this);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);
    if (this.isInvincible()) {
      ctx.globalAlpha = 0.4;
    }

    ctx.drawImage(
      Images.SHIP,
      -this.size,
      -this.size,
      2 * this.size,
      2 * this.size,
    );

    ctx.globalAlpha = 1;
    ctx.rotate(-this.angle - Math.PI / 2);
    ctx.translate(-this.x, -this.y);

    if (DEBUG_COLLISIONS) {
      drawCircle(ctx, this.x, this.y, this.size, null, 'blue');
    }

    this.laser.draw(ctx);
  }

  update(dt: number): void {
    this.laser.update(dt);
  }

  isLaserEquipped(): boolean {
    return this.activeWeapon === WeaponType.LASER;
  }

  isProjectileEquipped(): boolean {
    return this.activeWeapon === WeaponType.PROJECTILE;
  }

  isDead(): boolean {
    return this.lives <= 0;
  }

  isInvincible(): boolean {
    return INVINCIBILITY
      || Date.now() - this.lastHitTimestamp < Player.INVINCIBILITY_DURATION;
  }

  isWeaponUpgraded(): boolean {
    return Date.now() - this.weaponUpgradeStartTime < Player.WEAPON_UPGRADE_TIME;
  }

  getWeaponUpgradeTimeLeft(): number {
    return Player.WEAPON_UPGRADE_TIME - (Date.now() - this.weaponUpgradeStartTime);
  }

  faceMouse(x: number, y: number): void {
    this.angle = Math.atan2(y - this.y, x - this.x);
  }

  // Run this when player gets hit
  hit(): void {
    if (this.isInvincible()) {
      return;
    }
    this.lives--;
    this.lastHitTimestamp = Date.now();
  }

  // Spawns new projectile in the direction where the player is facing
  fireProjectile(): void {
    // Move x and y a bit to avoid spawning projectiles inside the player
    const offset = this.size;
    const x = this.x + offset * Math.cos(this.angle);
    const y = this.y + offset * Math.sin(this.angle);

    if (!this.isWeaponUpgraded()) {
      Game.projectiles.push(new Projectile(x, y, this.angle));
    } else {
      const angleOffset = 0.3;
      Game.projectiles.push(
        new Projectile(x, y, this.angle - 2 * angleOffset),
        new Projectile(x, y, this.angle - angleOffset),
        new Projectile(x, y, this.angle),
        new Projectile(x, y, this.angle + angleOffset),
        new Projectile(x, y, this.angle + 2 * angleOffset),
      );
    }
  }

  fireProjectileBurst(): void {
    const numProjectiles = 40;
    const angleOffset = 2 * Math.PI / numProjectiles;
    const projectiles: Projectile[] = [];
    for (let i = 0; i < numProjectiles; i++) {
      const angle = this.angle + (i - numProjectiles / 2) * angleOffset;
      projectiles.push(new Projectile(this.x, this.y, angle));
    }
    Game.projectiles.push(...projectiles);
  }

  changeWeapon(): void {
    if (this.activeWeapon === WeaponType.PROJECTILE) {
      this.activeWeapon = WeaponType.LASER;
    } else {
      this.activeWeapon = WeaponType.PROJECTILE;
    }
  }

  upgradeWeapon(): void {
    this.weaponUpgradeStartTime = Date.now();
  }

  getLaserDps(): number {
    return this.isWeaponUpgraded() ? Player.LASER_UPGRADED_DPS : Player.LASER_DPS;
  }

  getLaserPosition(): { x: number; y: number; } {
    return { x: this.x, y: this.y };
  }

  getLaserAngle(): number {
    return this.angle;
  }

  isLaserFiring(): boolean {
    return this.isLaserEquipped() && this.laser.isActive;
  }
}

