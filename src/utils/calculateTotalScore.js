import { getGameAssets } from '../init/assets.js';

const calculateTotalScore = (stages, gameEndTime, items) => {
  const { stages: stageJson, items: itemData } = getGameAssets();

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  // 각 스테이지의 지속 시간을 계산하여 총 점수 계산
  let totalScore = 0;

  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      // 마지막 스테이지의 경우 종료 시간이 게임의 종료 시간
      stageEndTime = gameEndTime;
    } else {
      // 다음 스테이지의 시작 시간을 현재 스테이지의 종료 시간으로 사용
      stageEndTime = stages[index + 1].timestamp;
    }
    const stageDuration = ((stageEndTime - stage.timestamp) / 1000) * stageJson.data[index].upScore; // 스테이지별 1초당 점수
    totalScore += stageDuration;
  });

  // 아이템 획득 점수
  for (const { item: itemId } of items) {
    const itemObj = itemData.data.find((it) => it.id === itemId);
    totalScore += itemObj.score;
  }

  return totalScore;
};

export default calculateTotalScore;
