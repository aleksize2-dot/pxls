import React from 'react'
import { useStore } from '../store'

export function History() {
  const activeGenerations = useStore(state => state.activeGenerations)
  
  // Also include finished items from the store
  const items = activeGenerations.filter(g => g.status === 'done' || g.status === 'failed')

  if (items.length === 0) {
    return (
      <div className="card glass" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h3 style={{ marginBottom: 10 }}>История пуста</h3>
        <p className="hint">Сгенерированные изображения и видео появятся здесь.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {items.map(item => (
        <div key={item.id} className="card glass history-card">
          <label className="label">{new Date(item.created_at).toLocaleString()}</label>
          <p style={{ marginBottom: 12, fontSize: 14 }}>{item.prompt}</p>
          
          {item.status === 'done' && item.result_urls?.[0] && (
            item.model_type === 'image-to-video' ? (
              <video src={item.result_urls[0]} controls className="history-img" autoPlay loop muted playsInline />
            ) : (
              <img src={item.result_urls[0]} alt="Result" className="history-img" />
            )
          )}
          
          {item.status === 'failed' && (
            <div style={{ color: 'var(--error)', fontSize: 14 }}>
              ❌ Ошибка: {item.error || 'Не удалось сгенерировать'}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
