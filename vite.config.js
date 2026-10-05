import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Chemin de base de publication.
// - En local et par défaut : './' (chemins relatifs, fonctionne dans n'importe quel sous-dossier).
// - Sur GitHub Pages, le workflow fournit BASE_PATH=/<nom-du-depot>/ automatiquement.
// Voir la section « Chemin de base Vite » du README.
export default defineConfig({
  base: process.env.BASE_PATH || './',
  plugins: [react()],
  // Configuration PostCSS vide : évite d'hériter de celle d'un dossier parent.
  css: { postcss: {} },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
  },
})
