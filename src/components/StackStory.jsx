import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import Hero from './Hero';
import About from './About';
import './StackStory.css';

export default function StackStory({ playKeyboardSound }) {
  const storyRef = useRef(null);
  const aboutRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState(0);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ['start start', 'end end'] });

  useEffect(() => {
    const sections = [...aboutRef.current.querySelectorAll('[data-stack-layer]')];
    let frame = 0;
    const update = () => {
      frame = 0;
      let next = 0;
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top < window.innerHeight * 0.6) {
          next = Number(section.dataset.stackLayer);
        }
      });
      setActiveLayer(next);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <div ref={storyRef} className="stack-story">
      <Hero />
      <div className="stack-transition container">
        <span className="transition-index">01 / THE PERSON & THE TOOLKIT</span>
        <div className="transition-rule"><motion.span style={{ scaleX: reducedMotion ? 1 : scrollYProgress }} /></div>
        <span className="transition-note">From the interface<br />to the infrastructure.</span>
      </div>
      <About sectionRef={aboutRef} activeLayer={activeLayer} playKeyboardSound={playKeyboardSound} />
    </div>
  );
}
