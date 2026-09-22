import{describe,expect,it}from'vitest';import{ecosystemPlanSchema,featureEnabled,periodEnd,planLimit}from'../../src/subscriptions';
describe('ecosystem subscriptions',()=>{
  it('allows administrator-configured free pricing',()=>{expect(ecosystemPlanSchema.parse({name:'Free',description:'Basic business tools',priceCents:0,billingPeriod:'MONTHLY',features:{inventory:true},limits:{products:25},active:true,sortOrder:1}).priceCents).toBe(0)});
  it('rejects negative configurable prices and limits',()=>{expect(()=>ecosystemPlanSchema.parse({name:'Bad',description:'Invalid pricing plan',priceCents:-1,billingPeriod:'MONTHLY',features:{},limits:{products:-1},active:true,sortOrder:1})).toThrow()});
  it('reads snapshotted features and limits safely',()=>{expect(featureEnabled('{"analytics":true}','analytics')).toBe(true);expect(planLimit('{"products":250}','products')).toBe(250);expect(planLimit('invalid','products')).toBe(0)});
  it('calculates monthly and annual service periods',()=>{const start=new Date('2026-01-15T00:00:00Z');expect(periodEnd(start,'MONTHLY').toISOString()).toBe('2026-02-15T00:00:00.000Z');expect(periodEnd(start,'ANNUAL').toISOString()).toBe('2027-01-15T00:00:00.000Z')});
});
