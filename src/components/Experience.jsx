import { useRef } from 'react';
import { ArrowDown, Download, MapPin } from 'lucide-react';
import { motion, useReducedMotion, useScroll } from 'framer-motion';
import { experience } from '../data/background';
import { profile } from '../data/profile';
import './Background.css';

export default function Experience() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start center', 'end center'] });

  return (
    <section ref={sectionRef} id="experience" className="experience-section section-padding" aria-labelledby="experience-title">
      <div className="container experience-layout">
        <div className="experience-intro">
          <span className="section-tag">03 / WHERE I’VE BUILT</span>
          <h2 id="experience-title" className="experience-title">WORK<br />EXPERIENCE<span className="title-period">.</span></h2>
          <p className="experience-intro-copy">Enterprise software, reliable APIs, and full-stack applications. The work behind the projects.</p>
          <a className="background-resume-link" href={profile.resume.href} download={profile.resume.filename} aria-label="Download Dulkar Saman’s résumé as a PDF"><Download size={15} strokeWidth={1.5} /> Download résumé</a>
          <a className="experience-education-link" href="#education">A little further back <ArrowDown size={13} strokeWidth={1.5} /></a>
        </div>
        <div className="experience-timeline">
          <div className="experience-track" aria-hidden="true"><motion.span className="experience-track-fill" style={{ scaleY: reducedMotion ? 1 : scrollYProgress }} /></div>
          <ol className="experience-list">
            {experience.map((job, index) => (
              <motion.li
                key={job.id}
                className="experience-entry"
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="experience-dot" aria-hidden="true" />
                <article className="experience-card" aria-labelledby={`experience-${job.id}`}>
                  <div className="experience-entry-meta"><span className="experience-period"><time dateTime={job.startDate}>{job.start}</time><span aria-hidden="true">—</span><time dateTime={job.endDate}>{job.end}</time></span><span className="experience-location"><MapPin size={11} strokeWidth={1.5} />{job.location}</span></div>
                  <h3 id={`experience-${job.id}`}>{job.role}</h3>
                  <p className="experience-company">{job.company}</p>
                  <ul className="experience-contributions">{job.contributions.map((contribution) => <li key={contribution}>{contribution}</li>)}</ul>
                  <div className="experience-card-footer"><ul className="experience-technologies" aria-label={`${job.company} technologies`}>{job.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul><span className="experience-entry-number" aria-hidden="true">0{index + 1}</span></div>
                </article>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
