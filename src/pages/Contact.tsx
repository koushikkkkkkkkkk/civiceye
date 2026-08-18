import { AnimatedText } from '@/components/ui/AnimatedText';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: { type: 'spring', duration: 0.45, bounce: 0 }
  }
};

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email address.'),
  subject: z.string().min(4, 'Please add a short subject.'),
  message: z.string().min(10, 'Your message should be at least 10 characters.'),
  ward: z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

const INFO = [
  { icon: Mail, label: 'Email', value: 'hello@civiceye.app' },
  { icon: Phone, label: 'Phone', value: '+91 80 1234 5678' },
  { icon: MapPin, label: 'Office', value: 'Indiranagar, Bengaluru 560038' },
  { icon: Clock, label: 'Response time', value: 'Within 1–2 working days' },
];

export function Contact() {
  const toast = useToast();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactForm) => {
    await new Promise((r) => setTimeout(r, 1200));
    console.info('[CivicEye] contact form (prototype)', data);
    setSent(true);
    toast.success('Message sent!', 'We’ll get back to you within 1–2 working days.');
  };

  return (
    <div className="bg-[#FFF5F7] dark:bg-[#1A030A] min-h-screen pt-32 pb-32">
      <section className="mx-auto max-w-[1920px] px-6 lg:px-12">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ type: 'spring', duration: 0.45, bounce: 0 }}
          className="mb-16"
        >
          <div className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#A51636] dark:text-[#E52B50]">
            <span className="h-2 w-2 rounded-full bg-[#A51636] dark:bg-[#E52B50]" aria-hidden="true" />
            <span>Contact us</span>
          </div>
          <h1 className="max-w-4xl text-[56px] sm:text-[64px] font-bold leading-[1.05] tracking-[-0.03em] text-neutral-900 dark:text-white">
            <AnimatedText text="Talk to the " /> <span className="font-serif italic font-normal text-[#A51636] dark:text-[#E52B50]"><AnimatedText text="team." /></span>
          </h1>
          <p className="mt-8 max-w-2xl text-[16px] leading-[1.5] text-neutral-600 dark:text-neutral-400">
            Questions, partnerships, or a ward office that wants in? We’d love to hear from you.
          </p>
        </motion.div>

        {/* Content Split */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-12 lg:grid-cols-5 lg:gap-24"
        >
          
          {/* Info Sidebar */}
          <motion.aside variants={itemVariants} className="space-y-6 lg:col-span-2">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Reach us directly</h2>
            <ul className="space-y-6">
              {INFO.map((item) => (
                <li key={item.label} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-[#111113] border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white shadow-sm">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col justify-center h-12">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                      {item.value}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-12 rounded-3xl border border-primary-500/20 bg-primary-500/5 p-8 shadow-sm dark:border-primary-500/30 dark:bg-primary-500/10">
              <h3 className="text-lg font-bold text-primary-600 dark:text-primary-400">For authorities</h3>
              <p className="mt-3 text-sm leading-6 text-primary-700/70 dark:text-primary-300/70">
                Ward officers and agencies: request a demo dashboard for your jurisdiction.
              </p>
              <p className="mt-6 font-mono text-sm font-semibold text-primary-600 dark:text-primary-400">gov@civiceye.app</p>
            </div>
          </motion.aside>

          {/* Form Area */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#0D0105] sm:p-12">
              {sent ? (
                <div className="flex flex-col items-center py-16 text-center">
                  <CheckCircle2 className="mb-6 h-16 w-16 text-primary-500" />
                  <h3 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Message sent!
                  </h3>
                  <p className="mt-4 max-w-sm text-base leading-7 text-neutral-500 dark:text-neutral-400">
                    Thanks for reaching out. This is a prototype, so nothing was actually emailed —
                    but in a real deployment this would land straight in our inbox.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-8 inline-flex h-14 items-center justify-center rounded-full border border-neutral-200 bg-white px-8 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-50 dark:border-white/10 dark:bg-[#1a1a1c] dark:text-white dark:hover:bg-[#222]"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-bold text-neutral-900 dark:text-white">
                        Full name
                      </label>
                      <input
                        id="name"
                        {...register('name')}
                        className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3.5 text-sm text-neutral-900 transition-colors focus:border-neutral-900 focus:outline-none dark:border-neutral-700 dark:text-white dark:focus:border-white"
                        placeholder="e.g. Ananya Rao"
                        aria-invalid={Boolean(errors.name)}
                      />
                      {errors.name && (
                        <p className="mt-2 text-xs font-medium text-primary-500">{errors.name.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-bold text-neutral-900 dark:text-white">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3.5 text-sm text-neutral-900 transition-colors focus:border-neutral-900 focus:outline-none dark:border-neutral-700 dark:text-white dark:focus:border-white"
                        placeholder="you@example.com"
                        aria-invalid={Boolean(errors.email)}
                      />
                      {errors.email && (
                        <p className="mt-2 text-xs font-medium text-primary-500">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="mb-2 block text-sm font-bold text-neutral-900 dark:text-white">
                      Subject
                    </label>
                    <input
                      id="subject"
                      {...register('subject')}
                      className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3.5 text-sm text-neutral-900 transition-colors focus:border-neutral-900 focus:outline-none dark:border-neutral-700 dark:text-white dark:focus:border-white"
                      placeholder="How can we help?"
                      aria-invalid={Boolean(errors.subject)}
                    />
                    {errors.subject && (
                      <p className="mt-2 text-xs font-medium text-primary-500">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="ward" className="mb-2 block text-sm font-bold text-neutral-900 dark:text-white">
                      Ward / area (optional)
                    </label>
                    <input
                      id="ward"
                      {...register('ward')}
                      className="w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3.5 text-sm text-neutral-900 transition-colors focus:border-neutral-900 focus:outline-none dark:border-neutral-700 dark:text-white dark:focus:border-white"
                      placeholder="e.g. Koramangala"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-bold text-neutral-900 dark:text-white">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      {...register('message')}
                      className="w-full resize-none rounded-xl border border-neutral-300 bg-transparent px-4 py-3.5 text-sm text-neutral-900 transition-colors focus:border-neutral-900 focus:outline-none dark:border-neutral-700 dark:text-white dark:focus:border-white"
                      placeholder="Tell us what’s on your mind…"
                      aria-invalid={Boolean(errors.message)}
                    />
                    {errors.message && (
                      <p className="mt-2 text-xs font-medium text-primary-500">{errors.message.message}</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-neutral-900 px-8 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-70 dark:bg-white dark:text-black"
                    >
                      {isSubmitting ? (
                        <>
                          <Send className="h-4 w-4 animate-pulse" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>

      </section>
    </div>
  );
}
