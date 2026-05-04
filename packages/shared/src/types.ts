// ===== Generation Models =====

export interface ModelConfig {
  id: string
  name: string
  provider: string
  type: ModelType
  creditsCost: number
  size?: string
}

export type ModelType = 'text-to-image' | 'image-to-image' | 'image-to-video' | 'tools'
export type GenerationStatus = 'pending' | 'processing' | 'done' | 'failed'

// ===== Generation =====

export interface GenerationRequest {
  modelId: string
  prompt: string
  negativePrompt?: string
  imageUrl?: string
  size?: string
  quality?: string
  count?: number
  seed?: number
}

export interface GenerationTask {
  id: string
  userId: string
  modelId: string
  type: ModelType
  prompt: string
  status: GenerationStatus
  creditsSpent: number
  resultUrls: string[]
  error?: string
  createdAt: string
  completedAt?: string
}

// ===== Users =====

export interface User {
  id: string
  telegramId: number
  username?: string
  firstName?: string
  lastName?: string
  credits: number
  role: 'user' | 'admin'
  referrerId?: string
  createdAt: string
  lastActive: string
}

// ===== Payments =====

export interface Package {
  id: string
  name: string
  stars: number
  credits: number
  isPopular?: boolean
}

export interface Transaction {
  id: string
  userId: string
  type: 'purchase' | 'spend' | 'bonus' | 'refund' | 'referral'
  starsAmount?: number
  creditsAmount: number
  packageName?: string
  description: string
  createdAt: string
}

// ===== Referrals =====

export interface Referral {
  id: string
  referrerId: string
  referredId?: string
  referredUsername?: string
  bonusCredits: number
  status: 'pending' | 'completed'
  createdAt: string
}

// ===== API =====

export interface ApiResponse<T = unknown> {
  ok: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  limit: number
}
