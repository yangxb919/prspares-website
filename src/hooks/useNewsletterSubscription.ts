'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

type NewsletterSource = 'footer' | 'blog';

interface UseNewsletterSubscriptionOptions {
  source: NewsletterSource;
  successResetMs?: number;
}

interface SubmitOptions {
  /** Honeypot field value — must be empty for real users. */
  honeypot?: string;
}

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export function useNewsletterSubscription(options: UseNewsletterSubscriptionOptions) {
  const { source, successResetMs = 5000 } = options;
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const submit = async (
    eventOrOptions?: FormEvent | SubmitOptions,
    maybeOptions?: SubmitOptions
  ) => {
    let event: FormEvent | undefined;
    let opts: SubmitOptions | undefined;
    if (eventOrOptions && typeof (eventOrOptions as FormEvent).preventDefault === 'function') {
      event = eventOrOptions as FormEvent;
      opts = maybeOptions;
    } else {
      opts = eventOrOptions as SubmitOptions | undefined;
    }
    if (event) event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: normalizedEmail,
          source,
          honeypot: opts?.honeypot,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(data?.error || 'Subscription failed. Please try again.');
        return false;
      }

      setIsSubscribed(true);
      setEmail('');
      setSuccessMessage(data?.message || 'Thanks for subscribing.');
      setTimeout(() => {
        setIsSubscribed(false);
        setSuccessMessage(null);
      }, successResetMs);
      return true;
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    isSubmitting,
    isSubscribed,
    errorMessage,
    successMessage,
    setErrorMessage,
    submit,
  };
}
