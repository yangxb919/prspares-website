import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { RedirectToLogin } from "./RedirectToLogin";
import PricingClient from "./PricingClient";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function PricingPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[]>;
}) {
  const supabase = createClient();

  let products: any[] | null = null;
  let error: any = null;

  try {
    // Get user session with strict validation
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    const { data: userRes, error: userError } = await supabase.auth.getUser();
    const user = userRes.user;

    console.log("?? Debug - Auth check:", {
      hasSession: !!session,
      hasUser: !!user,
      sessionError,
      userError,
      userId: user?.id
    });

    // Strict authentication check - require both session and user
    if (!session || !user || sessionError || userError) {
      console.log("? Authentication failed - no valid session or user");
      return <RedirectToLogin />;
    }

    // Check email confirmation status
    const confirmed = user.email_confirmed_at || (user as any)?.confirmed_at;
    console.log("?? Debug - User confirmation:", {
      confirmed: !!confirmed,
      email: user.email,
      emailConfirmedAt: user.email_confirmed_at
    });

    if (!confirmed) {
      console.log("? User email not confirmed, redirecting to login");
      return <RedirectToLogin />;
    }

    // Additional security check - verify session is not expired
    if (session.expires_at && session.expires_at < Math.floor(Date.now() / 1000)) {
      console.log("? Session expired, redirecting to login");
      return <RedirectToLogin />;
    }

    console.log("?? Debug - Fetching products via API...");

    // Prefer relative fetch to avoid origin/port mismatch in reverse proxy setups.
    let response: Response;
    try {
      response = await fetch(`/api/products`, { cache: "no-store" });
    } catch (_e) {
      // Fallback to absolute URL if relative fetch fails
      const h = headers();
      const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
      const proto = h.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
      const base = process.env.NEXT_PUBLIC_SITE_URL || `${proto}://${host}`;
      response = await fetch(`${base}/api/products`, { cache: "no-store" });
    }
    const apiResult = await response.json();

    if (response.ok) {
      products = apiResult.products;
      error = null;
    } else {
      products = null;
      error = { message: apiResult.error || 'Failed to fetch products' };
    }

    console.log("?? Debug - API result:", {
      productsCount: products?.length || 0,
      error: error?.message || null
    });
  } catch (err) {
    console.error("Error in PricingPage:", err);
    error = err;
  }

  const debug = (searchParams?.debug === "1") as boolean;

  return <PricingClient products={products} error={error} debug={debug} />;
}

