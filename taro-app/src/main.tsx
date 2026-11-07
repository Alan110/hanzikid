import { createRoot } from 'react-dom/client'
import './app.scss'
import Index from './pages/index'

createRoot(document.getElementById('app')!).render(<Index />)
