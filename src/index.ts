import { Meteor, Smoke } from './game_objects/gameObjects';
import { Laser, LaserHit, Player, Projectile } from './game_objects/player';
import { MeteorSpawner } from './spawners/meteorSpawner';
import { arrayCrossProduct, drawRoundRect, euclDistance, intersectRayAndCircle } from './util';
import Images from './images';
import { ProjectileBurstAttack } from './projectileBurstAttack';
import { Game } from './gameState';


async function main(): Promise<void> {
  await Images.initialize();

  let game = Game.get();

  game.canvas.addEventListener('mouseup', (event) => {
    game.player.laser.isActive = false;
  });

  // Spawn projectiles on mouse click
  game.canvas.addEventListener('mousedown', (event) => {
    // Ignore right click
    if (event.button === 2) {
      return;
    }
    // if (game.gameOver) {
    //   game = new Game();
    //   game.run();
    //   return;
    // }

    if (
      game.projectileBurstPowerup
      && euclDistance(
        game.projectileBurstPowerup.x,
        game.projectileBurstPowerup.y,
        event.clientX,
        event.clientY
      ) < game.projectileBurstPowerup.size
    ) {
      game.projectileBurstPowerup = null;
      game.projectileBurstAttack = new ProjectileBurstAttack(game.player);
    } else if (game.player.isProjectileEquipped()) {
      game.player.fireProjectile();
    } else if (game.player.isLaserEquipped()) {
      game.player.laser.isActive = true;
    }
  });

  // Player faces the mouse position
  game.canvas.addEventListener('mousemove', (event) => {
    game.player.angle = Math.atan2(event.clientY - game.player.y, event.clientX - game.player.x);
  });

  // Change weapon on right click
  game.canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    // TODO
    // game.player.changeWeapon();
    game.projectileBurstAttack.activate();
  });

  game.run();
}

main();