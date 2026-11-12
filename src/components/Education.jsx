import { BookOpen, GraduationCap } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { education } from '../data/background';
import './Background.css';

export default function Education() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="education" className="education-section" aria-labelledby="education-title">
      <div className="container">
        <div className="education-heading"><div><span className="section-tag">04 / THE FOUNDATION</span><h2 id="education-title" className="section-title">EDUCATION<span className="title-period">.</span></h2></div><p>The starting point<br />for everything I build.</p></div>
        <div className="education-grid">
          {education.map((item, index) => (
            <motion.article
              key={item.institution}
              className="education-card"
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : index * 0.08 }}
            >
              <div className="education-card-top"><span className="education-icon" aria-hidden="true">{index === 0 ? <GraduationCap size={23} strokeWidth={1.3} /> : <BookOpen size={22} strokeWidth={1.3} />}</span><span className="education-period"><time dateTime={item.start}>{item.start}</time> — <time dateTime={item.end}>{item.end}</time></span></div>
              <span className="education-type">{item.type}</span><h3>{item.degree}</h3><p>{item.institution}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
