import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Do I need an account to report an issue?",
    answer: "Yes, you need to sign in with your campus credentials. This helps us prevent spam and allows us to update you on the status of your report."
  },
  {
    question: "What kinds of issues can I report?",
    answer: "You can report anything from broken lights, plumbing leaks, and Wi-Fi dead zones, to structural damage and safety hazards on campus."
  },
  {
    question: "How long does it take for an issue to get fixed?",
    answer: "Response times vary by department and severity. Critical safety hazards are prioritized immediately, while routine maintenance usually takes 2-3 business days."
  },
  {
    question: "Will I be notified when my report is resolved?",
    answer: "Yes. You will receive an automated notification as soon as the maintenance team marks your reported issue as resolved."
  },
  {
    question: "Can I see what others have reported?",
    answer: "Yes, the campus map and feed show all public reports. This prevents duplicate submissions and keeps the community informed."
  },
  {
    question: "What if an issue is an emergency?",
    answer: "For immediate emergencies (e.g., major flooding, fire, severe security threats), please call campus security directly instead of using the app."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 32, filter: 'blur(4px)', opacity: 0 },
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

export function AmritaFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={itemVariants}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">
          Frequently asked questions
        </h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-4"
      >
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className="border border-gray-200 dark:border-[#272727] rounded-2xl overflow-hidden bg-white dark:bg-[#181818]"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#A51636]"
              >
                <span className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  >
                    <div className="px-6 pb-5 text-base text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
