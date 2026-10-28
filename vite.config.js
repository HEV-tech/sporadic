import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Логотип всегда встраивается в бандл (data:URL): из него в браузере считается
// эмблема, а canvas с data:URL не «портится» — эмблема работает даже при открытии
// index.html прямо с диска. Остальные картинки остаются файлами.
const inlineLogo = (filePath) => (filePath.includes('sporadic-logo') ? true : undefined)

// mode=single собирает один самодостаточный index.html (для показа заказчику),
// обычная сборка — обычный dist для хостинга.
// base: в single нужны относительные пути (файл открывают с диска), на сервере —
// корень, иначе на вложенных маршрутах (/sport/events) ассеты дают 404.
export default defineConfig(({ mode }) => ({
  base: mode === 'single' ? './' : '/',
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  build: {
    assetsInlineLimit: mode === 'single' ? 4_000_000 : inlineLogo,
    cssCodeSplit: false,
  },
}))
