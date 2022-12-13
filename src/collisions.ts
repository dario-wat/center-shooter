import { Game } from "./gameState";
import { Meteor, Smoke } from "./game_objects/gameObjects";
import { Laser, LaserHit } from "./game_objects/laser";
import { Projectile } from "./game_objects/player";
import { arrayCrossProduct, euclDistance, intersectRayAndCircle } from "./util";

export function collidePlayerWithMeteors(): void {
  const meteorPlayerHits = Game.meteors.filter(meteor => {
    const distance = euclDistance(Game.player.x, Game.player.y, meteor.x, meteor.y);
    return distance < Game.player.size + meteor.size();
  });

  const score = 10;
  if (meteorPlayerHits.length > 0) {
    // Remove meteors that hit the player
    Game.meteors = Game.meteors.filter(meteor => !meteorPlayerHits.includes(meteor));
    meteorPlayerHits.forEach(meteor => {
      Game.smokes.push(new Smoke(meteor.x, meteor.y));
    });
    Game.score += meteorPlayerHits.length * score;
    Game.player.hit();
  }
  Game.gameOver = Game.player.isDead();
}

export function collideProjectilesAndMeteors(): void {
  const meteorsAndProjectiles = arrayCrossProduct(Game.meteors, Game.projectiles);
  meteorsAndProjectiles.forEach(([meteor, projectile]) => {
    const dx = meteor.x - projectile.x;
    const dy = meteor.y - projectile.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < meteor.size() + projectile.size) {
      const damageTaken = meteor.takeDamage(Projectile.DAMAGE);

      // If the projectile hits the meteor increase the score
      Game.score += damageTaken;

      // Remove the meteor
      if (meteor.isDead()) {
        // Add smoke where the meteor was
        Game.smokes.push(new Smoke(meteor.x, meteor.y));
        Game.meteors = Game.meteors.filter(m => m !== meteor);
      }

      // Remove the projectile
      Game.projectiles = Game.projectiles.filter(p => p !== projectile);
    }
  });
}

export function collideLaserWithMeteors(laser: Laser, dt: number): void {
  // Collision between laser and meteors
  laser.hit = null;
  let distanceToMeteor = Infinity;
  let meteorToHit: Meteor | null = null;
  if (laser.isFiring()) {
    Game.meteors.forEach(meteor => {
      const position = laser.getPosition();
      // Circle and line intersection
      const intersection = intersectRayAndCircle(
        position.x, position.y, laser.getAngle(),
        meteor.x, meteor.y, meteor.size(),
      );
      if (intersection !== null) {
        const distance = euclDistance(position.x, position.y, intersection.x, intersection.y);
        if (distance < distanceToMeteor) {
          laser.hit = new LaserHit(intersection.x, intersection.y, laser);
          distanceToMeteor = distance;
          meteorToHit = meteor;
        }
      }
    });
  }

  const damageTaken = meteorToHit?.takeDamage(Game.player.laser.getDps() * dt);
  Game.score += damageTaken ?? 0;
  if (meteorToHit?.isDead()) {
    Game.meteors = Game.meteors.filter(m => m !== meteorToHit);
    Game.smokes.push(new Smoke(meteorToHit.x, meteorToHit.y));
  }
}