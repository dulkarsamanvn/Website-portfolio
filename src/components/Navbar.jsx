import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Menu, Volume2, VolumeX, X } from 'lucide-react';

const Navbar = ({ keyboardSound }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const handleOutsideClick = (event) => {
      if (!navRef.current?.contains(event.target)) setMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handleOutsideClick);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handleOutsideClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [menuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
    >
      <div className="nav-container glass">
        <div className="logo">
          <a href="#home" aria-label="Dulkar Saman — home">DULKAR<span className="logo-slash"> / </span></a>
        </div>
        <ul id="primary-navigation" className={`nav-links${menuOpen ? ' is-open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.name}>
              <a href={link.href} className="nav-link" onClick={() => setMenuOpen(false)}>
                {link.name}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="nav-sound-toggle"
          aria-label="Keyboard hover sounds"
          aria-pressed={keyboardSound.enabled}
          disabled={!keyboardSound.available}
          onClick={keyboardSound.toggle}
          title={!keyboardSound.available ? 'Keyboard sounds are unavailable in this browser' : keyboardSound.enabled ? 'Mute keyboard sounds' : 'Enable keyboard sounds'}
        >
          {keyboardSound.enabled ? <Volume2 size={17} strokeWidth={1.5} aria-hidden="true" /> : <VolumeX size={17} strokeWidth={1.5} aria-hidden="true" />}
        </button>
        <button
          ref={menuButtonRef}
          type="button"
          className="nav-menu-toggle"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={18} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={18} strokeWidth={1.5} aria-hidden="true" />}
        </button>
      </div>

      <style jsx="true">{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          padding: 1.5rem 0;
          transition: var(--transition-smooth);
        }

        .navbar.scrolled {
          padding: 1rem 0;
        }

        .nav-container {
          background: rgba(255, 255, 255, 0.87);
          max-width: fit-content;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 0.65rem 2rem;
          border-radius: 100px;
        }

        .logo a {
          font-weight: 900;
          font-size: 0.9rem;
          letter-spacing: 1px;
        }

        .logo-slash { font-weight: 300; color: #888; }

        .nav-links {
          display: flex;
          gap: 1.7rem;
        }

        .nav-link {
          font-size: 0.85rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-secondary);
          transition: var(--transition-smooth);
          position: relative;
        }

        .nav-link:hover {
          color: var(--text-primary);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: black;
          transition: var(--transition-smooth);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-sound-toggle, .nav-menu-toggle {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          padding: 0;
          border: 0;
          border-radius: 50%;
          background: transparent;
          color: #777;
          cursor: pointer;
          transition: color 0.2s, background-color 0.2s;
        }

        .nav-sound-toggle { margin-left: -0.5rem; }
        .nav-menu-toggle { display: none; }
        .nav-sound-toggle[aria-pressed='true'] { color: #111; }
        .nav-sound-toggle:hover, .nav-menu-toggle:hover { background: #00000008; color: #111; }
        .nav-sound-toggle:disabled { opacity: 0.4; cursor: default; }

        @media (max-width: 768px) {
          .nav-container {
            position: relative;
            width: calc(100% - 2rem);
            max-width: 440px;
            justify-content: space-between;
            gap: 0.65rem;
            padding: 0.45rem 0.9rem;
          }
          .nav-links {
            display: none;
            position: absolute;
            top: calc(100% + 0.6rem);
            left: 0;
            right: 0;
            flex-direction: column;
            gap: 0;
            padding: 0.45rem;
            background: rgba(255, 255, 255, 0.97);
            border: 1px solid #e0e0dc;
            border-radius: 17px;
            box-shadow: 0 15px 30px #0000000d;
          }
          .nav-links.is-open { display: flex; }
          .nav-link {
            display: block;
            font-size: 0.73rem;
            padding: 0.85rem 1rem;
          }
          .nav-link::after { display: none; }
          .nav-sound-toggle { margin-left: 0; }
          .nav-menu-toggle { display: grid; }
          .logo {
            display: block;
            margin-right: auto;
          }
          .logo a { font-size: 0.83rem; }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;
