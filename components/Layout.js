import Head from 'next/head';
import Navbar from './Navbar';

export default function Layout({ children, title, description }) {
  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>{title || 'Clinical Trial Finder'}</title>
        <meta name="description" content={description || 'Search and discover clinical trials that match your needs'} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {children}
      </main>
    </div>
  );
} 