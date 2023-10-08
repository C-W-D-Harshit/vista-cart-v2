import LayoutProvider from "@/providers/LayoutProvider";
import NextThemeProvider from "@/providers/NextThemeProvider";
import "@/styles/globals.scss";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import AuthSessionProvider from "@/providers/AuthSessionProvider";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: {
    default: "Vista Cart",
    template: "%s | Vista Cart",
  },
  description: "Developed by the one & only HARSHIT!",
  metadataBase: new URL("https://vista-cart.cleverdevloper.in"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: {
      default: "Vista Cart",
      template: "%s | Vista Cart",
    },
    description: "Developed by the one & only HARSHIT!",
    images: [
      {
        url: "https://vista-cart.cleverdevloper.in/og.png",
      },
    ],
    url: "https://vista-cart.cleverdevloper.in/",
    siteName: "Vista Cart",
    locale: "en_US",
    type: "website",
  },
  manifest: "/manifest.json",
  icons: { apple: "/og.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Toaster
          toastOptions={{ style: { fontSize: "1.4rem" } }}
          position="top-center"
          reverseOrder={false}
        />
        <NextTopLoader showSpinner={false} color="#5c59e8" />
        <AuthSessionProvider>
          <NextThemeProvider>
            <LayoutProvider>{children}</LayoutProvider>
          </NextThemeProvider>
        </AuthSessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
