import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import useRunnerGait from '../hooks/useRunnerGait';
import Runner3D from './Runner3D';
import './ScrollJourney.css';

function createTrail(points) {
  const segments = points.slice(1).map((end, index) => {
    const start = points[index];
    const bend = (end[1] - start[1]) * 0.48;
    return [start, [start[0], start[1] + bend], [end[0], end[1] - bend], end];
  });
  const samples = [];
  let length = 0;
  for (const [start, controlA, controlB, end] of segments) {
    for (let step = 0; step <= 80; step += 1) {
      const t = step / 80;
      const u = 1 - t;
      const point = {
        x: u ** 3 * start[0] + 3 * u ** 2 * t * controlA[0] + 3 * u * t ** 2 * controlB[0] + t ** 3 * end[0],
        y: u ** 3 * start[1] + 3 * u ** 2 * t * controlA[1] + 3 * u * t ** 2 * controlB[1] + t ** 3 * end[1],
      };
      const previous = samples.at(-1);
      if (previous) length += Math.hypot(point.x - previous.x, point.y - previous.y);
      samples.push({ ...point, distance: length });
    }
  }
  const d = `M ${segments[0][0].join(' ')} ${segments.map(([, a, b, end]) => `C ${a.join(' ')} ${b.join(' ')} ${end.join(' ')}`).join(' ')}`;
  return { d, samples, length };
}

const fallbackTrail = createTrail([[50, 0], [50, 100]]);

// Match the runner's vertical position to the viewport as the section scrolls.
// Distance along the curve drives the stride and the completed part of the road.
function pointAtVerticalProgress(trail, progress) {
  const first = trail.samples[0];
  const last = trail.samples.at(-1);
  const y = first.y + Math.max(0, Math.min(1, progress)) * (last.y - first.y);
  let low = 0;
  let high = trail.samples.length - 1;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (trail.samples[middle].y < y) low = middle + 1;
    else high = middle;
  }
  const next = trail.samples[low];
  const previous = trail.samples[Math.max(0, low - 1)];
  const blend = (y - previous.y) / (next.y - previous.y || 1);
  const distance = previous.distance + (next.distance - previous.distance) * blend;
  return { distance };
}

function pointOnTrail(trail, distance) {
  const travel = Math.max(0, Math.min(trail.length, distance));
  let low = 0;
  let high = trail.samples.length - 1;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (trail.samples[middle].distance < travel) low = middle + 1;
    else high = middle;
  }
  const next = trail.samples[low];
  const previous = trail.samples[Math.max(0, low - 1)];
  const blend = (travel - previous.distance) / (next.distance - previous.distance || 1);
  const ahead = trail.samples[Math.min(low + 3, trail.samples.length - 1)];
  const behind = trail.samples[Math.max(0, low - 3)];
  const magnitude = Math.hypot(ahead.x - behind.x, ahead.y - behind.y) || 1;
  const tangentX = (ahead.x - behind.x) / magnitude;
  const tangentY = (ahead.y - behind.y) / magnitude;
  return { x: previous.x + (next.x - previous.x) * blend, y: previous.y + (next.y - previous.y) * blend, completed: travel / trail.length, tangentX, tangentY };
}

function layoutBox(element, section) {
  let x = 0;
  let y = 0;
  let current = element;
  while (current && current !== section) {
    x += current.offsetLeft;
    y += current.offsetTop;
    current = current.offsetParent;
  }
  return { x, y, width: element.offsetWidth, height: element.offsetHeight };
}

function measureJourney(section, variant, compact) {
  const width = section.clientWidth;
  const height = section.clientHeight;
  const landmarks = [];
  let points;

  if (variant === 'experience') {
    const timeline = layoutBox(section.querySelector('.experience-timeline'), section);
    const center = timeline.x + timeline.width / 2;
    const cards = [...section.querySelectorAll('.experience-card')].map(card => layoutBox(card, section));
    points = [[center, 35], [center, Math.max(100, cards[0].y - 110)]];
    cards.forEach((card, index) => {
      const rightSide = index % 2 === 0;
      const sign = rightSide ? 1 : -1;
      const corridor = compact
        ? rightSide ? (card.x + card.width + width) / 2 : card.x / 2
        : center + sign * Math.min(220, timeline.width * 0.21);
      const bend = compact ? 4 : 35;
      const x = corridor + sign * bend;
      const y = card.y + card.height / 2;
      points.push([corridor - sign * bend, card.y - 24], [x, y], [corridor - sign * bend, card.y + card.height + 24]);
      landmarks.push({ x, y, cardX: rightSide ? card.x + card.width : card.x });
    });
    points.push([center, height - 45]);
  } else {
    const visual = layoutBox(section.querySelector('.about-visual-column'), section);
    const content = layoutBox(section.querySelector('.about-content'), section);
    const center = compact ? 26 : (visual.x + visual.width + content.x) / 2;
    const bend = compact ? 8 : Math.max(8, Math.min(38, (content.x - visual.x - visual.width) / 2 - 24));
    points = Array.from({ length: 7 }, (_, index) => [
      center + (index === 0 || index === 6 ? 0 : index % 2 ? -bend : bend),
      35 + (height - 80) * index / 6,
    ]);
  }

  const signature = JSON.stringify({ width, height, compact, points, landmarks });
  return { width, height, landmarks, signature, trail: createTrail(points) };
}

function useMediaQuery(query) {
  const subscribe = useCallback((callback) => {
    const media = window.matchMedia(query);
    media.addEventListener('change', callback);
    return () => media.removeEventListener('change', callback);
  }, [query]);
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

function Joint({ rotation, children }) {
  const jointRef = useRef(null);
  // SVG attributes keep the pivot in each shoulder or knee's local coordinates.
  const update = useCallback((angle) => {
    jointRef.current?.setAttribute('transform', `rotate(${angle})`);
  }, []);
  useEffect(() => update(rotation.get()), [rotation, update]);
  useMotionValueEvent(rotation, 'change', update);
  return <g ref={jointRef}>{children}</g>;
}

const kneeLift = stride => ((stride + Math.sqrt(stride * stride + 0.015)) / 2) ** 2;

function Runner({ phase, id }) {
  const frontLeg = useTransform(phase, value => Math.sin(value) * 34 - 8);
  const backLeg = useTransform(phase, value => -Math.sin(value) * 34 - 8);
  const frontKnee = useTransform(phase, value => 22 + kneeLift(Math.sin(value)) * 54);
  const backKnee = useTransform(phase, value => 22 + kneeLift(-Math.sin(value)) * 54);
  const frontArm = useTransform(phase, value => -Math.sin(value) * 28 - 8);
  const backArm = useTransform(phase, value => Math.sin(value) * 28 - 8);
  const bounce = useTransform(phase, value => {
    const stride = Math.sin(value);
    const footHeight = (hip, knee, origin) => {
      const radians = Math.PI / 180;
      const shin = (hip + knee) * radians;
      const toe = (Math.sin(shin) >= 0 ? 12 : -6) * Math.sin(shin);
      const sole = (Math.cos(shin) >= 0 ? 29 : 18) * Math.cos(shin);
      return origin + 22 * Math.cos(hip * radians) + toe + sole;
    };
    const frontFoot = footHeight(stride * 34 - 8, 22 + kneeLift(stride) * 54, 89);
    const backFoot = footHeight(-stride * 34 - 8, 22 + kneeLift(-stride) * 54, 87);
    const ground = (frontFoot + backFoot + Math.sqrt((frontFoot - backFoot) ** 2 + 9)) / 2;
    return 142 - ground - Math.sqrt(stride * stride + 0.02) * 1.5;
  });

  return (
    <motion.svg className="journey-boy" viewBox="0 0 100 144" style={{ y: bounce }}>
      <defs>
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2=".4"><stop stopColor="#eed8bd" /><stop offset=".6" stopColor="#d4b28e" /><stop offset="1" stopColor="#b38f6f" /></linearGradient>
        <linearGradient id={`${id}-shirt`} x1="0" y1="0" x2="1" y2=".3"><stop stopColor="#8a8b82" /><stop offset=".45" stopColor="#555b50" /><stop offset="1" stopColor="#343b32" /></linearGradient>
        <linearGradient id={`${id}-pants`} x1="0" y1="0" x2="1" y2="0"><stop stopColor="#777c7d" /><stop offset=".4" stopColor="#4c5354" /><stop offset="1" stopColor="#303738" /></linearGradient>
        <linearGradient id={`${id}-hair`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#50514a" /><stop offset=".5" stopColor="#262923" /><stop offset="1" stopColor="#151a15" /></linearGradient>
        <linearGradient id={`${id}-shoe`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff" /><stop offset="1" stopColor="#d6d8d0" /></linearGradient>
      </defs>
      <g transform="translate(57 57)">
        <Joint rotation={backArm}>
          <rect x="-5" y="0" width="10" height="19" rx="5" fill="#3e453b" />
          <g transform="translate(0 17) rotate(-78)"><rect x="-4" y="-1" width="8" height="19" rx="4" fill="#b7997b" /><circle cy="18" r="4.6" fill="#c6a486" /></g>
        </Joint>
      </g>
      <g transform="translate(55 87)">
        <Joint rotation={backLeg}>
          <rect x="-6" y="-3" width="12" height="27" rx="6" fill="#343b3c" />
          <g transform="translate(0 22)"><Joint rotation={backKnee}><rect x="-4.5" y="-3" width="9" height="25" rx="4.5" fill="#42494a" /><path d="M-5 18h9l8 6q3 4-2 5H-5q-3-4 0-11" fill="#c0c5ba" /><path d="M-6 27h18" stroke="#939b90" strokeWidth="2" strokeLinecap="round" /></Joint></g>
        </Joint>
      </g>
      <path d="M35 56q-9 3-8 16l3 13 11-1 2-24Z" fill="#3d4539" />
      <path d="M34 56q-7 7-4 20" stroke="#838d7b" strokeWidth="2" strokeLinecap="round" />
      <rect x="47" y="42" width="12" height="15" rx="5" fill={`url(#${id}-skin)`} />
      <path d="M44 50q9-3 17 4l4 16-7 21H36l-3-20q0-14 11-21Z" fill={`url(#${id}-shirt)`} />
      <path d="M45 52q-10 11-6 31" fill="none" stroke="#a8afa0" strokeOpacity=".4" strokeWidth="2" strokeLinecap="round" />
      <path d="m37 86 21 1-1 7H38Z" fill="#3e4543" />
      <g transform="translate(43 89)">
        <Joint rotation={frontLeg}>
          <rect x="-6" y="-4" width="12" height="27" rx="6" fill={`url(#${id}-pants)`} />
          <g transform="translate(0 22)"><Joint rotation={frontKnee}><rect x="-4.5" y="-3" width="9" height="25" rx="4.5" fill={`url(#${id}-pants)`} /><path d="M-5 18h9l8 6q3 4-2 5H-5q-3-4 0-11" fill={`url(#${id}-shoe)`} /><path d="M-6 27h18" stroke="#a3ab9d" strokeWidth="2" strokeLinecap="round" /><path d="m3 21 4 2" stroke="#aeb4a6" strokeWidth="1.5" /></Joint></g>
        </Joint>
      </g>
      <ellipse cx="53" cy="31" rx="16" ry="19" fill={`url(#${id}-skin)`} transform="rotate(9 53 31)" />
      <path d="m66 30 5 7q1 2-4 3" fill="#c9a786" />
      <ellipse cx="38" cy="33" rx="4" ry="5.5" fill="#d6b797" />
      <path d="M36 31q-9-13 0-22 3-7 11-4 9-6 15 1 12-1 12 10 5 10-5 13l-8-9q-5 6-19 4l-1 11Z" fill={`url(#${id}-hair)`} />
      <path d="M39 13q9-7 18-2" stroke="#77796c" strokeWidth="2" strokeLinecap="round" opacity=".55" />
      <ellipse cx="62" cy="32" rx="1.4" ry="2" fill="#33372d" />
      <path d="m62 43 4-1" stroke="#956e55" strokeWidth="1.2" strokeLinecap="round" />
      <g transform="translate(40 57)">
        <Joint rotation={frontArm}>
          <rect x="-6" y="-1" width="12" height="17" rx="5" fill={`url(#${id}-shirt)`} />
          <rect x="-4" y="12" width="8" height="8" rx="4" fill={`url(#${id}-skin)`} />
          <g transform="translate(0 19) rotate(-85)"><rect x="-4" y="-3" width="8" height="20" rx="4" fill={`url(#${id}-skin)`} /><ellipse cy="17" rx="4.6" ry="5.2" fill={`url(#${id}-skin)`} /></g>
        </Joint>
      </g>
    </motion.svg>
  );
}

export default function ScrollJourney({ sectionRef, variant = 'skills' }) {
  const id = `journey-${useId().replaceAll(':', '')}`;
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const compact = useMediaQuery(variant === 'skills' ? '(max-width: 767px)' : '(max-width: 900px)');
  const [geometry, setGeometry] = useState(null);
  const trail = geometry?.trail ?? fallbackTrail;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;
    let active = true;
    const measure = () => {
      frame = 0;
      if (!active) return;
      const next = measureJourney(section, variant, compact);
      setGeometry(current => current?.signature === next.signature ? current : next);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(section);
    section.querySelectorAll('.experience-card, .experience-intro, .about-content, .about-visual-column').forEach(element => observer.observe(element));
    window.addEventListener('resize', schedule);
    document.fonts.ready.then(() => { if (active) schedule(); });
    schedule();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [sectionRef, variant, compact]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 0.6', 'end 0.6'] });
  const targetDistance = useTransform(scrollYProgress, value => pointAtVerticalProgress(trail, reducedMotion ? 0.38 : value).distance);
  const distance = useSpring(targetDistance, { stiffness: 110, damping: 22, mass: 1, restDelta: 0.02, restSpeed: 0.1 });
  const location = useTransform(distance, value => pointOnTrail(trail, value));
  const x = useTransform(location, point => point.x);
  const y = useTransform(location, point => point.y);
  const completed = useTransform(location, point => point.completed);
  const { phase, turn } = useRunnerGait(distance, location, reducedMotion);
  const shadowScale = useTransform(phase, value => 1 - Math.abs(Math.sin(value)) * 0.12);

  // A resize or a motion-preference change should not send him across the old route.
  useEffect(() => {
    distance.jump(targetDistance.get());
  }, [geometry?.signature, reducedMotion, distance, targetDistance]);

  return (
    <div className={`scroll-journey scroll-journey--${variant}`} aria-hidden="true">
      {geometry && <>
        <svg className="journey-road" viewBox={`0 0 ${geometry.width} ${geometry.height}`} fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`${id}-road`} x1="0" y1="0" x2="1" y2=".2"><stop stopColor="#f0f2eb" /><stop offset=".5" stopColor="#f9faf6" /><stop offset="1" stopColor="#e5e8de" /></linearGradient>
            <filter id={`${id}-blur`} x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
          </defs>
          <g className="journey-road-layers">
            <path d={trail.d} className="journey-road-shadow" transform="translate(3 9)" filter={`url(#${id}-blur)`} />
            <path d={trail.d} className="journey-road-edge" transform="translate(3 5)" />
            <path d={trail.d} className="journey-road-rim" />
            <path d={trail.d} className="journey-road-surface" stroke={`url(#${id}-road)`} />
            <path d={trail.d} className="journey-road-dashes" />
          </g>
          {geometry.landmarks.map((point, index) => (
            <g key={index} className="journey-landmark">
              <path d={`M ${point.cardX} ${point.y} H ${point.x}`} className="journey-connector" />
              <circle cx={point.x} cy={point.y} r="8" fill="#fafbf7" stroke="#aeb9a0" strokeWidth="1.5" />
              <circle cx={point.x} cy={point.y} r="2.5" fill="#94a37f" />
            </g>
          ))}
        </svg>
        <svg className="journey-road-progress-layer" viewBox={`0 0 ${geometry.width} ${geometry.height}`} fill="none" preserveAspectRatio="none">
          <motion.path d={trail.d} className="journey-road-progress" style={{ pathLength: completed }} />
        </svg>
        <motion.div className="journey-runner-anchor" style={{ x, y }}>
          <motion.span className="journey-runner-shadow" style={{ scale: shadowScale }} />
          <div className="journey-runner-facing"><Runner3D phase={phase} heading={turn} fallback={<Runner phase={phase} id={id} />} /></div>
        </motion.div>
      </>}
    </div>
  );
}
