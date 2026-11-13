import { useEffect } from 'react';
import { cancelFrame, frame, useMotionValue, useSpring } from 'framer-motion';

function headingFor(point, direction, previous) {
  const angle = Math.atan2(point.tangentX * direction, point.tangentY * direction) * 180 / Math.PI;
  const difference = ((angle - previous + 180) % 360 + 360) % 360 - 180;
  return previous + difference;
}

export default function useRunnerGait(distance, location, reducedMotion) {
  const phase = useMotionValue(0.6);
  const heading = useMotionValue(0);
  const turn = useSpring(heading, { stiffness: 180, damping: 24, mass: 0.7, restDelta: 0.02, restSpeed: 0.1 });

  useEffect(() => {
    if (reducedMotion) {
      phase.jump(0.6);
      const angle = headingFor(location.get(), 1, heading.get());
      heading.set(angle);
      turn.jump(angle);
      return;
    }

    let running = false;
    let cadence = 0;
    const update = ({ delta }) => {
      const seconds = Math.min(delta, 40) / 1000;
      const velocity = distance.getVelocity();
      // Keep fast wheel input from turning the legs into a blur on wide bends.
      const targetCadence = Math.abs(velocity) < 0.5 ? 0 : 2.25 * Math.tanh(Math.abs(velocity) / 290);
      cadence += (targetCadence - cadence) * (1 - Math.exp(-seconds / 0.1));
      phase.set(phase.get() + cadence * seconds * Math.PI * 2);

      if (Math.abs(velocity) > 5) {
        heading.set(headingFor(location.get(), Math.sign(velocity), heading.get()));
      }

      if (Math.abs(velocity) < 0.5 && Math.abs(cadence) < 0.005) {
        cadence = 0;
        running = false;
        cancelFrame(update);
      }
    };
    const wake = () => {
      if (!running) {
        running = true;
        frame.update(update, true);
      }
    };
    const unsubscribe = distance.on('change', wake);
    return () => {
      unsubscribe();
      cancelFrame(update);
    };
  }, [distance, location, reducedMotion, phase, heading, turn]);

  return { phase, turn };
}
