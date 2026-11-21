interface ImportMeta {
  url: string
}

declare const Buffer: {
  from(data: Uint8Array): { toString(encoding: 'utf-8'): string }
}

declare module 'node:fs' {
  export interface Dirent {
    name: string
    isFile(): boolean
  }
  export function mkdirSync(path: string, options?: { recursive?: boolean }): string | undefined
  export function readdirSync(path: string, options: { withFileTypes: true }): Dirent[]
  export function readFileSync(path: string, encoding: 'utf-8'): string
  export function writeFileSync(path: string, data: string, encoding?: 'utf-8'): void
}

declare module 'node:module' {
  export function createRequire(filename: string | URL): {
    resolve(id: string): string
  }
}

declare module 'node:path' {
  export function resolve(...paths: string[]): string
  export function dirname(path: string): string
  export function join(...paths: string[]): string
}

declare module 'node:url' {
  export function fileURLToPath(url: string | URL): string
}

declare module '@pact-design/tokens/utils/helper.js' {
  export function kebab(s: string): string
}
