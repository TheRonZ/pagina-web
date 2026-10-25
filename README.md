# Nawio Health

Tienda y CMS para productos y servicios de bienestar. React, Vinext y Cloudflare Workers; catálogo persistente en D1 e imágenes subidas en R2.

## Uso

- Tienda: `/`
- Administración: `/admin`, con la cuenta ChatGPT del propietario.
- Edita productos, stock, precios, descuentos, servicios, contacto y banners. Pulsa **Guardar cambios** para actualizar la tienda.
- Los pedidos y solicitudes de cita se preparan en WhatsApp. No hay cobro en línea, reserva automática de stock ni bloqueo de horarios.
- Perfil, carrito y favoritos se guardan en este navegador. El catálogo se guarda en servidor y se comparte entre dispositivos.
- El producto inicial tiene stock 0 hasta confirmar existencias. Los servicios de ejemplo están pausados.
- El temporizador informa del fin de la campaña; no elimina automáticamente los descuentos.
- El teléfono impreso dentro de un banner es parte de la imagen: reemplaza esa imagen si cambia el número. Los enlaces y textos web sí usan el contacto global.

## Desarrollo

Requiere Node 22.13+ y pnpm. Instala dependencias con `pnpm install`, inicia con `pnpm dev`, verifica con `pnpm exec tsc --noEmit`, `node tests/catalog.test.mjs` y `pnpm build`.

Configura `ADMIN_EMAIL` como secreto de entorno del servidor. Nunca lo expongas mediante una variable `NEXT_PUBLIC_*`. El servidor rechaza escrituras de otras cuentas y solicitudes de otro origen. El proveedor de hosting debe validar e inyectar la identidad ChatGPT; no expongas el Worker directamente sin esa capa.

Los bindings `DB` (D1) y `BUCKET` (R2) se declaran en `.openai/hosting.json`. Las migraciones están en `drizzle/`. Sites aplica las migraciones al publicar. La vista previa local requiere aplicarlas a su base de datos local.

Los cambios se guardan con revisión optimista: una edición concurrente devuelve 409 y pide recargar. Las imágenes admitidas son PNG, JPG y WebP de hasta 5 MB. No se aceptan SVG ni URLs JavaScript.

## Validación

Pruebas de permisos, origen, guardado, revisiones concurrentes, validación de stock, URLs de imagen, descuentos y filtrado de servicios pausados. Revisión visual de escritorio y móvil de 390 px, búsqueda, favoritos y carrito vacío.

## Publicación

El sitio mantiene su acceso privado para el propietario. Activar acceso público es una acción independiente. No se incluyen credenciales ni datos de clientes en el repositorio.
