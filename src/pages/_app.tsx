import React from 'react'
import type { AppProps } from 'next/app'
// 导入全局样式，确保 Pages Router 页面也能使用样式
import '@/app/globals.css'

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  return <Component {...pageProps} />
}

export default MyApp
