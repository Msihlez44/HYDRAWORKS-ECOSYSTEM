import{z}from'zod';
export const ecosystemPlanSchema=z.object({name:z.string().min(2).max(100),description:z.string().min(10).max(1000),priceCents:z.number().int().nonnegative(),billingPeriod:z.enum(['MONTHLY','ANNUAL']),features:z.record(z.boolean()),limits:z.record(z.number().int().nonnegative()),active:z.boolean(),sortOrder:z.number().int().min(0).max(1000)});
export const subscribeSchema=z.object({businessId:z.string().min(1),planId:z.string().min(1)});
export function parseEntitlements(value:string){try{return JSON.parse(value) as Record<string,boolean|number>}catch{return{}}}
export function featureEnabled(features:string,key:string){return parseEntitlements(features)[key]===true}
export function planLimit(limits:string,key:string){const value=parseEntitlements(limits)[key];return typeof value==='number'?value:0}
export function periodEnd(from:Date,period:string){const end=new Date(from);if(period==='ANNUAL')end.setUTCFullYear(end.getUTCFullYear()+1);else end.setUTCMonth(end.getUTCMonth()+1);return end}
