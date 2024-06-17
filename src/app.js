import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';
import redisClient from './init/redis.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initSocket(server);

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    const assets = await loadGameAssets();
    console.log('Assets loaded successfully');

    if (!redisClient.status) {
      console.log('Redis client status:', redisClient.status);
      await redisClient.connect();
    }

    // // Redis 데이터베이스 초기화
    // await redisClient.flushall();  // 모든 데이터 삭제
    // console.log('Redis data flushed successfully.');
  } catch (error) {
    console.error('Failed to initialize game', error);
  }
});
