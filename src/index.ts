import Images from './images';
import { initCanvas, initGame, runGameLoop } from './gameState';
import { setupInputs } from './inputs';

async function main(): Promise<void> {
  await Images.initialize();
  initCanvas();
  setupInputs();

  initGame();

  runGameLoop();
}

main();