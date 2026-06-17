import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata = {
  title: "TrustOnes",
  description: "Freelance Trust System",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${dmSans.variable}`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}