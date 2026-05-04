# 👨‍💻 PXLS — Инструкция для разработчика

**Привет, Ант!** 🦞

Этот документ — твой onboarding. Прочитай полностью перед тем как начинать кодить.

---

## 🎯 Что мы строим

Telegram Mini App (TMA) для генерации изображений и видео через нейросети.

**Пользователь:**
1. Открывает бота → нажимает «Открыть PXLS»
2. Выбирает модель (Wan, Grok, GPT Image, Seedream...)
3. Пишет промпт (текст или загружает изображение)
4. Жмёт «Сгенерировать»
5. Ждёт результат (от секунд до минут, для видео до 10 мин)
6. Скачивает/делится результатом

**Монетизация:** Telegram Stars → внутренние кредиты (PX)
**Аудитория:** 🇷🇺 русскоязычные + СНГ

---

## 🧰 Стек

| Компонент | Технология | Почему |
|-----------|-----------|--------|
| **TMA Frontend** | React + Vite + TypeScript | Быстро, современно, TMA SDK |
| **Telegram Bot** | Telegraf (TypeScript) | Точка входа, инвойсы, уведомления |
| **Backend API** | Hono (TypeScript) | Лёгкий, быстрый, TypeScript везде |
| **База данных** | Supabase (PostgreSQL) | Auth, Realtime, Storage — всё вместе |
| **AI Генерация** | KIE.ai (прокси-API) | Wan, Grok, GPT Image, Seedream и 10+ моделей |
| **Monorepo** | pnpm + Turborepo | Единый репозиторий, быстрые сборки |

**Почему TypeScript на всём стеке?** Один язык — меньше когнитивной нагрузки, общие типы между фронтом и бэком.

---

## 📁 Структура проекта

```
pxls/
├── apps/
│   ├── bot/              # 🤖 Telegram бот (Telegraf)
│   │   └── src/index.ts  #    — /start, инвойсы, уведомления
│   ├── api/              #   ⚙️ Backend API (Hono)
│   │   └── src/index.ts  #    — генерация, юзеры, вебхуки
│   └── tma/              #   🎨 TMA Frontend (React + Vite)
│       └── src/
│           ├── App.tsx    #    — главный компонент с вкладками
│           ├── index.css  #    — тёмная тема
│           └── main.tsx   #    — точка входа
├── packages/
│   ├── shared/            # 📦 Общие типы и утилиты
│   ├── db/                # 🗄️ SQL схема и миграции
│   └── config/            # ⚙️ Конфиги: env, цены, модели
├── docs/
│   ├── ARCHITECTURE.md    # Полная архитектура системы
│   ├── ROADMAP.md         # План работ по фазам
│   └── FOR_DEV.md         # ← ты здесь
└── README.md
```

---

## 🚀 С чего начать (Фаза 0)

### Шаг 1. Склонировать и настроить

```bash
git clone https://github.com/aleksize2-dot/pxls.git
cd pxls

# Установка pnpm (если нет)
npm install -g pnpm

# Установка зависимостей
pnpm install
```

### Шаг 2. Создать .env

Скопируй `.env.example` в `.env` и заполни:

```env
# Supabase (у тебя уже есть доступ)
SUPABASE_URL=https://iydbitfaguhhyxbhjirr.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5ZGJpdGZhZ3VoaHl4YmhqaXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4OTUxNTUsImV4cCI6MjA5MzQ3MTE1NX0.RCgYBqCXmqluDnzDycBNAW_77BgsmvP95EPeBcID9lU
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5ZGJpdGZhZ3VoaHl4YmhqaXJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg5NTE1NSwiZXhwIjoyMDkzNDcxMTU1fQ.lrn0t3NNR_D3dWE-tzzcRCI9ZorbduzP5OpuwuiaT0c

# KIE API (генерация изображений/видео)
KIE_API_KEY=d9bfbe13eee289f0a12d05e407950d70
KIE_API_URL=https://api.kie.ai

# Telegram бот
TG_BOT_TOKEN=8462560250:AAFeq2QJBaGMabSU_a4t6gLsTF-DplmnDX0
```

### Шаг 3. Создать таблицы в Supabase

Открой Supabase Dashboard → **SQL Editor** → вставь содержимое `packages/db/src/seed.sql` → Run.

Это создаст 7 таблиц + RLS политики + стартовые пакеты кредитов.

### Шаг 4. Проверить что всё работает

```bash
# Запуск API
cd apps/api && pnpm dev

# Запуск TMA
cd apps/tma && pnpm dev

# Запуск бота
cd apps/bot && pnpm dev
```

---

## 📋 Очередность работ (сокращённый ROADMAP)

### Фаза 1 — База + Бот (сделать в первую очередь)
- [ ] **SQL готов** — таблицы уже есть в `packages/db/src/seed.sql`
- [ ] **Бот:** /start → кнопка "Открыть PXLS"
- [ ] **Бот:** Telegram Invoice API (покупка Stars)
- [ ] **Бот:** Callback после оплаты → начисление PX
- [ ] **Бот:** Уведомления о завершении генерации

### Фаза 2 — TMA Frontend (самая объёмная часть)
- [ ] Подключить Telegram WebApp SDK + initData авторизация
- [ ] Вкладка **Text-to-Image** — выбор модели, промпт, настройки
- [ ] Вкладка **Image-to-Video** — загрузка фото + промпт
- [ ] Вкладка **Инструменты** — Remove BG, Upscale
- [ ] Компоненты: галерея, история, профиль, магазин пакетов
- [ ] Лоадер со статусом генерации (realtime)

### Фаза 3 — API Backend
- [ ] Auth: верификация initData
- [ ] Generation: POST /api/generate, GET /api/generations
- [ ] Callback: POST /api/callback/kie — вебхук от KIE
- [ ] Payments: список пакетов, обработка Stars
- [ ] Referrals: реферальная система

### Фаза 4 — KIE Integration
- [ ] Прокси к KIE (скрыть ключ от клиента)
- [ ] Подключить все модели из `packages/config/src/pricing.ts`
- [ ] Обработка ошибок, retry, таймауты
- [ ] Rate limiting

### Фаза 5 — Админка
- [ ] Дашборд: DAU, revenue, генерации
- [ ] Пользователи + балансы
- [ ] Рассылка
- [ ] Партнёрка

---

## 🔄 Как работает генерация

```
Пользователь → TMA → POST /api/generate
  → API проверяет PX → списывает → вызывает KIE
  → API возвращает taskId, статус "processing"
  → Пользователь видит спиннер

KIE завершил → POST /api/callback/kie (вебхук)
  → API обновляет запись в БД
  → Supabase Realtime → TMA получает результат
  → (опционально) бот шлёт уведомление
```

**Все модели KIE используют единый endpoint:** `POST /api/v1/jobs/createTask`
**Проверка статуса:** `GET /api/v1/jobs/getTaskResult` (или callbackUrl)

Документация KIE в `/home/moltbot/pxles/` — там все модели с примерами.

---

## 💰 Экономика проекта

- 1 ⭐ (Telegram Star) ≈ $0.01
- 1 ⭐ = **6 PX** (внутренние кредиты)
- Мы продаём с **x3 наценкой** к себестоимости KIE

**Пакеты:**
| Пакет | ⭐ | PX |
|-------|-----|-----|
| 🥉 Start | 50 | 300 |
| 🥈 Standard | 200 | 1200 |
| 🥇 Pro | 500 | 3000 |
| 💎 Ultra | 1000 | 6000 |

**Бонус за регистрацию:** 30 PX

Цены моделей — в `packages/config/src/pricing.ts`. Если надо добавить/изменить — правь там.

---

## 🤝 Контакты

- **Бро** — руководитель, вопросы по продукту и приоритетам
- **Claw** — архитектор, вопросы по архитектуре и дизайну решений
- **Ты — Ант** — кодер, ты воплощаешь 🫡

---

**Важно:** если что-то непонятно в архитектуре — сначала прочитай `docs/ARCHITECTURE.md`. Если остались вопросы — спрашивай Бро или Claw.

Удачи! 🦞🚀
