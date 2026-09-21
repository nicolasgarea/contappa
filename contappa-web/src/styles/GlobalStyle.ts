import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background-color: ${({ theme }) => theme.color.canvas};
    color: ${({ theme }) => theme.color.text};
    font-family: ${({ theme }) => theme.font.sans};
    font-size: ${({ theme }) => theme.font.size.base};
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6, p, figure {
    margin: 0;
  }

  h1, h2, h3, h4 {
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  button, input, select, textarea {
    font: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    max-width: 100%;
    display: block;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.accent[500]};
    outline-offset: 2px;
  }

  ::selection {
    background-color: ${({ theme }) => theme.color.accent.line};
    color: ${({ theme }) => theme.color.text};
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.color.borderStrong};
    border-radius: ${({ theme }) => theme.radius.pill};
    border: 3px solid transparent;
    background-clip: content-box;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => theme.color.textSubtle};
    background-clip: content-box;
  }
`

export default GlobalStyle
