import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerOfflineWorker } from './lib/offline/registerSW'

createRoot(document.getElementById("root")!).render(<App />);
registerOfflineWorker();
