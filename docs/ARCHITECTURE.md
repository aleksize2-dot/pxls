# PXLS Architecture

> AI Image & Video Generator — Telegram Mini App

## 🏗️ Overview

```
┌─────────────────────────────────────────────────┐
│                  Telegram                        │
│  ┌─────────────┐        ┌───────────────────┐   │
│  │   Bot       │───────▶│  TMA (WebApp)     │   │
│  │ (Telegraf)  │        │  React + Vite     │   │
│  └──────┬──────┘        └─────────┬─────────┘   │
└─────────┼─────────────────────────┼─────────────┘
          │                         │
          ▼                         ▼
┌──────────────────────────────────────────────┐
│           API (Hono / Fastify)                │
│  ┌─────────┐ ┌─────────┐ ┌──────────────┐   │
│  │ Auth    │ │ Gen     │ │ Payment      │   │
│  │ (TMA)  │ │ Queue   │ │ (Stars)      │   │
│  └─────────┘ └────┬────┘ └──────┬───────┘   │
└───────────────────┼─────────────┼────────────┘
                    │             │
                    ▼             ▼
┌──────────────────┐   ┌──────────────────────┐
│   KIE.ai API     │   │   Supabase           │
│   /jobs/create   │   │   ┌──────────────┐   │
│   callbackUrl    │   │   │ Auth (anon)   │   │
│                  │   │   │ PostgreSQL    │   │
│                  │   │   │ Realtime      │   │
│                  │   │   │ Storage       │   │
└──────────────────┘   │   └──────────────┘   │
                       └──────────────────────┘
```

## 🧱 Stack

| Layer | Tech | Purpose |
|-------|------|---------|
| **Bot** | Telegraf (TypeScript) | Telegram bot — entry point, auth, invoices |
| **TMA** | React + Vite + TypeScript | Mini App UI — tabs, prompts, results |
| **API** | Hono (TypeScript) | REST API — generation, users, payments |
| **DB** | Supabase (PostgreSQL) | Users, generations, transactions, referrals |
| **AI** | KIE.ai API | Image & video generation (Wan, Grok, GPT, Qwen…) |
| **Queue** | Supabase + Webhooks | Async generation pipeline |
| **Storage** | Supabase Storage | User-uploaded images (temporary) |

## 📁 Directory Structure

```
pxls/
├── apps/
│   ├── bot/          # Telegram bot (Telegraf)
│   ├── api/          # Hono REST API
│   └── tma/          # React TMA frontend
├── packages/
│   ├── shared/       # Shared types, constants, helpers
│   ├── db/           # Database schema, migrations, types
│   └── config/       # Shared configuration (env, models, pricing)
├── docs/             # Documentation
└── .github/          # CI/CD workflows
```

## 🔄 Generation Flow

```
1. User opens TMA → selects model → writes prompt → clicks Generate
2. TMA → POST /api/generate { model, prompt, files }
3. API checks credits → deducts → uploads files → KIE request
4. API returns { taskId, status: "processing" } → TMA shows spinner
5. KIE completes → POST callbackUrl → API updates DB
6. Supabase Realtime → TMA gets result automagically
7. TMA shows result (image/video) + option to share / download

For long generations (video): bot sends notification too
```

## 🎯 Key Design Decisions

- **Single KIE API key** on backend — never exposed to frontend
- **All generation async** via webhooks — no polling
- **Realtime updates** via Supabase Realtime (WebSocket) — instant UX
- **Credits in PX** — internal unit, converted from Stars
- **Authentication** via Telegram initData — no passwords
- **x3 pricing** — 3x KIE cost for margin
