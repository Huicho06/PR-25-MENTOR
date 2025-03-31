import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './routes/AppRouter' // <-- Importas el enrutador
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter /> {/* <-- Usás el enrutador que sí tiene <BrowserRouter> */}
  </React.StrictMode>
)
