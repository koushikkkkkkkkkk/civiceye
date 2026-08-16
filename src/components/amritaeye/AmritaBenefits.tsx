import { motion } from 'framer-motion';
import { Eye, Zap, Users } from 'lucide-react';

const benefits = [
  {
    icon: Eye,
    title: "Instant visibility",
    description: "Know exactly what's happening on campus right now, without waiting for emails or reports."
  },
  {
    icon: Zap,
    title: "Targeted resolution",
    description: "Route issues directly to the right department, cutting response times from days to hours."
  },
  {
    icon: Users,
    title: "Community driven",
    description: "Empower students and faculty to take ownership and make their campus better together."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

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

export function AmritaBenefits() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
      >
        {benefits.map((benefit, index) => (
          <motion.div key={index} variants={itemVariants} className="flex flex-col items-start text-left">
            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#181818] flex items-center justify-center mb-6">
              <benefit.icon className="w-6 h-6 text-[#A51636]" />
            </div>
            <p className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
              {benefit.title}
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
