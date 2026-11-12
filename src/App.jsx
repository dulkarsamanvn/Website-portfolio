import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import StackStory from './components/StackStory';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import useKeyboardSound from './hooks/useKeyboardSound';

function App() {
  const keyboardSound = useKeyboardSound();

  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <Navbar keyboardSound={keyboardSound} />
        <main>
          <StackStory playKeyboardSound={keyboardSound.play} />
          <Projects />
          <Experience />
          <Education />
          <Contact />
        </main>
        <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>© {new Date().getFullYear()} DULKAR SAMAN. BUILT WITH INTENTION.</p>
        </footer>
      </div>
    </MotionConfig>
  );
}

export default App;
