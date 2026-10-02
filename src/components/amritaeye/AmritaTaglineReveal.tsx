import { AnimatedText } from '@/components/ui/AnimatedText';

export function AmritaTaglineReveal() {
  return (
    <section className="relative bg-primary-50 dark:bg-black border-t border-primary-500/10 overflow-hidden">
      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-[1920px] items-center justify-center px-6 py-28 sm:py-36">
        <h2 
          className="max-w-6xl text-center text-[56px] sm:text-[72px] lg:text-[72px] font-bold leading-[1.05] tracking-[-0.03em] text-neutral-900 dark:text-white"
        >
          <AnimatedText text="Stop guessing where campus issues are." /> <br className="hidden lg:block" />
          <span className="font-serif italic font-normal text-primary-500">
            <AnimatedText text="See exactly what needs fixing, in real time." />
          </span>
        </h2>
      </div>
    </section>
  );
}
