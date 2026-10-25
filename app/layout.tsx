import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Nawio Health · Bienestar a tu alcance',description:'Suplementos y bienestar en Lima. Conoce nuestro catálogo y coordina tu pedido por WhatsApp.',icons:{icon:'/assets/logo.png'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
