
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'imamah Sports | Luxury Ummah Leagues',
  description: 'The premier destination for high-end Ummah sports leagues and news.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-background">
        {children}
      </body>
    </html>
  );
}
