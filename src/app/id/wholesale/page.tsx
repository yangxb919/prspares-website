'use client';

import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  CheckCircle, Factory, Shield, Clock, Award, ChevronDown, ChevronUp,
  Phone, Mail, MessageSquare, Send, Zap, Users, Plus, Minus,
} from 'lucide-react';
import ScrollAnimator from '@/components/ScrollAnimator';
import { submitRfqAndNotify } from '@/lib/rfq-client';
import { useTurnstile } from '@/components/common/Turnstile';
import Honeypot from '@/components/common/Honeypot';
import { markAsHumanVerified, trackEvent } from '@/lib/analytics';
import styles from '../../home.module.css';

// WhatsApp configuration (Indonesian audience — greet in Bahasa Indonesia)
// Override via NEXT_PUBLIC_WA_NUMBER once the +62 Indonesian line is provisioned.
const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || '85363902425';
const WA_DISPLAY = WA_NUMBER.startsWith('+') ? WA_NUMBER : `+${WA_NUMBER}`;
const WA_GREETING = encodeURIComponent(
  'Halo, saya ingin minta penawaran grosir sparepart HP untuk toko saya. Bisa kirim katalog dan harga?'
);
const WA_URL = `https://wa.me/${WA_NUMBER.replace(/^\+/, '')}?text=${WA_GREETING}`;

// Unified tracking schema for SEA wholesale pages — every event ships with these
// dimensions so GA4 can segment by language / channel / placement in Looker Studio.
const TRACK_BASE = { lang: 'id', page_type: 'sea_wholesale' } as const;

// ─── Types ───────────────────────────────────────────────────────
interface FormData {
  company: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  products: string;
  models: string;
  quantity: string;
  quality: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

// ─── FAQ Data (4 item MVP) ───────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: 'Berapa MOQ (minimum order) kalian?',
    a: 'MOQ kami fleksibel — mulai 10 pcs untuk LCD HP dan 20 pcs untuk baterai / sparepart kecil. Kami melayani dari toko kecil sampai distributor besar.',
  },
  {
    q: 'Berapa lama lead time pengiriman?',
    a: 'Stok ready kirim di hari yang sama atau hari kerja berikutnya. Untuk order besar (1.000+ pcs), lead time 3–5 hari kerja.',
  },
  {
    q: 'Metode pembayaran apa saja yang diterima?',
    a: 'Kami terima T/T (Transfer Bank Internasional), PayPal, Western Union, dan Alibaba Trade Assurance untuk keamanan transaksi Anda.',
  },
  {
    q: 'Bagaimana kebijakan garansi?',
    a: 'Semua produk bergaransi 12 bulan. RMA rate kami di bawah 1%. Barang cacat kami ganti gratis.',
  },
];

// ─── Product Categories ──────────────────────────────────────────
const PRODUCT_CATEGORIES = [
  {
    name: 'LCD / OLED HP',
    image: '/images/screens-hero.jpg',
    items: ['LCD iPhone / OLED', 'AMOLED Samsung', 'Layar Android'],
    href: '/products/screens',
  },
  {
    name: 'Baterai HP',
    image: '/images/batteries-hero.jpg',
    items: ['Kapasitas Tinggi', 'Kualitas Original', 'Semua Merek Utama'],
    href: '/products/batteries',
  },
  {
    name: 'Komponen & Fleksibel HP',
    image: '/images/small-parts-hero.jpg',
    items: ['Fleksibel', 'Konektor Cas', 'Speaker & Tombol'],
    href: '/products/small-parts',
  },
  {
    name: 'Tools Reparasi',
    image: '/images/repair-tools-hero.jpg',
    items: ['Tool Kit', 'Programmer', 'Alat Tes'],
    href: '/products/repair-tools',
  },
];

// ─── Trust Stats ─────────────────────────────────────────────────
const TRUST_STATS = [
  { value: '10+', label: 'Tahun Pengalaman', icon: Award },
  { value: '1.000+', label: 'Klien B2B', icon: Users },
  { value: '<1%', label: 'RMA Rate', icon: Shield },
  { value: '24 Jam', label: 'Fast Respon', icon: Clock },
];

function revealStyle(delay: number): CSSProperties {
  return { '--reveal-delay': `${delay}ms` } as CSSProperties;
}

// ─── FAQ Accordion Item ──────────────────────────────────────────
function FaqItem({ item, defaultOpen }: { item: typeof FAQ_ITEMS[0]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className={`overflow-hidden rounded-lg border border-[#ded6c8] bg-white shadow-sm ${styles.motionCard}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between bg-white px-6 py-4 text-left transition-colors hover:bg-[#fffaf0]"
        aria-expanded={open}
      >
        <span className="pr-4 font-black text-[#18212c]">{item.q}</span>
        {open ? <ChevronUp className="h-5 w-5 flex-shrink-0 text-[#52606d]" /> : <ChevronDown className="h-5 w-5 flex-shrink-0 text-[#52606d]" />}
      </button>
      {open && (
        <div className="px-6 pb-4 leading-relaxed text-[#52606d]">
          {item.a}
        </div>
      )}
    </div>
  );
}

// ─── Main Page Component ─────────────────────────────────────────
export default function IdWholesalePage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    company: '', name: '', email: '', phone: '', country: '',
    products: '', models: '', quantity: '', quality: '', message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formStarted, setFormStarted] = useState(false);
  const [showOptional, setShowOptional] = useState(false);

  // Pre-fill product from URL params. Matching is case- and whitespace-insensitive,
  // so links from /products/screens, /products/batteries, BestSellerCard, etc. all land
  // on the right category without each caller having to know the Indonesian label.
  useEffect(() => {
    const url = new URL(window.location.href);
    const productParam = url.searchParams.get('product');
    if (!productParam) return;
    const key = productParam.replace(/\+/g, ' ').toLowerCase().trim();
    const aliases: Record<string, string> = {
      'screens': 'LCD / OLED HP',
      'lcd': 'LCD / OLED HP',
      'lcd/oled screens': 'LCD / OLED HP',
      'wholesale phone screens': 'LCD / OLED HP',
      'other screen models': 'LCD / OLED HP',
      'batteries': 'Baterai HP',
      'battery': 'Baterai HP',
      'wholesale phone batteries': 'Baterai HP',
      'other battery models': 'Baterai HP',
      'small parts': 'Komponen & Fleksibel HP',
      'wholesale small parts': 'Komponen & Fleksibel HP',
      'other small parts': 'Komponen & Fleksibel HP',
      'repair tools': 'Tools Reparasi',
      'tools': 'Tools Reparasi',
      'multiple': 'Campuran',
      'multiple categories': 'Campuran',
    };
    const matched = aliases[key];
    if (matched) {
      setFormData(prev => ({ ...prev, products: matched }));
    }
  }, []);

  // Turnstile
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
  const {
    token: turnstileToken,
    isVerified: isTurnstileVerified,
    hasError: turnstileError,
    isEnabled: isTurnstileEnabled,
    TurnstileWidget,
  } = useTurnstile(turnstileSiteKey);
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isTurnstileVerified) markAsHumanVerified();
  }, [isTurnstileVerified]);

  // IP is captured server-side from request headers (see /api/send-rfq-email).
  // Client-side IP fetch removed: (1) avoids leaking SEA visitor IPs to 3rd-party
  // lookup services (PDPL/PDPA concern), (2) client-supplied IP is untrusted anyway.

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    trackEvent('quote_cta_click', { ...TRACK_BASE, channel: 'form', placement: 'hero' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (submitError) setSubmitError('');
    if (!formStarted) {
      setFormStarted(true);
      trackEvent('begin_form', { ...TRACK_BASE, form_name: 'id_wholesale_inquiry' });
    }
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!formData.name.trim()) errs.name = 'Nama wajib diisi';
    if (!formData.email.trim()) errs.email = 'Email wajib diisi';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'Format email tidak valid';
    if (!formData.products) errs.products = 'Pilih kategori produk';
    if (!formData.quantity) errs.quantity = 'Pilih range jumlah';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Fail-open Turnstile policy (aligned with /wholesale-inquiry after
    // commit cbe3644). If the widget rendered and the user can see it,
    // require it to be solved — that's a fair UX expectation. But if the
    // Turnstile script itself failed to load (CN/SEA networks frequently
    // block challenges.cloudflare.com, ad/privacy extensions can too),
    // do NOT kill the submit; let the server verifyTurnstileToken()
    // soft-pass via honeypot + rate-limit + content checks. The previous
    // fail-closed branch silently lost leads from exactly the markets
    // this page targets.
    //
    // We also do NOT pre-verify the token here — Cloudflare tokens are
    // single-use, and a client-side pre-verify call consumed the token
    // before the server got it, causing every submit to 403. Server
    // verifies once via /api/send-rfq-email → verifyTurnstileToken.
    const turnstileAvailable = isTurnstileEnabled && !turnstileError && typeof window !== 'undefined' && !!window.turnstile;
    if (turnstileAvailable && !isTurnstileVerified) {
      setSubmitError('Silakan selesaikan verifikasi keamanan.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const productLabel = formData.products;
      const qtyLabel = formData.quantity ? ` | Jumlah: ${formData.quantity}` : '';
      const qualityLabel = formData.quality ? ` | Grade: ${formData.quality}` : '';
      const modelsLabel = formData.models ? `\nTipe/Merek: ${formData.models}` : '';
      const countryLabel = formData.country ? `\nKota: ${formData.country}` : '';
      const msgParts = [
        `[Wholesale Inquiry — /id/wholesale — Bahasa Indonesia]`,
        `Produk: ${productLabel}${qtyLabel}${qualityLabel}`,
        modelsLabel,
        countryLabel,
        formData.message ? `\nDetail: ${formData.message}` : '',
      ].filter(Boolean).join('\n');

      await submitRfqAndNotify({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        phone: formData.phone.trim(),
        productInterest: formData.products,
        message: msgParts,
        pageUrl: window.location.href,
        submittedAt: new Date().toISOString(),
        turnstileToken: turnstileToken || undefined,
        honeypot: honeypotRef.current?.value,
      });

      trackEvent('generate_lead', { ...TRACK_BASE, currency: 'USD', value: 100, channel: 'form' });
      router.push('/thank-you?lang=id');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error tidak dikenal';
      setSubmitError(`Gagal mengirim: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#18212c]">
      <ScrollAnimator />
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-[calc(100svh-150px)] overflow-hidden bg-[#101820] text-white">
        <Image
          src="/hero/wholesale-inquiry.jpg"
          alt="PRSPARES wholesale phone repair parts warehouse"
          fill
          priority
          className={`object-cover ${styles.heroImage}`}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,16,24,0.92),rgba(10,16,24,0.7)_46%,rgba(10,16,24,0.25)_100%)]" />
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,177,64,0.22),transparent_32%),radial-gradient(circle_at_78%_24%,rgba(255,139,47,0.2),transparent_28%)] ${styles.heroAura}`} />

        <div className="relative mx-auto flex min-h-[calc(100svh-150px)] max-w-7xl flex-col justify-between px-4 py-10 sm:px-6 lg:px-8">
          <div className={`max-w-4xl pt-8 md:pt-14 ${styles.heroCopy}`}>
            <div className={`mb-5 inline-flex items-center gap-2 border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur ${styles.heroBadge}`}>
              <CheckCircle className="h-4 w-4 text-[#51d88a]" />
              PRSPARES / Mitra sourcing Shenzhen untuk Indonesia
            </div>
            <h1 className={`max-w-4xl text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-7xl ${styles.heroTitle}`}>
                Grosir Sparepart HP Langsung dari{' '}
              <span className="text-[#ffb36b]">Pabrik Shenzhen</span>
              </h1>
            <p className={`mt-6 max-w-2xl text-lg leading-8 text-slate-100 md:text-xl ${styles.heroText}`}>
                Kualitas OEM — <strong className="text-white">Hemat 30–40% Tanpa Perantara</strong>. Pabrik 10 Tahun · Melayani 1.000+ Teknisi, Konter HP &amp; Reseller — Kirim Langsung ke Seluruh Indonesia.
              </p>

            <div className="mt-6 flex flex-wrap gap-2">
                {['RMA Rate < 1%', 'QC Tested', 'MOQ Mulai 10 pcs', 'Garansi 12 Bulan'].map(badge => (
                <span key={badge} className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/10 px-3 py-2 text-sm font-bold text-white backdrop-blur">
                  <CheckCircle className="h-4 w-4 text-[#51d88a]" />
                    {badge}
                  </span>
                ))}
              </div>

            <div className={`mt-8 flex flex-col gap-3 sm:flex-row ${styles.heroActions}`}>
                <button
                  onClick={scrollToForm}
                className={`inline-flex items-center justify-center gap-2 rounded-md bg-[#ff8a2a] px-6 py-4 text-base font-bold text-white shadow-lg shadow-black/25 transition hover:bg-[#e97313] ${styles.ctaSheen}`}
                >
                  <MessageSquare className="w-5 h-5" />
                  Minta Penawaran Grosir
                </button>
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('whatsapp_click', { ...TRACK_BASE, channel: 'whatsapp', placement: 'hero' })}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <MessageSquare className="w-5 h-5" />
                  Chat WA Sekarang
                </a>
              </div>
            <p className="mt-3 text-sm font-semibold text-slate-200">Penawaran gratis dalam 24 jam — Tanpa komitmen</p>
            </div>

          <div className={`mt-10 grid border-y border-white/20 bg-black/20 backdrop-blur md:grid-cols-4 ${styles.statRail}`}>
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="border-white/20 px-4 py-5 md:border-r last:md:border-r-0">
                <div className="font-mono text-3xl font-black text-[#ffb36b]">{stat.value}</div>
                <div className="mt-1 text-sm font-bold text-white">{stat.label}</div>
                <div className="mt-1 text-xs leading-5 text-slate-200">Wholesale supply signal</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="bg-[#f5f3ee] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-scroll-reveal className="mb-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm font-bold text-[#0b6b45]">Kenapa PRSPARES</p>
              <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">
                Dipilih oleh teknisi, konter HP dan reseller yang reorder rutin.
              </h2>
            </div>
            <p className="text-base leading-7 text-[#52606d] md:text-lg">
              Kami bukan sekadar supplier. Halaman ini dibuat untuk membuat tiga hal cepat terbaca: harga pabrik, QC batch dan ritme pengiriman grosir.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div data-scroll-reveal style={revealStyle(0)} className={`rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm ${styles.motionCard}`}>
              <Factory className={`h-8 w-8 text-[#0b6b45] ${styles.iconPulse}`} />
              <h3 className="mt-5 text-xl font-black text-[#18212c]">Harga Langsung Pabrik</h3>
              <p className="mt-3 text-sm leading-6 text-[#52606d]">
                Beli langsung dari pabrik kami di Shenzhen Huaqiangbei. Tanpa perantara, tanpa markup — hemat 30–40% dibanding distributor lokal.
              </p>
            </div>
            <div data-scroll-reveal style={revealStyle(110)} className={`rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm ${styles.motionCard}`}>
              <Shield className={`h-8 w-8 text-[#0b6b45] ${styles.iconPulse}`} />
              <h3 className="mt-5 text-xl font-black text-[#18212c]">Kualitas OEM Premium</h3>
              <p className="mt-3 text-sm leading-6 text-[#52606d]">
                Sistem QC TQC dengan RMA rate di bawah 1%. Support True Tone untuk layar iPhone. Komponen bersertifikat CE &amp; RoHS.
              </p>
            </div>
            <div data-scroll-reveal style={revealStyle(220)} className={`rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm ${styles.motionCard}`}>
              <Zap className={`h-8 w-8 text-[#0b6b45] ${styles.iconPulse}`} />
              <h3 className="mt-5 text-xl font-black text-[#18212c]">Pengiriman Cepat &amp; MOQ Fleksibel</h3>
              <p className="mt-3 text-sm leading-6 text-[#52606d]">
                Kirim di hari yang sama untuk stok ready. MOQ fleksibel — mulai 10 pcs untuk LCD HP, 20 pcs untuk baterai dan sparepart kecil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRODUCT RANGE ═══ */}
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-scroll-reveal className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold text-[#0b6b45]">Kategori produk</p>
              <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">Sparepart HP lengkap untuk list grosir campuran.</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-[#52606d] md:text-lg">
              Pilih kategori dulu, lalu kirim model dan kuantitas. Tim sales akan konfirmasi harga, MOQ dan rute kirim.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCT_CATEGORIES.map((cat, index) => (
              <a
                key={cat.name}
                href={cat.href}
                data-scroll-reveal="scale"
                style={revealStyle(index * 90)}
                className={`group overflow-hidden rounded-lg border border-[#e4e0d8] bg-white shadow-sm transition hover:border-[#ff8a2a] ${styles.motionCard}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#18212c]">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/12 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 right-4 text-lg font-black leading-6 text-white">{cat.name}</h3>
                </div>
                <div className="p-5">
                  <ul className="space-y-2">
                    {cat.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm font-semibold text-[#27313c]">
                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-[#0b6b45]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW WE WORK ═══ */}
      <section className="bg-[#fffaf0] py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-scroll-reveal className="mb-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-bold text-[#0b6b45]">Cara kerja sama</p>
              <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">Ketentuan grosir dibuat mudah dibaca.</h2>
            </div>
            <p className="text-base leading-7 text-[#52606d] md:text-lg">
              Fokus halaman ini mengikuti homepage baru: buyer langsung paham MOQ, pembayaran, pengiriman dan garansi sebelum mengisi form.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'MOQ Fleksibel', items: ['Mulai 10 pcs (LCD HP)', 'Mulai 20 pcs (baterai / sparepart kecil)', 'Bisa mix antar kategori', 'Order sample tersedia'] },
              { title: 'Metode Pembayaran', items: ['T/T (Transfer Bank Internasional)', 'PayPal', 'Western Union', 'Alibaba Trade Assurance'] },
              { title: 'Pengiriman Cepat', items: ['Kirim di hari yang sama', 'DHL / FedEx / UPS', '3–7 hari ke seluruh dunia', 'Sea freight untuk order besar'] },
              { title: 'Garansi 12 Bulan', items: ['Semua produk bergaransi', 'RMA rate < 1%', 'Ganti barang cacat gratis', 'Respon 24 jam dijamin'] },
            ].map((block, index) => (
              <div key={block.title} data-scroll-reveal="scale" style={revealStyle(index * 90)} className={`rounded-lg border border-[#ded6c8] bg-white p-5 shadow-sm ${styles.motionCard}`}>
                <div className="font-mono text-sm font-black text-[#ff8a2a]">0{index + 1}</div>
                <h3 className="mt-4 text-lg font-black text-[#18212c]">{block.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {block.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm font-semibold text-[#27313c]">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-[#0b6b45]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INQUIRY FORM ═══ */}
      <section ref={formRef} className="bg-white py-14 md:py-20" id="quote-form">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div data-scroll-reveal className="rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm sm:p-8">
                <p className="text-sm font-bold text-[#0b6b45]">Form penawaran</p>
                <h2 className="mt-2 text-2xl font-black text-[#18212c] sm:text-3xl">Dapatkan Penawaran Grosir Dalam 24 Jam</h2>
                <p className="mt-3 text-[#52606d]">Isi form di bawah dan tim sales kami akan kirim penawaran khusus untuk Anda.</p>
                <div className="mb-8 mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[#52606d]">
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-[#0b6b45]" /> Penawaran gratis dalam 24 jam</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-[#0b6b45]" /> Order sample tersedia</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-[#0b6b45]" /> Bisa mix tipe &amp; kategori</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-[#0b6b45]" /> Garansi 12 bulan</span>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Honeypot ref={honeypotRef} />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#27313c] mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent ${errors.name ? 'border-red-400 bg-red-50' : 'border-[#d8d2c8]'}`} placeholder="Contoh: Budi Santoso" />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#27313c] mb-1.5">Alamat Email <span className="text-red-500">*</span></label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent ${errors.email ? 'border-red-400 bg-red-50' : 'border-[#d8d2c8]'}`} placeholder="budi@tokoanda.com" />
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="products" className="block text-sm font-medium text-[#27313c] mb-1.5">Produk yang Diminati <span className="text-red-500">*</span></label>
                      <select id="products" name="products" value={formData.products} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent ${errors.products ? 'border-red-400 bg-red-50' : 'border-[#d8d2c8]'}`}>
                        <option value="">Pilih kategori</option>
                        <option value="LCD / OLED HP">LCD / OLED HP</option>
                        <option value="Baterai HP">Baterai HP</option>
                        <option value="Komponen & Fleksibel HP">Komponen &amp; Fleksibel HP</option>
                        <option value="Tools Reparasi">Tools Reparasi</option>
                        <option value="Campuran">Campuran (Beberapa Kategori)</option>
                      </select>
                      {errors.products && <p className="mt-1 text-sm text-red-500">{errors.products}</p>}
                    </div>
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-[#27313c] mb-1.5">Jumlah Pesanan <span className="text-red-500">*</span></label>
                      <select id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent ${errors.quantity ? 'border-red-400 bg-red-50' : 'border-[#d8d2c8]'}`}>
                        <option value="">Pilih range jumlah</option>
                        <option value="10-50 pcs">10-50 pcs</option>
                        <option value="50-100 pcs">50-100 pcs</option>
                        <option value="100-500 pcs">100-500 pcs</option>
                        <option value="500-1.000 pcs">500-1.000 pcs</option>
                        <option value="1.000+ pcs">1.000+ pcs</option>
                      </select>
                      {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-[#ded6c8]">
                    <button
                      type="button"
                      onClick={() => setShowOptional(!showOptional)}
                      className="flex w-full items-center justify-between bg-[#fffaf0] px-4 py-3 text-left text-sm font-bold text-[#27313c] transition-colors hover:bg-[#fff3df]"
                    >
                      <span>Detail Tambahan (Opsional) — bantu kami siapkan penawaran lebih akurat</span>
                      {showOptional ? <Minus className="h-4 w-4 text-[#52606d]" /> : <Plus className="h-4 w-4 text-[#52606d]" />}
                    </button>
                    {showOptional && (
                      <div className="space-y-4 border-t border-[#ded6c8] bg-white p-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="company" className="block text-sm font-medium text-[#27313c] mb-1.5">Nama Toko / Perusahaan</label>
                            <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 border border-[#d8d2c8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent" placeholder="Nama Toko Anda" />
                          </div>
                          <div>
                            <label htmlFor="country" className="block text-sm font-medium text-[#27313c] mb-1.5">Kota / Provinsi</label>
                            <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-3 border border-[#d8d2c8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent" placeholder="Jakarta, Surabaya..." />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-[#27313c] mb-1.5">Nomor HP / WhatsApp</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-[#d8d2c8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent" placeholder="+62 812 3456 7890" />
                          </div>
                          <div>
                            <label htmlFor="models" className="block text-sm font-medium text-[#27313c] mb-1.5">Tipe / Merek</label>
                            <input type="text" id="models" name="models" value={formData.models} onChange={handleChange} className="w-full px-4 py-3 border border-[#d8d2c8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent" placeholder="iPhone 15 Pro, Samsung S24..." />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="quality" className="block text-sm font-medium text-[#27313c] mb-1.5">Pilih Grade</label>
                            <select id="quality" name="quality" value={formData.quality} onChange={handleChange} className="w-full px-4 py-3 border border-[#d8d2c8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent">
                              <option value="">Pilih grade</option>
                              <option value="OEM Original">OEM Original</option>
                              <option value="Premium Aftermarket">Premium Aftermarket</option>
                              <option value="Standard Aftermarket">Standard Aftermarket</option>
                              <option value="Campuran">Campuran</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-[#27313c] mb-1.5">Keterangan Tambahan</label>
                          <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={3} className="w-full px-4 py-3 border border-[#d8d2c8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent resize-none" placeholder="Tuliskan detail tipe, kualitas, pengiriman..." />
                        </div>
                      </div>
                    )}
                  </div>

                  {isTurnstileEnabled && (
                    <div className="flex justify-center">
                      <TurnstileWidget />
                    </div>
                  )}
                  {submitError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{submitError}</p>}
                  <button type="submit" disabled={isSubmitting} className={`flex w-full items-center justify-center gap-2 rounded-md bg-[#ff8a2a] px-6 py-4 text-lg font-bold text-white shadow-lg shadow-orange-900/10 transition hover:bg-[#e97313] ${isSubmitting ? 'cursor-not-allowed opacity-70' : ''} ${styles.ctaSheen}`}>
                    {isSubmitting ? (
                      <><svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> Mengirim...</>
                    ) : (
                      <><Send className="w-5 h-5" /> Kirim Permintaan Penawaran</>
                    )}
                  </button>
                  <p className="text-center text-xs text-[#52606d]">Kami balas dalam 24 jam. Data Anda kami jaga kerahasiaannya.</p>

                  <div className="relative flex items-center justify-center py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#ded6c8]" /></div>
                    <span className="relative bg-white px-4 text-sm text-[#52606d]">atau</span>
                  </div>
                  <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('whatsapp_click', { ...TRACK_BASE, channel: 'whatsapp', placement: 'form_alt' })}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#0b6b45] px-6 py-3.5 text-base font-bold text-white transition hover:bg-[#085c3a]"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Chat WA Sekarang — Respon Langsung
                  </a>
                </form>
              </div>
            </div>
            <div className="space-y-4 lg:col-span-2">
              <div data-scroll-reveal="right" className={`rounded-lg border border-[#ded6c8] bg-[#fffaf0] p-6 ${styles.motionCard}`}>
                <h3 className="mb-4 flex items-center gap-2 font-black text-[#18212c]"><Shield className="h-5 w-5 text-[#0b6b45]" /> Jaminan Kualitas</h3>
                <ul className="space-y-3">
                  {['Sistem QC TQC', 'Sertifikat CE & RoHS', 'Support True Tone (iPhone)', 'Garansi 12 Bulan untuk Semua Produk'].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-[#27313c]"><CheckCircle className="h-4 w-4 flex-shrink-0 text-[#0b6b45]" />{item}</li>
                  ))}
                </ul>
              </div>
              <div data-scroll-reveal="right" style={revealStyle(90)} className={`rounded-lg border border-white/15 bg-[#18212c] p-6 text-white ${styles.motionCard}`}>
                <h3 className="mb-4 font-black">Angka Kami</h3>
                <div className="grid grid-cols-2 gap-4">
                  {TRUST_STATS.map(stat => (
                    <div key={stat.label} className="text-center">
                      <div className="font-mono text-2xl font-black text-[#ffb36b]">{stat.value}</div>
                      <div className="mt-1 text-xs text-slate-200">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div data-scroll-reveal="right" style={revealStyle(180)} className={`rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm ${styles.motionCard}`}>
                <h3 className="mb-4 font-black text-[#18212c]">Ingin Langsung Ngobrol?</h3>
                <div className="space-y-3">
                  <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-semibold text-[#27313c] transition-colors hover:text-[#0b6b45]" onClick={() => trackEvent('whatsapp_click', { ...TRACK_BASE, channel: 'whatsapp', placement: 'contact_card' })}>
                    <MessageSquare className="w-4 h-4" /> WhatsApp: {WA_DISPLAY}
                  </a>
                  <a href="mailto:parts.info@phonerepairspares.com" className="flex items-center gap-3 text-sm font-semibold text-[#27313c] transition-colors hover:text-[#0b6b45]" onClick={() => trackEvent('contact_click', { ...TRACK_BASE, channel: 'email', placement: 'contact_card' })}>
                    <Mail className="w-4 h-4" /> parts.info@phonerepairspares.com
                  </a>
                  <a href="tel:+8618312589439" className="flex items-center gap-3 text-sm font-semibold text-[#27313c] transition-colors hover:text-[#0b6b45]" onClick={() => trackEvent('contact_click', { ...TRACK_BASE, channel: 'phone', placement: 'contact_card' })}>
                    <Phone className="w-4 h-4" /> +86 183 1258 9439
                  </a>
                </div>
              </div>
              <div data-scroll-reveal="right" style={revealStyle(270)} className={`relative h-48 overflow-hidden rounded-lg border border-[#ded6c8] ${styles.mediaFrame}`}>
                <Image src="/images/oled_factory_hero.jpg" alt="Pabrik PRSPARES di Shenzhen" fill className={`object-cover ${styles.mediaImage}`} sizes="(max-width: 1024px) 100vw, 40vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                  <p className="text-sm font-bold text-white">Pabrik PRSPARES di Shenzhen</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section className="border-y border-[#d9d2c4] bg-[#fffaf0] py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-2 gap-3 md:grid-cols-4 ${styles.statRail}`}>
            {TRUST_STATS.map(stat => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="border border-[#e4d8c2] bg-white px-4 py-4 text-center">
                  <Icon className="mx-auto mb-2 h-7 w-7 text-[#0b6b45]" />
                  <div className="font-mono text-3xl font-black text-[#ff8a2a]">{stat.value}</div>
                  <div className="mt-1 text-sm font-black text-[#18212c]">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="bg-[#f5f3ee] py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold text-[#0b6b45]">FAQ</p>
          <h2 className="mt-3 text-center text-3xl font-black text-[#18212c] md:text-5xl">Pertanyaan yang Sering Diajukan</h2>
          <p className="mb-10 mt-4 text-center text-[#52606d]">
            Semua yang perlu Anda tahu tentang bekerja sama dengan PRSPARES.
          </p>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} item={item} defaultOpen={i < 2} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section data-scroll-reveal className="bg-[#0b6b45] py-14 text-white md:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
          <p className="text-sm font-bold text-[#bff2d0]">Siap untuk langkah berikutnya</p>
          <h2 className="mt-2 text-3xl font-black md:text-5xl">Siap Mulai Kerja Sama?</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#e4fff0]">
            Bergabung dengan 1.000+ bisnis yang mempercayakan sparepart HP mereka ke PRSPARES — kualitas terjamin, harga langsung pabrik.
          </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={scrollToForm}
              className={`inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-4 text-base font-black text-[#0b6b45] transition hover:bg-[#fff0dd] ${styles.ctaSheen}`}
            >
              <MessageSquare className="w-5 h-5" />
              Minta Penawaran Grosir
            </button>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { ...TRACK_BASE, channel: 'whatsapp', placement: 'final_cta' })}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              <MessageSquare className="w-5 h-5" />
              Chat WA Sales
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
