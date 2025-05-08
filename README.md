# 🧠 Collector Redis

Приложение на Node.js + TypeScript:

- Несколько производителей генерируют случайные числа в заданном диапазоне и пишут их в Redis-очередь.
- Один потребитель вычитывает числа, сохраняет уникальные значения и дату их получения.
- Когда собраны все значения из диапазона, данные сохраняются в JSON-файл `result.json` (или `result1.json`, `result2.json`, ... если файл уже существует).

---

## 🚀 Быстрый старт

# Клонируем репозиторий
`git clone https://github.com/vevsksenon/collector_redis.git`

`cd collector_redis`

# Устанавливаем зависимости
npm install

# Запускаем Redis через Docker или Brew (если он не установлен локально)
- docker run -d --name redis -p 6379:6379 redis
- или ставим через Brew  
`brew install redis`  
и запускаем  
`brew services start redis`

# Проверяем Redis
redis-cli ping  
Должен вернуть: PONG

# Компилируем проект
npx tsc

# Запускаем
node dist/index.js

## Конфигурация 

const NUM_PRODUCERS = 3;  Кол-во производителей  
const MIN = 1;            Минимальное значение диапазона  
const MAX = 500;          Максимальное значение диапазона
