'use client';

import { useState, KeyboardEvent } from 'react';
import Image, { ImageProps } from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

export function toCloudinaryHighRes(url: string): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  if (/w_\d+/.test(url)) return url.replace(/w_\d+/g, 'w_1600');
  return url.replace('/upload/', '/upload/w_1600/');
}

interface LightboxImageProps extends Omit<ImageProps, 'onClick' | 'src'> {
  src: string;
  hiResSrc?: string;
}

export default function LightboxImage({ hiResSrc, alt, style, src, ...rest }: LightboxImageProps) {
  const [open, setOpen] = useState(false);
  const big = hiResSrc || toCloudinaryHighRes(src) || src;
  const altText = alt || '';
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <>
      <Image
        {...rest}
        src={src}
        alt={altText}
        role="button"
        tabIndex={0}
        aria-label={`Click to enlarge: ${altText || 'image'}`}
        onClick={() => setOpen(true)}
        onKeyDown={onKey}
        style={{ cursor: 'zoom-in', ...style }}
      />
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: big, alt: altText }]}
        plugins={[Zoom]}
        carousel={{ finite: true }}
        controller={{ closeOnBackdropClick: true }}
        render={{ buttonPrev: () => null, buttonNext: () => null }}
      />
    </>
  );
}
