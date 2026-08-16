import { motion } from 'framer-motion';

const steps = [
  {
    number: "01",
    title: "Snap a photo",
    description: "Spot a broken light, leak, or hazard? Take a clear photo of the issue."
  },
  {
    number: "02",
    title: "Tag the location",
    description: "Drop a pin on the campus map so the maintenance team knows exactly where to go."
  },
  {
    number: "03",
    title: "Watch it get resolved",
    description: "Track the status of your report in real time as the issue gets fixed."
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

export function AmritaHowItWorks() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={itemVariants}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">
          How it works
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Report issues in three simple steps. No complicated forms, no long emails.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
      >
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gray-100 dark:bg-[#1F1F1F] -z-10" />
        
        {steps.map((step, index) => (
          <motion.div key={index} variants={itemVariants} className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-white dark:bg-black border-[6px] border-gray-50 dark:border-[#181818] shadow-sm flex items-center justify-center mb-6">
              <span className="text-2xl font-bold font-mono text-[#A51636]">
                {step.number}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
              {step.title}
            </h3>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
