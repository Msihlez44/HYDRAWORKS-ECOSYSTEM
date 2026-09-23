export type ReadinessCheck = { name: string; passed: boolean; detail: string }

const attestations = [
  'PRODUCTION_DATABASE_VERIFIED', 'HTTPS_VERIFIED', 'ADMIN_CREDENTIALS_VERIFIED',
  'EMAIL_VERIFIED', 'PAYMENT_WEBHOOK_VERIFIED', 'MAPS_VERIFIED', 'STORAGE_VERIFIED',
  'BACKUP_RESTORE_VERIFIED', 'ERROR_MONITORING_VERIFIED', 'PRIVACY_POLICY_PUBLISHED',
  'TERMS_PUBLISHED', 'SUPPORT_PROCESS_VERIFIED', 'VERIFICATION_PROCESS_VERIFIED',
  'MOBILE_LAYOUTS_VERIFIED', 'PRODUCTION_BACKUP_COMPLETED',
] as const

export function productionReadiness(env: Record<string, string | undefined>): ReadinessCheck[] {
  const secret = env.JWT_SECRET || ''
  const webhook = env.PAYMENT_WEBHOOK_SECRET || ''
  const checks: ReadinessCheck[] = [
    { name: 'production mode', passed: env.NODE_ENV === 'production', detail: 'NODE_ENV must be production' },
    { name: 'HTTPS origin', passed: /^https:\/\/[^\s]+$/i.test(env.APP_ORIGIN || ''), detail: 'APP_ORIGIN must be the deployed HTTPS URL' },
    { name: 'JWT secret', passed: secret.length >= 32 && !/replace|example|changeme/i.test(secret), detail: 'JWT_SECRET must be a unique secret of at least 32 characters' },
    { name: 'webhook secret', passed: webhook.length >= 24 && !/replace|example|changeme/i.test(webhook), detail: 'PAYMENT_WEBHOOK_SECRET must be a unique provider secret' },
    { name: 'production payments', passed: Boolean(env.PAYMENT_MODE && env.PAYMENT_MODE !== 'sandbox'), detail: 'A production payment adapter and mode must be configured' },
    { name: 'database', passed: Boolean(env.DATABASE_URL), detail: 'DATABASE_URL must be configured' },
    { name: 'demo credentials removed', passed: !env.SEED_ADMIN_PASSWORD, detail: 'Do not expose a seed administrator password to the running service' },
  ]
  for (const name of attestations) checks.push({ name, passed: env[name] === 'true', detail: `${name}=true requires recorded operational evidence` })
  return checks
}

export function isProductionReady(checks: ReadinessCheck[]) {
  return checks.length > 0 && checks.every((check) => check.passed)
}
