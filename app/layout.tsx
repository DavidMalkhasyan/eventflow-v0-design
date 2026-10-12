import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EventFlow — Make every event flow",
  description:
    "Thoughtful event registration, participant management, and seamless check-in. An interactive EventFlow demonstration.",
};
export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#4f46e5",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
