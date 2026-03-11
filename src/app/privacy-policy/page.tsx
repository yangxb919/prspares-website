import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - PRSPARES',
  description: 'Learn how PRSPARES collects, uses, and protects your personal data.',
  alternates: {
    canonical: '/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: February 26, 2026</p>

        <div className="space-y-8 text-gray-700 leading-7">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>
              We may collect contact details (name, email, phone), business details, inquiry content,
              and technical data such as device information and IP address when you use our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p>
              We use your information to respond to inquiries, provide quotations, deliver support,
              improve website performance, and send service updates or marketing messages where permitted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Data Sharing</h2>
            <p>
              We do not sell personal information. We may share data with trusted service providers
              (e.g., hosting, analytics, email delivery) strictly for operating our business and website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Cookies and Analytics</h2>
            <p>
              We use cookies and similar technologies to understand traffic and improve user experience.
              You can manage cookie preferences in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
            <p>
              We apply reasonable technical and organizational measures to protect your information.
              No internet transmission or storage method can be guaranteed 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
            <p>
              Depending on your location, you may have rights to access, correct, or delete your personal
              data, and to object to certain processing activities.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Contact Us</h2>
            <p>
              For privacy-related questions, contact us at{' '}
              <a className="text-[#00B140] hover:text-[#008631]" href="mailto:service.team@phonerepairspares.com">
                service.team@phonerepairspares.com
              </a>
              .
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
