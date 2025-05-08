import { Worker } from 'worker_threads';
import path from 'path';

const NUM_PRODUCERS = 3;
const MIN = 1;
const MAX = 500;

for (let i = 0; i < NUM_PRODUCERS; i++) {
  new Worker(path.resolve(__dirname, 'producer.js'), {
    workerData: { min: MIN, max: MAX },
  });
}

new Worker(path.resolve(__dirname, 'consumer.js'), {
  workerData: { min: MIN, max: MAX },
});