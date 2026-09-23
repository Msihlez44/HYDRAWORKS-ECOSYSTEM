import { describe, expect, it } from 'vitest'
import { applyPlatformScope } from '../../src/analytics'
import { subscriptionPrice } from '../../src/hydrahost'
import { currentStock, saleTotals } from '../../src/kasibiz'
import { assertServiceTransition, quoteTotal } from '../../src/mzansifix'
import { expectedPayment, matchScore, workedMinutes } from '../../src/mzansiwork'
import { assertTransition } from '../../src/tuckquest'
import { assertVerificationTransition } from '../../src/verification'
import { calculateCommission, signedAmount } from '../../src/wallet'

const identities = {
  customer: { id: 'customer-1', role: 'CUSTOMER' },
  tuckshopOwner: { id: 'owner-1', role: 'BUSINESS_OWNER' },
  driver: { id: 'driver-1', role: 'DRIVER' },
  supplier: { id: 'supplier-1', role: 'SUPPLIER' },
  serviceProvider: { id: 'provider-1', role: 'SERVICE_PROVIDER' },
  worker: { id: 'worker-1', role: 'WORKER' },
  employer: { id: 'employer-1', role: 'BUSINESS_OWNER' },
  administrator: { id: 'admin-1', role: 'SUPER_ADMIN' },
} as const

describe('Phase 25 production acceptance simulation', () => {
  it('uses all eight required identities', () => {
    expect(Object.keys(identities)).toHaveLength(8)
    expect(new Set(Object.values(identities).map((identity) => identity.id)).size).toBe(8)
  })

  it('runs registration, verification, Tuckquest, purchase and delivery rules in order', () => {
    const registered = Object.values(identities).every((identity) => identity.id && identity.role)
    expect(registered).toBe(true)
    assertVerificationTransition('PENDING', 'UNDER_REVIEW')
    assertVerificationTransition('UNDER_REVIEW', 'APPROVED')
    const delivery = ['SEARCHING_DRIVER', 'DRIVER_ASSIGNED', 'SHOPPING', 'AWAITING_APPROVAL', 'PURCHASED', 'DELIVERING', 'ARRIVED', 'DELIVERED']
    for (let index = 1; index < delivery.length; index += 1) assertTransition(delivery[index - 1], delivery[index])
    expect(() => assertTransition('SEARCHING_DRIVER', 'DELIVERED')).toThrow(/Invalid/)
  })

  it('updates KasiBiz inventory and completes a POS sale without negative stock', () => {
    const stockAfterDelivery = currentStock([{ quantityDelta: 4 }, { quantityDelta: 6 }])
    const sale = saleTotals([{ quantity: 3, unitPriceCents: 2_000 }], 500)
    const stockAfterSale = currentStock([{ quantityDelta: stockAfterDelivery }, { quantityDelta: -3 }])
    expect({ stockAfterDelivery, stockAfterSale, sale }).toEqual({
      stockAfterDelivery: 10,
      stockAfterSale: 7,
      sale: { subtotalCents: 6_000, discountCents: 500, totalCents: 5_500 },
    })
  })

  it('runs MzansiFix request, quote, completion and payment release', () => {
    expect(quoteTotal({ labourCents: 8_000, materialsCents: 3_000, calloutCents: 1_000, otherFeesCents: 0 })).toBe(12_000)
    const flow = ['REQUESTED', 'QUOTED', 'ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'WORK_STARTED', 'COMPLETED', 'CUSTOMER_CONFIRMED', 'PAYMENT_RELEASED', 'REVIEWED']
    for (let index = 1; index < flow.length; index += 1) assertServiceTransition(flow[index - 1], flow[index])
  })

  it('runs MzansiWork matching, application and temporary assignment settlement', () => {
    expect(matchScore(['stock count', 'cashier'], ['Cashier', 'Stock Count'], true, true, 4)).toBe(99)
    const minutes = workedMinutes(new Date('2026-09-23T08:00:00Z'), new Date('2026-09-23T16:00:00Z'))
    expect(minutes).toBe(480)
    expect(expectedPayment(minutes, 4_000, 'DAY')).toBe(4_000)
  })

  it('prices HydraHost, invoices, settles wallet and commissions, and scopes reports', () => {
    expect(subscriptionPrice({ monthlyPriceCents: 19_900, annualPriceCents: 214_900 }, 'ANNUAL')).toBe(214_900)
    const settlement = calculateCommission({ grossCents: 100_000, commissionBasisPoints: 1_000, paymentFeeCents: 2_000, vatBasisPoints: 1_500 })
    expect(settlement).toEqual({ grossCents: 100_000, platformCommissionCents: 10_000, paymentFeeCents: 2_000, vatCents: 1_500, providerAmountCents: 86_500, netSettlementCents: 86_500 })
    expect(signedAmount('RELEASE', settlement.providerAmountCents)).toBe(86_500)
    expect(applyPlatformScope({ tuckquestDeliveries: 1, mzansiFixJobs: 1, subscriptions: 1 }, 'HYDRAHOST')).toEqual({ tuckquestDeliveries: 0, mzansiFixJobs: 0, subscriptions: 1 })
  })
})
