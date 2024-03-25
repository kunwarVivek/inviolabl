import { NextResponse } from "next/server";

export function middleware(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
    default-src * data: blob: 'unsafe-inline' 'unsafe-eval';
    script-src * data: blob: 'unsafe-inline' 'unsafe-eval';
    connect-src * data: blob: 'unsafe-inline' 'unsafe-eval' ipc://*;
    img-src * data: blob: 'unsafe-inline' 'unsafe-eval';
    frame-src * data: blob: 'unsafe-inline' 'unsafe-eval';
    style-src * data: blob: 'unsafe-inline' 'unsafe-eval';
    font-src * data: blob: 'unsafe-inline' 'unsafe-eval';
    object-src * data: blob: 'unsafe-inline' 'unsafe-eval';
    media-src * data: blob: 'unsafe-inline' 'unsafe-eval';
    child-src * data: blob: 'unsafe-inline' 'unsafe-eval';
    form-action * data: blob: 'unsafe-inline' 'unsafe-eval';
    worker-src * data: blob: 'unsafe-inline' 'unsafe-eval';
`;
  
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};