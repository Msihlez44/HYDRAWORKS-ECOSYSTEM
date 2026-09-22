import{z}from'zod';
export const conversationSchema=z.object({contextType:z.enum(['DELIVERY','SERVICE_REQUEST','JOB','SUPPLIER_ORDER','SUPPORT_TICKET','HOSTING_REQUEST']),contextId:z.string().min(1).max(120),subject:z.string().max(160).optional()});
export const messageSchema=z.object({text:z.string().trim().max(4000).optional(),attachments:z.array(z.object({type:z.enum(['IMAGE','DOCUMENT']),url:z.string().url(),fileName:z.string().min(1).max(255),mimeType:z.string().regex(/^(image\/(jpeg|png|webp|gif)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document))$/),sizeBytes:z.number().int().positive().max(10*1024*1024)})).max(10).default([])}).refine(v=>Boolean(v.text)||v.attachments.length>0,{message:'Message text or attachment is required'});
export const uniqueParticipants=(ids:string[])=>[...new Set(ids.filter(Boolean))];
export const canAccessConversation=(participantIds:string[],userId:string)=>participantIds.includes(userId);
