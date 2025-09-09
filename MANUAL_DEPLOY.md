# Manual de Despliegue - Sistema de Gestión de Inventario Chriska SRL

## 1. Información General del Sistema

### 1.1 Descripción

Sistema web de gestión de inventario desarrollado para Chriska SRL como proyecto de tesis. Consiste en una arquitectura cliente-servidor con:

- **Frontend**: Aplicación web desarrollada en Next.js 15 con TypeScript
- **Backend**: API REST desarrollada en .NET con C#
- **Base de Datos**: SQL Server

### 1.2 Arquitectura del Sistema

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   Frontend      │  HTTPS  │    Backend      │   SQL   │   Database      │
│   (Next.js)     │────────▶│    (.NET API)   │────────▶│   (SQL Server)  │
│                 │         │                 │         │                 │
│   Vercel        │         │  Azure App      │         │  Azure SQL      │
│                 │         │    Service      │         │   Database      │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

## 2. Repositorios y Código Fuente

### 2.1 Estructura de Repositorios

- **Frontend Repository**: GitHub (público)

  - Tecnologías: Next.js 15, TypeScript, Chakra UI, Zustand
  - Branch principal: `main`
  - Branch de desarrollo: `develop`

- **Backend Repository**: GitHub (público)
  - Tecnologías: .NET 8, C#, Entity Framework
  - Documentación API: Swagger integrado

### 2.2 Acceso al Código

Los repositorios son públicos y accesibles para evaluación académica. Los profesores tienen acceso completo para revisión del código fuente.

## 3. Requisitos del Sistema

### 3.1 Frontend - Requisitos Locales

- **Node.js**: versión 18.x o superior
- **npm**: versión 9.x o superior
- **Sistema Operativo**: Windows, macOS o Linux
- **Memoria RAM**: Mínimo 4GB disponibles
- **Espacio en disco**: 500MB para dependencias

### 3.2 Backend - Requisitos del Servidor

- **.NET Runtime**: .NET 8.0
- **SQL Server**: 2019 o superior
- **Memoria RAM**: Mínimo 2GB
- **CPU**: 2 cores mínimo
- **Espacio en disco**: 1GB mínimo

## 4. Configuración del Entorno de Desarrollo

### 4.1 Frontend - Instalación Local

#### Paso 1: Clonar el repositorio

```bash
git clone [URL_REPOSITORIO_FRONTEND]
cd chriska-web
```

#### Paso 2: Instalar dependencias

```bash
npm install
```

#### Paso 3: Configurar variables de entorno

Crear archivo `.env` basándose en `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
JWT_SECRET=your-super-secure-jwt-secret-key-here-minimum-32-characters
NODE_ENV=development
```

#### Paso 4: Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 4.2 Backend - Instalación Local

#### Paso 1: Clonar el repositorio

```bash
git clone [URL_REPOSITORIO_BACKEND]
cd chriska-api
```

#### Paso 2: Restaurar paquetes NuGet

```bash
dotnet restore
```

#### Paso 3: Configurar cadena de conexión

Actualizar `appsettings.json` o `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ChriskaDB;Trusted_Connection=true;"
  },
  "JWT": {
    "Secret": "your-super-secure-jwt-secret-key-here-minimum-32-characters",
    "Issuer": "ChriskaAPI",
    "Audience": "ChriskaWeb"
  }
}
```

#### Paso 4: Ejecutar migraciones de base de datos

```bash
dotnet ef database update
```

#### Paso 5: Ejecutar la API

```bash
dotnet run
```

La API estará disponible en `http://localhost:5000`
Swagger UI disponible en `http://localhost:5000/Swagger/index.html`

## 5. Despliegue en Producción

### 5.1 Frontend - Despliegue en Vercel

#### Opción A: Despliegue Automático (Recomendado)

1. **Conectar con GitHub**

   - Ingresar a [vercel.com](https://vercel.com)
   - Crear cuenta o iniciar sesión
   - Hacer clic en "New Project"
   - Importar repositorio desde GitHub

2. **Configuración del Proyecto**

   - Framework Preset: Next.js
   - Root Directory: `./` (dejar por defecto)
   - Build Command: `npm run build`
   - Output Directory: `.next` (automático)

3. **Variables de Entorno**
   Configurar en Settings → Environment Variables:

   ```
   NEXT_PUBLIC_API_URL = https://[nombre-app].azurewebsites.net/api
   JWT_SECRET = [mismo-secreto-que-backend]
   ```

4. **Deploy Automático**
   - Los deploys se ejecutan automáticamente con cada push a `main`
   - Preview deployments para cada pull request

#### Opción B: Despliegue Manual con CLI

1. **Instalar Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login y Deploy**
   ```bash
   vercel login
   vercel --prod
   ```

### 5.2 Backend - Despliegue en Azure App Service

#### Paso 1: Crear recursos en Azure

1. **Crear Resource Group**

   ```bash
   az group create --name rg-chriska --location eastus
   ```

2. **Crear App Service Plan**

   ```bash
   az appservice plan create \
     --name asp-chriska \
     --resource-group rg-chriska \
     --sku B1 \
     --is-linux
   ```

3. **Crear Web App**

   ```bash
   az webapp create \
     --name chriska-api \
     --resource-group rg-chriska \
     --plan asp-chriska \
     --runtime "DOTNET|8.0"
   ```

4. **Crear SQL Database**

   ```bash
   # Crear servidor SQL
   az sql server create \
     --name chriska-sql-server \
     --resource-group rg-chriska \
     --admin-user chriska-admin \
     --admin-password [SECURE_PASSWORD]

   # Crear base de datos
   az sql db create \
     --resource-group rg-chriska \
     --server chriska-sql-server \
     --name ChriskaDB \
     --service-objective S0
   ```

#### Paso 2: Configurar la aplicación

1. **Configurar Connection String**

   ```bash
   az webapp config connection-string set \
     --resource-group rg-chriska \
     --name chriska-api \
     --settings DefaultConnection="Server=chriska-sql-server.database.windows.net;Database=ChriskaDB;User Id=chriska-admin;Password=[PASSWORD];" \
     --connection-string-type SQLAzure
   ```

2. **Configurar Application Settings**

   ```bash
   az webapp config appsettings set \
     --resource-group rg-chriska \
     --name chriska-api \
     --settings \
       JWT__Secret="[MISMO_SECRET_QUE_FRONTEND]" \
       JWT__Issuer="ChriskaAPI" \
       JWT__Audience="ChriskaWeb" \
       ASPNETCORE_ENVIRONMENT="Production"
   ```

3. **Habilitar CORS**
   ```bash
   az webapp cors add \
     --resource-group rg-chriska \
     --name chriska-api \
     --allowed-origins "https://chriska-web.vercel.app"
   ```

#### Paso 3: Desplegar el código

**Opción 1: GitHub Actions (CI/CD)**

```yaml
# .github/workflows/azure-deploy.yml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup .NET
        uses: actions/setup-dotnet@v1
        with:
          dotnet-version: '8.0.x'

      - name: Build
        run: dotnet build --configuration Release

      - name: Publish
        run: dotnet publish -c Release -o ./publish

      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'chriska-api'
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          package: ./publish
```

**Opción 2: Azure CLI**

```bash
# Compilar
dotnet publish -c Release -o ./publish

# Comprimir
cd publish
zip -r ../deploy.zip *
cd ..

# Desplegar
az webapp deployment source config-zip \
  --resource-group rg-chriska \
  --name chriska-api \
  --src deploy.zip
```

## 6. Configuración Post-Despliegue

### 6.1 Verificación del Sistema

1. **Frontend**

   - Acceder a `https://[tu-app].vercel.app`
   - Verificar que la página carga correctamente
   - Revisar consola del navegador (F12) por errores

2. **Backend**

   - Acceder a `https://[tu-app].azurewebsites.net/swagger`
   - Verificar que Swagger UI se muestra
   - Probar endpoint de health check

3. **Integración**
   - Intentar login desde el frontend
   - Verificar que las llamadas API funcionan
   - Revisar logs en Azure Portal

### 6.2 Monitoreo y Logs

#### Frontend (Vercel)

- Acceder a dashboard.vercel.com
- Sección "Functions" → Ver logs de ejecución
- Sección "Analytics" → Métricas de rendimiento

#### Backend (Azure)

- Azure Portal → App Service → "Log stream"
- Application Insights (si está configurado)
- Kudu console: `https://[tu-app].scm.azurewebsites.net`

## 7. Mantenimiento y Actualizaciones

### 7.1 Proceso de Actualización

#### Frontend

1. Hacer cambios en branch `develop`
2. Crear Pull Request a `main`
3. Merge activa deploy automático en Vercel
4. Rollback disponible en dashboard de Vercel

#### Backend

1. Hacer cambios y probar localmente
2. Push a `main` activa CI/CD
3. Verificar en Azure Portal → Deployment Center
4. Rollback disponible en Deployment Slots

### 7.2 Backups de Base de Datos

Azure SQL Database incluye backups automáticos:

- Point-in-time restore: últimos 7-35 días
- Geo-redundant backups automáticos
- Configurar backups manuales si es necesario:

```bash
az sql db export \
  --resource-group rg-chriska \
  --server chriska-sql-server \
  --database ChriskaDB \
  --admin-user chriska-admin \
  --admin-password [PASSWORD] \
  --storage-key [STORAGE_KEY] \
  --storage-uri "https://[storage].blob.core.windows.net/backups/backup.bacpac"
```

## 8. Solución de Problemas Comunes

### 8.1 Frontend

**Error: "Failed to connect to API"**

- Verificar variable `NEXT_PUBLIC_API_URL` en Vercel
- Verificar CORS en backend
- Revisar certificados SSL

**Error: "Build failed"**

- Revisar logs en Vercel dashboard
- Verificar versión de Node.js
- Limpiar caché: `npm cache clean --force`

### 8.2 Backend

**Error: "Database connection failed"**

- Verificar connection string en Azure
- Verificar firewall rules en SQL Server
- Verificar credenciales

**Error: "JWT validation failed"**

- Verificar que JWT_SECRET coincide en frontend y backend
- Verificar fecha/hora del servidor

### 8.3 Comandos Útiles para Debugging

```bash
# Ver logs del frontend (local)
npm run dev

# Ver logs del backend (local)
dotnet run --verbosity detailed

# Ver logs en Azure
az webapp log tail \
  --resource-group rg-chriska \
  --name chriska-api

# Reiniciar App Service
az webapp restart \
  --resource-group rg-chriska \
  --name chriska-api

# Ver estado de la aplicación
az webapp show \
  --resource-group rg-chriska \
  --name chriska-api \
  --query state
```

## 9. Seguridad y Mejores Prácticas

### 9.1 Checklist de Seguridad

- ✅ HTTPS habilitado en ambos servicios
- ✅ Variables sensibles en variables de entorno
- ✅ JWT tokens con expiración
- ✅ CORS configurado restrictivamente
- ✅ SQL injection prevention (Entity Framework)
- ✅ Rate limiting en API
- ✅ Logs sin información sensible

### 9.2 Recomendaciones

1. Cambiar JWT_SECRET en producción (mínimo 32 caracteres)
2. Habilitar Application Insights para monitoreo
3. Configurar alertas para errores críticos
4. Implementar health checks
5. Documentar todos los cambios en CHANGELOG

## 10. Costos Estimados

### Servicios Gratuitos

- **Vercel Hobby Plan**: $0/mes

  - 100GB bandwidth
  - Unlimited deployments
  - SSL automático

- **Azure Free Tier** (12 meses):
  - App Service: B1 instance
  - SQL Database: 250GB
  - $200 créditos iniciales

### Plan Producción (Estimado)

- Vercel Pro: $20/mes
- Azure App Service B2: ~$55/mes
- Azure SQL Database S0: ~$15/mes
- **Total**: ~$90/mes

## 11. Contacto y Soporte

Para dudas sobre el despliegue o acceso a los recursos:

- Repositorios en GitHub (públicos)
- Documentación técnica en `/docs`
- API documentation en `/swagger` cuando el backend está corriendo

---

**Nota**: Este manual forma parte de la documentación de tesis del Sistema de Gestión de Inventario para Chriska SRL. Todos los servicios cloud mencionados ofrecen planes gratuitos o de estudiante adecuados para proyectos académicos.
