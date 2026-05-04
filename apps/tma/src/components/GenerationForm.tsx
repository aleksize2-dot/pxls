import React, { useState } from 'react'
import { useStore } from '../store'
import { MODELS } from '@pxls/config'

export function GenerationForm({ type }: { type: 'text-to-image' | 'image-to-video' | 'tools' }) {
  const models = Object.values(MODELS).filter(m => m.type === type)
  const [selectedModel, setSelectedModel] = useState(models[0]?.id || '')
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const addGeneration = useStore(state => state.addGeneration)
  const activeGenerations = useStore(state => state.activeGenerations)

  const currentGen = activeGenerations.find(g => g.status === 'processing' || g.status === 'pending')

  const handleGenerate = async () => {
    if (!prompt.trim() || !selectedModel) return
    setIsGenerating(true)

    try {
      // In a real app, this should call our Hono API (Phase 3)
      // For now, we mock the API call and create a local pending generation
      const mockId = Math.random().toString(36).substring(7)
      
      addGeneration({
        id: mockId,
        prompt,
        model_type: type,
        status: 'processing',
        created_at: new Date().toISOString()
      })

      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Here you'd normally await the API, which returns { taskId }
      setPrompt('')
    } catch (e) {
      console.error(e)
    } finally {
      setIsGenerating(false)
    }
  }

  // If there's an active generation, show the loader instead of the form
  if (currentGen) {
    return (
      <div className="card glass" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div className="spinner" />
        </div>
        <h3 style={{ marginBottom: 10 }}>Идёт генерация...</h3>
        <p className="hint">
          {currentGen.prompt.length > 30 ? currentGen.prompt.slice(0, 30) + '...' : currentGen.prompt}
        </p>
        <p className="hint" style={{ marginTop: 20 }}>
          Это может занять от 10 секунд до нескольких минут в зависимости от модели. Мы пришлём уведомление в бота!
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="card glass">
        <label className="label">Модель</label>
        <select
          className="model-select"
          value={selectedModel}
          onChange={e => setSelectedModel(e.target.value)}
        >
          {models.map((m: any) => (
            <option key={m.id} value={m.id}>
              {m.name} — {m.creditsCost} PX
            </option>
          ))}
        </select>
      </div>

      <div className="card glass" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <label className="label">
          {type === 'text-to-image' ? 'Опишите изображение' : 
           type === 'image-to-video' ? 'Опишите анимацию' : 'Параметры утилиты'}
        </label>
        
        {/* Placeholder for image upload if image-to-video */}
        {type === 'image-to-video' && (
          <div style={{ border: '1px dashed var(--border)', padding: 20, textAlign: 'center', borderRadius: 12, marginBottom: 16, color: 'var(--text-secondary)' }}>
            📷 Загрузить исходное фото
          </div>
        )}

        <textarea
          className="prompt-input"
          placeholder={type === 'text-to-image' ? "Красивый киберпанк город будущего, неон..." : "Анимация воды, волны..."}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      <button
        className="btn-primary"
        disabled={!prompt.trim() || isGenerating}
        onClick={handleGenerate}
      >
        {isGenerating ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : '🚀 Сгенерировать'}
      </button>
    </>
  )
}
