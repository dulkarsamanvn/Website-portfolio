import TechStack from './TechStack';

const layers = ['Web & mobile', 'Backend', 'Data & cloud'];
const skills = [
  { title: 'Frontend development', detail: 'React.js, Redux, Tailwind CSS, CSS, Bootstrap, HTML', layer: 0 },
  { title: 'Mobile development', detail: 'React Native CLI, Xcode, Android Studio, iOS & Android build configuration', layer: 0 },
  { title: 'Backend development', detail: 'Django, Django REST Framework, FastAPI, Celery, Laravel', layer: 1 },
  { title: 'AI & LLMs', detail: 'LLM API integration, RAG, embeddings, pgvector', layer: 1 },
  { title: 'APIs & real-time communication', detail: 'REST APIs, WebSockets, Django Channels', layer: 1 },
  { title: 'Authentication', detail: 'JWT, OAuth 2.0, Laravel Sanctum', layer: 1 },
  { title: 'Database', detail: 'PostgreSQL, MySQL, MongoDB, Redis, Firebase', layer: 2 },
  { title: 'Cloud & deployment', detail: 'AWS (EC2, S3), Docker, DockerHub, Nginx, Vercel, GitHub Actions, Cloudinary', layer: 2 },
  { title: 'Progressive web apps', detail: 'Service workers, Firebase Cloud Messaging, offline support', layer: 0 },
  { title: 'Programming languages', detail: 'Python, JavaScript, PHP, SQL, C' },
  { title: 'Tools & version control', detail: 'Git, GitHub, Postman, Swagger, Figma' },
  { title: 'Data structures & algorithms', detail: 'Arrays, Linked Lists, Stacks, Queues, Trees, Graphs' },
];

export default function About({ sectionRef, activeLayer, playKeyboardSound }) {
  return (
    <section ref={sectionRef} id="about" className="about-section section-padding">
      <div className="container about-grid">
        <div className="about-visual-column">
          <div className="about-sticky">
            <span className="section-tag">THE TOOLS BEHIND THE WORK</span>
            <h2 className="section-title">MY TECH<br />STACK<span className="title-period">.</span></h2>
            <TechStack sectionRef={sectionRef} activeLayer={activeLayer} playKeyboardSound={playKeyboardSound} />
            <div className="stack-legend" aria-label="Technology categories">
              {layers.map((layer, index) => (
                <div className="stack-legend-item" key={layer} data-active={index === activeLayer}>
                  <span className="layer-number">0{index + 1}</span><span>{layer}</span><span className="layer-indicator" />
                </div>
              ))}
            </div>
            <p className="stack-caption">The tools I use to bring ideas to life.</p>
          </div>
        </div>
        <div className="about-content">
          <p className="large-text">Good software goes<br />beyond the surface.</p>
          <p className="regular-text">I’m Dulkar, a full stack developer. I build scalable web apps with responsive frontends, clean backends, and the connections that make them work together.</p>
          <p className="regular-text">I combine technical skills with creative thinking, focusing on simplicity, intuitive experiences, and clean, efficient code.</p>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div key={skill.title} className="skill-item" data-stack-layer={skill.layer} data-active={skill.layer === activeLayer}>
                <div className="skill-heading"><span className="skill-number">{String(index + 1).padStart(2, '0')}</span><h3>{skill.title}</h3></div>
                <p>{skill.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
