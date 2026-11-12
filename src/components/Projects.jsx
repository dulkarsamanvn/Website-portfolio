import { useRef } from 'react';
import { ArrowRight, ArrowUpRight, AudioLines, Code2, PackageOpen, Workflow } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { featuredProjects, moreProjects } from '../data/projects';
import ProjectVisual from './ProjectVisual';
import './Projects.css';

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.0001 });
  const rotateX = useTransform(progress, [0, 0.5, 1], [6, 0, -4]);
  const rotateY = useTransform(progress, [0, 0.5, 1], [index % 2 ? -3 : 3, 0, index % 2 ? 2 : -2]);
  const y = useTransform(progress, [0, 0.5, 1], [26, 0, -16]);
  const sceneTurn = useTransform(progress, [0, 0.5, 1], [-3, 0, 3]);
  const sceneY = useTransform(progress, [0, 0.5, 1], [10, 0, -10]);

  return (
    <div ref={cardRef} className="project-card-shell">
      <motion.article
        className={`project-card project-${project.visual}`}
        aria-labelledby={`project-title-${project.id}`}
        style={reducedMotion ? {} : { rotateX, rotateY, y, transformPerspective: 1400 }}
      >
        <div className="project-visual" aria-hidden="true">
          <span className="project-visual-index">{String(index + 1).padStart(2, '0')} / SELECTED WORK</span>
          <div className="project-visual-ground" />
          <motion.div className="project-scroll-layer" style={reducedMotion ? {} : { rotateZ: sceneTurn, y: sceneY }}>
            <div className="project-hover-layer"><ProjectVisual type={project.visual} /></div>
          </motion.div>
          <span className="project-visual-caption">ILLUSTRATED PREVIEW</span>
        </div>
        <div className="project-body">
          <span className="project-category">{project.category}</span>
          <h3 id={`project-title-${project.id}`} className="project-title">{project.title}<span className="title-period">.</span></h3>
          <p className="project-description">{project.description}</p>
          <ul className="project-technologies" aria-label={`${project.title} technologies`}>
            {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
          </ul>
          <div className="project-links">
            <a className="project-source-link" href={project.source} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} source on GitHub`}><Code2 size={14} strokeWidth={1.5} /><span>View source</span><ArrowUpRight size={14} strokeWidth={1.5} /></a>
            {project.secondary && <a className="project-secondary-link" href={project.secondary.href} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} ${project.secondary.label}`}><PackageOpen size={14} strokeWidth={1.5} /><span>{project.secondary.label}</span><ArrowUpRight size={13} strokeWidth={1.5} /></a>}
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="projects-section section-padding">
      <div className="container">
        <div className="projects-header">
          <div><span className="section-tag">02 / IDEAS INTO EXPERIENCES</span><h2 className="section-title">SELECTED<br />WORKS<span className="title-period">.</span></h2></div>
          <div className="projects-header-note"><span className="projects-count">{String(featuredProjects.length).padStart(2, '0')} SELECTED PROJECTS</span><p>Interfaces, systems, and the<br />little details that connect them.</p></div>
        </div>
        <div className="projects-grid">{featuredProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
        <div className="more-projects">
          <div className="more-projects-heading"><div><span className="section-tag">A LITTLE MORE TO EXPLORE</span><h3>More projects<span className="title-period">.</span></h3></div><a href="https://github.com/dulkarsamanvn?tab=repositories" target="_blank" rel="noopener noreferrer">All repositories <ArrowUpRight size={15} strokeWidth={1.5} /></a></div>
          <div className="more-projects-grid">
            {moreProjects.map((project) => (
              <a className="more-project-link" key={project.title} href={project.source} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} on GitHub`}>
                <span className="more-project-icon">{project.icon === 'workflow' ? <Workflow size={21} strokeWidth={1.3} /> : <AudioLines size={21} strokeWidth={1.3} />}</span>
                <div><h4>{project.title}</h4><p>{project.description}</p><span>{project.technologies}</span></div><ArrowRight className="more-project-arrow" size={17} strokeWidth={1.3} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
