import { getUsers, removeUser } from '../models/user.model.js';
import { CLIENT_VERSION } from '../constants.js';
import handlerMappings from './handlerMapping.js';
import { createStage } from '../models/stage.model.js';

export const handleDisconnect = (socket, uuid) => {
  removeUser(socket.id); // 사용자 삭제
  console.log(`User disconnected: ${socket.id}`);
  console.log('Current users:', getUsers());
};

export const handleConnection = (socket, userUUID) => {
  console.log(`New user connected: ${userUUID} with socket ID ${socket.id}`);
  console.log('Current users:', getUsers());

  // 스테이지 빈 배열 생성
  createStage(userUUID);

  socket.emit('connection', { uuid: userUUID });
};

export const handleEvent = (io, socket, data) => {
  // 서버에 저장된 클라이언트 배열에서 메세지로 받은 clientVersion을 확인합니다.
  if (!CLIENT_VERSION.includes(data.clientVersion)) {
    // 만약 일치하는 버전이 없다면 response 이벤트로 fail 결과를 전송합니다.
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }

  // 메세지로 오는 handlerId에 따라 handlerMappings 객체에서 적절한 핸들러를 찾습니다.
  const handler = handlerMappings[data.handlerId];
  // 적절한 핸들러가 없다면 실패처리합니다.
  if (!handler) {
    socket.emit('response', { status: 'fail', message: 'Handler not found' });
    return;
  }

  // 적절한 핸들러에 userID 와 payload를 전달하고 결과를 받습니다.
  const response = handler(data.userId, data.payload);
  // 만약 결과에 broadcast (모든 유저에게 전달)이 있다면 broadcast 합니다.
  if (response.broadcast) {
    io.emit('response', 'broadcast');
    return;
  }
  // 해당 유저에게 적절한 response를 전달합니다.
  socket.emit('response', response);
};
