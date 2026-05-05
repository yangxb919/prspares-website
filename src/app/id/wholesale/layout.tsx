import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grosir Sparepart HP Langsung dari Pabrik Shenzhen | PRSPARES',
  description:
    'Grosir sparepart HP langsung dari pabrik Shenzhen. Kualitas OEM, hemat 30-40% tanpa perantara. MOQ mulai 10 pcs, garansi 12 bulan. Melayani 1.000+ teknisi, konter HP & reseller di Indonesia.',
  keywords:
    'grosir sparepart hp, distributor sparepart hp, supplier sparepart hp, grosir lcd hp, grosir baterai hp, pabrik sparepart hp shenzhen, sparepart hp grosir murah',
  alternates: {
    canonical: '/id/wholesale',
    languages: {
      'en': '/wholesale-inquiry',
      'id-ID': '/id/wholesale',
      'th-TH': '/th/wholesale',
      'x-default': '/wholesale-inquiry',
    },
  },
  openGraph: {
    title: 'Grosir Sparepart HP Langsung dari Pabrik Shenzhen | PRSPARES',
    description:
      'Grosir sparepart HP dari pabrik Shenzhen. Hemat 30-40% tanpa perantara. MOQ 10 pcs, garansi 12 bulan.',
    type: 'website',
    url: '/id/wholesale',
    locale: 'id_ID',
    images: ['/PRSPARES1.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grosir Sparepart HP Langsung dari Pabrik Shenzhen | PRSPARES',
    description:
      'Grosir sparepart HP dari pabrik Shenzhen. Hemat 30-40% tanpa perantara.',
    images: ['/PRSPARES1.png'],
  },
};

export default function IdWholesaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
