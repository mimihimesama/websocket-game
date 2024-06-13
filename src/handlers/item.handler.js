import { getStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';
import { setItem } from '../models/item.model.js';

export const getItemHandler = (userId, payload) => {
  const { items, itemUnlocks } = getGameAssets();
  const { itemId, itemScore } = payload;

  // 아이템의 존재 여부 확인
  const item = items.data.find((it) => it.id === itemId);
  if (!item) {
    return { status: 'fail', message: '존재하지 않는 아이템입니다.' };
  }

  // 아이템 점수가 정확한지 확인
  if (item.score !== itemScore) {
    return { status: 'fail', message: '잘못된 아이템 점수입니다.' };
  }

  // 사용자의 현재 스테이지 가져오기
  let currentStages = getStage(userId);
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 현재 스테이지에 해당하는 아이템인지 확인
  const unlockInfo = itemUnlocks.data.find((unlock) => unlock.stage_id === currentStage.id);
  if (!unlockInfo || !unlockInfo.item_id.includes(itemId)) {
    return { status: 'fail', message: '해당 스테이지의 아이템이 아닙니다.' };
  }

  setItem(userId, itemId);

  return { status: 'success' };
};
