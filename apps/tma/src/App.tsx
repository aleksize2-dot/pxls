import React, { useEffect, useState } from 'react'
import type { ModelConfig, Tab } from './types'

type Tab = { id: string; label: string; models: ModelConfig[] }

// TODO: replace with API call
const SAMPLE_TABS: Tab[] = [
  {
    id: 'text-to-image',
    label: '🖼️ Text → Image',
    models: [
      { id: 'wan/2-7-image', name: 'Wan 2.7', provider: 'Wan', type: 'text-to-image', creditsCost: 30 },
      { id: 'gpt-image-2/1k', name: 'GPT Image 2 (1K)', provider: 'OpenAI', type: 'text-to-image', creditsCost: 36 },
      { id: 'seedream/4-5', name: 'Seedream 4.5', provider: 'ByteDance', type: 'text-to-image', creditsCost: 39 },
    ],
  },
  {
    id: 'image-to-video',
    label: '🎬 Image → Video',
    models: [
      { id: 'wan/2-7-image-to-video', name: 'Wan 2.7 Video', provider: 'Wan', type: 'image-to-video', creditsCost: 90 },
    ],
  },
]

function App() {
  const [activeTab, setActiveTab] = useState(SAMPLE_TABS[0].id)
  const [selectedModel, setSelectedModel] = useState(SAMPLE_TABS[0].models[0].id)
  const [prompt, setPrompt] = useState('')

  const currentTab = SAMPLE_TABS.find(t => t.id === activeTab)!
  const currentModel = currentTab.models.find(m => m.id === selectedModel)

  useEffect(() => {
    // Init Telegram WebApp
    const tg = (window as any).Telegram?.WebApp
    if (tg) {
      tg.expand()
      tg.setHeaderColor('#1c1c1c')
      tg.setBackgroundColor('#1c1c1c')
    }
  }, [])

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1 className="logo">PXLS</h1>
        <span className="badge">{currentModel?.creditsCost} PX</span>
      </header>

      {/* Tabs */}
      <nav className="tabs">
        {SAMPLE_TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab.id)
              setSelectedModel(tab.models[0].id)
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Model selector */}
      <select
        className="model-select"
        value={selectedModel}
        onChange={e => setSelectedModel(e.target.value)}
      >
        {currentTab.models.map(m => (
          <option key={m.id} value={m.id}>
            {m.name} — {m.creditsCost} PX ({m.provider})
          </option>
        ))}
      </select>

      {/* Prompt */}
      <textarea
        className="prompt-input"
        placeholder="Введите промпт (на русском или английском)..."
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        rows={4}
      />

      {/* Generate button */}
      <button
        className="generate-btn"
        disabled={!prompt.trim()}
        onClick={() => {
          // TODO: implement
          console.log('Generate', { model: selectedModel, prompt })
        }}
      >
        🚀 Сгенерировать
      </button>

      {/* TODO: Result area */}
      <div className="results">
        <p className="hint">Результаты появятся здесь</p>
      </div>
    </div>
  )
}

export default App
