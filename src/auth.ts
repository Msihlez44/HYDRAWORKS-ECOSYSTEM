import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import{createHash}from'node:crypto';
export const registerSchema=z.object({firstName:z.string().min(2).max(60),lastName:z.string().min(2).max(60),email:z.string().email(),phone:z.string().min(9).max(20),province:z.string().min(2).max(80).optional(),password:z.string().min(10).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),role:z.enum(['CUSTOMER','BUSINESS_OWNER','DRIVER','SERVICE_PROVIDER','WORKER','SUPPLIER']).default('CUSTOMER')});
export const loginSchema=z.object({email:z.string().email(),password:z.string().min(1)});
export const hashPassword=(value:string)=>bcrypt.hash(value,12);
export const verifyPassword=(value:string,hash:string)=>bcrypt.compare(value,hash);
export const signToken=(payload:{sub:string;roles:string[]})=>jwt.sign(payload,requiredSecret(),{expiresIn:'8h',issuer:'hydra-id',audience:'hydra-ecosystem'});
export const readToken=(token:string)=>jwt.verify(token,requiredSecret(),{issuer:'hydra-id',audience:'hydra-ecosystem'}) as jwt.JwtPayload & {sub:string;roles:string[]};
export const tokenDigest=(token:string)=>createHash('sha256').update(token).digest('hex');
function requiredSecret(){const v=process.env.JWT_SECRET;if(!v||v.length<32) throw new Error('JWT_SECRET must contain at least 32 characters');return v;}
