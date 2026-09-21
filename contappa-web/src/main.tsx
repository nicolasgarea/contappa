import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import queryClient from '@api/queryClient.ts'
import GlobalStyle from '@styles/GlobalStyle'
import { ThemeModeProvider } from '@styles/ThemeMode'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeModeProvider>
        <GlobalStyle />
        <App />
      </ThemeModeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
