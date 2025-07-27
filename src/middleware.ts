import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJwtPayload(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = JSON.parse(atob(padded));

    // 🔧 FIX: Normalizar el needsPasswordChange
    decoded.needsPasswordChange =
      decoded.needsPasswordChange === true ||
      decoded.needsPasswordChange === 'true' ||
      decoded.needsPasswordChange === 'True';

    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth-token')?.value;

  // Rutas que no requieren autenticación
  if (pathname === '/iniciar-sesion') {
    // Si ya está logueado, redirigir según si necesita cambiar contraseña
    if (authToken) {
      const decoded = decodeJwtPayload(authToken);
      if (decoded?.needsPasswordChange === true) {
        return NextResponse.redirect(new URL('/cambiar-contrasena', request.url));
      } else {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
    // Si no tiene token, permitir acceso al login
    return NextResponse.next();
  }

  // Para todas las demás rutas, verificar autenticación
  if (!authToken) {
    return NextResponse.redirect(new URL('/iniciar-sesion', request.url));
  }

  // Decodificar token para verificar estado
  const decoded = decodeJwtPayload(authToken);
  if (!decoded) {
    // Token inválido, eliminar cookie y redirigir al login
    const response = NextResponse.redirect(new URL('/iniciar-sesion', request.url));
    response.cookies.delete('auth-token');
    return response;
  }

  // Si necesita cambiar contraseña
  if (decoded.needsPasswordChange === true) {
    // Solo permitir acceso a la página de cambio de contraseña
    if (pathname !== '/cambiar-contrasena') {
      return NextResponse.redirect(new URL('/cambiar-contrasena', request.url));
    }
  } else {
    // Si NO necesita cambiar contraseña pero está en esa página, redirigir al home
    if (pathname === '/cambiar-contrasena') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/usuarios/:path*',
    '/productos/:path*',
    '/roles/:path*',
    '/marcas/:path*',
    '/categorias/:path*',
    '/vehiculos/:path*',
    '/clientes/:path*',
    '/zonas/:path*',
    '/proveedores/:path*',
    '/movimientos-de-stock/:path*',
    '/depositos-y-estanterias/:path*',
    '/cambiar-contrasena/:path*',
    '/iniciar-sesion',
  ],
};
