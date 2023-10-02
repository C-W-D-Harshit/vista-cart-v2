import LayoutProvider from "@/providers/LayoutProvider";
import NextThemeProvider from "@/providers/NextThemeProvider";
import "@/styles/globals.scss";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import AuthSessionProvider from "@/providers/AuthSessionProvider";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Vista Cart",
  description: "Developed by the one & only HARSHIT!",
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
          toastOptions={{ style: { fontSize: "1.5rem" } }}
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
