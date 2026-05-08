import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import ThreeBackground from './components/ThreeBackground';

export default function App() {
  return (
    <div className="app">
      <div className="three-bg">
        <ThreeBackground />
      </div>
      <div className="content">
        <Navbar />
        <Hero />
        <About />
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
