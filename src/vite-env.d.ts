/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'uat' | 'production';
  }
}
interface Window {
  Stripe: any;
}
