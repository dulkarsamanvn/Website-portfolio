import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

const stack = [
  { label: 'Web & mobile', tools: [{ name: 'React', icon: 'react' }, { name: 'React Native', icon: 'react' }, { name: 'JavaScript', icon: 'javascript' }] },
  { label: 'Backend', tools: [{ name: 'Python', icon: 'python' }, { name: 'Django / DRF', icon: 'django' }, { name: 'FastAPI', icon: 'fastapi' }, { name: 'PHP', icon: 'php' }, { name: 'Laravel', icon: 'laravel' }] },
  { label: 'Data & cloud', tools: [{ name: 'PostgreSQL', icon: 'postgresql' }, { name: 'Redis', icon: 'redis' }, { name: 'Docker', icon: 'docker' }, { name: 'AWS', icon: 'aws' }] },
];

const technologies = stack.flatMap((group, category) => group.tools.map((tool) => ({ ...tool, category })));

export default function TechStack({ sectionRef, activeLayer, playKeyboardSound }) {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 30 });
  const rotateX = useTransform(progress, [0, 0.45, 1], [16, 7, -7]);
  const rotateY = useTransform(progress, [0, 0.45, 1], [-11, -4, 7]);
  const rotateZ = useTransform(progress, [0, 0.45, 1], [-3, -1, 2]);

  return (
    <div className="tech-stack-display" role="group" aria-label="My technology stack">
      <div className="tech-display-ground" aria-hidden="true" />
      <motion.div className="tech-deck" role="list" style={reducedMotion ? {} : { rotateX, rotateY, rotateZ }}>
        {technologies.map((tool) => (
          <motion.div
            key={tool.name}
            className="tech-tile-depth"
            role="listitem"
            aria-label={`${tool.name}, ${stack[tool.category].label}`}
            animate={{ z: reducedMotion ? 0 : activeLayer === tool.category ? 22 : 0 }}
            transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 95, damping: 22 }}
          >
            <div
              className="tech-tile"
              data-active={activeLayer === tool.category}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse' || event.pointerType === 'pen') playKeyboardSound();
              }}
              onPointerDown={(event) => {
                if (event.pointerType === 'touch') playKeyboardSound();
              }}
            >
              <span className="tech-tile-index" aria-hidden="true">0{tool.category + 1}</span>
              <img src={`/tech/${tool.icon}.svg`} alt="" width="36" height="36" loading="lazy" />
              <span className="tech-tile-name">{tool.name}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
