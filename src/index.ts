import { Meteor, Smoke } from './game_objects/gameObjects';
import { Laser, LaserHit, Player, Projectile } from './game_objects/player';
import { MeteorSpawner } from './spawners/meteorSpawner';
import { arrayCrossProduct, drawRoundRect, euclDistance, intersectRayAndCircle } from './util';
import Images from './images';
import { ProjectileBurstPower } from './projectileBurstPower';
import { Game } from './gameState';


async function main(): Promise<void> {
  await Images.initialize();

  let game = Game.get();

  // Activate laser while mouse is down
  game.canvas.addEventListener('mousedown', (event) => {
    if (event.button === 2) {
      return;
    }
    if (game.player.isLaserEquipped()) {
      game.player.laser.isActive = true;
    }
  });
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

    // New projectile at player position moving towards the mouse click
    if (game.player.isProjectileEquipped()) {
      game.player.fireProjectile();
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
    game.projectileBurstPower.activate();
  });

  game.run();
}

main();