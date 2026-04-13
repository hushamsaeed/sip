import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/login";
  const isApiAuth = req.nextUrl.pathname.startsWith("/api/auth");

  if (isApiAuth) return;

  if (isAdminRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL("/admin/dashboard", req.nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
