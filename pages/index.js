import Head from 'next/head';
import Hero from '../components/Hero';
import LogoSlider from '../components/LogoSlider'

export default function Home() {
  return (
    <>
      <Head>
        <title>Clinical Trial Finder</title>
        <meta name="description" content="Search and discover clinical trials that match your needs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Hero />
        <LogoSlider />
      </main>
    </>
  );
}
