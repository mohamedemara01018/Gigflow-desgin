import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/provider/StoreProvider";
import MeProvider from "@/provider/MeProvider";
import ToastificationProvider from "@/provider/ToastificationProvider";

export const metadata: Metadata = {
  title: "GigFlow – Scale Your Freelance Career With Precision",
  description:
    "GigFlow is the elite marketplace for elite independent talent. Connect with top-tier companies through AI-driven matching and secure, guaranteed payments.",
  icons: {
    icon: '/icon.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <head>
        {/* Prevent dark-mode flash on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('theme');if(m==='dark'||(!m&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />

      </head>
      <body className="min-h-full flex flex-col  transition-colors duration-200 antialiased">
        <StoreProvider>
          <ToastificationProvider>
            <MeProvider>
              {children}
            </MeProvider>
          </ToastificationProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
