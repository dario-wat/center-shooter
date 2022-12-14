import { euclDistance } from './util';
import Images from './images';
import { ProjectileBurstAttack, RocketLaser } from './specialAttacks';
import { Game, initGame, runGameLoop } from './gameState';


async function main(): Promise<void> {
  await Images.initialize();
  initGame();

  Game.canvas.addEventListener('mouseup', (event) => {
    Game.player.laser.isActive = false;
  });

  // Spawn projectiles on mouse click
  Game.canvas.addEventListener('mousedown', (event) => {
    // Ignore right click
    if (event.button === 2) {
      return;
    }
    // if (Game.GameOver) {
    //   Game = new Game();
    //   Game.run();
    //   return;
    // }

    if (Game.weaponUpgradePowerup
      && euclDistance(
        Game.weaponUpgradePowerup.x,
        Game.weaponUpgradePowerup.y,
        event.clientX,
        event.clientY
      ) < Game.weaponUpgradePowerup.size
    ) {
      Game.weaponUpgradePowerup = null;
      Game.player.upgradeWeapon();
    } else if (
      Game.projectileBurstPowerup
      && euclDistance(
        Game.projectileBurstPowerup.x,
        Game.projectileBurstPowerup.y,
        event.clientX,
        event.clientY
      ) < Game.projectileBurstPowerup.size
    ) {
      Game.projectileBurstPowerup = null;
      Game.projectileBurstAttack = new ProjectileBurstAttack(Game.player);
    } else if (Game.rocketLaserPowerup
      && euclDistance(
        Game.rocketLaserPowerup.x,
        Game.rocketLaserPowerup.y,
        event.clientX,
        event.clientY
      ) < Game.rocketLaserPowerup.size
    ) {
      Game.rocketLaserPowerup = null;
      Game.rocketLaser = new RocketLaser();
    } else if (Game.player.isProjectileEquipped()) {
      Game.player.fireProjectile();
    } else if (Game.player.isLaserEquipped()) {
      Game.player.laser.activate();
    }
  });

  // Player faces the mouse position
  Game.canvas.addEventListener('mousemove', (event) => {
    Game.player.angle = Math.atan2(event.clientY - Game.player.y, event.clientX - Game.player.x);
  });

  // Change weapon on right click
  Game.canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    // Game.projectileBurstAttack.activate();
    Game.rocketLaser.activate();
  });

  // Change weapon on scroll
  Game.canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    Game.player.changeWeapon();
  });

  runGameLoop();
}

main();