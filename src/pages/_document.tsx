import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon configuration */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Meta tags */}
        <meta name="theme-color" content="#00B140" />
        <meta name="msapplication-TileColor" content="#00B140" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
