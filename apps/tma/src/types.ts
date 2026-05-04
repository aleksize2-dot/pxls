export interface ModelConfig {
  id: string
  name: string
  provider: string
  type: string
  creditsCost: number
}

export interface Tab {
  id: string
  label: string
  models: ModelConfig[]
}
