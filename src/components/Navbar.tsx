export default function Navbar() {
  return (
    <nav className="navbar">
      <a href="#home" className="nav-logo">
        Sharoon <span>— Full Stack Engineer</span>
      </a>
      <div className="nav-links">
        <a href="#about">about</a>
        <a href="#skills">skills</a>
        <a href="#projects">work</a>
        <a href="#experience">experience</a>
      </div>
      <div className="nav-cta">
        <span className="dot" />
        <span>available</span>
      </div>
    </nav>
  );
}
