'use client';

import dynamic from 'next/dynamic';

const InquiryModal = dynamic(() => import('./InquiryModal'), { ssr: false });

export default InquiryModal;
