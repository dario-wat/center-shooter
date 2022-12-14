import { Game, initGame, runGameLoop } from './gameState';
import { ProjectileBurstAttack, RocketLaser } from './specialAttacks';

export function setupInputs(): void {
  Game.canvas.addEventListener('mouseup', _event => {
    if (Game.player.isLaserEquipped()) {
      Game.player.laser.deactivate();
    }
  });

  // Spawn projectiles on mouse click
  Game.canvas.addEventListener('mousedown', event => {
    // Ignore right click
    if (event.button === 2) {
      return;
    }

    if (Game.gameOver) {
      initGame();
      runGameLoop();
      return;
    }

    if (Game.weaponUpgradePowerup
      && Game.weaponUpgradePowerup.isClicked(event.clientX, event.clientY)
    ) {
      Game.weaponUpgradePowerup = null;
      Game.player.upgradeWeapon();
    } else if (
      Game.projectileBurstPowerup
      && Game.projectileBurstPowerup.isClicked(event.clientX, event.clientY)
    ) {
      Game.projectileBurstPowerup = null;
      Game.projectileBurstAttack = new ProjectileBurstAttack(Game.player);
    } else if (Game.rocketLaserPowerup
      && Game.rocketLaserPowerup.isClicked(event.clientX, event.clientY)
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
  Game.canvas.addEventListener('mousemove', event => {
    Game.player.faceMouse(event.clientX, event.clientY);
  });

  // Activate special attacks on right click
  Game.canvas.addEventListener('contextmenu', event => {
    event.preventDefault();
    Game.projectileBurstAttack?.activate();
    Game.rocketLaser?.activate();
  });

  // Change weapon on scroll
  Game.canvas.addEventListener('wheel', event => {
    event.preventDefault();
    Game.player.changeWeapon();
  });
}