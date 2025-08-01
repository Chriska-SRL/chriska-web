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
  
  // If JWT_SECRET is available, use secure verification
  if (jwtSecret) {
    try {
      // Convert string secret to Uint8Array for jose
      const secret = new TextEncoder().encode(jwtSecret);
      
      // Verify JWT signature and decode payload
      const { payload } = await jwtVerify(token, secret);

      // Normalize needsPasswordChange boolean
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
      // JWT verification failed - could be expired, invalid signature, etc.
      if (process.env.NODE_ENV === 'development') {
        console.log('JWT verification failed:', error);
      }
      return null;
    }
  } else {
    // Fallback to unsafe decoding if JWT_SECRET is not set
    if (process.env.NODE_ENV === 'development') {
      console.warn('JWT_SECRET not set - using unsafe JWT decoding. Set JWT_SECRET for production security.');
    }
    return decodeJwtPayloadUnsafe(token);
  }
}

// Fallback function for when JWT_SECRET is not available (backwards compatibility)
function decodeJwtPayloadUnsafe(token: string): DecodedToken {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = JSON.parse(atob(padded));

    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (!decoded.exp || decoded.exp < currentTime) {
      return null;
    }

    // Normalize needsPasswordChange boolean
    const needsPasswordChange = 
      decoded.needsPasswordChange === true ||
      decoded.needsPasswordChange === 'true' ||
      decoded.needsPasswordChange === 'True';

    return {
      userId: decoded.userId,
      username: decoded.username,
      needsPasswordChange,
      exp: decoded.exp,
    };
  } catch (error) {
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
    // Handle login page - redirect authenticated users
    if (pathname === '/iniciar-sesion') {
      if (!authToken) {
        return NextResponse.next();
      }

      const decoded = await verifyAndDecodeJWT(authToken);
      if (!decoded) {
        // Invalid token, clear it and stay on login page
        const response = NextResponse.next();
        response.cookies.delete('auth-token');
        return response;
      }

      // Valid token, redirect based on password change requirement
      const redirectUrl = decoded.needsPasswordChange ? '/cambiar-contrasena' : '/';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Handle home page - require authentication
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

    // Handle password change page
    if (pathname === '/cambiar-contrasena') {
      if (!authToken) {
        return NextResponse.redirect(new URL('/iniciar-sesion', request.url));
      }

      const decoded = await verifyAndDecodeJWT(authToken);
      if (!decoded) {
        return createUnauthenticatedResponse('/iniciar-sesion', request);
      }

      // If password change is not required, redirect to home
      if (!decoded.needsPasswordChange) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      return NextResponse.next();
    }

    // Handle all other protected routes
    if (!authToken) {
      return NextResponse.redirect(new URL('/iniciar-sesion', request.url));
    }

    const decoded = await verifyAndDecodeJWT(authToken);
    if (!decoded) {
      return createUnauthenticatedResponse('/iniciar-sesion', request);
    }

    // Force password change if required
    if (decoded.needsPasswordChange) {
      return NextResponse.redirect(new URL('/cambiar-contrasena', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // Log error in production for security monitoring
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
    '/depositos-y-estanterias/:path*',
    '/cambiar-contrasena/:path*',
    '/iniciar-sesion',
  ],
};
