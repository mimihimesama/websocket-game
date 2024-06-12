import { sendEvent } from './Socket.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  currentStage = 1000; // 초기 스테이지 설정
  stageChange = true;

  constructor(ctx, scaleRatio, stages) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stages = stages;
  }

  update(deltaTime) {
    this.score += deltaTime * 0.01;
    const currentStageIndex = this.stages.findIndex((stage) => stage.id === this.currentStage);
    const nextStage = this.stages[currentStageIndex + 1];

    // 다음 스테이지가 존재하는지 확인하고 점수가 다음 스테이지의 기준점수 이상일 때 스테이지 변경
    if (nextStage && this.score >= nextStage.score && this.stageChange) {
      this.stageChange = false;
      sendEvent(11, { currentStage: this.currentStage, targetStage: nextStage.id });
      this.currentStage = nextStage.id; // 현재 스테이지 업데이트
    }
  }

  getItem(itemId) {
    this.score += 0;
  }

  reset() {
    this.score = 0;
    this.currentStage = 1000; // 스테이지 초기화
    this.stageChange = true; // 스테이지 변경 가능하도록 초기화
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);

    // 스테이지 번호 표시
    this.ctx.font = `${fontSize}px serif`;
    const stageNumber = this.currentStage - 999; // 스테이지 ID를 1부터 시작하는 번호로 변환
    const stageText = `Stage ${stageNumber}`;
    const stageTextX = 10;
    this.ctx.fillText(stageText, stageTextX, y);
  }
}

export default Score;
