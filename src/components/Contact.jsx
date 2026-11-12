import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Download, MessageCircle } from 'lucide-react';
import { profile } from '../data/profile';

const Contact = () => {
  const whatsappHref = `https://wa.me/${profile.whatsapp.number}?text=${encodeURIComponent(profile.whatsapp.message)}`;
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'center center'] });
  const signatureX = useTransform(scrollYProgress, [0, 1], [-28, 0]);
  const signatureY = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const signatureRotate = useTransform(scrollYProgress, [0, 1], [-18, 0]);

  return (
    <section ref={sectionRef} id="contact" className="section-padding">
      <div className="container">
        <div className="contact-wrapper">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="contact-info"
          >
            <div className="contact-signature" aria-hidden="true">
              <motion.span style={reducedMotion ? {} : { x: signatureX, rotate: signatureRotate }}>&lt;</motion.span>
              <motion.span style={reducedMotion ? {} : { y: signatureY }}>/&gt;</motion.span>
            </div>
            <span className="section-tag">05 / LET'S CONNECT</span>
            <h2 className="section-title">LET'S BUILD<br/>SOMETHING<br/>GREAT</h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="contact-links"
          >
            <div className="link-item">
              <span className="label">WHATSAPP</span>
              <a href={whatsappHref} className="value contact-whatsapp-link" target="_blank" rel="noopener noreferrer" aria-label="Chat with Dulkar Saman on WhatsApp"><MessageCircle size={19} strokeWidth={1.5} aria-hidden="true" /><span>Chat on WhatsApp</span><ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" /></a>
              <span className="contact-whatsapp-number">{profile.whatsapp.displayNumber}</span>
            </div>
            <div className="link-item">
              <span className="label">EMAIL</span>
              <a href={`mailto:${profile.email}`} className="value">{profile.email}</a>
            </div>
            <div className="link-item">
              <span className="label">GITHUB</span>
              <a href={profile.github} className="value" target="_blank" rel="noopener noreferrer">@{profile.handle}</a>
            </div>
            <div className="link-item">
              <span className="label">LINKEDIN</span>
              <a href={profile.linkedin} className="value" target="_blank" rel="noopener noreferrer">linkedin.com/in/{profile.handle}</a>
            </div>
            <div className="link-item">
              <span className="label">RESUME</span>
              <a href={profile.resume.href} className="value contact-resume-link" download={profile.resume.filename} aria-label="Download Dulkar Saman’s résumé as a PDF">Download résumé <Download size={17} strokeWidth={1.4} /></a>
              <span className="contact-resume-meta">PDF · {profile.resume.pages} pages</span>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx="true">{`
        .contact-wrapper {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 4rem;
          padding: 4rem 0;
        }

        .contact-info .section-title {
          font-size: clamp(3rem, 6vw, 6rem);
          margin-top: 1rem;
        }

        .contact-links {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 3rem;
        }

        .link-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .label {
          font-size: 0.7rem;
          letter-spacing: 3px;
          color: var(--text-secondary);
        }

        .value {
          font-size: clamp(0.9rem, 1.8vw, 1.5rem);
          font-weight: 400;
          transition: var(--transition-smooth);
          overflow-wrap: anywhere;
        }

        .contact-resume-link { display: inline-flex; align-items: center; gap: 0.65rem; width: fit-content; }
        .contact-resume-meta { font-size: 0.62rem; color: #999; margin-top: 0.25rem; }

        .value:hover {
          color: var(--text-secondary);
          transform: translateX(10px);
        }

        .contact-whatsapp-link {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          width: fit-content;
          max-width: 100%;
          min-height: 44px;
          padding: 0.75rem 0.9rem;
          border: 1px solid #d3e3d5;
          border-radius: 6px;
          background: #f3f8f3;
          color: #356b40;
          font-size: clamp(0.85rem, 1.5vw, 1.1rem);
        }

        .contact-whatsapp-link svg { flex-shrink: 0; }
        .contact-whatsapp-link:hover { color: #265530; background: #eaf3eb; transform: translateY(-2px); }
        .contact-whatsapp-number { font-size: 0.65rem; color: #999; margin-top: 0.25rem; letter-spacing: 0.035em; }

        @media (prefers-reduced-motion: reduce) {
          .contact-whatsapp-link { transition: none; }
          .contact-whatsapp-link:hover { transform: none; }
        }

        .contact-signature {
          position: relative;
          display: flex;
          width: 140px;
          height: 75px;
          margin-bottom: 2rem;
          font-size: 4.5rem;
          font-weight: 900;
          letter-spacing: -0.13em;
          line-height: 1;
        }

        .contact-signature span { position: relative; }
        .contact-signature span:first-child { color: #bbb; }
        .contact-signature span:last-child { color: #111; }

        @media (max-width: 992px) {
          .contact-wrapper {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .contact-info .section-title {
            font-size: clamp(2.7rem, 8vw, 4rem);
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
