import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  PackageCheck,
  Phone,
  Search,
} from 'lucide-react';
import { TrackedLink } from '@/components/TrackedLink';
import JsonLd from '@/components/JsonLd';

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  'https://www.phonerepairspares.com'
).replace(/\/$/, '');

function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}

export const metadata: Metadata = {
  title: 'Contact PRSPARES — Phone Repair Parts Wholesale Support',
  description:
    'Contact PRSPARES for wholesale phone repair parts inquiries, order support, stock checks and quote support. Shenzhen Huaqiangbei sourcing team.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact PRSPARES — Phone Repair Parts Wholesale Support',
    description:
      'Reach PRSPARES for wholesale parts inquiries, stock checks, order support and technical questions.',
    type: 'website',
    url: '/contact',
    images: ['/hero/contact.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact PRSPARES — Phone Repair Parts Wholesale Support',
    description:
      'Reach PRSPARES for wholesale parts inquiries, stock checks, order support and technical questions.',
    images: ['/hero/contact.jpg'],
  },
};

type ContactCard = {
  icon: LucideIcon;
  title: string;
  text: string;
  action: string;
  href: string;
  event?: string;
  external?: boolean;
};

const contactCards: ContactCard[] = [
  {
    icon: MessageSquare,
    title: 'Inquiry Form',
    text: 'Best for wholesale pricing, model lists and mixed category quotes.',
    action: 'Get Quote',
    href: '/wholesale-inquiry',
    event: 'quote_cta_click',
  },
  {
    icon: Phone,
    title: 'WhatsApp',
    text: 'Best for urgent stock checks, model confirmation and fast negotiation.',
    action: 'Chat Now',
    href: 'https://wa.me/85363902425?text=Hi,%20I%27m%20interested%20in%20wholesale%20phone%20parts',
    event: 'whatsapp_click',
    external: true,
  },
  {
    icon: Mail,
    title: 'Email',
    text: 'Best for order support, warranty questions and documents.',
    action: 'Send Email',
    href: 'mailto:parts.info@phonerepairspares.com',
    event: 'contact_click',
  },
  {
    icon: MapPin,
    title: 'Shenzhen Office',
    text: 'Huaqiangbei electronics supply-chain base. Visits by appointment.',
    action: 'View Details',
    href: '#office',
  },
];

const contactJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact PRSPARES',
    url: absoluteUrl('/contact'),
    description: metadata.description,
    primaryImageOfPage: absoluteUrl('/hero/contact.jpg'),
    mainEntity: {
      '@type': 'Organization',
      name: 'PRSPARES',
      email: 'parts.info@phonerepairspares.com',
      telephone: '+8618312589439',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Huaqiangbei, Futian District',
        addressLocality: 'Shenzhen',
        addressRegion: 'Guangdong',
        addressCountry: 'CN',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'sales',
          telephone: '+85363902425',
          email: 'parts.info@phonerepairspares.com',
          availableLanguage: ['English', 'Chinese'],
        },
      ],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact',
        item: absoluteUrl('/contact'),
      },
    ],
  },
];

function PageHero({
  eyebrow,
  title,
  text,
  image,
}: {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#111922] text-white">
      <Image src={image} alt="" fill priority className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,16,24,0.94),rgba(10,16,24,0.72)_45%,rgba(10,16,24,0.26))]" />
      <div className="relative mx-auto grid min-h-[460px] max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur">
            <BadgeCheck className="h-4 w-4 text-[#51d88a]" />
            {eyebrow}
          </div>
          <h1 className="max-w-4xl text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">{text}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <TrackedLink
              href="/wholesale-inquiry"
              event="quote_cta_click"
              params={{ event_label: 'Contact Hero CTA' }}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#ff8a2a] px-6 py-4 text-base font-bold text-white shadow-lg shadow-black/25 transition hover:bg-[#e97313]"
            >
              Get Wholesale Quote
              <ArrowRight className="h-5 w-5" />
            </TrackedLink>
            <TrackedLink
              href="https://wa.me/85363902425?text=Hi,%20I%27m%20interested%20in%20wholesale%20phone%20parts"
              event="whatsapp_click"
              params={{ event_label: 'Contact Hero WhatsApp' }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              WhatsApp Sales
            </TrackedLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mb-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
      <div>
        <p className="text-sm font-bold text-[#0b6b45]">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">{title}</h2>
      </div>
      {text && <p className="text-base leading-7 text-[#52606d] md:text-lg">{text}</p>}
    </div>
  );
}

function FinalCta() {
  return (
    <section className="bg-[#0b6b45] py-14 text-white md:py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div>
          <p className="text-sm font-bold text-[#bff2d0]">Ready for next step</p>
          <h2 className="mt-2 text-3xl font-black md:text-5xl">Send your model list for a quote.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#e4fff0]">
            PRSPARES can return stock status, price tiers, grade options and shipping route within 24 hours.
          </p>
        </div>
        <TrackedLink
          href="/wholesale-inquiry"
          event="quote_cta_click"
          params={{ event_label: 'Contact Footer CTA' }}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-white px-6 py-4 text-base font-black text-[#0b6b45] transition hover:bg-[#fff0dd]"
        >
          Get Wholesale Quote
          <ArrowRight className="h-5 w-5" />
        </TrackedLink>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f5f3ee]">
      <JsonLd data={contactJsonLd} />
      <PageHero
        eyebrow="Contact / sales support"
        title="Contact PRSPARES for Stock, Quote and Order Support"
        text="Choose the fastest channel for your request: quote form for pricing, WhatsApp for urgent model checks, email for after-sales support and documents."
        image="/hero/contact.jpg"
      />

      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Contact routing"
            title="Help buyers choose the fastest channel."
            text="This page turns contact information into a clear decision surface instead of a static address block."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((item) => (
              <div key={item.title} className="rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm">
                <item.icon className="h-8 w-8 text-[#0b6b45]" />
                <h3 className="mt-5 text-xl font-black text-[#18212c]">{item.title}</h3>
                <p className="mt-3 min-h-16 text-sm leading-6 text-[#52606d]">{item.text}</p>
                {item.event ? (
                  <TrackedLink
                    href={item.href}
                    event={item.event}
                    params={{ event_label: `Contact ${item.title}` }}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#ff8a2a]"
                  >
                    {item.action}
                    <ArrowRight className="h-4 w-4" />
                  </TrackedLink>
                ) : (
                  <Link href={item.href} className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#ff8a2a]">
                    {item.action}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#18212c] py-14 text-white md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-bold text-[#ffb36b]">Support expectations</p>
            <h2 className="mt-3 text-3xl font-black md:text-5xl">What happens after a buyer contacts you?</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Clock, title: '24h response', text: 'Sales confirms stock, quantity and model details.' },
              { icon: Search, title: 'Model check', text: 'Team verifies compatibility and grade options.' },
              { icon: PackageCheck, title: 'Quote ready', text: 'Buyer receives price tiers and shipping route.' },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-white/15 bg-white/[0.06] p-5">
                <item.icon className="h-7 w-7 text-[#51d88a]" />
                <h3 className="mt-4 text-lg font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="office" className="bg-[#fffaf0] py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-sm font-bold text-[#0b6b45]">Direct contact</p>
            <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-5xl">Shenzhen sales and support details.</h2>
            <p className="mt-5 text-base leading-7 text-[#52606d]">
              For wholesale quote requests, the inquiry form is the cleanest route. For urgent sourcing, WhatsApp is usually fastest.
            </p>
          </div>
          <div className="rounded-lg border border-[#ded6c8] bg-white p-6 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <div className="text-sm font-black text-[#18212c]">Email</div>
                <a href="mailto:parts.info@phonerepairspares.com" className="mt-2 block break-words text-sm font-semibold text-[#0b6b45]">
                  parts.info@phonerepairspares.com
                </a>
              </div>
              <div>
                <div className="text-sm font-black text-[#18212c]">Phone / WhatsApp</div>
                <a href="https://wa.me/85363902425" target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm font-semibold text-[#0b6b45]">
                  +853 6390 2425
                </a>
              </div>
              <div>
                <div className="text-sm font-black text-[#18212c]">Office</div>
                <p className="mt-2 text-sm leading-6 text-[#52606d]">Huaqiangbei, Futian District, Shenzhen, Guangdong, China</p>
              </div>
              <div>
                <div className="text-sm font-black text-[#18212c]">Business hours</div>
                <p className="mt-2 text-sm leading-6 text-[#52606d]">Mon-Fri, 9:00-18:00 China time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </main>
  );
}
