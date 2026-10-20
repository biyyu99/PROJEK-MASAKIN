import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

export const metadata: Metadata = {
  title: 'Masakin - Temukan & Bagikan Resep Masakan Nusantara',
  description: 'Jelajahi ratusan resep masakan rumahan lezat, praktis, dan mudah dibuat. Bagikan kreasi masakan terbaikmu bersama komunitas Masakin.',
  keywords: ['resep masakan', 'masakan indonesia', 'kuliner nusantara', 'cara masak', 'masakin'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-theme="dark">
      <body>
        <AuthProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
            <AuthModal />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
