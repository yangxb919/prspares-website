import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const slug = decodeURIComponent(params.slug);
  let fallback = new URL(`/contact?product=${encodeURIComponent(slug)}`, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");

  try {
    const supabase = getAdminClient();
    const { data: product } = await supabase
      .from("products")
      .select("id, url, clicks")
      .eq("slug", slug)
      .maybeSingle();

    if (!product || !product.url) {
      return NextResponse.redirect(fallback, 302);
    }

    // Optional click statistic (best-effort)
    try {
      await supabase.from("products").update({ clicks: (product as any).clicks + 1 || 1 }).eq("id", product.id);
    } catch (_) {
      // ignore stats failures
    }

    return NextResponse.redirect(product.url, 302);
  } catch {
    return NextResponse.redirect(fallback, 302);
  }
}

