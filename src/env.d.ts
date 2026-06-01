/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly EMAIL_API_KEY?: string;
  readonly EMAIL_FROM?: string;
  readonly RESEND_API_KEY?: string;
  readonly RESEND_FROM?: string;
}
