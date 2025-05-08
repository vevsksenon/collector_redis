import { workerData } from 'worker_threads';
import Redis from 'ioredis';
import fs from 'fs';
import path from 'path';

const redis = new Redis();
const { min, max } = workerData as { min: number; max: number };

interface ResultEntry {
  value: number;
  date: string;
}

const allNumbers = new Set<number>();
for (let i = min; i <= max; i++) {
  allNumbers.add(i);
}

const foundNumbers = new Map<number, string>();
const startTime = Date.now();

function getAvailableFilename(baseName: string, ext: string): string {
  let index = 0;
  let filename = `${baseName}.${ext}`;
  while (fs.existsSync(path.resolve(__dirname, filename))) {
    index++;
    filename = `${baseName}${index}.${ext}`;
  }
  return filename;
}

console.log(`Ищем числа в диапозоне от ${min} до ${max}`);

async function consume(): Promise<void> {
  let lastId = '0';

  while (foundNumbers.size < allNumbers.size) {
    const res = await redis.xread('BLOCK', 1000, 'STREAMS', 'number_stream', lastId);
    if (!res) continue;

    for (const [, entries] of res) {
      for (const [id, fields] of entries) {
        lastId = id;
        const value = parseInt(fields[1], 10);

        if (!foundNumbers.has(value)) {
          foundNumbers.set(value, new Date().toISOString());
        }
      }
    }
  }

  const timeSpent = Date.now() - startTime;
  const numbersGenerated: ResultEntry[] = Array.from(foundNumbers.entries()).map(([value, date]) => ({ value, date }));

  const result = { timeSpent, numbersGenerated };

  // ... где-то в consumer.ts после получения результата:
  const fileName = getAvailableFilename('result', 'json');
  fs.writeFileSync(path.resolve(__dirname, fileName), JSON.stringify(result, null, 2));
  console.log(`✅ Все числа найдены. Результат записан в result.json`);
  process.exit(0);
}

consume();
