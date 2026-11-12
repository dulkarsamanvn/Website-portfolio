import { useRef } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textX = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const portraitOpacity = useTransform(scrollYProgress, [0, 0.55, 0.95], [1, 1, 0]);

  return (
    <section ref={sectionRef} id="home" className="hero">
      <motion.div className="hero-background-word" style={{ x: reducedMotion ? 0 : textX }} aria-hidden="true">FULL STACK</motion.div>
      <motion.div className="hero-portrait" style={{ x: '-50%', y: reducedMotion ? 0 : portraitY, opacity: reducedMotion ? 1 : portraitOpacity }}>
        <img src="/bg-removed_me.png" alt="Dulkar Saman" className="main-portrait" fetchPriority="high" />
      </motion.div>
      <div className="hero-content">
        <motion.div className="hero-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <span className="hero-eyebrow"><span className="status-dot" /> DEVELOPER. THINKER. BUILDER.</span>
          <h1 className="main-title">DULKAR<br />SAMAN<span className="title-period">.</span></h1>
          <div className="hero-description">
            <span className="description-line" />
            <p>Thoughtful interfaces.<br />Powerful systems.<br /><strong>One full stack developer.</strong></p>
          </div>
          <a className="hero-work-link" href="#projects">EXPLORE MY WORK <ArrowUpRight size={17} strokeWidth={1.5} /></a>
        </motion.div>
        <div className="hero-side-note"><span className="section-tag">FULL STACK DEVELOPER</span><p>From the first pixel<br />to the last API call.</p><a href="#about">MEET MY TOOLKIT <ArrowDown size={13} /></a></div>
        <div className="hero-bottom">
          <span className="hero-discipline">FRONTEND <span>/</span> BACKEND <span>/</span> EVERYTHING BETWEEN</span>
          <a href="#about" className="scroll-hint">SCROLL TO EXPLORE <span className="scroll-icon"><ArrowDown size={17} strokeWidth={1.5} /></span></a>
        </div>
      </div>
    </section>
  );
}
