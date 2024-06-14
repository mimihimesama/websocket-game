import { getUsers, removeUser } from '../models/user.model.js';
import { CLIENT_VERSION } from '../constants.js';
import handlerMappings from './handlerMapping.js';
import { createStage } from '../models/stage.model.js';
import { getHighScores } from '../models/score.model.js';

export const handleConnection = async (socket, userUUID) => {
  console.log(`New user connected: ${userUUID} with socket ID ${socket.id}`);
  console.log('Current users:', await getUsers());

  // 스테이지 빈 배열 생성
  createStage(userUUID);

  // 역대 최고 점수 반환
  const highScores = await getHighScores(1);

  socket.emit('connection', { uuid: userUUID, ...(highScores && { highScore: highScores[0] }) });
};

export const handleDisconnect = async (socket, uuid) => {
  console.log(`User disconnected: ${uuid}`);
};

export const handleEvent = async (io, socket, data) => {
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  const handler = handlerMappings[data.handlerId];
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  const response = await handler(data.userId, data.payload, io);

  socket.emit('response', response);
};
