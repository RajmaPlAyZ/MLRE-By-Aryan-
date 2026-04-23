import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ML Resource Estimator — Model · Hardware · Performance",
  description:
    "Estimate VRAM usage, training time, inference speed, and hardware feasibility for your machine learning models. Compare configurations and optimize resource allocation.",
  keywords: [
    "machine learning",
    "VRAM estimator",
    "GPU calculator",
    "training time",
    "FLOPs",
    "LLM",
    "transformer",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      appearance={{ 
        baseTheme: dark
      }}
    >
      <html lang="en" className="dark">
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
