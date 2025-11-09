import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "./libauth/auth0";

export async function middleware(request: NextRequest) {
  const response = await auth0.middleware(request);
  
  // Define protected routes
  const protectedRoutes = ["/private"];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    try {
      // Check if user is authenticated
      const session = await auth0.getSession(request);
      
      if (!session || !session.user) {
        // User is not logged in, redirect to login
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      // If there's an error getting the session, redirect to login
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};