import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterConfig } from './configs/RouterConfig'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterConfig />
  </React.StrictMode>,
)
