import type { Metadata } from "next";
import { Providers } from "@/src/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RentMyHeader — Premium Influencer Marketplace",
    template: "%s | RentMyHeader",
  },
  description:
    "The premium marketplace for renting influencer digital assets — headers, bios, and posts. Escrow-protected campaigns on LinkedIn, Twitter, and Facebook.",
  keywords: ["influencer marketing", "sponsored content", "digital assets", "creator monetization"],
  openGraph: {
    title: "RentMyHeader — Premium Influencer Marketplace",
    description: "Escrow-protected influencer campaigns. Brands fund, influencers deliver, everyone wins.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}