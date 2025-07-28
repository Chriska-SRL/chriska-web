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

    // Normalizar el needsPasswordChange
    decoded.needsPasswordChange =
      decoded.needsPasswordChange === true ||
      decoded.needsPasswordChange === 'true' ||
      decoded.needsPasswordChange === 'True';

    return decoded;
  } catch (error) {
    console.error('🔴 MIDDLEWARE ERROR - Error decoding JWT:', error);
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth-token')?.value;

  // 🔍 DEBUG: Logs detallados
  console.log('🔵 MIDDLEWARE START:', {
    pathname,
    hasToken: !!authToken,
    tokenLength: authToken?.length || 0,
    userAgent: request.headers.get('user-agent')?.substring(0, 50),
    timestamp: new Date().toISOString(),
  });

  // Caso 1: Ruta de login
  if (pathname === '/iniciar-sesion') {
    console.log('🟡 LOGIN ROUTE - Checking auth status');

    if (authToken) {
      console.log('🟢 LOGIN ROUTE - Has token, decoding...');
      const decoded = decodeJwtPayload(authToken);

      if (!decoded) {
        console.log('🔴 LOGIN ROUTE - Invalid token, allowing login');
        return NextResponse.next();
      }

      console.log('🟢 LOGIN ROUTE - Valid token:', {
        username: decoded.username,
        needsPasswordChange: decoded.needsPasswordChange,
      });

      if (decoded.needsPasswordChange === true) {
        console.log('🔄 LOGIN ROUTE - Redirecting to password change');
        return NextResponse.redirect(new URL('/cambiar-contrasena', request.url));
      } else {
        console.log('🔄 LOGIN ROUTE - Redirecting to home');
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    console.log('🟢 LOGIN ROUTE - No token, allowing access');
    return NextResponse.next();
  }

  // Caso 2: Todas las demás rutas protegidas
  console.log('🟡 PROTECTED ROUTE - Checking auth');

  if (!authToken) {
    console.log('🔄 PROTECTED ROUTE - No token, redirecting to login');
    return NextResponse.redirect(new URL('/iniciar-sesion', request.url));
  }

  // Decodificar token
  console.log('🟡 PROTECTED ROUTE - Decoding token...');
  const decoded = decodeJwtPayload(authToken);

  if (!decoded) {
    console.log('🔴 PROTECTED ROUTE - Invalid token, clearing and redirecting');
    const response = NextResponse.redirect(new URL('/iniciar-sesion', request.url));
    response.cookies.delete('auth-token');
    return response;
  }

  console.log('🟢 PROTECTED ROUTE - Valid token:', {
    username: decoded.username,
    needsPasswordChange: decoded.needsPasswordChange,
    currentPath: pathname,
  });

  // Verificar si necesita cambiar contraseña
  if (decoded.needsPasswordChange === true) {
    console.log('🟡 PROTECTED ROUTE - Needs password change');

    if (pathname !== '/cambiar-contrasena') {
      console.log('🔄 PROTECTED ROUTE - Redirecting to password change');
      return NextResponse.redirect(new URL('/cambiar-contrasena', request.url));
    } else {
      console.log('🟢 PROTECTED ROUTE - Already on password change page');
    }
  } else {
    console.log('🟡 PROTECTED ROUTE - No password change needed');

    if (pathname === '/cambiar-contrasena') {
      console.log('🔄 PROTECTED ROUTE - Redirecting away from password change');
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  console.log('🟢 MIDDLEWARE END - Allowing access to:', pathname);
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
