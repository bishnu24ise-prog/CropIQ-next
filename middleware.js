import { NextResponse } from 'next/server';

// Routes that require authentication
const PROTECTED = ['/dashboard', '/weather', '/loan-tracker', '/market', '/schemes', '/crop-doctor', '/community', '/debt-fund', '/analytics', '/knowledge', '/chatbot', '/offline', '/profile', '/irrigation', '/market-forecast', '/farmer-analytics'];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get('token')?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('reason', 'auth');
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)'],
};
