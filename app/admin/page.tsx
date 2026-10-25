import {requireChatGPTUser} from '../chatgpt-auth';
import {isAdmin} from '@/lib/authorize';
import Admin from './panel';
export const dynamic='force-dynamic';
export default async function Page(){await requireChatGPTUser('/admin');if(!await isAdmin())return <main className="wrap section"><h1>Acceso restringido</h1><p>Este panel es exclusivo del propietario de Nawio Health.</p><a href="/">Volver a la tienda</a></main>;return <Admin/>;}
