import { describe, expect, it } from 'vitest'
import { isProductionReady, productionReadiness } from '../../src/readiness'

const external = ['PRODUCTION_DATABASE_VERIFIED','HTTPS_VERIFIED','ADMIN_CREDENTIALS_VERIFIED','EMAIL_VERIFIED','PAYMENT_WEBHOOK_VERIFIED','MAPS_VERIFIED','STORAGE_VERIFIED','BACKUP_RESTORE_VERIFIED','ERROR_MONITORING_VERIFIED','PRIVACY_POLICY_PUBLISHED','TERMS_PUBLISHED','SUPPORT_PROCESS_VERIFIED','VERIFICATION_PROCESS_VERIFIED','MOBILE_LAYOUTS_VERIFIED','PRODUCTION_BACKUP_COMPLETED']

describe('production launch readiness', () => {
  it('fails the repository defaults instead of making a false launch claim', () => {
    expect(isProductionReady(productionReadiness({ NODE_ENV: 'development', PAYMENT_MODE: 'sandbox' }))).toBe(false)
  })
  it('rejects placeholder secrets and HTTP origins', () => {
    const failed = productionReadiness({ NODE_ENV: 'production', APP_ORIGIN: 'http://example.test', JWT_SECRET: 'replace-with-at-least-32-random-characters', PAYMENT_WEBHOOK_SECRET: 'replace-with-a-secret' })
    expect(failed.filter((check) => !check.passed).map((check) => check.name)).toEqual(expect.arrayContaining(['HTTPS origin', 'JWT secret', 'webhook secret']))
  })
  it('passes only when technical configuration and every external gate are evidenced', () => {
    const env: Record<string, string> = { NODE_ENV: 'production', APP_ORIGIN: 'https://hydraworks.example', JWT_SECRET: 'f3a8c2d7e1b94651a9c50e72d624b831', PAYMENT_WEBHOOK_SECRET: 'a7c2d5e8f1b44901ac10ed88', PAYMENT_MODE: 'production-provider', DATABASE_URL: 'postgresql://private' }
    for (const key of external) env[key] = 'true'
    expect(isProductionReady(productionReadiness(env))).toBe(true)
  })
})
