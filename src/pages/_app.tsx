import '../styles/globals.css';

// Import necessary types from Next.js
import type { AppProps } from 'next/app';


function MyApp({ Component, pageProps }: AppProps) {
  return (
      <Component {...pageProps} />
  );
}

export default MyApp;