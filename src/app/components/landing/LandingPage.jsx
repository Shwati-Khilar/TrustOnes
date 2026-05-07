import Navbar from './Navbar';
import Hero from './Hero';
import Services from './Services';
import Selectedworks from './Selectedworks';
import Techstack from './Techstack';
import Workflow from './Workflow';
import CTA from './CTA';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f0ede8' }}>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Selectedworks />
        <Techstack />
        <Workflow />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}