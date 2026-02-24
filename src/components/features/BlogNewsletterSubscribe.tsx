'use client';

import { useNewsletterSubscription } from '@/hooks/useNewsletterSubscription';

export default function BlogNewsletterSubscribe() {
  const {
    email,
    setEmail,
    isSubmitting,
    isSubscribed,
    errorMessage,
    successMessage,
    submit,
  } = useNewsletterSubscription({ source: 'blog' });

  return (
    <div className="max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="flex-1 px-5 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B140] focus:border-transparent bg-white shadow-sm"
          disabled={isSubmitting}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              void submit();
            }
          }}
        />
        <button
          onClick={() => {
            void submit();
          }}
          disabled={isSubmitting || isSubscribed}
          className="px-7 py-3.5 bg-[#00B140] text-white rounded-lg font-semibold hover:bg-[#008631] transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : isSubscribed ? 'Subscribed' : 'Subscribe Now'}
        </button>
      </div>

      <div aria-live="polite" className="min-h-[1.25rem] mt-2 text-left">
        {isSubmitting && (
          <p className="text-sm text-blue-600">Submitting your subscription...</p>
        )}
        {!isSubmitting && successMessage && (
          <p className="text-sm text-green-600">{successMessage}</p>
        )}
        {!isSubmitting && errorMessage && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
