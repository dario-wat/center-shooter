import { euclDistance } from './util';
import Images from './images';
import { ProjectileBurstAttack } from './specialAttacks';
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

    if (game.weaponUpgradePowerup
      && euclDistance(
        game.weaponUpgradePowerup.x,
        game.weaponUpgradePowerup.y,
        event.clientX,
        event.clientY
      ) < game.weaponUpgradePowerup.size
    ) {
      game.weaponUpgradePowerup = null;
      game.player.upgradeWeapon();
    } else if (
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
    game.projectileBurstAttack.activate();
  });

  // Change weapon on scroll
  game.canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    if (event.deltaY > 0) {
      game.player.changeWeapon();
    }
  });

  game.run();
}

main();