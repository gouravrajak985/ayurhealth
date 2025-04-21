import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
 
export default authMiddleware({
  publicRoutes: ["/", "/api/webhook"],
  async afterAuth(auth, req) {
    if (auth.userId && !auth.isPublicRoute) {
      try {
        const userResponse = await fetch(`${req.nextUrl.origin}/api/user`);
        if (!userResponse.ok) throw new Error('Failed to fetch user');
        
        const user = await userResponse.json();
        
        if (user.subscriptionStatus === 'unpaid' && !req.nextUrl.pathname.includes('/subscription')) {
          return NextResponse.redirect(new URL('/subscription', req.url));
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    }
  }
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};