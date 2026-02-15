import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, BookOpen, Brain, Trophy, Paperclip, X, FileText, Zap, Trash2, Cpu, GraduationCap } from 'lucide-react';
import { csKnowledgeBase } from '../data/csKnowledgeBase';
import * as pdfjsLib from 'pdfjs-dist';

// Reliable worker for PDF extraction
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;

interface StudyBuddyProps {
  user: any;
}

interface LearnedData {
  fileName: string;
  content: string;
  timestamp: number;
}

export function StudyBuddy({ user }: StudyBuddyProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState<{ file: File; type: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [learnedSessionData, setLearnedSessionData] = useState<LearnedData[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(`nuconnect_buddy_memory_${user?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (user?.id && typeof window !== 'undefined') {
      localStorage.setItem(`nuconnect_buddy_memory_${user.id}`, JSON.stringify(learnedSessionData));
    }
  }, [learnedSessionData, user?.id]);

  useEffect(() => {
    setMessages([
      {
        role: 'ai',
        content: `Hello ${user?.name?.split(' ')[0] || 'Friend'}! 🎓 I'm your **Persistent** Study Buddy.

I have knowledge of CS concepts across all semesters, and I memorize every PDF you upload. ${learnedSessionData.length > 0
            ? `I'm currently remembering **${learnedSessionData.length} documents** you shared earlier.`
            : "Upload a PDF, and I'll learn its contents for our future sessions!"}

What should we master today?`
      }
    ]);
  }, [user?.name, learnedSessionData.length]);

  const quickActions = [
    { icon: BookOpen, label: 'Explain OOP', prompt: 'Explain Object Oriented Programming' },
    { icon: Brain, label: 'Data Structures', prompt: 'Tell me about BSTs' },
    { icon: Trophy, label: 'Normalization', prompt: 'What is Database Normalization?' },
    { icon: Sparkles, label: 'Learn from PDF', prompt: 'LEARN_PDF_TRIGGER' }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachment({ file, type: file.type });
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearMemory = () => {
    if (window.confirm("Delete all learned PDF data?")) {
      setLearnedSessionData([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`nuconnect_buddy_memory_${user?.id || 'guest'}`);
      }
      setMessages(prev => [...prev, { role: 'ai', content: "Memory cleared. Returning to my core CS knowledge base." }]);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';

      const maxPages = Math.min(pdf.numPages, 10);
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => (item && typeof item === 'object' && 'str' in item) ? item.str : '')
          .join(' ');
        fullText += pageText + ' ';
      }
      return fullText.trim();
    } catch (error) {
      console.error('PDF Extraction Error:', error);
      return '';
    }
  };

  const generateResponse = async (query: string, file?: File): Promise<string> => {
    let response = '';

    if (file && file.type === 'application/pdf') {
      const text = await extractTextFromPDF(file);
      if (text) {
        if (learnedSessionData.some(d => d.fileName === file.name)) {
          return `I already remember **${file.name}**. I'm ready to answer any questions about its contents!`;
        }

        setLearnedSessionData(prev => [...prev, {
          fileName: file.name,
          content: text,
          timestamp: Date.now()
        }]);

        response += `### 🧠 Memory Enhanced\n\nI've analyzed **${file.name}** and stored it in my persistent core. I'll remember this across all future sessions! `;

        const matches = csKnowledgeBase.filter(c => text.toLowerCase().includes(c.topic.toLowerCase()));
        if (matches.length > 0) {
          response += `This aligns with my knowledge of **${matches[0].topic}**. `;
        }

        response += `\n\n**Snippet:** ${text.substring(0, 150)}...`;
      } else {
        response = `I've noted the upload of **${file.name}**. (Note: If this is a scan, text extraction might be limited, but I'll assist as best as I can!)`;
      }
      return response;
    }

    const q = query.toLowerCase();

    // Core Knowledge
    const core = csKnowledgeBase.find(c =>
      c.topic.toLowerCase() === q ||
      c.keywords.some(k => q.includes(k.toLowerCase())) ||
      q.includes(c.topic.toLowerCase())
    );

    if (core) {
      response = `### ${core.topic} (Semester ${core.semester})`;
      if (core.definition) response += `\n\n**Definition:** ${core.definition}`;
      response += `\n\n${core.explanation}`;
      if (core.simple) response += `\n\n*💡 Simple Mode: ${core.simple}*`;
      if (core.example) response += `\n\n**Example:** \`${core.example}\``;
      if (core.complexity) response += `\n\n**Efficiency:** ${core.complexity}`;
      if (core.questions && core.questions.length > 0) {
        response += `\n\n**Practice Questions:**\n` + core.questions.map(q => `* ${q}`).join('\n');
      }
      if (core.related) response += `\n\n*Related: ${core.related.join(', ')}*`;
    }
    // Memory Check
    else {
      const memoryMatch = learnedSessionData.find(d =>
        d.content.toLowerCase().includes(q) ||
        q.split(' ').some(w => w.length > 4 && d.content.toLowerCase().includes(w))
      );

      if (memoryMatch) {
        const idx = memoryMatch.content.toLowerCase().indexOf(q);
        const start = Math.max(0, (idx === -1 ? 0 : idx) - 50);
        response = `### 📖 From Your Documents\n\nI found this in **${memoryMatch.fileName}**:\n\n"...${memoryMatch.content.substring(start, start + 450)}..."`;
      }
    }

    if (!response) {
      if (q.includes('hello') || q.includes('hi')) {
        response = `Hello! I'm your offline-capable Study Buddy. I remember **${learnedSessionData.length}** of your documents. How can I help?`;
      } else {
        response = "I don't have that in my current memory or database. Try asking about CS topics or upload a PDF!";
      }
    }

    return response;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !attachment) return;
    const msg = inputMessage;
    const att = attachment;
    setInputMessage('');
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsTyping(true);

    const fullMsg = msg + (att ? `\n[File: ${att.file.name}]` : '');
    const updated = [...messages, { role: 'user' as const, content: fullMsg }];
    setMessages(updated);

    try {
      const aiMsg = await generateResponse(msg, att?.file);
      setMessages([...updated, { role: 'ai' as const, content: aiMsg }]);
    } catch (e) {
      setMessages([...updated, { role: 'ai' as const, content: "Something went wrong. Let me try that again!" }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className="flex flex-col h-[75vh] sm:h-[650px] bg-white rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden border border-emerald-100/50 w-full max-w-4xl mx-auto">
      {/* Premium Header */}
      <div className="bg-[#064e3b] p-4 sm:p-6 text-white flex items-center justify-between relative shadow-xl z-20">
        <div className="flex items-center gap-3 sm:gap-4 relative z-10">
          <div className="bg-emerald-50 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-inner">
            <Cpu className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-900" />
          </div>
          <div>
            <h2 className="font-black text-lg sm:text-2xl tracking-tighter text-white m-0 uppercase leading-none">STUDY BUDDY AI</h2>
            <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
              <span className="flex items-center gap-1 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-100 bg-emerald-500/20 px-2 py-0.5 sm:py-1 rounded-lg border border-white/10">
                <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-emerald-400" /> Persistent Mode
              </span>
              {learnedSessionData.length > 0 && (
                <span className="text-[8px] sm:text-[10px] text-emerald-50 font-bold bg-white/10 px-2 py-0.5 sm:py-1 rounded-lg border border-white/5">
                  {learnedSessionData.length} Docs
                </span>
              )}
            </div>
          </div>
        </div>

        {learnedSessionData.length > 0 && (
          <button
            onClick={clearMemory}
            className="p-2 sm:p-3 hover:bg-black/20 rounded-xl transition-all text-white/80 hover:text-white border border-white/10"
          >
            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-8 bg-[#fdfdfd]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex gap-2 sm:gap-4 max-w-[95%] sm:max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-2 ${msg.role === 'user' ? 'bg-emerald-800 border-emerald-700' : 'bg-white border-emerald-50'
                }`}>
                {msg.role === 'user' ? <Trophy className="w-5 h-5 sm:w-7 sm:h-7 text-white" /> : <Bot className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-800" />}
              </div>
              <div className={`p-3 sm:p-5 rounded-2xl sm:rounded-[2rem] shadow-sm leading-relaxed ${msg.role === 'user'
                ? 'bg-emerald-800 text-white rounded-tr-none font-bold'
                : 'bg-white text-gray-900 border border-emerald-100 rounded-tl-none font-bold'
                }`}>
                <div className="text-xs sm:text-[15px] whitespace-pre-wrap tracking-tight">
                  {msg.content}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-1.5 p-3 sm:p-4 bg-emerald-50/50 rounded-full animate-pulse border border-emerald-100">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-800 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input */}
      <div className="p-4 sm:p-6 bg-white border-t border-emerald-50 space-y-3 sm:space-y-4 relative z-20">
        {attachment && (
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl sm:rounded-2xl animate-in zoom-in-95 border border-emerald-100 shadow-inner">
            <div className="bg-emerald-800 p-2 rounded-lg text-white">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-xs sm:text-sm font-black text-emerald-950 truncate flex-1">{attachment.file.name}</span>
            <button onClick={removeAttachment} className="p-2 hover:bg-white rounded-lg text-red-500 transition-all border border-emerald-100">
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {messages.length < 3 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {quickActions.map((a, idx) => (
                <button
                  key={idx}
                  onClick={() => a.prompt === 'LEARN_PDF_TRIGGER' ? fileInputRef.current?.click() : setInputMessage(a.prompt)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#f8faf9] text-emerald-900 rounded-xl sm:rounded-2xl text-[10px] sm:text-[13px] font-black whitespace-nowrap border border-emerald-100 hover:bg-emerald-50 transition-all"
                >
                  <a.icon className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
                  {a.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-4">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf" className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 sm:p-5 text-emerald-900 hover:bg-emerald-50 rounded-xl sm:rounded-[1.8rem] transition-all border-2 border-emerald-50 hover:border-emerald-200 bg-emerald-50/20 shadow-sm"
            >
              <Paperclip className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="flex-1 relative group">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={attachment ? "Ask about file..." : "Ask me anything..."}
                className="w-full pl-4 pr-12 sm:pl-7 sm:pr-16 py-3.5 sm:py-5 bg-[#f8faf9] border-2 border-emerald-50 rounded-xl sm:rounded-[2rem] focus:bg-white focus:border-emerald-600/30 transition-all outline-none font-bold text-xs sm:text-base text-gray-900"
              />
              <button
                onClick={handleSendMessage}
                className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 p-2 sm:p-3.5 text-white bg-emerald-800 rounded-lg sm:rounded-[1.5rem] hover:bg-[#064e3b] transition-all shadow-lg flex items-center justify-center"
              >
                <Send className="w-4 h-4 sm:w-6 sm:h-6 fill-current" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}