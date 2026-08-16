import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

const tagline = "Stop guessing where campus issues are. See exactly what needs fixing, in real time.";

const Word = ({ children, progress, range }: { children: string, progress: MotionValue<number>, range: [number, number] }) => {
  const opacity = useTransform(progress, range, [0.25, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-2 sm:mr-3 inline-block">
      {children}
    </motion.span>
  );
};

export function AmritaTaglineReveal() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 75%", "end 50%"]
  });

  const words = tagline.split(" ");

  return (
    <section ref={container} className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-[680px] text-4xl sm:text-5xl font-semibold leading-tight text-center text-[#1d1d1f] dark:text-[#f5f5f7]">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + (1 / words.length);
          return (
            <Word key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          );
        })}
      </div>
    </section>
  );
}
