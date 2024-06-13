import { moveStageHandler } from './stage.handler.js';
import { gameEnd, gameStart } from './game.handler.js';
import { getItemHandler } from './item.handler.js';

const handlerMappings = {
  2: gameStart,
  3: gameEnd,
  11: moveStageHandler,
  14: getItemHandler,
};

export default handlerMappings;
