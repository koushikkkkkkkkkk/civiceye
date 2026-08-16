import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const itemVariants = {
  hidden: { y: 64, filter: 'blur(8px)', opacity: 0 },
  visible: {
    y: 0,
    filter: 'blur(0px)',
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.32, 0.72, 0, 1]
    }
  }
};

export function AmritaCTA() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={itemVariants}
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mb-6">
          Ready to improve your campus?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Join thousands of students and faculty reporting and resolving issues every day.
        </p>
        <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#A51636] hover:bg-[#8B122D] text-white text-lg font-semibold rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#A51636]/25">
          <span>Report an issue</span>
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </motion.div>
    </section>
  );
}
