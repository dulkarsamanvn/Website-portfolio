import { useEffect, useRef, useState } from 'react';
import { cancelFrame, frame } from 'framer-motion';

export default function Runner3D({ phase, heading, fallback }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    let active = true;
    let visible = false;
    let loading = false;
    let scene;
    const render = () => {
      if (active && visible && scene) scene.render(phase.get(), heading.get() * Math.PI / 180);
    };
    const schedule = () => { if (visible && scene) frame.render(render); };
    const resize = new ResizeObserver(() => {
      scene?.resize();
      schedule();
    });
    resize.observe(canvas);
    const observer = new IntersectionObserver(async ([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) { cancelFrame(render); return; }
      if (!scene && !loading) {
        loading = true;
        try {
          const { createRunnerScene } = await import('./runner/createRunnerScene');
          if (!active) return;
          scene = createRunnerScene(canvas);
          render();
          setReady(true);
        } catch {
          // Retain the illustrated runner when WebGL is unavailable.
          if (active) setReady(false);
        }
      }
      schedule();
    }, { rootMargin: '240px' });
    observer.observe(canvas);
    const unsubscribePhase = phase.on('change', schedule);
    const unsubscribeHeading = heading.on('change', schedule);
    const contextLost = event => {
      event.preventDefault();
      if (active) setReady(false);
    };
    canvas.addEventListener('webglcontextlost', contextLost);
    return () => {
      active = false;
      observer.disconnect();
      resize.disconnect();
      unsubscribePhase();
      unsubscribeHeading();
      cancelFrame(render);
      canvas.removeEventListener('webglcontextlost', contextLost);
      scene?.dispose();
    };
  }, [phase, heading]);

  return <div className="journey-runner-model" data-renderer={ready ? 'webgl' : 'illustration'}>
    <canvas ref={canvasRef} className="journey-boy-canvas" style={{ opacity: ready ? 1 : 0 }} />
    {!ready && fallback}
  </div>;
}
