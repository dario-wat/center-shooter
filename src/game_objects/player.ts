import { drawCircle, euclDistance } from '../util';
import Images from '../images';
import { DEBUG_COLLISIONS } from '../config';
import { AnimatedObject } from './animatedObject';

enum WeaponType {
  LASER,
  PROJECTILE,
}

export class Player extends AnimatedObject {

  private static readonly INVINCIBILITY_DURATION = 2000;

  private activeWeapon: WeaponType = WeaponType.PROJECTILE;
  public lives: number = 3;
  private lastHitTimestamp: number = 0;

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
    // Player has no updates so only update the laser
    this.laser.update(dt);
  }

  isLaserEquipped(): boolean {
    return this.activeWeapon === WeaponType.LASER;
  }

  isProjectileEquipped(): boolean {
    return this.activeWeapon === WeaponType.PROJECTILE;
  }

  isLaserFiring(): boolean {
    return this.isLaserEquipped() && this.laser.isActive;
  }

  isDead(): boolean {
    return this.lives <= 0;
  }

  isInvincible(): boolean {
    return Date.now() - this.lastHitTimestamp < Player.INVINCIBILITY_DURATION;
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
  fireProjectile(): Projectile {
    return new Projectile(this.x, this.y, this.angle);
  }

  fireProjectileBurst(): Projectile[] {
    const numProjectiles = 40;
    const angleOffset = 2 * Math.PI / numProjectiles;
    const projectiles: Projectile[] = [];
    for (let i = 0; i < numProjectiles; i++) {
      const angle = this.angle + (i - numProjectiles / 2) * angleOffset;
      projectiles.push(new Projectile(this.x, this.y, angle));
    }
    return projectiles;
  }

  changeWeapon(): void {
    if (this.activeWeapon === WeaponType.PROJECTILE) {
      this.activeWeapon = WeaponType.LASER;
    } else {
      this.activeWeapon = WeaponType.PROJECTILE;
    }
  }
}

export class Projectile extends AnimatedObject {

  public static readonly DAMAGE = 35;

  constructor(
    public x: number,
    public y: number,
    private angle: number,
    private velocity: number = 300,
    public size: number = 10,
  ) {
    super();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);

    const scaleProjectileHoriz = 0.8;
    ctx.drawImage(
      Images.PROJECTILE,
      -this.size * scaleProjectileHoriz,
      -this.size,
      this.size * 2.0 * scaleProjectileHoriz,
      this.size * 2.0,
    );

    const scaleTrailHoriz = 0.6;
    const scaleTrailVert = 1.5;
    ctx.drawImage(
      Images.PROJECTILE_TRAIL,
      -this.size * scaleTrailHoriz,
      this.size,
      this.size * 2.0 * scaleTrailHoriz,
      this.size * 2.0 * scaleTrailVert,
    );

    ctx.rotate(-this.angle - Math.PI / 2);
    ctx.translate(-this.x, -this.y);

    if (DEBUG_COLLISIONS) {
      drawCircle(ctx, this.x, this.y, this.size, null, 'red');
    }
  }

  update(dt: number): void {
    this.x += this.velocity * Math.cos(this.angle) * dt;
    this.y += this.velocity * Math.sin(this.angle) * dt;
  }
}

export class Laser extends AnimatedObject {

  public static readonly DPS = 120;

  public isActive: boolean = false;
  public hit: LaserHit | null = null;

  constructor(private player: Player) {
    super();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (!this.isActive) {
      return;
    }

    ctx.translate(this.player.x, this.player.y);
    ctx.rotate(this.player.angle - Math.PI / 2);

    // Draw laser to the edge of the screen or to the hit point
    const laserLength = this.hit
      ? euclDistance(this.hit.x, this.hit.y, this.player.x, this.player.y)
      : 1000;
    const laserWidth = 10;
    ctx.drawImage(
      Images.LASER,
      -5,   // No clue why, but need this to center the laser
      this.player.size,
      laserWidth,
      - this.player.size + laserLength,
    );

    ctx.rotate(-this.player.angle + Math.PI / 2);
    ctx.translate(-this.player.x, -this.player.y);

    this.hit?.draw(ctx);
  }

  update(dt: number): void {
    // Do nothing for laser, update the laser hit
    this.hit?.update(dt);
  }
}

export class LaserHit extends AnimatedObject {

  constructor(
    public x: number,
    public y: number,
    public size: number = 20,
  ) {
    super();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      Images.LASER_HIT,
      this.x - this.size,
      this.y - this.size,
      this.size * 2,
      this.size * 2,
    );
  }

  update(dt: number): void {
    // Do nothing
  }
}