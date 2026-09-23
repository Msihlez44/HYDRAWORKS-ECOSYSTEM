# Production acceptance simulation

The automated Phase 25 suite uses eight distinct identities: customer, tuckshop owner, driver, supplier, service provider, worker, employer, and super administrator. It exercises the domain rules in the required sequence without direct database edits.

| Required flow | Automated evidence |
| --- | --- |
| Registration and business verification | unique role identities; legal verification transitions |
| Tuckquest request through delivery | every state transition from driver search to delivered; illegal shortcut rejected |
| Payment and KasiBiz inventory/POS | purchase quantity, sale totals, discount, and remaining stock assertions |
| MzansiFix request through completion | quote total and complete service/payment-release transition chain |
| MzansiWork job through temporary assignment | verified skill match, check-in/out duration, and day-rate settlement |
| HydraHost request and invoices | annual Pro Business subscription invoice calculation |
| Wallet and commissions | gross, platform commission, payment fee, VAT, provider net, and signed release |
| Reports and administration | platform-scoped administrative metrics |

Run it with `npm test -- production-acceptance.test.ts` or as part of the complete `npm test` suite. These tests validate application business rules and regression safety. They do not represent a live payment, email, DNS, maps, hosting-provider, or production URL test; those require configured external sandbox/production services and are launch gates.
