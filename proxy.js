// proxy.js (in the root of your project)
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Changed function name to 'proxy'
export async function proxy(request) {
  // 1. Get the cookie from the incoming request
  const token = request.cookies.get('admin_session')?.value;

  // 2. If there is no token, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // 3. Verify the token using the secret key
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secretKey);
    
    // If verification passes, allow them into the admin panel
    return NextResponse.next();
  } catch (error) {
    // If the token is fake or expired, kick them out
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// 4. Only run this proxy on /admin and its sub-pages
export const config = {
  matcher: ['/admin/:path*'],
};