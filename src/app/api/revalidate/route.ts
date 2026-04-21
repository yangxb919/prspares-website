import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function authorized(req: NextRequest) {
  const secret =
    req.nextUrl.searchParams.get('secret') ||
    req.headers.get('x-revalidate-secret');
  const expected = process.env.REVALIDATE_SECRET;
  return expected && secret && secret === expected;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const path = req.nextUrl.searchParams.get('path');
  const tag = req.nextUrl.searchParams.get('tag');
  const results: string[] = [];

  if (path) {
    revalidatePath(path);
    results.push(`revalidatePath: ${path}`);
  }
  if (tag) {
    revalidateTag(tag);
    results.push(`revalidateTag: ${tag}`);
  }
  if (!path && !tag) {
    // Default: refresh blog list + all blog posts by tag
    revalidatePath('/blog');
    revalidatePath('/blog/[slug]', 'page');
    results.push('revalidatePath: /blog', 'revalidatePath: /blog/[slug] (page)');
  }

  return NextResponse.json({ ok: true, revalidated: true, results, now: Date.now() });
}

export async function POST(req: NextRequest) {
  return GET(req);
}
