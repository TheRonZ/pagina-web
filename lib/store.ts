import {env} from 'cloudflare:workers';
import {initial} from './catalog';
export async function readCatalog(){
 if(!env.DB)throw new Error('Base de datos no disponible');
 const row=await env.DB.prepare('SELECT data,revision FROM catalog WHERE id = ?').bind('main').first<{data:string,revision:number}>();
 return row?{data:JSON.parse(row.data),revision:row.revision}:{data:initial,revision:0};
}
