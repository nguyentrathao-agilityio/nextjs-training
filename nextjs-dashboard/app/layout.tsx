import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";
import "@/app/ui/global.css";

export const metadata: Metadata = {
  title: "NextJS Course App",
  description: "Your first NextJS app!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
