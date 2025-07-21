import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isTokenValid = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));

    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch {
    return false;
  }
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authToken = request.cookies.get('auth-token')?.value;
  const isAuthenticated = authToken && isTokenValid(authToken);

  const publicRoutes = ['/iniciar-sesion'];

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  const protectedRoutes = [
    '/',
    '/usuarios',
    '/productos',
    '/roles',
    '/marcas',
    '/categorias',
    '/vehiculos',
    '/clientes',
    '/zonas',
    '/proveedores',
    '/movimientos-de-stock',
    '/depositos-y-estanterias',
    '/cambiar-contrasena',
    '/perfil',
  ];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/iniciar-sesion', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|woff|woff2|ttf|eot|ico)$).*)',
  ],
};
