# Manual de Deploy

Este manual explica cómo poner en producción el sistema completo desde cero.

> **Nota**: Los ejemplos usan Azure para el backend/DB y Vercel para el frontend, pero pueden usarse otros servicios equivalentes (AWS, Google Cloud, Railway, Render, Netlify, etc.) siempre que cumplan con los requisitos técnicos.

## 1. Base de Datos (Azure SQL Database)

### Crear desde Azure Portal

1. **Crear SQL Server**

   - Ir a Azure Portal → "Create a resource" → SQL Database
   - Crear nuevo servidor SQL:
     - Server name: `chriska-sql-server`
     - Location: (US) East US
     - Authentication method: Use SQL Authentication
     - Server admin login: `chriska-admin`
     - Password: [Crear contraseña segura]

2. **Configurar Base de Datos**

   - Database name: `ChriskaDB`
   - Server: [Seleccionar el server creado anteriormente]
   - Compute + storage: General Purpose - Serverless
   - Backup redundancy: Locally redundant

3. **Configurar Firewall**
   - En el servidor SQL → Settings → Firewalls and virtual networks
   - Allow Azure services: YES
   - Agregar IP del desarrollador si se necesita acceso directo

### String de conexión

Obtener desde Azure Portal → SQL Database → Connection strings:

```
Server=chriska-sql-server.database.windows.net;Database=ChriskaDB;User Id=chriska-admin;Password=[TU_PASSWORD];
```

## 2. Backend API (.NET en Azure App Service)

### Crear Storage Account para Imágenes

1. **Crear Storage Account**

   - Azure Portal → "Create a resource" → Storage Account
   - Configuración:
     - Storage account name: `chriskastorage` (debe ser único globalmente)
     - Region: Misma que la base de datos
     - Performance: Standard
     - Redundancy: Locally-redundant storage (LRS)

2. **Crear Containers**

   - Storage Account → Data storage → Containers
   - Crear container `products`:
     - Public access level: Blob (anonymous read access)
   - Crear container `zones`:
     - Public access level: Blob (anonymous read access)

3. **Obtener Connection String**
   - Storage Account → Access keys
   - Copiar Connection string para usar en el App Service

### Crear App Service

1. **Crear App Service**

   - Azure Portal → "Create a resource" → App Service
   - Configuración:
     - Name: `chriska-api`
     - Publish: Code
     - Runtime stack: .NET 8
     - Operating System: Windows o Linux
     - Region: Misma que la base de datos
     - Plan: Basic B1 o superior

2. **Configurar Variables de Entorno**

   - App Service → Settings → Configuration → Application settings
   - Agregar:
     - `JWT__Secret`: [Generar secret de mínimo 32 caracteres]
     - `JWT__Issuer`: ChriskaAPI
     - `JWT__Audience`: ChriskaWeb

3. **Configurar Connection Strings**

   - App Service → Settings → Configuration → Connection strings
   - Agregar:
     - **Base de datos:**
       - Name: `Database`
       - Value: [String de conexión de SQL Server]
       - Type: SQLServer
     - **Blob Storage:**
       - Name: `AzureBlob`
       - Value: [Connection string del Storage Account]
       - Type: Custom

### Deploy desde Visual Studio

#### Preparación

1. **Conectar Visual Studio con Azure**

   - En Visual Studio → View → Cloud Explorer (o Azure)
   - Click en el ícono de cuenta → Add an account
   - Iniciar sesión con la cuenta de Azure que tiene acceso a los recursos
   - Visual Studio ahora puede ver todos los recursos de esa cuenta

2. **Obtener el código y abrir en Visual Studio**

   - Clonar el repositorio del backend desde GitHub
   - Abrir Visual Studio
   - File → Open → Project/Solution
   - Navegar a la carpeta clonada y seleccionar el archivo .sln
   - La solución contiene tanto el proyecto de API como el proyecto de base de datos

#### Publicar Base de Datos

1. **Configurar acceso desde tu IP**

   - Ir a Azure Portal → SQL Server → Networking
   - Click en "Add your client IPv4 address"
   - Save
   - Esperar unos segundos para que se apliquen los cambios

2. **Publicar el proyecto de base de datos**

   - Click derecho en el proyecto de base de datos → Publish
   - Target database connection → Edit
   - Ingresar:
     - Server name: `chriska-sql-server.database.windows.net`
     - Authentication: SQL Server Authentication
     - User name: `chriska-admin`
     - Password: [La contraseña configurada]
     - Database name: `ChriskaDB`
   - Test Connection para verificar
   - Publish
   - Visual Studio creará/actualizará el esquema y datos iniciales

#### Publicar Backend API

1. **Configurar el publish profile**

   - Click derecho en el proyecto de API → Publish
   - Target: Azure → Azure App Service (Windows/Linux)
   - Seleccionar la suscripción de Azure
   - Buscar y seleccionar el App Service creado anteriormente (`chriska-api`)
   - Finish

2. **Configurar Settings**

   - Configuration: Release
   - Target Framework: net8.0
   - Deployment Mode: Framework-dependent
   - Target Runtime: Portable

3. **Publicar la API**

   - Click en "Publish"
   - Visual Studio compilará y subirá la API automáticamente
   - Verificar en Azure Portal que el deploy fue exitoso
   - Probar accediendo a `https://chriska-api.azurewebsites.net/swagger`

## 3. Frontend (Next.js en Vercel)

### Deploy con Vercel

1. **Ir a [vercel.com](https://vercel.com) e iniciar sesión**

2. **Importar el proyecto**

   - Click en "New Project"
   - Seleccionar el repositorio `chriska-web` desde GitHub
   - Framework Preset: Next.js (se detecta automáticamente)

3. **Configurar variables de entorno**

   ```
   NEXT_PUBLIC_API_URL = https://chriska-api.azurewebsites.net/api
   JWT_SECRET = [MISMO_SECRET_QUE_EN_EL_BACKEND]
   ```

4. **Deploy**
   - Click en "Deploy"
   - Esperar que termine el build (~2-3 minutos)

### URL del sistema

Una vez completado, Vercel proporcionará una URL como:

- `https://chriska-web.vercel.app`

## 4. Verificación Post-Deploy

### Backend

```bash
# Verificar que la API responde
curl https://chriska-api.azurewebsites.net/Swagger/index.html
```

### Frontend

1. Abrir `https://chriska-web.vercel.app`
2. Intentar hacer login
3. Verificar en la consola del navegador (F12) que no hay errores de CORS

### Si hay problemas

**Error de conexión a DB:**

- Verificar connection string en Azure Portal → App Service → Configuration
- Verificar firewall de SQL Server permite servicios de Azure
- Verificar credenciales de la base de datos

**Frontend no conecta con API:**

- Verificar en Vercel Settings → Environment Variables que `NEXT_PUBLIC_API_URL` apunte correctamente
- Verificar que la API esté corriendo (acceder a `/Swagger/index.html`)
- Hacer Redeploy después de cambiar variables

**Imágenes no se cargan:**

- Verificar connection string de AzureBlob en Configuration
- Verificar que los containers tienen acceso público de lectura
- Verificar nombres de containers (`products` y `zones`)

---

**Nota**: Reemplazar todos los valores entre corchetes `[...]` con valores reales al momento del deploy.
