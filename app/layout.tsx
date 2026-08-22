import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Macro Risk Coach",
  description: "Build market judgment before the market tests it.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
