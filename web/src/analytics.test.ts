import{describe,expect,it}from'vitest';
import{analyticsQuerySchema,applyPlatformScope,money}from'../../src/analytics';
describe('command centre analytics',()=>{
  it('validates filter date order',()=>{expect(()=>analyticsQuerySchema.parse({from:'2026-09-30T00:00:00.000Z',to:'2026-09-01T00:00:00.000Z'})).toThrow(/before/)});
  it('accepts ecosystem filters',()=>{expect(analyticsQuerySchema.parse({province:'KwaZulu-Natal',platform:'TUCKQUEST',userType:'DRIVER',status:'DELIVERED'}).platform).toBe('TUCKQUEST')});
  it('removes unrelated platform metrics without exposing records',()=>{expect(applyPlatformScope({tuckquestDeliveries:4,mzansiFixJobs:7,totalUsers:9},'TUCKQUEST')).toEqual({tuckquestDeliveries:4,mzansiFixJobs:0,totalUsers:9})});
  it('normalises financial totals',()=>{expect(money(1234.4)).toBe(1234);expect(money(null)).toBe(0)});
});
