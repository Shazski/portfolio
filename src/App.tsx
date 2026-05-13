import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import ThreeBackground from './components/ThreeBackground';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import Marquee from './components/Marquee';
import Loader from './components/Loader';
import MouseAura from './components/MouseAura';
import AuroraBackground from './components/AuroraBackground';
import SmoothScroll from './components/SmoothScroll';

export default function App() {
  return (
    <div className="app">
      <Loader />
      <SmoothScroll />
      <AuroraBackground />
      <div className="three-bg">
        <ThreeBackground />
      </div>
      <MouseAura />
      <CustomCursor />
      <ScrollProgress />
      <div className="content">
        <Navbar />
        <Hero />
        <About />
        <Marquee />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
        <footer>
          <span>© {new Date().getFullYear()} — Sharoon</span>
          <span>Built with React &amp; Three.js</span>
        </footer>
      </div>
    </div>
  );
}
