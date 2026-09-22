import type{PrismaClient,NotificationEvent,NotificationChannel}from'@prisma/client';import{z}from'zod';
export const preferenceSchema=z.object({event:z.enum(['NEW_DELIVERY_REQUEST','DRIVER_ASSIGNED','PURCHASE_APPROVAL','DELIVERY_ARRIVING','DELIVERY_COMPLETE','LOW_STOCK','SERVICE_QUOTE','JOB_MATCH','PAYMENT_RECEIVED','VERIFICATION_UPDATE','SUPPORT_REPLY']),channel:z.enum(['IN_APP','EMAIL','SMS','PUSH']),enabled:z.boolean()});
export const placeholders=(body:string,data:Record<string,string|number>)=>body.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g,(_m,key)=>String(data[key]??''));
export interface NotificationAdapter{channel:NotificationChannel;name:string;send(input:{userId:string;subject?:string;body:string}):Promise<{providerRef:string}>}
export class UnconfiguredAdapter implements NotificationAdapter{constructor(public channel:NotificationChannel,public name='unconfigured'){}async send(_input:{userId:string;subject?:string;body:string}):Promise<{providerRef:string}>{throw new Error(`${this.channel} provider is not configured`)}}
export async function notify(db:PrismaClient,input:{userIds:string[];event:NotificationEvent;data:Record<string,string|number>;relatedEntityType?:string;relatedEntityId?:string}){
  const template=await db.notificationTemplate.findUnique({where:{event_channel:{event:input.event,channel:'IN_APP'}}});
  const body=placeholders(template?.body||input.event.replaceAll('_',' '),input.data);
  const title=placeholders(template?.subject||input.event.replaceAll('_',' '),input.data);
  for(const userId of [...new Set(input.userIds)]){
    const prefs=await db.notificationPreference.findMany({where:{userId,event:input.event}});
    const disabled=new Set(prefs.filter(p=>!p.enabled).map(p=>p.channel));
    if(disabled.has('IN_APP'))continue;
    const channels=(['IN_APP','EMAIL','SMS','PUSH'] as NotificationChannel[]).filter(channel=>!disabled.has(channel));
    await db.notification.create({data:{
      userId,event:input.event,title,body,
      relatedEntityType:input.relatedEntityType,relatedEntityId:input.relatedEntityId,
      attempts:{create:channels.map(channel=>({
        channel,status:channel==='IN_APP'?'SENT':'PENDING',
        provider:channel==='IN_APP'?'internal':null,
        attempts:channel==='IN_APP'?1:0,
        lastAttemptAt:channel==='IN_APP'?new Date():null
      }))}
    }});
  }
}
