import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConvexProvider } from 'convex/react'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { TransactionProvider } from './context/TransactionContext'
import { ThemeProvider } from './context/ThemeContext'
import { convexClient } from './lib/convex'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConvexProvider client={convexClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <TransactionProvider>
              <App />
            </TransactionProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ConvexProvider>
  </React.StrictMode>,
)
