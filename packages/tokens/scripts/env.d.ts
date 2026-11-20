interface ImportMeta {
  url: string
}

declare module 'node:path' {
  export function resolve(...paths: string[]): string
  export function dirname(path: string): string
  export function join(...paths: string[]): string
  export const sep: string
}

declare module 'node:url' {
  export function fileURLToPath(url: string | URL): string
}

declare module 'node:process' {
  const process: {
    cwd(): string
    chdir(directory: string): void
    exit(code?: number): never
  }
  export default process
}
