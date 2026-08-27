import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/**
 * アプリケーションのエントリーポイント。
 * DOMの #root 要素にReactアプリケーションをマウントする。
 * StrictModeで囲むことで、開発時に潜在的な問題（副作用の重複実行など）を検出する。
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
