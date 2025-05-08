import { workerData } from 'worker_threads';
import Redis from 'ioredis';

const redis = new Redis();
const { min, max } = workerData as { min: number; max: number };

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function produce(): Promise<void> {
  await redis.del('number_stream');
  console.log('🔄 Очередь number_stream очищена');

  while (true) {
    const num = getRandomInt(min, max);
    await redis.xadd('number_stream', '*', 'value', num.toString());
    await new Promise(res => setTimeout(res, 10));
  }
}

produce();
