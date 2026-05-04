// ============================================
// PXLS Pricing Configuration
// All prices in PX (internal credits)
// Rate: 1 ⭐ = 4 PX (at x3 markup vs KIE cost)
// ============================================

import type { ModelConfig } from '@pxls/shared'

export const CREDITS_PER_STAR = 6
export const SIGNUP_BONUS = 30

export const PACKAGES = [
  { name: '🥉 Start', stars: 50, credits: 300 },
  { name: '🥈 Standard', stars: 200, credits: 1200, isPopular: true },
  { name: '🥇 Pro', stars: 500, credits: 3000 },
  { name: '💎 Ultra', stars: 1000, credits: 6000 },
] as const

// ============================================
// Models catalog — each model with its PX cost
// Cost = KIE credit × 6 (to match Star → PX rate)
// ============================================

export const MODELS: Record<string, ModelConfig> = {
  // === Budget tier ===
  'qwen/z-image': {
    id: 'qwen/z-image', name: 'Qwen Z-Image', provider: 'Qwen',
    type: 'text-to-image', creditsCost: Math.ceil(0.8 * 6),
  },

  // === Standard image ===
  'wan/2-7-image': {
    id: 'wan/2-7-image', name: 'Wan 2.7', provider: 'Wan',
    type: 'text-to-image', creditsCost: Math.ceil(4.8 * 6),
  },
  'wan/2-7-image-pro': {
    id: 'wan/2-7-image-pro', name: 'Wan 2.7 Pro', provider: 'Wan',
    type: 'text-to-image', creditsCost: Math.ceil(12 * 6),
  },
  'seedream/4-5': {
    id: 'seedream/4-5', name: 'Seedream 4.5', provider: 'ByteDance',
    type: 'text-to-image', creditsCost: Math.ceil(6.5 * 6),
  },
  'seedream/5-lite': {
    id: 'seedream/5-lite', name: 'Seedream 5.0 Lite', provider: 'ByteDance',
    type: 'text-to-image', creditsCost: Math.ceil(5.5 * 6),
  },
  'gpt-image-2/1k': {
    id: 'gpt-image-2/1k', name: 'GPT Image 2 (1K)', provider: 'OpenAI',
    type: 'text-to-image', creditsCost: Math.ceil(6 * 6),
  },
  'gpt-image-2/2k': {
    id: 'gpt-image-2/2k', name: 'GPT Image 2 (2K)', provider: 'OpenAI',
    type: 'text-to-image', creditsCost: Math.ceil(10 * 6),
  },
  'gpt-image-2/4k': {
    id: 'gpt-image-2/4k', name: 'GPT Image 2 (4K)', provider: 'OpenAI',
    type: 'text-to-image', creditsCost: Math.ceil(16 * 6),
  },
  'grok/imagine': {
    id: 'grok/imagine', name: 'Grok Imagine', provider: 'Grok',
    type: 'text-to-image', creditsCost: Math.ceil(5 * 6),
  },
  'flux/pro-1k': {
    id: 'flux/pro-1k', name: 'Flux 2 Pro (1K)', provider: 'Black Forest Labs',
    type: 'text-to-image', creditsCost: Math.ceil(5 * 6),
  },
  'flux/flex-1k': {
    id: 'flux/flex-1k', name: 'Flux 2 Flex (1K)', provider: 'Black Forest Labs',
    type: 'text-to-image', creditsCost: Math.ceil(14 * 6),
  },
  'qwen/image': {
    id: 'qwen/image', name: 'Qwen Image', provider: 'Qwen',
    type: 'text-to-image', creditsCost: Math.ceil(4 * 6),
  },
  'google/nano-banana': {
    id: 'google/nano-banana', name: 'Nano Banana', provider: 'Google',
    type: 'text-to-image', creditsCost: Math.ceil(4 * 6),
  },
  'google/nano-banana-2/1k': {
    id: 'google/nano-banana-2/1k', name: 'Nano Banana 2 (1K)', provider: 'Google',
    type: 'text-to-image', creditsCost: Math.ceil(8 * 6),
  },
  'google/nano-banana-2/4k': {
    id: 'google/nano-banana-2/4k', name: 'Nano Banana 2 (4K)', provider: 'Google',
    type: 'text-to-image', creditsCost: Math.ceil(18 * 6),
  },
  'google/imagen4': {
    id: 'google/imagen4', name: 'Imagen 4 Fast', provider: 'Google',
    type: 'text-to-image', creditsCost: Math.ceil(4 * 6),
  },
  'ideogram/v3': {
    id: 'ideogram/v3', name: 'Ideogram V3', provider: 'Ideogram',
    type: 'text-to-image', creditsCost: Math.ceil(7 * 6),
  },
  'openai/4o-image': {
    id: 'openai/4o-image', name: 'OpenAI 4o Image', provider: 'OpenAI 4o',
    type: 'text-to-image', creditsCost: Math.ceil(6 * 6),
  },

  // === Premium image ===
  'google/nano-banana-pro/4k': {
    id: 'google/nano-banana-pro/4k', name: 'Nano Banana Pro (4K)', provider: 'Google',
    type: 'text-to-image', creditsCost: Math.ceil(24 * 6),
  },

  // === Image-to-Video ===
  'wan/2-7-image-to-video': {
    id: 'wan/2-7-image-to-video', name: 'Wan 2.7 Video', provider: 'Wan',
    type: 'image-to-video', creditsCost: Math.ceil(15 * 6),
  },
  'grok/image-to-video': {
    id: 'grok/image-to-video', name: 'Grok Video', provider: 'Grok',
    type: 'image-to-video', creditsCost: Math.ceil(15 * 6),
  },

  // === Tools ===
  'remove-bg': {
    id: 'remove-bg', name: 'Remove Background', provider: 'Recraft',
    type: 'tools', creditsCost: Math.ceil(1 * 6),
  },
  'crisp-upscale': {
    id: 'crisp-upscale', name: 'Crisp Upscale', provider: 'Recraft',
    type: 'tools', creditsCost: Math.ceil(0.5 * 6),
  },
  'topaz-upscale/2k': {
    id: 'topaz-upscale/2k', name: 'Topaz Upscaler (2K)', provider: 'Topaz',
    type: 'tools', creditsCost: Math.ceil(10 * 6),
  },
}

// ============================================
// Tabs configuration
// ============================================

export const MODEL_TABS = [
  {
    id: 'text-to-image',
    label: '🖼️ Text → Image',
    models: Object.values(MODELS).filter(m => m.type === 'text-to-image'),
  },
  {
    id: 'image-to-video',
    label: '🎬 Image → Video',
    models: Object.values(MODELS).filter(m => m.type === 'image-to-video'),
  },
  {
    id: 'tools',
    label: '🛠️ Инструменты',
    models: Object.values(MODELS).filter(m => m.type === 'tools'),
  },
] as const
