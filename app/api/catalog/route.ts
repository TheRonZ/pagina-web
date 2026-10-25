import {env} from 'cloudflare:workers';
import {catalogSchema} from '@/lib/catalog';
import {readCatalog} from '@/lib/store';
import {isAdmin,sameOrigin} from '@/lib/authorize';
export const dynamic='force-dynamic';
export async function GET(){try{const state=await readCatalog();const admin=await isAdmin();return Response.json({...state,data:admin?state.data:{...state.data,products:state.data.products.filter((p:{active:boolean})=>p.active),services:state.data.services.filter((p:{active:boolean})=>p.active)},admin},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'No se pudo cargar el catálogo. Intenta nuevamente.'},{status:503});}}
export async function PUT(req:Request){
 if(!await isAdmin())return Response.json({error:'Acceso exclusivo del administrador.'},{status:403});
 if(!sameOrigin(req))return Response.json({error:'Origen no autorizado'},{status:403});
 try{const body=await req.json() as {data:unknown,revision:number};const result=catalogSchema.safeParse(body.data);if(!result.success)return Response.json({error:result.error.issues.map(x=>x.path.join('.')+': '+x.message).join('; ')},{status:400});
 if(!Number.isInteger(body.revision)||body.revision<0)return Response.json({error:'Versión inválida'},{status:400});
 if(!env.DB)throw new Error();
 const r=body.revision===0?await env.DB.prepare('INSERT OR IGNORE INTO catalog (id,data,revision) VALUES (?,?,1)').bind('main',JSON.stringify(result.data)).run():await env.DB.prepare('UPDATE catalog SET data=?,revision=revision+1 WHERE id=? AND revision=?').bind(JSON.stringify(result.data),'main',body.revision).run();
 if(r.meta.changes!==1)return Response.json({error:'Hay cambios más recientes. Recarga la página antes de guardar.'},{status:409});
 return Response.json({revision:body.revision+1});
 }catch{return Response.json({error:'No se guardaron los cambios. Intenta nuevamente.'},{status:500});}
}
