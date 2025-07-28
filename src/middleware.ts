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

    decoded.needsPasswordChange =
      decoded.needsPasswordChange === true ||
      decoded.needsPasswordChange === 'true' ||
      decoded.needsPasswordChange === 'True';

    return decoded;
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth-token')?.value;

  try {
    if (pathname === '/iniciar-sesion') {
      if (authToken) {
        const decoded = decodeJwtPayload(authToken);

        if (!decoded) {
          const response = NextResponse.next();
          response.cookies.delete('auth-token');
          return response;
        }

        const redirectUrl = decoded.needsPasswordChange === true ? '/cambiar-contrasena' : '/';

        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
      return NextResponse.next();
    }

    if (pathname === '/') {
      if (!authToken) {
        return NextResponse.redirect(new URL('/iniciar-sesion', request.url));
      }

      const decoded = decodeJwtPayload(authToken);
      if (!decoded) {
        const response = NextResponse.redirect(new URL('/iniciar-sesion', request.url));
        response.cookies.delete('auth-token');
        return response;
      }

      if (decoded.needsPasswordChange === true) {
        return NextResponse.redirect(new URL('/cambiar-contrasena', request.url));
      }

      return NextResponse.next();
    }

    if (!authToken) {
      return NextResponse.redirect(new URL('/iniciar-sesion', request.url));
    }

    const decoded = decodeJwtPayload(authToken);
    if (!decoded) {
      const response = NextResponse.redirect(new URL('/iniciar-sesion', request.url));
      response.cookies.delete('auth-token');
      return response;
    }

    if (decoded.needsPasswordChange === true) {
      if (pathname !== '/cambiar-contrasena') {
        return NextResponse.redirect(new URL('/cambiar-contrasena', request.url));
      }
    } else {
      if (pathname === '/cambiar-contrasena') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    const response = NextResponse.redirect(new URL('/iniciar-sesion', request.url));
    response.cookies.delete('auth-token');
    return response;
  }
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
