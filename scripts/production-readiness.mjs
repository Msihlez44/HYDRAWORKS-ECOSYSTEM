import 'dotenv/config'
import { isProductionReady, productionReadiness } from '../src/readiness.ts'

const checks = productionReadiness(process.env)
for (const check of checks) console.log(`${check.passed ? 'PASS' : 'FAIL'}  ${check.name} — ${check.detail}`)
if (!isProductionReady(checks)) {
  console.error('\nNOT PRODUCTION-READY: resolve every failed gate and retain evidence before launch.')
  process.exitCode = 1
} else {
  console.log('\nAll configured and attested launch gates passed. Complete final change approval before directing traffic.')
}
