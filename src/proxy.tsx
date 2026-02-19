import { NextRequest, NextResponse } from "next/server";

const publicRoutes = [
  { path: "/", whenAuthenticated: "redirect" },
  { path: "/login", whenAuthenticated: "redirect" },
  { path: "/register", whenAuthenticated: "redirect" },
] as const;

const WHEN_NOT_AUTHENTICATED_ROUTE = "/login";
const AUTHENTICATED_HOME_ROUTE = "/home";

export function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  // Verificar se é uma rota pública
  const publicRoute = publicRoutes.find((item) => {
    if (item.path.includes(":id")) {
      const basePath = item.path.split(":id")[0];
      return pathName.startsWith(basePath) && pathName.length > basePath.length;
    }
    return item.path === pathName;
  });

  const token = request.cookies.get("@EstudaEasy:accessToken")?.value;

  // Caso 1: Rota pública SEM autenticação → permitir acesso
  if (publicRoute && !token) {
    return NextResponse.next();
  }

  // Caso 2: Rota privada SEM autenticação → redirecionar para login
  if (!publicRoute && !token) {
    return NextResponse.redirect(new URL(WHEN_NOT_AUTHENTICATED_ROUTE, request.url));
  }

  // Caso 3: Rota pública COM autenticação → redirecionar para home
  if (publicRoute && token && publicRoute.whenAuthenticated === "redirect") {
    return NextResponse.redirect(new URL(AUTHENTICATED_HOME_ROUTE, request.url));
  }

  // Caso 4: Rota privada COM autenticação
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - .svg (arquivos SVG)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*.svg|.*.png).*)",
  ],
};
