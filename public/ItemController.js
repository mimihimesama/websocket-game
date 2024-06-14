import Item from './Item.js';

class ItemController {
  INTERVAL_MIN = 0;
  INTERVAL_MAX = 6000;

  nextInterval = null;
  items = [];

  constructor(ctx, itemImages, scaleRatio, speed, itemUnlocks, currentScore) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.itemImages = itemImages;
    this.scaleRatio = scaleRatio;
    this.speed = speed;
    this.itemUnlocks = itemUnlocks;
    this.currentScore = currentScore; // Score 인스턴스를 저장

    this.setNextItemTime();
  }

  setNextItemTime() {
    this.nextInterval = this.getRandomNumber(this.INTERVAL_MIN, this.INTERVAL_MAX);
  }

  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  createItem() {
    this.currentStage = this.currentScore.getCurrentStage(); // 초기 스테이지를 Score 인스턴스로부터 가져옴
    const itemUnlockIndex = this.itemUnlocks.findIndex(
      (data) => data.stage_id === this.currentStage,
    );

    const itemsAvailable = this.itemUnlocks[itemUnlockIndex].item_id;
    if (itemsAvailable.length === 0) {
      console.log('스테이지 1에는 아이템이 없습니다.');
      return;
    }

    const randomIndex = this.getRandomNumber(0, itemsAvailable.length - 1);
    const itemId = itemsAvailable[randomIndex];
    const itemInfo = this.itemImages.find((item) => item.id === itemId);

    const x = this.canvas.width * 1.5;
    const y = this.getRandomNumber(10, this.canvas.height - itemInfo.height);

    const item = new Item(
      this.ctx,
      itemInfo.id,
      x,
      y,
      itemInfo.width,
      itemInfo.height,
      itemInfo.image,
    );

    this.items.push(item);
  }

  update(gameSpeed, deltaTime) {
    if (this.nextInterval <= 0) {
      this.createItem();
      this.setNextItemTime();
    }

    this.nextInterval -= deltaTime;

    this.items.forEach((item) => {
      item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
    });

    this.items = this.items.filter((item) => item.x > -item.width);
  }

  draw() {
    this.items.forEach((item) => item.draw());
  }

  collideWith(sprite) {
    const collidedItem = this.items.find((item) => item.collideWith(sprite));
    if (collidedItem) {
      this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height);
      return {
        itemId: collidedItem.id,
      };
    }
  }

  reset() {
    this.items = [];
  }
}

export default ItemController;
