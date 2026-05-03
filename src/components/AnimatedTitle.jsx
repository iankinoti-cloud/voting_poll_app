import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';

const LETTERS = 'VotePoll'.split('');

const SHADOW_3D =
  '1px 1px 0 #c8b89a, 2px 2px 0 #b8a88a, 3px 3px 0 #a8987a, 4px 4px 0 #887060, 5px 5px 7px rgba(0,0,0,0.65)';

function startFloat(controls, index) {
  controls.start({
    y: [0, -5, 0],
    transition: {
      duration: 2.8,
      delay: index * 0.18,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    },
  });
}

function Letter({ letter, index, wiggleTrigger }) {
  const controls = useAnimation();
  const resumeTimer = useRef(null);
  const isHovered = useRef(false);

  // Start floating on mount
  useEffect(() => {
    startFloat(controls, index);
    return () => {
      clearTimeout(resumeTimer.current);
      controls.stop();
    };
  }, []);

  // On reset: settle to ground, then resume floating after 2s
  useEffect(() => {
    if (wiggleTrigger === 0) return;

    clearTimeout(resumeTimer.current);
    controls.stop();

    controls.start({
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 180,
        damping: 18,
        delay: index * 0.06,
      },
    });

    resumeTimer.current = setTimeout(() => {
      if (!isHovered.current) startFloat(controls, index);
    }, 2000 + index * 80);

    return () => clearTimeout(resumeTimer.current);
  }, [wiggleTrigger]);

  function handleHoverStart() {
    isHovered.current = true;
    clearTimeout(resumeTimer.current);
    controls.stop();
    controls.start({
      y: -10,
      scale: 1.25,
      transition: { type: 'spring', stiffness: 420, damping: 11 },
    });
  }

  function handleHoverEnd() {
    isHovered.current = false;
    controls.start({
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 16 },
    }).then(() => {
      if (!isHovered.current) startFloat(controls, index);
    });
  }

  return (
    <motion.span
      animate={controls}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      className="inline-block cursor-default select-none text-[#f2ede4]"
      style={{ textShadow: SHADOW_3D, willChange: 'transform' }}
    >
      {letter}
    </motion.span>
  );
}

export default function AnimatedTitle({ wiggleTrigger }) {
  return (
    <h1 className="text-3xl font-bold tracking-widest uppercase flex">
      {LETTERS.map((letter, i) => (
        <Letter key={i} letter={letter} index={i} wiggleTrigger={wiggleTrigger} />
      ))}
    </h1>
  );
}
