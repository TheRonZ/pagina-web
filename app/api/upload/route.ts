import {env} from 'cloudflare:workers';
import {isAdmin,sameOrigin} from '@/lib/authorize';
export async function POST(req:Request){
 if(!await isAdmin()||!sameOrigin(req))return Response.json({error:'No autorizado'},{status:403});
 try{if(Number(req.headers.get('content-length'))>6000000)return Response.json({error:'Máximo 5 MB'},{status:400});
 const f=(await req.formData()).get('file');if(!(f instanceof File)||f.size>5000000||!['image/png','image/jpeg','image/webp'].includes(f.type))return Response.json({error:'Elige PNG, JPG o WebP de hasta 5 MB.'},{status:400});
 const bytes=await f.arrayBuffer(),b=new Uint8Array(bytes);const valid=f.type==='image/png'?b[0]===137&&b[1]===80&&b[2]===78&&b[3]===71:f.type==='image/jpeg'?b[0]===255&&b[1]===216&&b[2]===255:String.fromCharCode(...b.slice(0,4))==='RIFF'&&String.fromCharCode(...b.slice(8,12))==='WEBP';if(!valid)return Response.json({error:'El contenido no coincide con el formato de imagen.'},{status:400});
 if(!env.BUCKET)throw new Error();const key=crypto.randomUUID();await env.BUCKET.put(key,bytes,{httpMetadata:{contentType:f.type}});return Response.json({url:'/api/media/'+key});
 }catch{return Response.json({error:'No se pudo subir la imagen.'},{status:500});}
}
