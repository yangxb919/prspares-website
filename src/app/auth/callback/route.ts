import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient();
    // Establish the session from the auth code
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to pricing after confirming session
  return NextResponse.redirect(new URL("/pricing", origin));
}

