import MarkdownRenderer from '@/components/MarkdownRenderer';

export default function TestMarkdownPage() {
  const md = `# Image URL Normalization Test

This page verifies that Markdown images are normalized to HTTPS when necessary.

![HTTP Image](http://example.com/image.jpg)

![Protocol Relative](//example.com/image2.jpg)

![Data Image](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==)
`;

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Markdown Image Normalization</h1>
      <MarkdownRenderer content={md} />
    </main>
  );
}

