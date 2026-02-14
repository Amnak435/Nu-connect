import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, BookOpen, Brain, Trophy, Paperclip, X, FileText, Zap, Trash2, Cpu, GraduationCap, ArrowUpRight } from 'lucide-react';
import { csKnowledgeBase } from '../data/csKnowledgeBase';
import * as pdfjsLib from 'pdfjs-dist';

// Use the exact version from package.json for the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.624/pdf.worker.min.js`;

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
        content: `Hello ${user?.name?.split(' ')[0] || 'Friend'}! 🎓 I'm your **Advanced Persistent** AI Study Buddy.

I memorize everything you upload. ${learnedSessionData.length > 0
            ? `I'm currently holding knowledge from **${learnedSessionData.length} documents** you taught me before.`
            : "Upload any PDF, and I'll learn its contents to help you study!"}

What's on our syllabus today?`
      }
    ]);
  }, [user?.name, learnedSessionData.length]);

  const quickActions = [
    { icon: BookOpen, label: 'Explain OOP', prompt: 'Explain Object Oriented Programming' },
    { icon: Brain, label: 'Data Structures', prompt: 'Tell me about Binary Search Trees' },
    { icon: Trophy, label: 'Database', prompt: 'What is Normalization?' },
    { icon: Sparkles, label: 'Learn PDF', prompt: 'LEARN_PDF_TRIGGER' }
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
    if (window.confirm("Should I clear everything I've learned from your documents?")) {
      setLearnedSessionData([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`nuconnect_buddy_memory_${user?.id || 'guest'}`);
      }
      setMessages(prev => [...prev, { role: 'ai', content: "Memory wiped. Fresh start!" }]);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let text = '';

      const maxPages = Math.min(pdf.numPages, 10);
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => (item && typeof item === 'object' && 'str' in item) ? item.str : '')
          .join(' ');
        text += pageText + ' ';
      }
      return text.trim();
    } catch (error) {
      console.error('PDF Extraction Error:', error);
      return '';
    }
  };

  const generateOfflineResponse = async (query: string, file?: File): Promise<string> => {
    let response = '';

    if (file && file.type === 'application/pdf') {
      const pdfText = await extractTextFromPDF(file);
      if (pdfText) {
        if (learnedSessionData.some(d => d.fileName === file.name)) {
          return `I already remember **${file.name}**. What would you like to know about it?`;
        }

        setLearnedSessionData(prev => [...prev, {
          fileName: file.name,
          content: pdfText,
          timestamp: Date.now()
        }]);

        response += `### 🧠 Long-Term Memory Updated\n\nI've analyzed and memorized **${file.name}**. I'll remember this content even if you refresh or logout! `;

        const matchedCoreTopics = csKnowledgeBase.filter(concept =>
          pdfText.toLowerCase().includes(concept.topic.toLowerCase())
        );

        if (matchedCoreTopics.length > 0) {
          response += `This document matches my core knowledge of **${matchedCoreTopics[0].topic}**. `;
        }

        response += `\n\n**Quick Preview:** ${pdfText.substring(0, 200)}...`;
      } else {
        response = `I've noted the upload of **${file.name}**, but I couldn't extract the text (it might be a scan). I'll remember that you uploaded it!`;
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
        response = `### 📖 From My Memorized Data\n\nI found this in **${learnedMatch.fileName}**:\n\n"...${snippet}..."`;
      }
    }

    if (!response) {
      if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
        response = `Hello! I remember **${learnedSessionData.length}** of your documents. How can I help you today?`;
      } else {
        response = "I don't have that in my memory or core database yet. Try uploading a PDF about it!";
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
      setMessages([...newMessages, { role: 'ai' as const, content: "Sorry, I had a processing error. Please try again." }]);
    } finally { setIsTyping(false); }
  };

  return (
    <div className="flex flex-col h-[650px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-emerald-100 font-sans">
      {/* Premium Header */}
      <div className="bg-[#064e3b] p-6 text-white flex items-center justify-between relative shadow-xl z-20">
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-emerald-500/20 p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
            <Cpu className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-black text-2xl tracking-tight text-white m-0">Study Buddy AI</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-50 bg-emerald-500/30 px-2.5 py-1 rounded-lg border border-white/10">
                <Zap className="w-3 h-3 fill-emerald-300" /> Persistent Core
              </span>
              {learnedSessionData.length > 0 && (
                <span className="text-[10px] text-emerald-100 font-bold bg-white/5 px-2.5 py-0.5 rounded-lg border border-white/5 backdrop-blur-sm">
                  Knowledge Base: {learnedSessionData.length} Docs
                </span>
              )}
            </div>
          </div>
        </div>

        {learnedSessionData.length > 0 && (
          <button
            onClick={clearMemory}
            className="p-3 hover:bg-white/10 rounded-2xl transition-all text-white/80 hover:text-white border border-white/10 group"
            title="Clear Memory"
          >
            <Trash2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white to-[#f0f4f2]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`flex gap-3 max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${msg.role === 'user' ? 'bg-emerald-700' : 'bg-white border border-emerald-100'
                }`}>
                {msg.role === 'user' ? <GraduationCap className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-emerald-700" />}
              </div>
              <div className={`p-5 rounded-[2rem] shadow-sm leading-relaxed ${msg.role === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-none font-bold'
                  : 'bg-white text-gray-800 border border-emerald-100 rounded-tl-none ring-1 ring-emerald-500/5'
                }`}>
                <div className="text-sm md:text-[15px] whitespace-pre-wrap font-bold tracking-tight">
                  {msg.content}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-emerald-100 px-6 py-4 rounded-full shadow-lg flex gap-1.5 items-center">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-duration:1s]" />
              <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s] [animation-duration:1s]" />
              <div className="w-2.5 h-2.5 bg-emerald-800 rounded-full animate-bounce [animation-delay:0.4s] [animation-duration:1s]" />
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Bar */}
      {messages.length < 3 && (
        <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar border-t border-emerald-100/30 bg-white/80 backdrop-blur-md relative z-10">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => action.prompt === 'LEARN_PDF_TRIGGER' ? fileInputRef.current?.click() : setInputMessage(action.prompt)}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-white text-emerald-800 rounded-2xl text-[13px] font-black whitespace-nowrap hover:bg-emerald-50 transition-all border border-emerald-100/60 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                <action.icon className="w-4 h-4" />
              </div>
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Premium Input Section */}
      <div className="p-6 bg-white border-t border-emerald-100/50 space-y-4 shadow-[0_-15px_40px_rgba(0,0,0,0.03)] relative z-20">
        {attachment && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl animate-in zoom-in-95 border border-emerald-100 shadow-inner">
            <div className="bg-emerald-700 p-2.5 rounded-xl text-white shadow-lg">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-sm font-black text-emerald-950 truncate flex-1">{attachment.file.name}</span>
            <button onClick={removeAttachment} className="p-2.5 hover:bg-red-50 rounded-xl text-emerald-600 hover:text-red-500 transition-all bg-white border border-emerald-100 shadow-sm">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf" className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-5 text-emerald-600 hover:bg-emerald-50 rounded-3xl transition-all border-2 border-emerald-50 hover:border-emerald-200 shadow-sm bg-gray-50/50 active:scale-90"
            title="Attach PDF"
          >
            <Paperclip className="w-6 h-6" />
          </button>

          <div className="flex-1 relative group">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={attachment ? "What should I look for in this file?" : "Ask me anything..."}
              className="w-full pl-6 pr-16 py-5 bg-gray-50/50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/40 focus:ring-[12px] focus:ring-emerald-500/5 transition-all outline-none font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-black"
            />
            <button
              onClick={handleSendMessage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-4 text-white bg-emerald-700 rounded-[1.5rem] hover:bg-emerald-900 active:scale-95 transition-all shadow-xl shadow-emerald-200 flex items-center gap-2 group-focus-within:bg-emerald-800"
            >
              <Send className="w-6 h-6 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}