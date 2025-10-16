import type { Metadata } from 'next';
import ThankYouClient from './ThankYouClient';

export const metadata: Metadata = {
  title: 'Thank You - PRSPARES',
  description: 'Thank you for contacting PRSPARES. We will get back to you within 24 hours.',
};

export default function ThankYou() {
  return <ThankYouClient />;
} 