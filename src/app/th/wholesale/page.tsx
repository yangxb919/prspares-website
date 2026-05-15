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

// LINE Official Account configuration (Thai audience — LINE is primary channel).
// MUST set NEXT_PUBLIC_LINE_OA_ID before running Thai ads; default '@prspares'
// is a placeholder and will 404 on LINE if not replaced.
const LINE_OA_ID = process.env.NEXT_PUBLIC_LINE_OA_ID || '@prspares';
const LINE_IS_PLACEHOLDER = LINE_OA_ID === '@prspares';
const LINE_URL = `https://line.me/R/ti/p/${encodeURIComponent(LINE_OA_ID)}`;

// WhatsApp as secondary channel for Thai
const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || '85363902425';
const WA_DISPLAY = WA_NUMBER.startsWith('+') ? WA_NUMBER : `+${WA_NUMBER}`;
const WA_GREETING_TH = encodeURIComponent(
  'สวัสดีครับ/ค่ะ สนใจใบเสนอราคาส่งอะไหล่มือถือสำหรับร้าน ขอแคตตาล็อกและราคาได้ไหมครับ/ค่ะ'
);
const WA_URL = `https://wa.me/${WA_NUMBER.replace(/^\+/, '')}?text=${WA_GREETING_TH}`;

if (typeof window !== 'undefined' && LINE_IS_PLACEHOLDER) {
  // Surface the misconfiguration in dev/prod console so ops notices before ads spend.
  console.warn(
    '[th/wholesale] NEXT_PUBLIC_LINE_OA_ID is not set — Thai LINE CTA will hit a placeholder OA.'
  );
}

// Unified tracking schema for SEA wholesale pages.
const TRACK_BASE = { lang: 'th', page_type: 'sea_wholesale' } as const;

// ─── Types ───────────────────────────────────────────────────────
interface FormData {
  company: string;
  name: string;
  email: string;
  phone: string;
  lineId: string; // NEW — Thai-specific field (split from phone per Codex review)
  country: string;
  products: string;
  models: string;
  quantity: string;
  quality: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

// ─── FAQ Data (4 item MVP, all with ครับ politeness) ─────────────
const FAQ_ITEMS = [
  {
    q: 'MOQ (จำนวนสั่งขั้นต่ำ) เท่าไหร่ครับ?',
    a: 'MOQ ยืดหยุ่น — เริ่ม 10 ชิ้นสำหรับหน้าจอ และ 20 ชิ้นสำหรับแบตเตอรี่ / อะไหล่ชิ้นเล็ก เรายินดีให้บริการตั้งแต่ร้านเล็กไปจนถึงผู้นำเข้ารายใหญ่ครับ',
  },
  {
    q: 'Lead time การจัดส่งนานเท่าไหร่ครับ?',
    a: 'สินค้าพร้อมส่งจัดส่งภายในวันเดียวกันหรือวันทำการถัดไป สำหรับออเดอร์ใหญ่ (1,000+ ชิ้น) ใช้เวลา 3–5 วันทำการครับ',
  },
  {
    q: 'รับวิธีการชำระเงินแบบไหนบ้างครับ?',
    a: 'เรารับ T/T (โอนผ่านธนาคาร), PayPal, Western Union และ Alibaba Trade Assurance เพื่อความปลอดภัยของลูกค้าครับ',
  },
  {
    q: 'นโยบายการรับประกันเป็นอย่างไรครับ?',
    a: 'ทุกสินค้ารับประกัน 12 เดือน อัตราเคลมของเราต่ำกว่า 1% สินค้าเสียเปลี่ยนให้ฟรีครับ',
  },
];

// ─── Product Categories ──────────────────────────────────────────
const PRODUCT_CATEGORIES = [
  {
    name: 'หน้าจอ LCD / OLED',
    image: '/images/screens-hero.jpg',
    items: ['หน้าจอ iPhone LCD/OLED', 'AMOLED Samsung', 'หน้าจอ Android'],
    href: '/products/screens',
  },
  {
    name: 'แบตเตอรี่',
    image: '/images/batteries-hero.jpg',
    items: ['ความจุสูง', 'คุณภาพ Original', 'ทุกแบรนด์หลัก'],
    href: '/products/batteries',
  },
  {
    name: 'อะไหล่ชิ้นเล็ก',
    image: '/images/small-parts-hero.jpg',
    items: ['สายแพร', 'ก้นชาร์จ', 'ลำโพงและปุ่มกด'],
    href: '/products/small-parts',
  },
  {
    name: 'เครื่องมือช่าง',
    image: '/images/repair-tools-hero.jpg',
    items: ['ชุดเครื่องมือ', 'เครื่องโปรแกรม', 'อุปกรณ์ทดสอบ'],
    href: '/products/repair-tools',
  },
];

// ─── Trust Stats ─────────────────────────────────────────────────
const TRUST_STATS = [
  { value: '10+', label: 'ปี ประสบการณ์', icon: Award },
  { value: '1,000+', label: 'ลูกค้า B2B', icon: Users },
  { value: '<1%', label: 'อัตราเคลม', icon: Shield },
  { value: '24 ชม.', label: 'ตอบกลับ', icon: Clock },
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

// ─── LINE Icon (custom SVG since lucide doesn't have a LINE brand icon) ─────
function LineIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.631-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
    </svg>
  );
}

// ─── Main Page Component ─────────────────────────────────────────
export default function ThWholesalePage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    company: '', name: '', email: '', phone: '', lineId: '', country: '',
    products: '', models: '', quantity: '', quality: '', message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formStarted, setFormStarted] = useState(false);
  const [showOptional, setShowOptional] = useState(false);

  // Pre-fill product from URL params — case-insensitive alias table.
  useEffect(() => {
    const url = new URL(window.location.href);
    const productParam = url.searchParams.get('product');
    if (!productParam) return;
    const key = productParam.replace(/\+/g, ' ').toLowerCase().trim();
    const aliases: Record<string, string> = {
      'screens': 'หน้าจอ LCD / OLED',
      'lcd': 'หน้าจอ LCD / OLED',
      'lcd/oled screens': 'หน้าจอ LCD / OLED',
      'wholesale phone screens': 'หน้าจอ LCD / OLED',
      'other screen models': 'หน้าจอ LCD / OLED',
      'batteries': 'แบตเตอรี่',
      'battery': 'แบตเตอรี่',
      'wholesale phone batteries': 'แบตเตอรี่',
      'other battery models': 'แบตเตอรี่',
      'small parts': 'อะไหล่ชิ้นเล็ก',
      'wholesale small parts': 'อะไหล่ชิ้นเล็ก',
      'other small parts': 'อะไหล่ชิ้นเล็ก',
      'repair tools': 'เครื่องมือช่าง',
      'tools': 'เครื่องมือช่าง',
      'multiple': 'หลายหมวด',
      'multiple categories': 'หลายหมวด',
    };
    const matched = aliases[key];
    if (matched) {
      setFormData(prev => ({ ...prev, products: matched }));
    }
  }, []);

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

  // IP is captured server-side from request headers (PDPL/PDPA compliance).

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
      trackEvent('begin_form', { ...TRACK_BASE, form_name: 'th_wholesale_inquiry' });
    }
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!formData.name.trim()) errs.name = 'กรุณากรอกชื่อ';
    if (!formData.email.trim()) errs.email = 'กรุณากรอกอีเมล';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    if (!formData.products) errs.products = 'กรุณาเลือกหมวดสินค้า';
    if (!formData.quantity) errs.quantity = 'กรุณาเลือกช่วงจำนวน';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Fail-open Turnstile policy (aligned with /wholesale-inquiry after
    // commit cbe3644 and /id/wholesale). Require Turnstile only if the
    // widget actually rendered. If the script failed to load (CN/SEA
    // networks often block challenges.cloudflare.com), let the submit
    // through — the server verifies via honeypot + rate-limit + content
    // checks. Also no client pre-verify (single-use token).
    const turnstileAvailable = isTurnstileEnabled && !turnstileError && typeof window !== 'undefined' && !!window.turnstile;
    if (turnstileAvailable && !isTurnstileVerified) {
      setSubmitError('กรุณายืนยันตัวตนให้เสร็จก่อน');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const productLabel = formData.products;
      const qtyLabel = formData.quantity ? ` | จำนวน: ${formData.quantity}` : '';
      const qualityLabel = formData.quality ? ` | เกรด: ${formData.quality}` : '';
      const modelsLabel = formData.models ? `\nรุ่น/ยี่ห้อ: ${formData.models}` : '';
      const countryLabel = formData.country ? `\nจังหวัด: ${formData.country}` : '';
      const lineLabel = formData.lineId ? `\nLINE ID: ${formData.lineId}` : '';
      const msgParts = [
        `[Wholesale Inquiry — /th/wholesale — ภาษาไทย]`,
        `สินค้า: ${productLabel}${qtyLabel}${qualityLabel}`,
        modelsLabel,
        countryLabel,
        lineLabel,
        formData.message ? `\nรายละเอียด: ${formData.message}` : '',
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
      router.push('/thank-you?lang=th');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ';
      setSubmitError(`ส่งไม่สำเร็จ: ${msg}`);
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
              PRSPARES / พาร์ทเนอร์จัดหาอะไหล่จากเซินเจิ้น
            </div>
            <h1 className={`max-w-4xl text-4xl font-black leading-[1.05] text-white sm:text-5xl lg:text-7xl ${styles.heroTitle}`}>
                อะไหล่มือถือราคาส่ง{' '}
              <span className="text-[#ffb36b]">ตรงจากโรงงานเซินเจิ้น</span>
              </h1>
            <p className={`mt-6 max-w-2xl text-lg leading-8 text-slate-100 md:text-xl ${styles.heroText}`}>
                คุณภาพ OEM — <strong className="text-white">ลดต้นทุนได้ 30–40% เพราะสั่งตรงจากโรงงาน ไม่ผ่านคนกลาง</strong> · โรงงาน 10 ปี · ให้บริการช่าง ร้านมือถือ และผู้นำเข้ากว่า 1,000 รายทั่วโลก
              </p>

            <div className="mt-6 flex flex-wrap gap-2">
                {['ผ่าน QC ทุกชิ้น', 'ส่งวันเดียวกัน', 'MOQ เริ่ม 10 ชิ้น', 'รับประกัน 12 เดือน'].map(badge => (
                <span key={badge} className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/10 px-3 py-2 text-sm font-bold text-white backdrop-blur">
                  <CheckCircle className="h-4 w-4 text-[#51d88a]" />
                    {badge}
                  </span>
                ))}
              </div>

              {/* CRITICAL: LINE is primary CTA for Thai audience per Reference doc */}
            <div className={`mt-8 flex flex-col gap-3 sm:flex-row ${styles.heroActions}`}>
                <a
                  href={LINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('line_click', { ...TRACK_BASE, channel: 'line', placement: 'hero' })}
                className={`inline-flex items-center justify-center gap-2 rounded-md bg-[#06C755] px-6 py-4 text-base font-bold text-white shadow-lg shadow-black/25 transition hover:bg-[#05a847] ${styles.ctaSheen}`}
                >
                  <LineIcon className="w-5 h-5" />
                  แชท LINE สอบถามราคาเลย
                </a>
                <button
                  onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  <MessageSquare className="w-5 h-5" />
                  ขอใบเสนอราคาส่ง ฟรี!
                </button>
              </div>
            <p className="mt-3 text-sm font-semibold text-slate-200">ตอบกลับภายใน 24 ชั่วโมง — ไม่มีค่าใช้จ่าย ไม่มีภาระผูกพัน</p>

              {/* Secondary channel for Thai buyers who prefer WhatsApp (minority but valuable) */}
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', { ...TRACK_BASE, channel: 'whatsapp', placement: 'hero_secondary' })}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-200 underline decoration-white/35 underline-offset-4 transition hover:text-white hover:decoration-white"
              >
                <MessageSquare className="w-4 h-4" />
                หรือทักผ่าน WhatsApp
              </a>
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
              <p className="text-sm font-bold text-[#0b6b45]">ทำไมเลือก PRSPARES</p>
              <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">
                สำหรับร้านและผู้นำเข้าที่ต้องเติมสต็อกซ้ำอย่างสม่ำเสมอ
              </h2>
            </div>
            <p className="text-base leading-7 text-[#52606d] md:text-lg">
              โครงหน้าใหม่นี้ทำให้ buyer เห็นสามเรื่องหลักเร็วขึ้น: ราคาจากโรงงาน QC รายล็อต และจังหวะจัดส่งสำหรับออเดอร์ส่ง
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div data-scroll-reveal style={revealStyle(0)} className={`rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm ${styles.motionCard}`}>
              <Factory className={`h-8 w-8 text-[#0b6b45] ${styles.iconPulse}`} />
              <h3 className="mt-5 text-xl font-black text-[#18212c]">ราคาตรงจากโรงงาน</h3>
              <p className="mt-3 text-sm leading-6 text-[#52606d]">
                สั่งตรงจากแหล่งโรงงานในเซินเจิ้น ไม่ผ่านคนกลาง จึงช่วยลดต้นทุนได้ 30–40%
              </p>
            </div>
            <div data-scroll-reveal style={revealStyle(110)} className={`rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm ${styles.motionCard}`}>
              <Shield className={`h-8 w-8 text-[#0b6b45] ${styles.iconPulse}`} />
              <h3 className="mt-5 text-xl font-black text-[#18212c]">คุณภาพ OEM เกรดพรีเมียม</h3>
              <p className="mt-3 text-sm leading-6 text-[#52606d]">
                ระบบ QC TQC อัตราเคลมต่ำกว่า 1% รองรับ True Tone สำหรับหน้าจอ iPhone · สินค้าทุกชิ้นผ่านมาตรฐาน CE / RoHS
              </p>
            </div>
            <div data-scroll-reveal style={revealStyle(220)} className={`rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm ${styles.motionCard}`}>
              <Zap className={`h-8 w-8 text-[#0b6b45] ${styles.iconPulse}`} />
              <h3 className="mt-5 text-xl font-black text-[#18212c]">ส่งไว MOQ ยืดหยุ่น</h3>
              <p className="mt-3 text-sm leading-6 text-[#52606d]">
                สินค้าพร้อมส่งในวันเดียวกัน MOQ ยืดหยุ่น — เริ่ม 10 ชิ้นสำหรับหน้าจอ 20 ชิ้นสำหรับแบตเตอรี่และอะไหล่ชิ้นเล็ก
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
              <p className="text-sm font-bold text-[#0b6b45]">หมวดสินค้า</p>
              <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">อะไหล่มือถือครบสำหรับรายการสั่งซื้อแบบผสม</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-[#52606d] md:text-lg">
              เลือกหมวดก่อน แล้วส่งรุ่นและจำนวน ทีมขายจะยืนยันราคา MOQ และเส้นทางจัดส่งให้ชัดเจน
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
              <p className="text-sm font-bold text-[#0b6b45]">รูปแบบการทำงาน</p>
              <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">เงื่อนไขขายส่งอ่านง่ายตั้งแต่แรกเห็น</h2>
            </div>
            <p className="text-base leading-7 text-[#52606d] md:text-lg">
              ใช้จังหวะเดียวกับ homepage ใหม่: buyer เข้าใจ MOQ การชำระเงิน การจัดส่ง และการรับประกันก่อนกรอกฟอร์ม
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'MOQ ยืดหยุ่น', items: ['เริ่ม 10 ชิ้น (หน้าจอ)', 'เริ่ม 20 ชิ้น (แบตเตอรี่ / อะไหล่ชิ้นเล็ก)', 'คละรุ่น / คละสินค้าได้', 'รับสั่งตัวอย่าง'] },
              { title: 'วิธีการชำระเงิน', items: ['T/T (โอนผ่านธนาคาร)', 'PayPal', 'Western Union', 'Alibaba Trade Assurance'] },
              { title: 'ส่งเร็ว', items: ['ส่งวันเดียวกัน', 'DHL / FedEx / UPS', '3–7 วันทั่วโลก', 'มีขนส่งทางเรือสำหรับออเดอร์ใหญ่'] },
              { title: 'รับประกัน 12 เดือน', items: ['ทุกสินค้ารับประกัน', 'อัตราเคลมต่ำกว่า 1%', 'เปลี่ยนของเสียฟรี', 'ตอบกลับภายใน 24 ชั่วโมง'] },
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
                <p className="text-sm font-bold text-[#0b6b45]">แบบฟอร์มใบเสนอราคา</p>
                <h2 className="mt-2 text-2xl font-black text-[#18212c] sm:text-3xl">ขอใบเสนอราคาส่งภายใน 24 ชั่วโมง</h2>
                <p className="mt-3 text-[#52606d]">กรอกฟอร์มด้านล่าง ทีมขายของเราจะส่งใบเสนอราคาเฉพาะให้คุณ</p>
                <div className="mb-8 mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[#52606d]">
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-[#0b6b45]" /> ใบเสนอราคาฟรีภายใน 24 ชั่วโมง</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-[#0b6b45]" /> รับสั่งตัวอย่าง</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-[#0b6b45]" /> ผสมรุ่น / หมวดได้</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-[#0b6b45]" /> รับประกัน 12 เดือน</span>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Honeypot ref={honeypotRef} />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#27313c] mb-1.5">ชื่อผู้ติดต่อ <span className="text-red-500">*</span></label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent ${errors.name ? 'border-red-400 bg-red-50' : 'border-[#d8d2c8]'}`} placeholder="เช่น สมชาย ใจดี" />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#27313c] mb-1.5">อีเมล <span className="text-red-500">*</span></label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent ${errors.email ? 'border-red-400 bg-red-50' : 'border-[#d8d2c8]'}`} placeholder="somchai@shop.co.th" />
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="products" className="block text-sm font-medium text-[#27313c] mb-1.5">สินค้าที่สนใจ <span className="text-red-500">*</span></label>
                      <select id="products" name="products" value={formData.products} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent ${errors.products ? 'border-red-400 bg-red-50' : 'border-[#d8d2c8]'}`}>
                        <option value="">เลือกหมวด</option>
                        <option value="หน้าจอ LCD / OLED">หน้าจอ LCD / OLED</option>
                        <option value="แบตเตอรี่">แบตเตอรี่</option>
                        <option value="อะไหล่ชิ้นเล็ก">อะไหล่ชิ้นเล็ก</option>
                        <option value="เครื่องมือช่าง">เครื่องมือช่าง</option>
                        <option value="หลายหมวด">หลายหมวด</option>
                      </select>
                      {errors.products && <p className="mt-1 text-sm text-red-500">{errors.products}</p>}
                    </div>
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-[#27313c] mb-1.5">จำนวนที่ต้องการ <span className="text-red-500">*</span></label>
                      <select id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent ${errors.quantity ? 'border-red-400 bg-red-50' : 'border-[#d8d2c8]'}`}>
                        <option value="">เลือกช่วงจำนวน</option>
                        <option value="10-50 ชิ้น">10-50 ชิ้น</option>
                        <option value="50-100 ชิ้น">50-100 ชิ้น</option>
                        <option value="100-500 ชิ้น">100-500 ชิ้น</option>
                        <option value="500-1,000 ชิ้น">500-1,000 ชิ้น</option>
                        <option value="1,000+ ชิ้น">1,000+ ชิ้น</option>
                      </select>
                      {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
                    </div>
                  </div>

                  {/* LINE ID — 独立字段（Thai 买家主渠道，与电话拆分） */}
                  <div>
                    <label htmlFor="lineId" className="block text-sm font-medium text-[#27313c] mb-1.5">
                      LINE ID <span className="text-xs text-[#52606d] font-normal">(ช่องทางติดต่อหลักของเรา)</span>
                    </label>
                    <input
                      type="text"
                      id="lineId"
                      name="lineId"
                      value={formData.lineId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#d8d2c8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent"
                      placeholder="@yourid"
                    />
                  </div>

                  <div className="overflow-hidden rounded-lg border border-[#ded6c8]">
                    <button
                      type="button"
                      onClick={() => setShowOptional(!showOptional)}
                      className="flex w-full items-center justify-between bg-[#fffaf0] px-4 py-3 text-left text-sm font-bold text-[#27313c] transition-colors hover:bg-[#fff3df]"
                    >
                      <span>ระบุรุ่นหรืออะไหล่ที่หาอยู่ (ไม่บังคับ) — เพื่อให้เราจัดราคาส่งได้ตรงใจที่สุด</span>
                      {showOptional ? <Minus className="h-4 w-4 text-[#52606d]" /> : <Plus className="h-4 w-4 text-[#52606d]" />}
                    </button>
                    {showOptional && (
                      <div className="space-y-4 border-t border-[#ded6c8] bg-white p-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="company" className="block text-sm font-medium text-[#27313c] mb-1.5">ชื่อร้าน / บริษัท</label>
                            <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 border border-[#d8d2c8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent" placeholder="ชื่อร้านของคุณ" />
                          </div>
                          <div>
                            <label htmlFor="country" className="block text-sm font-medium text-[#27313c] mb-1.5">จังหวัด</label>
                            <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} className="w-full px-4 py-3 border border-[#d8d2c8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent" placeholder="กรุงเทพฯ / เชียงใหม่..." />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-[#27313c] mb-1.5">เบอร์ติดต่อ</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-[#d8d2c8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent" placeholder="08X-XXX-XXXX" />
                          </div>
                          <div>
                            <label htmlFor="models" className="block text-sm font-medium text-[#27313c] mb-1.5">รุ่น / ยี่ห้อ</label>
                            <input type="text" id="models" name="models" value={formData.models} onChange={handleChange} className="w-full px-4 py-3 border border-[#d8d2c8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent" placeholder="iPhone 15 Pro, Samsung S24..." />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="quality" className="block text-sm font-medium text-[#27313c] mb-1.5">ระดับคุณภาพ</label>
                            <select id="quality" name="quality" value={formData.quality} onChange={handleChange} className="w-full px-4 py-3 border border-[#d8d2c8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent">
                              <option value="">เลือกเกรด</option>
                              <option value="OEM Original">OEM Original</option>
                              <option value="Premium Aftermarket">Premium Aftermarket</option>
                              <option value="Standard Aftermarket">Standard Aftermarket</option>
                              <option value="คละเกรด">คละเกรด</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-[#27313c] mb-1.5">รายละเอียดเพิ่มเติม</label>
                          <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={3} className="w-full px-4 py-3 border border-[#d8d2c8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b6b45] focus:border-transparent resize-none" placeholder="ระบุรุ่น คุณภาพ การจัดส่ง..." />
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
                      <><svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg> กำลังส่ง...</>
                    ) : (
                      <><Send className="w-5 h-5" /> ส่งคำขอใบเสนอราคา</>
                    )}
                  </button>
                  <p className="text-center text-xs text-[#52606d]">เราตอบกลับภายใน 24 ชั่วโมง ข้อมูลของคุณเก็บเป็นความลับ</p>

                  <div className="relative flex items-center justify-center py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#ded6c8]" /></div>
                    <span className="relative bg-white px-4 text-sm text-[#52606d]">หรือ</span>
                  </div>
                  <a
                    href={LINE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('line_click', { ...TRACK_BASE, channel: 'line', placement: 'form_alt' })}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#06C755] px-6 py-3.5 text-base font-bold text-white transition hover:bg-[#05a847]"
                  >
                    <LineIcon className="w-5 h-5" />
                    แชท LINE — ตอบทันที
                  </a>

                  {/* Secondary WhatsApp option — LINE stays primary, WA as fallback */}
                  <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('whatsapp_click', { ...TRACK_BASE, channel: 'whatsapp', placement: 'form_secondary' })}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#ded6c8] bg-white px-6 py-3 text-sm font-bold text-[#27313c] transition hover:border-[#ff8a2a] hover:bg-[#fffaf0]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    หรือทักผ่าน WhatsApp
                  </a>
                </form>
              </div>
            </div>
            <div className="space-y-4 lg:col-span-2">
              <div data-scroll-reveal="right" className={`rounded-lg border border-[#ded6c8] bg-[#fffaf0] p-6 ${styles.motionCard}`}>
                <h3 className="mb-4 flex items-center gap-2 font-black text-[#18212c]"><Shield className="h-5 w-5 text-[#0b6b45]" /> การรับประกันคุณภาพ</h3>
                <ul className="space-y-3">
                  {['ระบบ QC TQC', 'ผ่านมาตรฐาน CE & RoHS', 'รองรับ True Tone (iPhone)', 'รับประกัน 12 เดือนทุกสินค้า'].map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm font-semibold text-[#27313c]"><CheckCircle className="h-4 w-4 flex-shrink-0 text-[#0b6b45]" />{item}</li>
                  ))}
                </ul>
              </div>
              <div data-scroll-reveal="right" style={revealStyle(90)} className={`rounded-lg border border-white/15 bg-[#18212c] p-6 text-white ${styles.motionCard}`}>
                <h3 className="mb-4 font-black">ตัวเลขของเรา</h3>
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
                <h3 className="mb-4 font-black text-[#18212c]">อยากคุยตรงกับเซลส์?</h3>
                <div className="space-y-3">
                  <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-semibold text-[#27313c] transition-colors hover:text-[#0b6b45]" onClick={() => trackEvent('line_click', { ...TRACK_BASE, channel: 'line', placement: 'contact_card' })}>
                    <LineIcon className="w-4 h-4" /> LINE: {LINE_OA_ID}
                  </a>
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
                <Image src="/images/oled_factory_hero.jpg" alt="โรงงาน PRSPARES ที่เซินเจิ้น" fill className={`object-cover ${styles.mediaImage}`} sizes="(max-width: 1024px) 100vw, 40vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                  <p className="text-sm font-bold text-white">โรงงาน PRSPARES ที่เซินเจิ้น</p>
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
          <h2 className="mt-3 text-center text-3xl font-black text-[#18212c] md:text-5xl">คำถามที่พบบ่อย</h2>
          <p className="mb-10 mt-4 text-center text-[#52606d]">
            ทุกสิ่งที่คุณอยากรู้เกี่ยวกับการทำงานร่วมกับ PRSPARES
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
          <p className="text-sm font-bold text-[#bff2d0]">พร้อมสำหรับขั้นตอนต่อไป</p>
          <h2 className="mt-2 text-3xl font-black md:text-5xl">พร้อมเริ่มต้นด้วยกันหรือยังครับ?</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#e4fff0]">
            ร่วมเป็นส่วนหนึ่งของลูกค้ากว่า 1,000 รายที่ไว้วางใจ PRSPARES ในเรื่องอะไหล่มือถือคุณภาพ — ราคาตรงจากโรงงาน สินค้าพร้อมส่ง ยินดีให้บริการครับ
          </p>
          </div>
          {/* CRITICAL: LINE primary CTA */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={LINE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('line_click', { ...TRACK_BASE, channel: 'line', placement: 'final_cta' })}
              className={`inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-4 text-base font-black text-[#0b6b45] transition hover:bg-[#fff0dd] ${styles.ctaSheen}`}
            >
              <LineIcon className="w-5 h-5" />
              แชท LINE กับเซลส์
            </a>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              <MessageSquare className="w-5 h-5" />
              ขอใบเสนอราคาส่ง
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
