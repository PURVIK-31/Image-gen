import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GEN IMAGE",
  description: "Generate beautiful images using AI with text prompts",
  metadataBase: new URL("https://gen-image.vercel.app"),
  openGraph: {
    title: "GEN IMAGE - AI Image Generator",
    description: "Transform your ideas into stunning visuals with AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "GEN IMAGE - AI Image Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GEN IMAGE - AI Image Generator",
    description: "Transform your ideas into stunning visuals with AI",
    images: ["/og-image.jpg"],
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  manifest: "/manifest.json",
};
