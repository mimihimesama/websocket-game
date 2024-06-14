import { getGameAssets } from '../init/assets.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';
import { createItem, getItem } from '../models/item.model.js';
import calculateTotalScore from '../utils/calculateTotalScore.js';
import { addHighScore, getHighScores } from '../models/score.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();

  clearStage(uuid);
  createItem(uuid);

  setStage(uuid, stages.data[0].id, payload.timestamp);

  return { status: 'success' };
};

export const gameEnd = async (uuid, payload, io) => {
  // 클라이언트에서 받은 게임 종료 시 타임스탬프와 총 점수
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);
  const items = getItem(uuid);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 총 점수 계산
  const totalScore = calculateTotalScore(stages, gameEndTime, items);

  console.log('총점 : ', totalScore);

  // 점수와 타임스탬프 검증 (예: 클라이언트가 보낸 총점과 계산된 총점 비교)
  // 오차범위 5
  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  // 현재 최고 점수를 가져와서 비교
  const highScores = await getHighScores(1);
  const currentHighScore = highScores.length > 0 ? highScores[0].score : 0;

  if (score > currentHighScore) {
    // 새로운 최고 점수인 경우
    await addHighScore(uuid, score);

    io.emit('newHighScore', { uuid, score });
  }

  return { status: 'success', message: 'Game ended successfully', score };
};
