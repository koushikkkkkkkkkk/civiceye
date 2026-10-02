import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles, Phone, Mail, MessageSquare } from 'lucide-react';
import { useBrand } from '@/hooks/useBrand';
import { CAMPUS_ADDRESS } from '@/data/amritaCampus/campusInfo';
import { AUTHORITIES } from '@/data/authorities';
import { cn } from '@/utils/cn';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const KNOWLEDGE = {
  civiceye: [
    { q: 'what is civiceye', a: 'CivicEye is a civic-issue reporting platform — making cities better, one report at a time. Report potholes, garbage, broken lights with photo + AI analysis + location, community verifies, authorities fix.' },
    { q: 'how to report', a: 'Go to Report → Pick category → Add photo (AI will auto-detect) → Pin location on map → Add details → Submit. Your report gets a code like CE-XXXX and goes live for verification.' },
    { q: 'bbmp', a: 'BBMP handles roads, potholes, garbage, etc. CivicEye routes your report to comm@bbmp.gov.in + zone emails based on location. Helpline 1533 / 080-2266 0000, WhatsApp 9480685700 (grievance) + 9448197197 (waste). Portal: bbmp.gov.in' },
    { q: 'email', a: 'When you click Report to Authority, CivicEye creates an email with original photo + AI annotated image, Maps link, severity, and link to report on website. For city it goes to BBMP, for campus to Estate Office.' },
    { q: 'ai', a: 'CivicEye uses smart AI to auto-detect category, confidence, severity, and produces annotated image with exact outline tracing the issue. You can view AI annotation in Community tab via View AI button.' },
    { q: 'community', a: 'Community tab shows reports. Each card has View AI button to toggle between original and AI annotated image. You can upvote, confirm, and review.' },
    { q: 'food', a: 'Food / mess hygiene complaints are anonymous and go straight to the Chief Warden, Hostel Office, DSW, Student Welfare, Estate, and info@blr.amrita.edu — CivicEye is BCC\'d as a fallback. Open /food-hygiene to file one.' },
  ],
  amrita: [
    { q: 'what is amrita eye', a: 'Amrita Eye is the campus portal for Amrita Bengaluru — Kasavanahalli, 560035. It has a campus map with 12 buildings, 5 blocks A-E, 15 floors, 165 rooms, 155 faculty searchable.' },
    { q: 'estate office', a: `Estate Office handles campus maintenance — potholes, roads, sidewalks, garbage, water, lights. Email: ${CAMPUS_ADDRESS.email}. Address: Estate Office, Admin Block. Hours: Mon–Sat 9-5. Security handles safety 24x7.` },
    { q: 'how to report campus', a: 'Go to Report → Pin location on campus map (tap any building, block, floor, room) → Add photo → Submit. Your campus issue shows only on campus map. Estate office gets email with annotation + Maps link + severity.' },
    { q: 'floor plan', a: 'Floor plans show accurate layouts — open corridor with railing facing courtyard, classrooms and labs inside. E Block is square with all halls on 1st, 2nd, 3rd floor. Library is on 4th floor with 200 seating.' },
    { q: 'faculty', a: '155 faculty searchable by name, department, room. Tap a faculty in campus map to see room, floor, block, and route from entrance.' },
    { q: 'mess', a: 'Mess / food hygiene complaints: open /food-hygiene — 100% anonymous, up to 3 photos (GPS/EXIF auto-stripped), routed to Chief Warden, Hostel Office, DSW, Student Welfare, Estate, and info@blr.amrita.edu.' },
  ],
};

function getResponse(input: string, isAmrita: boolean): string {
  const q = input.toLowerCase();
  const all = [...KNOWLEDGE.civiceye, ...(isAmrita ? KNOWLEDGE.amrita : [])];
  for (const item of all) {
    if (q.includes(item.q)) return item.a;
  }
  if (q.includes('hello') || q.includes('hi')) return `Hello! 👋 I'm CivicEye AI assistant — I can help with reporting issues, BBMP, Estate Office, campus map, AI annotations, community, food-hygiene, etc.`;
  if (q.includes('map')) return isAmrita ? KNOWLEDGE.amrita[0].a : 'CivicEye map shows live issues with clustering, heatmap, filters. Amrita Eye uses campus map with floor plans.';
  if (q.includes('library')) return 'Central Library — E Block 4th floor, 200 seating + Reading Hall 150 seating, 45,880+ items, Reference & Digital Library, 8am-12midnight.';
  if (q.includes('hall')) return 'Halls in E Block: Amriteshwari 265, Sudhamani 300, Krishna 112 on 1st floor, Vyasa 90, Rama 85, Valmiki 80, Conference 27 on 2nd floor, Indo-US 62, E-Learning 120, Akshaya 100 on 3rd floor.';
  if (q.includes('food') || q.includes('mess') || q.includes('hygiene')) return isAmrita ? KNOWLEDGE.amrita.find(k => k.q === 'mess')!.a : KNOWLEDGE.civiceye.find(k => k.q === 'food')!.a;
  if (q.includes('contact') || q.includes('phone') || q.includes('email')) {
    const auth = AUTHORITIES.filter((a) => (isAmrita ? a.scope === 'campus' : a.scope === 'city')).slice(0,3).map((a) => `${a.name}: ${a.email || a.phone}`).join(', ');
    return `Authorities: ${auth}. For campus: Estate Office via ${CAMPUS_ADDRESS.email}. For city: BBMP comm@bbmp.gov.in helpline 1533. For food/mess issues: /food-hygiene (anonymous).`;
  }
  return `I'm still learning! 🤖 I can help with reporting, BBMP/Estate Office email, food hygiene complaints, campus map, faculty, community AI view, etc. Try asking about BBMP, Estate Office, mess/food, floor plan, library, halls, or how to report.`;
}

const QUICK_QUESTIONS = [
  'How to report?',
  'Estate Office?',
  'Campus map?',
  'Mess / food?',
  'Faculty?',
];

/**
 * CivicEye / Amrita Eye AI assistant.
 * PWA-Optimized Native-like Experience.
 */
export function AIChatbot() {
  const { isAmrita } = useBrand();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: `Hi! I'm CivicEye AI 🤖 — ${isAmrita ? 'Amrita Eye campus helper' : 'city helper'}. I can help with reporting, Estate Office, campus map, mess/food complaints, AI annotations, community.`, timestamp: new Date().toISOString() },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, open]);

  // Lock body scroll when the chat sheet is open (mobile).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTimeout(() => {
      const reply = getResponse(text, isAmrita);
      const assistantMsg: Message = { id: (Date.now()+1).toString(), role: 'assistant', text: reply, timestamp: new Date().toISOString() };
      setMessages((m) => [...m, assistantMsg]);
    }, 500);
  };

  const panel = (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100]"
          role="dialog"
          aria-modal="true"
          aria-label="AI Assistant"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Mobile: full-width native-like 100dvh sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="absolute inset-x-0 bottom-0 flex flex-col bg-slate-50 dark:bg-[#121212] sm:hidden"
            style={{ height: '100dvh' }}
          >
            <ChatHeader onClose={() => setOpen(false)} isAmrita={isAmrita} />
            <MessageList messages={messages} bottomRef={bottomRef} />
            <Composer input={input} setInput={setInput} send={send} />
          </motion.div>

          {/* Desktop: floating card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="hidden sm:absolute sm:bottom-24 sm:right-7 sm:flex sm:h-[600px] sm:w-[400px] sm:flex-col sm:overflow-hidden sm:rounded-[2rem] sm:border sm:border-slate-200/50 sm:bg-slate-50 sm:shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:sm:border-white/10 dark:sm:bg-[#121212] dark:sm:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
          >
            <ChatHeader onClose={() => setOpen(false)} isAmrita={isAmrita} />
            <MessageList messages={messages} bottomRef={bottomRef} />
            <Composer input={input} setInput={setInput} send={send} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.06 }}
        className={cn(
          'fixed left-4 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]',
          'bottom-24 sm:bottom-8 sm:left-auto sm:right-7',
        )}
        aria-label={open ? 'Close AI chat' : 'Open AI chat'}
        aria-expanded={open}
      >
        {open ? <X className="h-6 w-6" strokeWidth={2.5} /> : <MessageSquare className="h-6 w-6" strokeWidth={2.3} />}
      </motion.button>

      {typeof document !== 'undefined' ? createPortal(panel, document.body) : null}
    </>
  );
}

function ChatHeader({ onClose, isAmrita }: { onClose: () => void; isAmrita: boolean }) {
  return (
    <div 
      className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-slate-200/50 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-white/5 dark:bg-[#18181b]/80"
      style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 12px)' }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white shadow-sm">
          <Bot className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[15px] font-semibold tracking-tight text-slate-900 dark:text-white">
            CivicEye AI <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-[12px] text-slate-500 dark:text-slate-400">
            {isAmrita ? 'Amrita Eye Campus Assistant' : 'City Assistant'}
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        aria-label="Close chat"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition active:scale-95 dark:bg-white/10 dark:text-slate-300"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

function MessageList({ messages, bottomRef }: { messages: Message[]; bottomRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-6 scroll-smooth bg-transparent">
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn('flex w-full', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            {msg.role === 'assistant' && (
              <div className="mr-2 mt-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 shadow-sm dark:bg-primary-500/20 dark:text-primary-400">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div
              className={cn(
                'relative max-w-[85%] rounded-[1.25rem] px-4 py-2.5 text-[15px] leading-[1.45]',
                msg.role === 'user'
                  ? 'rounded-br-sm bg-primary-500 text-white shadow-sm'
                  : 'rounded-bl-sm bg-white text-slate-800 shadow-sm ring-1 ring-slate-900/5 dark:bg-[#18181b] dark:text-slate-100 dark:ring-white/10',
              )}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} className="h-2" />
      </div>
    </div>
  );
}

function Composer({
  input, setInput, send,
}: { input: string; setInput: (s: string) => void; send: () => void }) {
  return (
    <div 
      className="shrink-0 border-t border-slate-200/50 bg-white/90 p-3 backdrop-blur-xl dark:border-white/5 dark:bg-[#18181b]/90" 
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 12px), 12px)' }}
    >
      <div className="-mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-700 shadow-sm transition active:bg-slate-50 dark:border-white/5 dark:bg-[#27272a] dark:text-slate-200 dark:active:bg-[#3f3f46]"
          >
            {q}
          </button>
        ))}
      </div>
      <div className="flex items-end gap-2">
        <div className="flex min-h-[44px] flex-1 items-center rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-1 shadow-inner focus-within:border-primary-500/40 focus-within:bg-white dark:border-white/5 dark:bg-[#18181b] dark:focus-within:border-primary-500/40 dark:focus-within:bg-[#18181b]">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Ask a question..."
            className="max-h-32 flex-1 resize-none bg-transparent py-2.5 text-[15px] outline-none placeholder:text-slate-400 dark:text-white"
          />
        </div>
        <button
          onClick={send}
          disabled={!input.trim()}
          aria-label="Send message"
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition',
            input.trim() ? 'bg-primary-500 active:scale-95' : 'bg-slate-200 text-slate-400 dark:bg-[#27272a] dark:text-slate-500',
          )}
        >
          <Send className="h-5 w-5" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
