import type { Faq } from '@/data/category-buying-faqs';

// Visible "Buying questions" block for category pages. The same array is merged
// into the page's FAQPage schema by the caller, so text and schema never drift.
export default function BuyingQuestions({ title, faqs }: { title: string; faqs: Faq[] }) {
  return (
    <section id="buying-questions" className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold text-[#0b6b45]">Before you order</p>
        <h2 className="mt-3 text-3xl font-black text-[#18212c] md:text-4xl">{title}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-lg border border-[#e4dccb] bg-[#faf8f3] p-6">
              <h3 className="text-lg font-bold text-[#18212c]">{f.q}</h3>
              <p className="mt-3 text-sm leading-6 text-[#52606d]">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
