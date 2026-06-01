import { createServer } from 'http'
import { readFileSync, existsSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3000
const DIST = join(__dirname, 'dist')

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
}

const server = createServer((req, res) => {
  // Strip query string
  let urlPath = req.url.split('?')[0]

  // Try exact file first
  let filePath = join(DIST, urlPath)

  if (!existsSync(filePath) || urlPath === '/') {
    // SPA fallback — serve index.html for all routes
    filePath = join(DIST, 'index.html')
  }

  try {
    const data = readFileSync(filePath)
    const ext = extname(filePath)
    const contentType = MIME[ext] || 'application/octet-stream'

    // Cache static assets
    if (ext !== '.html') {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    }

    res.writeHead(200, { 'Content-Type': contentType })
    res.end(data)
  } catch {
    // Fallback to index.html for SPA routing
    const html = readFileSync(join(DIST, 'index.html'))
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(html)
  }
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`StockFlow frontend running on port ${PORT}`)
})
