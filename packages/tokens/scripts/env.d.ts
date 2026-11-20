interface ImportMeta {
  url: string
}

declare module 'node:fs/promises' {
  export function mkdir(path: string, options?: { recursive?: boolean }): Promise<string | undefined>
  export function rm(path: string, options?: { recursive?: boolean, force?: boolean }): Promise<void>
  export function writeFile(path: string, data: string, encoding?: 'utf-8'): Promise<void>
  export function readFile(path: string, encoding: 'utf-8'): Promise<string>
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
