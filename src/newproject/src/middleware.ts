import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const response = NextResponse.next();
    response.headers.set('x-request-url', req.url);
    return response;
}

export const config = {
    matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};