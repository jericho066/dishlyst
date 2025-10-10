import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const REPO_NAME = 'dishlyst'
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

// https://vite.dev/config/
export default defineConfig({
  base: isGitHubPages ? `/${REPO_NAME}/` : '/',
  plugins: [react()],
})
