import { NextResponse } from "next/server";

// IndexNow key file — served as a route handler so it bypasses
// Vercel's global www-redirect middleware that affects static files.
export function GET() {
  return new NextResponse("272eea5409654b49b404dee73c5f0bfb", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
