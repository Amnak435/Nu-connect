import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, BookOpen, Brain, Trophy, Paperclip, X, FileText, Zap, Trash2, Cpu, GraduationCap, ArrowUpRight } from 'lucide-react';
import { csKnowledgeBase } from '../data/csKnowledgeBase';

// Using a slightly older, more stable PDF worker for maximal compatibility
const PDF_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

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

  const [learnedSessionData, setLearnedSessionData] = useState<LearnedData[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(`nuconnect_buddy_memory_${user?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  useEffect(() => {
    if (user?.id && typeof window !== 'undefined') {
      localStorage.setItem(`nuconnect_buddy_memory_${user.id}`, JSON.stringify(learnedSessionData));
    }
  }, [learnedSessionData, user?.id]);

  useEffect(() => {
    setMessages([
      {
        role: 'ai',
        content: `Hello ${user?.name?.split(' ')[0] || 'there'}! I'm your **Persistent** Study Buddy.

I have my core CS database, and I remember everything you teach me from PDF uploads. ${learnedSessionData.length > 0
            ? `I currently remember **${learnedSessionData.length} documents** from your previous sessions.`
            : "Upload a PDF, and I'll memorize it for your future sessions!"}

What should we study today?`
      }
    ]);
  }, [user?.name, learnedSessionData.length]);

  const quickActions = [
    { icon: BookOpen, label: 'OOP Concepts', prompt: 'Explain Object Oriented Programming' },
    { icon: Brain, label: 'Tree Structures', prompt: 'Tell me about Binary Search Trees' },
    { icon: Trophy, label: 'Database Normalization', prompt: 'What is Database Normalization?' },
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
    if (window.confirm("Delete everything I've learned from your documents?")) {
      setLearnedSessionData([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`nuconnect_buddy_memory_${user?.id || 'guest'}`);
      }
      setMessages(prev => [...prev, { role: 'ai', content: "Memory cleared. Back to basic mode!" }]);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      // Import PDF.js dynamically
      const pdfjs = await import('pdfjs-dist');
      // Set worker with specific version worker for stability
      pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let text = '';

      const maxPages = Math.min(pdf.numPages, 12);
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        text += textContent.items.map((item: any) => item.str).join(' ') + '\n';
      }
      return text.trim();
    } catch (error) {
      console.error('PDF Read Error:', error);
      // Fallback: If parsing fails, use the filename to at least give some simulated context
      return `[SIMULATED CONTEXT FOR ${file.name}] The document appears to be related to its title.`;
    }
  };

  const generateOfflineResponse = async (query: string, file?: File): Promise<string> => {
    let response = '';

    if (file && file.type === 'application/pdf') {
      const pdfText = await extractTextFromPDF(file);
      if (pdfText && !pdfText.startsWith('[SIMULATED')) {
        if (learnedSessionData.some(d => d.fileName === file.name)) {
          return `I already remember **${file.name}**. I'm ready to answer any questions about it!`;
        }

        setLearnedSessionData(prev => [...prev, {
          fileName: file.name,
          content: pdfText,
          timestamp: Date.now()
        }]);

        response += `### 🧠 Memory Acquired!\n\nI've memorized **${file.name}**. I'll remember this content across all your future sessions. `;

        const matchedCoreTopics = csKnowledgeBase.filter(concept =>
          pdfText.toLowerCase().includes(concept.topic.toLowerCase())
        );

        if (matchedCoreTopics.length > 0) {
          response += `This document matches my knowledge of **${matchedCoreTopics[0].topic}**. `;
        }

        response += `\n\n**Brief Summary:** ${pdfText.substring(0, 200)}...`;
      } else {
        response = `I've noted the document **${file.name}**. (PDF text extraction is limited in some environments, but I'll do my best to help based on your queries!)`;
      }
      return response;
    }

    const lowerQuery = query.toLowerCase();
    const coreMatch = csKnowledgeBase.find(concept =>
      concept.keywords.some(k => lowerQuery.includes(k.toLowerCase())) ||
      lowerQuery.includes(concept.topic.toLowerCase())
    );

    if (coreMatch) {
      response = `### ${coreMatch.topic}\n\n${coreMatch.explanation}\n\n*Related: ${coreMatch.related?.join(', ') || 'None'}*`;
    }
    else if (learnedSessionData.length > 0) {
      const learnedMatch = learnedSessionData.find(doc =>
        doc.content.toLowerCase().includes(lowerQuery) ||
        lowerQuery.split(' ').some(word => word.length > 4 && doc.content.toLowerCase().includes(word))
      );

      if (learnedMatch) {
        const index = learnedMatch.content.toLowerCase().indexOf(lowerQuery);
        const start = Math.max(0, (index === -1 ? 0 : index) - 100);
        const snippet = learnedMatch.content.substring(start, start + 500);
        response = `### 📖 From My Memory\n\nI found this in **${learnedMatch.fileName}**:\n\n"...${snippet}..."`;
      }
    }

    if (!response) {
      if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
        response = `Hello! I'm your self-learning assistant. I remember **${learnedSessionData.length}** of your files. How can I help?`;
      } else {
        response = "I don't have that in my core database or memory yet. Try uploading a PDF about it!";
      }
    }

    return response;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !attachment) return;
    const userMsg = inputMessage;
    const currentAttachment = attachment;
    setInputMessage('');
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsTyping(true);

    const fullUserMsg = userMsg + (currentAttachment ? `\n[Attached: ${currentAttachment.file.name}]` : '');
    const newMessages = [...messages, { role: 'user' as const, content: fullUserMsg }];
    setMessages(newMessages);

    try {
      const responseText = await generateOfflineResponse(userMsg, currentAttachment?.file);
      setMessages([...newMessages, { role: 'ai' as const, content: responseText }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'ai' as const, content: "I'm having a little trouble thinking. Try again!" }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className="flex flex-col h-[680px] bg-white rounded-[2.5rem] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.2)] overflow-hidden border border-emerald-100/50 font-sans transition-all">
      {/* High-Performance Header */}
      <div className="bg-[#064e3b] p-7 text-white flex items-center justify-between relative shadow-2xl z-40 border-b border-emerald-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-black opacity-90" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[100px] -mr-20 -mt-20" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="bg-emerald-50 content-center p-3.5 rounded-3xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Cpu className="w-9 h-9 text-emerald-900" />
          </div>
          <div>
            <h2 className="font-black text-2xl tracking-tight text-white m-0 uppercase flex items-center gap-2">
              Study Buddy <span className="text-[10px] bg-emerald-500/30 px-2 py-0.5 rounded-md border border-white/20">V2.0</span>
            </h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-50 opacity-80">
                <Zap className="w-3 h-3 fill-emerald-400 text-emerald-400" /> Self-Learning Core
              </span>
              {learnedSessionData.length > 0 && (
                <span className="text-xs text-white font-black px-2 py-0.5 bg-white/10 rounded-full border border-white/10">
                  {learnedSessionData.length} Files Learned
                </span>
              )}
            </div>
          </div>
        </div>

        {learnedSessionData.length > 0 && (
          <button
            onClick={clearMemory}
            className="p-3.5 hover:bg-red-500/20 rounded-2xl transition-all text-white/80 hover:text-white border border-white/10 hover:border-red-500/30 backdrop-blur-sm group"
            title="Wipe Memory"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Modern Chat Canvas */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#fdfdfd] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-5 duration-500`}>
            <div className={`flex gap-4 max-w-[92%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-2 ${msg.role === 'user' ? 'bg-emerald-800 border-emerald-700' : 'bg-white border-emerald-100'
                }`}>
                {msg.role === 'user' ? <GraduationCap className="w-7 h-7 text-white" /> : <Bot className="w-7 h-7 text-emerald-800" />}
              </div>
              <div className={`p-6 rounded-[2.2rem] shadow-sm leading-[1.6] ${msg.role === 'user'
                  ? 'bg-emerald-800 text-white rounded-tr-none font-bold'
                  : 'bg-white text-gray-900 border border-emerald-50 rounded-tl-none ring-1 ring-emerald-500/5 antialiased font-semibold tracking-tight'
                }`}>
                <div className="text-[15px] whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-emerald-100 px-7 py-5 rounded-full shadow-xl flex gap-1.5 items-center">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-duration:1.2s]" />
              <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:1.2s]" />
              <div className="w-2.5 h-2.5 bg-emerald-900 rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:1.2s]" />
            </div>
          </div>
        )}
      </div>

      {/* Ultra-Modern Action Footer */}
      <div className="p-8 bg-white border-t border-emerald-50 space-y-5 relative z-20">
        {attachment && (
          <div className="flex items-center gap-4 p-5 bg-emerald-50 rounded-3xl animate-in zoom-in-95 border border-emerald-100 shadow-inner ring-4 ring-emerald-50/50">
            <div className="bg-emerald-800 p-3 rounded-2xl text-white shadow-xl shadow-emerald-200">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex flex-col flex-1 truncate">
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Selected Material</span>
              <span className="text-base font-black text-emerald-950 truncate">{attachment.file.name}</span>
            </div>
            <button onClick={removeAttachment} className="p-3 hover:bg-white rounded-2xl text-red-500 transition-all shadow-sm border border-emerald-100 hover:border-red-100">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => action.prompt === 'LEARN_PDF_TRIGGER' ? fileInputRef.current?.click() : setInputMessage(action.prompt)}
                className="flex items-center gap-2.5 px-5 py-2.5 bg-emerald-50/30 text-emerald-800 rounded-2xl text-[13px] font-black whitespace-nowrap hover:bg-emerald-100 transition-all border border-emerald-100/40 hover:scale-[1.03] active:scale-95 shadow-sm"
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf" className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-5 text-emerald-900 hover:bg-emerald-50 rounded-[1.8rem] transition-all border-2 border-emerald-50 hover:border-emerald-200 bg-emerald-50/20 active:scale-90 shadow-sm"
            >
              <Paperclip className="w-7 h-7" />
            </button>

            <div className="flex-1 relative group">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={attachment ? "What should I look for in this file?" : "Ask me anything..."}
                className="w-full pl-7 pr-20 py-6 bg-[#f8faf9] border-2 border-transparent rounded-[2.2rem] focus:bg-white focus:border-emerald-600/20 focus:ring-[15px] focus:ring-emerald-500/5 transition-all outline-none font-black text-gray-900 placeholder:text-gray-400 placeholder:font-black shadow-inner"
              />
              <button
                onClick={handleSendMessage}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-4 text-white bg-emerald-900 rounded-[1.8rem] hover:bg-black active:scale-95 transition-all shadow-xl shadow-emerald-200 flex items-center gap-2 px-6"
              >
                <span className="font-black text-xs uppercase tracking-tighter">Send</span>
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}