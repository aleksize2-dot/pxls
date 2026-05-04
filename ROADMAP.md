# PXLS Roadmap

> **Версия:** v1.0.0  
> **Команда:** Бро (руководитель) · Claw (архитектор) · Ант (кодер)

---

## Фаза 0 — Фундамент (день 1)

- [x] Создать GitHub репозиторий `pxls`
- [x] Настроить Supabase проект
- [ ] Установить зависимости (pnpm, turbo, hono, telegraf, react)
- [ ] Настроить CI/CD (.github/workflows)
- [ ] Создать `.env` с ключами (kie, supabase, tg bot)
- [ ] Написать init SQL схемы БД

## Фаза 1 — База + Бот (дни 2–4)

### Бот (Telegraf)
- [ ] Команда /start → приветствие + кнопка "Открыть PXLS"
- [ ] Telegram Invoice API для покупки Stars
- [ ] Callback: подтверждение покупки → начисление PX
- [ ] Уведомления о завершении генерации
- [ ] Реферальная ссылка

### База данных (Supabase)
- [ ] Таблицы: users, generations, transactions, packages, model_pricing, referrals
- [ ] Row Level Security (RLS) политики
- [ ] Индексы на telegram_id, user_id, created_at
- [ ] Триггер: обновление last_active

## Фаза 2 — TMA Frontend (дни 5–10)

### Основа
- [ ] Vite + React + TypeScript проект
- [ ] Telegram WebApp SDK интеграция
- [ ] initData авторизация
- [ ] Тёмная тема (Telegram theme variables)
- [ ] Локализация (русский + опционально английский)

### Вкладки
- [ ] **Text-to-Image** — выбор модели, промпт, настройки (size, steps), генерация
- [ ] **Image-to-Image** — выбор модели, промпт, загрузка референса, настройки
- [ ] **Image-to-Video** — загрузка изображения + промпт, настройки
- [ ] **Инструменты** — Upscale, Remove Background, Image Edit

### Компоненты UI
- [ ] Галерея результатов (сетка + превью)
- [ ] История генераций (лента с фильтром)
- [ ] Профиль (баланс PX, история транзакций)
- [ ] Магазин пакетов (список + кнопка купить)
- [ ] Уведомления (Toast)
- [ ] Лоадер генерации (статус + прогресс)
- [ ] Реферальная страница

## Фаза 3 — API Backend (дни 8–14)

### Users & Auth
- [ ] POST /api/auth — верификация initData
- [ ] GET /api/user — профиль + баланс
- [ ] PATCH /api/user — настройки

### Generation
- [ ] POST /api/generate — создание задачи
- [ ] GET /api/generations — история
- [ ] GET /api/generations/:id — статус
- [ ] POST /api/callback — webhook от KIE
- [ ] Upload файлов на Supabase Storage

### Payments
- [ ] POST /api/packages — список пакетов
- [ ] Bot: Invoice → Payment → Credits
- [ ] Webhook: обновление баланса
- [ ] GET /api/transactions — история

### Partner Program
- [ ] POST /api/referrals — создание реферального кода
- [ ] GET /api/referrals — статистика
- [ ] Автоначисление бонусов при активации

## Фаза 4 — KIE Integration (дни 12–16)

- [ ] Прокси к KIE API (скрыть ключ)
- [ ] Асинхронная очередь генераций
- [ ] Обработка callbackUrl от KIE
- [ ] Retry-логика при ошибках
- [ ] Rate limiting (лимит одновременных генераций)
- [ ] Таймауты (особенно video — до 10 минут)
- [ ] Логирование всех запросов (structured logs)

### Модели
- [ ] Wan 2.7 (txt2img, img2img, img2vid)
- [ ] Seedream 4.5 / 5.0
- [ ] Grok Imagine
- [ ] GPT Image 2 (1K, 2K, 4K)
- [ ] Qwen (txt2img, img2img, edit)
- [ ] Google Nano Banana (1K, 2K, 4K)
- [ ] Flux 2 Pro / Flex
- [ ] Ideogram v3
- [ ] Hailuo / Seedance (video)
- [ ] Topaz Upscaler

## Фаза 5 — Админка (дни 15–18)

- [ ] Отдельная React-страница (доступ по admin role)
- [ ] Дашборд: DAU, генераций, revenue
- [ ] Просмотр пользователей + их баланс
- [ ] Мануальное начисление/списание кредитов
- [ ] Рассылка (inline телеграм)
- [ ] Партнёрка: просмотр рефералов, выплаты
- [ ] Логи генераций (успех/ошибка)
- [ ] Статистика по моделям

## Фаза 6 — Запуск (дни 19–21)

- [ ] Деплой API на VPS (Docker + PM2/hypervisor)
- [ ] Деплой TMA на Vercel/Cloudflare
- [ ] Деплой бота на VPS
- [ ] Настройка домена + SSL
- [ ] Финальное тестирование всех моделей
- [ ] Оптимизация (кэширование, батчинг)
- [ ] Мониторинг (ошибки, производительность)
- [ ] Realese 🚀

## Post-MVP

- [ ] Избранное (сохранение генераций)
- [ ] Prompt templates (предустановленные промпты)
- [ ] AI апскейл результатов
- [ ] Batch генерация (несколько вариантов)
- [ ] Telegram Ads
- [ ] Веб-версия (без Telegram)
