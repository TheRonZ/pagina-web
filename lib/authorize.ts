import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
export async function isAdmin(){const user=await getChatGPTUser();return !!user&&user.email.toLowerCase()===env.ADMIN_EMAIL?.toLowerCase();}
export function sameOrigin(r:Request){return r.headers.get('origin')===new URL(r.url).origin;}
