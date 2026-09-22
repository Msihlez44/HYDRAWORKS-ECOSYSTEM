import{describe,expect,it}from'vitest';
import{assertSupportTransition,slaHours,supportTicketSchema}from'../../src/support';

const ticket={category:'PAYMENTS',subject:'Missing supplier payment',description:'Payment has not reached the supplier.',isDispute:true};
describe('support and disputes',()=>{
  it('requires disputes to reference a real transaction',()=>{expect(()=>supportTicketSchema.parse(ticket)).toThrow(/linked to a transaction/)});
  it('accepts transaction-linked disputes',()=>{expect(supportTicketSchema.parse({...ticket,contextType:'SupplierOrder',contextId:'order_1'}).contextId).toBe('order_1')});
  it('sets market-standard response targets by priority',()=>{expect([slaHours('URGENT'),slaHours('HIGH'),slaHours('NORMAL'),slaHours('LOW')]).toEqual([4,12,24,72])});
  it('enforces the case lifecycle',()=>{expect(()=>assertSupportTransition('OPEN','ASSIGNED')).not.toThrow();expect(()=>assertSupportTransition('CLOSED','OPEN')).toThrow(/Invalid support transition/)});
});
