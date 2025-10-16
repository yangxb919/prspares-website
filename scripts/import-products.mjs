#!/usr/bin/env node
/*
  Import products from CSV into Supabase `products` table.
  - BOM tolerant
  - Batches inserts
  - Cleans price values and normalizes currency (default USD)

  Usage:
    node scripts/import-products.mjs ./data/products.csv

  Requirements:
    - env SUPABASE_URL, SUPABASE_SERVICE_ROLE (service role key)
    - Table `products` as per supabase/products_schema.sql
*/

import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { parse } from "csv-parse/sync";
import * as iconv from "iconv-lite";

// Load .env.local if present
try {
  const dotenv = await import("dotenv");
  dotenv.config({ path: ".env.local" });
} catch (_) {}

function usage(msg) {
  if (msg) console.error(msg);
  console.error("\nUsage: node scripts/import-products.mjs <csv_path>\n");
  process.exit(1);
}

const csvPath = process.argv[2];
if (!csvPath) usage("Missing CSV path");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  usage("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE in env");
}

function parsePrice(input) {
  if (input == null) return null;
  const str = String(input).trim();
  if (!str) return null;
  // Remove everything except digits, minus and dot
  const cleaned = str
    .replace(/[^0-9.\-]/g, "")
    .replace(/\u00A0/g, "");
  const num = Number.parseFloat(cleaned);
  return Number.isFinite(num) ? num : null;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function slugify(input) {
  if (!input) return null;
  return String(input)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const abs = path.resolve(csvPath);
const buf = await fs.readFile(abs);
let content = buf.toString("utf8");
// Heuristic: if replacement char appears a lot, try GB18030 decode
const replRatio = (content.slice(0, 400).match(/�/g)?.length || 0) / Math.max(1, content.slice(0, 400).length);
if (replRatio > 0.02) {
  try {
    content = iconv.decode(buf, "gb18030");
    console.log("[import] decoded CSV using gb18030");
  } catch (e) {
    console.warn("[import] gb18030 decode failed, fallback to utf8");
  }
}

const records = parse(content, {
  bom: true,
  columns: true,
  skip_empty_lines: true,
  trim: true,
});

if (!Array.isArray(records) || records.length === 0) {
  console.log("No rows to import.");
  process.exit(0);
}

// Column mapping with multilingual support
const col = (row, candidates) => {
  for (const c of candidates) if (c in row) return c;
  return undefined;
};
const sample = records[0];
const titleCol = col(sample, [
  "title", "name", "product", "product_name",
  "产品", "产品名称", "商品名称", "品名", "����", "��Ʒ����"
]);
const imageCol = col(sample, [
  "image", "image_url", "img", "picture", "image link",
  "图片", "图片链接", "产品图片", "产品图片_URL", "��ƷͼƬ", "��ƷͼƬ_URL"
]);
const urlCol = col(sample, [
  "url", "link", "product_url", "产品链接", "商品链接"
]);
const priceCol = col(sample, [
  "price", "售价", "单价", "金额", "价格", "�۸�"
]);
const currencyCol = col(sample, [
  "currency", "币种", "货币"
]);
const slugCol = col(sample, ["slug", "短链", "别名"]);

if (!titleCol) usage("Could not find a title/name column in CSV");
if (!imageCol) console.warn("[import] No image column detected; images will be null");

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let success = 0;
let rowIndexOffset = 2; // header is row 1, data starts at row 2

const prepared = records.map((r, idx) => {
  const title = titleCol ? r[titleCol] ?? null : null;
  const slug = slugCol && r[slugCol] ? r[slugCol] : slugify(title);
  return {
    title,
    slug: slug || null,
    url: urlCol ? r[urlCol] ?? null : null,
    image: imageCol ? r[imageCol] ?? null : null,
    price: priceCol != null && r[priceCol] != null ? parsePrice(r[priceCol]) : null,
    currency: (currencyCol && r[currencyCol]) ? String(r[currencyCol]).toUpperCase() : (String(r[priceCol]||"").trim().startsWith("US$") ? "USD" : "USD"),
  };
});

const withUrl = prepared.filter(r => r.url);
const withoutUrl = prepared.filter(r => !r.url && r.slug);

for (const group of chunk(withUrl, 500)) {
  const { error } = await supabase
    .from("products")
    .upsert(group, { onConflict: 'url', ignoreDuplicates: false });
  if (error) {
    const failedAt = success + rowIndexOffset; 
    console.error(`\nImport failed near CSV row ${failedAt}:`, error.message);
    process.exit(1);
  }
  success += group.length;
}

for (const group of chunk(withoutUrl, 500)) {
  const { error } = await supabase
    .from("products")
    .upsert(group, { onConflict: 'slug', ignoreDuplicates: false });
  if (error) {
    const failedAt = success + rowIndexOffset; 
    console.error(`\nImport failed near CSV row ${failedAt}:`, error.message);
    process.exit(1);
  }
  success += group.length;
}

console.log(`Imported ${success} rows successfully.`);
