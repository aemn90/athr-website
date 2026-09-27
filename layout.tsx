import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "أثر — أفكار استثنائية، وأثر يدوم",
  description: "أثر استوديو إبداعي مستقل. نصمّم الهويات البصرية، ونطوّر المواقع والتجارب الرقمية للعلامات الطموحة. لنصنع معًا شيئًا يستحق أن يُذكر.",
  applicationName: "أثر | Athar Studio",
  keywords: ["أثر", "تصميم", "هوية بصرية", "تطوير مواقع", "استوديو إبداعي", "Athar Studio"],
  openGraph: {
    title: "أثر — أفكار استثنائية، وأثر يدوم",
    description: "استوديو إبداعي يجمع بين التفكير الجريء والتصميم الهادف والتقنية.",
    locale: "ar_SA",
    type: "website",
    images: [{ url: "/images/hero-art.jpg", width: 1448, height: 1086, alt: "أثر — استوديو إبداعي" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#f8f7f3" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
