# 🎨 PXLS — AI Image & Video Generator

> Telegram Mini App для генерации изображений и видео через нейросети.

![Telegram](https://img.shields.io/badge/Telegram-Mini%20App-26A5E4?logo=telegram)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase)

## ✨ Возможности

- **Text-to-Image** — генерация изображений по текстовому описанию
- **Image-to-Image** — референс + промпт → новое изображение
- **Image-to-Video** — анимируй статичные изображения
- **Инструменты** — Upscale, Remove Background, Image Edit
- **10+ моделей** — Wan, Seedream, Grok, GPT Image, Qwen, Flux, Nano Banana и др.
- **Telegram Stars** — покупка кредитов через Telegram

## 🧰 Стек

| Технология | Назначение |
|-----------|-----------|
| **Hono** (TypeScript) | Backend API |
| **Telegraf** (TypeScript) | Telegram Bot |
| **React + Vite** (TypeScript) | TMA Frontend |
| **Supabase** | PostgreSQL, Auth, Realtime, Storage |
| **KIE.ai** | Провайдер AI генерации |
| **Turbo** | Monorepo tooling |

## 🚀 Быстрый старт

```bash
# Установка зависимостей
pnpm install

# Настройка переменных окружения
cp .env.example .env
# Заполни SUPABASE_URL, SUPABASE_ANON_KEY, KIE_API_KEY, TG_BOT_TOKEN

# Запуск в режиме разработки
pnpm dev
```

## 📦 Структура

```
apps/
├── bot/     — Telegram bot (точка входа, инвойсы, уведомления)
├── api/     — Hono REST API (генерация, юзеры, платежи)
└── tma/     — React TMA (интерфейс пользователя)
```

## 👥 Команда

- **Бро** — руководитель проекта
- **Claw** — архитектор системы
- **Ант** — разработчик
