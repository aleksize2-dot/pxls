import { create } from 'zustand'
import type { ModelConfig } from './types'

export type Generation = {
  id: string
  prompt: string
  status: 'pending' | 'processing' | 'done' | 'failed'
  result_urls?: string[]
  error?: string
  model_type: string
  created_at: string
}

type StoreState = {
  credits: number
  telegramUser: any | null
  activeGenerations: Generation[]
  setCredits: (credits: number) => void
  setTelegramUser: (user: any) => void
  addGeneration: (gen: Generation) => void
  updateGeneration: (id: string, updates: Partial<Generation>) => void
  removeGeneration: (id: string) => void
}

export const useStore = create<StoreState>((set) => ({
  credits: 0,
  telegramUser: null,
  activeGenerations: [],

  setCredits: (credits) => set({ credits }),
  setTelegramUser: (telegramUser) => set({ telegramUser }),
  
  addGeneration: (gen) => set((state) => ({ 
    activeGenerations: [gen, ...state.activeGenerations] 
  })),
  
  updateGeneration: (id, updates) => set((state) => ({
    activeGenerations: state.activeGenerations.map(g => 
      g.id === id ? { ...g, ...updates } : g
    )
  })),

  removeGeneration: (id) => set((state) => ({
    activeGenerations: state.activeGenerations.filter(g => g.id !== id)
  }))
}))
