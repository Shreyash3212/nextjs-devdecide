"use server";

import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import { redirect } from 'next/navigation';

export async function loginAdmin(formData) {
  const username = formData.get('username');
  const password = formData.get('password');

  // 1. Check if credentials match the .env.local file
  if (
    username === process.env.ADMIN_USERNAME && 
    password === process.env.ADMIN_PASSWORD
  ) {
    // 2. Create an encrypted JWT Token
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h') // Forces you to log in again after 24 hours
      .sign(secretKey);

    // 3. Set the HTTP-only cookie (Next.js 15 requires await for cookies)
    const cookieStore = await cookies();
    cookieStore.set('admin_session', token, {
      httpOnly: true, // Prevents cross-site scripting (XSS) attacks
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours in seconds
      path: '/',
    });

    // 4. Redirect to the dashboard
    redirect('/admin');
  } else {
    return { error: "Invalid username or password" };
  }
}

// Optional: A quick function to log out
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/login');
}