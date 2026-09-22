import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import queryClient from '@api/queryClient.ts'
import GlobalStyle from '@styles/GlobalStyle'
import { ThemeProvider } from 'styled-components'
import theme from '@styles/theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
