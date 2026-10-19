import { defineConfig } from 'orval'

export default defineConfig({ api: { input: '../backend/openapi.json', output: { target: './src/api/gerado.ts', client: 'fetch', override: { fetch: { includeHttpResponseReturnType: false }, mutator: { path: './src/lib/api.ts', name: 'requisicao' } } } } })
