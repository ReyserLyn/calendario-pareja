# Album MariRey

**Album MariRey** es una aplicación web para gestionar un álbum de fotos organizado por meses. Permite a los usuarios subir imágenes, visualizarlas en tiempo real, editarlas (incluyendo la eliminación y restauración) y guardar los cambios que se reflejan inmediatamente en la interfaz.

## Características

- **Edición en tiempo real:** Modifica, sube y elimina imágenes con retroalimentación inmediata en la vista sin necesidad de recargar la página.
- **Gestión centralizada del estado:** Uso de React Context para compartir el estado de las fotos en toda la aplicación (con `PhotosContext` y `EditingContext`).
- **Carga de imágenes con previsualización:** Arrastra y suelta imágenes o selecciónalas manualmente, con una vista previa antes de confirmar la carga.
- **Control de sesiones:** Cada álbum se asocia a un ID de sesión obtenido desde la URL.
- **Autenticación y rutas protegidas:** Uso de middleware para redirigir a los usuarios a `/login` en rutas protegidas si no están autenticados.

## Tecnologías Utilizadas

- **Next.js / React:** Framework principal para construir la aplicación.
- **TypeScript:** Tipado estricto para mejorar la calidad y mantenimiento del código.
- **Tailwind CSS:** Estilizado de la interfaz de usuario.
- **PocketBase:** Solución backend para almacenar datos y gestionar archivos.
- **React Hook Form & Zod:** Gestión y validación de formularios.
- **Sonner:** Notificaciones tipo toast.

## Instalación

### Requisitos Previos

- [Node.js](https://nodejs.org/) (v14 o superior)
- npm o yarn

### Pasos para instalar

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/album-marirey.git
   ```

2. Entra en el directorio del proyecto:

   ```bash
   cd album-marirey
   ```
   
3. Instala las dependencias:

   ```bash
   npm install
   # o
   yarn install
   ```

4. Configura las variables de entorno necesarias según la documentación de PocketBase y cualquier otra configuración requerida.

## Ejecución

Para iniciar el servidor de desarrollo, ejecuta:

```bash
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación en acción.

## Contribuciones

Las contribuciones son bienvenidas. Si encuentras algún error o tienes ideas para nuevas funcionalidades, abre un **issue** o envía un **pull request**.

## Licencia

Este proyecto se distribuye bajo la **Licencia MIT**.

## Agradecimientos

- **PocketBase** por ser la solución backend.
- **Next.js** por su robustez y facilidad de uso.
- A todos los contribuidores y usuarios que ayudan a mejorar este proyecto.

---

Este README ofrece una visión general completa del proyecto y sirve tanto para nuevos colaboradores como para usuarios interesados en probar la aplicación. Puedes ajustarlo y ampliarlo según evolucionen las funcionalidades o necesidades de tu proyecto.

¡Espero que te sea útil! 😊

