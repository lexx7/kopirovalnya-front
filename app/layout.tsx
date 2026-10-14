import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getLayout } from "@/lib/api";
import type { FooterContent } from "@/components/Footer";
import Footer from "@/components/Footer";
import CallbackModal from "@/components/CallbackModal";

export const metadata: Metadata = {
  title: {
    default: "Копировальня — фотосалон в Нижнем Новгороде",
    template: "%s | Копировальня",
  },
  description: "Фотоуслуги, полиграфия, фотоподарки и сувениры в Нижнем Новгороде",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const layout = await getLayout().catch(() => null);
  return (
    <html lang="ru">
      <body>
        {children}
        <Footer footer={(layout?.footer ?? {}) as FooterContent} menu={layout?.menu?.footer ?? []} />
        <CallbackModal />
      </body>
    </html>
  );
}
