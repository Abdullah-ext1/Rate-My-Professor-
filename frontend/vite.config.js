import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Rate Professor',
        short_name: 'RateProf',
        description: 'Rate your professors and track attendance easily.',
        theme_color: '#0E0D14',
        background_color: '#0E0D14',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/campus_logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/campus_logo.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/campus_logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
})
