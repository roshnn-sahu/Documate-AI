import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontBricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Documate AI",
  description:
    "AI-powered document search and chat assistant. Get instant answers from your documents with intelligent RAG-powered insights.",
  keywords: [
    "AI document search",
    "RAG assistant",
    "document chat",
    "intelligent search",
    "AI insights",
  ],
  alternates: {
    canonical: "https://documate.ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Documate AI",
    description:
      "AI-powered document search and chat assistant. Get instant answers from your documents with intelligent RAG-powered insights.",
    url: "https://documate.ai",
    siteName: "Documate AI",
    images: [
      {
        url: "https://documate.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Documate AI Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Documate AI",
    description: "AI-powered document search and chat assistant.",
    images: ["https://documate.ai/twitter-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicons/favicon.ico", sizes: "any" },
      { url: "/favicons/favicon.svg", type: "image/svg+xml" },
      { url: "/favicons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/favicons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/favicons/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontBricolage.variable}`}
    >
      <body className="antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
