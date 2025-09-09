import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

type DecodedToken = {
  userId: number;
  username: string;
  needsPasswordChange: boolean;
  exp: number;
} | null;

async function verifyAndDecodeJWT(token: string): Promise<DecodedToken> {
  const jwtSecret = process.env.JWT_SECRET;

  if (jwtSecret) {
    try {
      const secret = new TextEncoder().encode(jwtSecret);

      const { payload } = await jwtVerify(token, secret);

      const needsPasswordChange =
        payload.needsPasswordChange === true ||
        payload.needsPasswordChange === 'true' ||
        payload.needsPasswordChange === 'True';

      return {
        userId: payload.userId as number,
        username: payload.username as string,
        needsPasswordChange,
        exp: payload.exp as number,
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('JWT verification failed:', error);
      }
      return null;
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.warn('JWT_SECRET not set - using unsafe JWT decoding. Set JWT_SECRET for production security.');
    }
    return null;
  }
}

function createUnauthenticatedResponse(redirectUrl: string, request: NextRequest) {
  const response = NextResponse.redirect(new URL(redirectUrl, request.url));
  response.cookies.delete('auth-token');
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('auth-token')?.value;

  try {
    if (pathname === '/iniciar-sesion') {
      if (!authToken) {
        return NextResponse.next();
      }

      const decoded = await verifyAndDecodeJWT(authToken);
      if (!decoded) {
        const response = NextResponse.next();
        response.cookies.delete('auth-token');
        return response;
      }

      const redirectUrl = decoded.needsPasswordChange ? '/cambiar-contrasena' : '/';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    if (pathname === '/') {
      if (!authToken) {
        return NextResponse.redirect(new URL('/iniciar-sesion', request.url));
      }

      const decoded = await verifyAndDecodeJWT(authToken);
      if (!decoded) {
        return createUnauthenticatedResponse('/iniciar-sesion', request);
      }

      if (decoded.needsPasswordChange) {
        return NextResponse.redirect(new URL('/cambiar-contrasena', request.url));
      }

      return NextResponse.next();
    }

    if (pathname === '/cambiar-contrasena') {
      if (!authToken) {
        return NextResponse.redirect(new URL('/iniciar-sesion', request.url));
      }

      const decoded = await verifyAndDecodeJWT(authToken);
      if (!decoded) {
        return createUnauthenticatedResponse('/iniciar-sesion', request);
      }

      if (!decoded.needsPasswordChange) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      return NextResponse.next();
    }

    if (!authToken) {
      return NextResponse.redirect(new URL('/iniciar-sesion', request.url));
    }

    const decoded = await verifyAndDecodeJWT(authToken);
    if (!decoded) {
      return createUnauthenticatedResponse('/iniciar-sesion', request);
    }

    if (decoded.needsPasswordChange) {
      return NextResponse.redirect(new URL('/cambiar-contrasena', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return createUnauthenticatedResponse('/iniciar-sesion', request);
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
    '/depositos/:path*',
    '/ordenes/:path*',
    '/pedidos/:path*',
    '/entregas/:path*',
    '/devoluciones/:path*',
    '/pagos-de-clientes/:path*',
    '/descuentos/:path*',
    '/repartos/:path*',
    '/mapa/:path*',
    '/cambiar-contrasena/:path*',
    '/iniciar-sesion',
  ],
};
