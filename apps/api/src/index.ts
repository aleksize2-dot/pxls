import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { parseEnv, MODEL_TABS, MODELS, PACKAGES, SIGNUP_BONUS } from '@pxls/config'
import type { ApiResponse } from '@pxls/shared'

const env = parseEnv()
const app = new Hono()

// Middleware
app.use('*', cors())
app.use('*', logger())

// Health check
app.get('/', (c) => c.json({ ok: true, service: 'pxls-api', ts: Date.now() }))
app.get('/health', (c) => c.json({ ok: true, ts: Date.now() }))

// Packages
app.get('/api/packages', (c) => {
  return c.json<ApiResponse>({
    ok: true,
    data: PACKAGES.map((p, i) => ({ id: `pkg-${i}`, ...p })),
  })
})

// Models & pricing
app.get('/api/models', (c) => {
  return c.json<ApiResponse>({
    ok: true,
    data: { tabs: MODEL_TABS, models: MODELS },
  })
})

// Generation
app.post('/api/generate', async (c) => {
  // TODO: auth via initData
  // TODO: validate credits
  // TODO: call KIE API
  // TODO: return task

  return c.json<ApiResponse>({
    ok: false,
    error: 'Not implemented',
  }, 501)
})

// Generation status
app.get('/api/generations/:id', async (c) => {
  // TODO: query DB

  return c.json<ApiResponse>({
    ok: false,
    error: 'Not implemented',
  }, 501)
})

// KIE webhook callback
app.post('/api/callback/kie', async (c) => {
  // TODO: process KIE callback
  return c.json({ ok: true })
})

// User profile
app.get('/api/user', async (c) => {
  // TODO: auth, return user data
  return c.json<ApiResponse>({
    ok: false,
    error: 'Not implemented',
  }, 501)
})

console.log(`🚀 PXLS API starting on :${env.PORT}`)
serve({
  fetch: app.fetch,
  port: env.PORT,
})
