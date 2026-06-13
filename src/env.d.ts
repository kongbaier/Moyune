/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API 服务器基础地址 */
  readonly VITE_BASE_URL: string
  /** API 服务器端口 */
  readonly VITE_PORT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
