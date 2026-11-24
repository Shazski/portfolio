import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import SafeCanvas from './components/SafeCanvas';
import ScrollProgress from './components/ScrollProgress';
import Marquee from './components/Marquee';
import Loader from './components/Loader';
import AuroraBackground from './components/AuroraBackground';
import SmoothScroll from './components/SmoothScroll';
import PortfolioChat from './components/PortfolioChat';
import AISection from './components/AISection';
import CommandPalette from './components/CommandPalette';
import AccentSwitcher from './components/AccentSwitcher';
import Spotlight from './components/Spotlight';

export default function App() {
  return (
    <div className="app">
      <Loader />
      <Spotlight />
      <div className="grain" aria-hidden />
      <SmoothScroll />
      <AuroraBackground />
      <ScrollProgress />
      <div className="content">
        <Navbar />
        <Hero />
        <About />
        <Marquee />
        <Skills />
        <AISection />
        <Projects />
        <Experience />
        <Contact />
        <footer>
          <span>© {new Date().getFullYear()} — Sharoon</span>
        </footer>
      </div>
      <PortfolioChat />
      <CommandPalette />
      <AccentSwitcher />
    </div>
  );
}
