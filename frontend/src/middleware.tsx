import { NextResponse } from "next/server";

export function middleware(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
    default-src *;
    script-src 'self' https://clerk.inviolabl.io https://explorer-api.walletconnect.com https://challenges.cloudflare.com 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' https: http: 'unsafe-inline' ${
    process.env.NODE_ENV === "production" ? "" : `'unsafe-eval'`
  };
    style-src 'self' 'unsafe-inline' 'unsafe-eval';
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    img-src * blob: data:;
    form-action 'self';
    frame-ancestors 'none';
    connect-src * https://auth.privy.io wss://relay.walletconnect.com wss://relay.walletconnect.org wss://www.walletlink.org https://*.infura.io https://*.blastapi.io;
    frame-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org https://challenges.cloudflare.com https://clerk.inviolabl.io;
`;
  // Replace newline characters and spaces
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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};