import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SelfNative — Master IELTS Speaking with AI",
  description: "Practice real IELTS Cue Cards, get instant AI feedback, and hit your target band score faster.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="site-header">
          <a href="/" className="logo">
            <img src="/logo.svg" alt="SelfNative" style={{ height: '28px', width: 'auto' }} />
            SelfNative
          </a>
          <nav>
            <a href="/dashboard">Dashboard</a>
            <a href="/reviews">Reviews</a>
            <a href="/progress">Progress</a>
            <a href="/#partners">Our Partners</a>
            <a href="/#spotlight">Spotlight</a>
            <a href="/practice" className="gradient-btn" style={{ padding: '9px 18px', borderRadius: '999px', fontSize: '14px' }}>
              Start Practicing →
            </a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}