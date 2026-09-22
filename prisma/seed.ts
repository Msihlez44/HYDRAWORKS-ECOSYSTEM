import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
const db = new PrismaClient();
if (!process.env.SEED_ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD.length < 12) {
  throw new Error('SEED_ADMIN_PASSWORD must be set to at least 12 characters');
}
const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 12);
const user = await db.user.upsert({where:{email:'admin@hydraworks.co.za'},update:{},create:{email:'admin@hydraworks.co.za',phone:'+27000000000',firstName:'HYDRA',lastName:'Administrator',passwordHash}});
await db.userRole.upsert({where:{userId_role:{userId:user.id,role:Role.SUPER_ADMIN}},update:{},create:{userId:user.id,role:Role.SUPER_ADMIN}});
const plans=[
  {code:'BUSINESS_STARTER',name:'Business Starter',description:'Essential website and professional email hosting for a new business.',monthlyPriceCents:9900,annualPriceCents:106900,storageGb:15,websites:1,mailboxes:10,databases:3,sortOrder:1},
  {code:'PRO_BUSINESS',name:'Pro Business',description:'Expanded hosting for a growing company with multiple websites and teams.',monthlyPriceCents:19900,annualPriceCents:214900,storageGb:50,websites:10,mailboxes:50,databases:15,sortOrder:2},
  {code:'PREMIUM_BUSINESS',name:'Premium Business',description:'High-capacity business hosting for larger websites, teams and databases.',monthlyPriceCents:34900,annualPriceCents:376900,storageGb:100,websites:30,mailboxes:200,databases:40,sortOrder:3}
];
for(const plan of plans)await db.hostingPlan.upsert({where:{code:plan.code},update:plan,create:plan});
const notificationTemplates=[
  ['NEW_DELIVERY_REQUEST','New delivery request','A new stock-delivery request is available.'],
  ['DRIVER_ASSIGNED','Driver assigned','A driver has been assigned to request {{reference}}.'],
  ['PURCHASE_APPROVAL','Purchase approval required','Approve the updated stock total for {{reference}}.'],
  ['DELIVERY_ARRIVING','Delivery arriving','Your delivery for {{reference}} has arrived.'],
  ['DELIVERY_COMPLETE','Delivery complete','Delivery {{reference}} was confirmed.'],
  ['LOW_STOCK','Low stock','{{product}} has reached its reorder level.'],
  ['SERVICE_QUOTE','New service quote','A provider submitted a quote for {{reference}}.'],
  ['JOB_MATCH','New job match','A new {{title}} opportunity matches your worker profile.'],
  ['PAYMENT_RECEIVED','Payment received','Payment of R{{amount}} was confirmed.'],
  ['VERIFICATION_UPDATE','Verification updated','Your verification status is now {{status}}.'],
  ['SUPPORT_REPLY','Support replied','There is a new reply on support ticket {{reference}}.']
] as const;
for(const [event,subject,body] of notificationTemplates)await db.notificationTemplate.upsert({where:{event_channel:{event,channel:'IN_APP'}},update:{subject,body,active:true},create:{event,channel:'IN_APP',subject,body}});
console.log('Seeded administrator. Change the seed password before shared use.');
await db.$disconnect();
