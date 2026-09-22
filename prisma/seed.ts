import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
const db = new PrismaClient();
if (!process.env.SEED_ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD.length < 12) {
  throw new Error('SEED_ADMIN_PASSWORD must be set to at least 12 characters');
}
const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 12);
const user = await db.user.upsert({where:{email:'admin@hydraworks.co.za'},update:{},create:{email:'admin@hydraworks.co.za',phone:'+27000000000',firstName:'HYDRA',lastName:'Administrator',passwordHash}});
await db.userRole.upsert({where:{userId_role:{userId:user.id,role:Role.SUPER_ADMIN}},update:{},create:{userId:user.id,role:Role.SUPER_ADMIN}});
console.log('Seeded administrator. Change the seed password before shared use.');
await db.$disconnect();
