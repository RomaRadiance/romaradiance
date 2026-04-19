import type { AppProps } from "next/app";
import { Baloo_2, Hind, Nunito } from "next/font/google";

import "@/styles/globals.css";

const headingFont = Baloo_2({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext", "vietnamese", "devanagari"],
  weight: ["600", "700", "800"],
});

const bodyFont = Hind({
  variable: "--font-body",
  subsets: ["latin", "latin-ext", "devanagari"],
  weight: ["400", "500", "600", "700"],
});

const monoFont = Nunito({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["500", "700"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
