import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Solo verificar si existe la cookie, no decodificar
  const authToken = request.cookies.get('auth-token')?.value;
  const hasToken = !!authToken;

  // Rutas públicas - verificar PRIMERO
  const publicRoutes = ['/iniciar-sesion'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    if (hasToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Rutas protegidas - todas las que tenías
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
    '/configuracion',
  ];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !hasToken) {
    return NextResponse.redirect(new URL('/iniciar-sesion', request.url));
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
