'use client';

import dynamic from 'next/dynamic';

const QuoteModalEnhanced = dynamic(() => import('./QuoteModalEnhanced'), { ssr: false });

export default QuoteModalEnhanced;
