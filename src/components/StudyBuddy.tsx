import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, BookOpen, Brain, Trophy, Paperclip, X, FileText, Zap, Trash2, Cpu, GraduationCap, Layout } from 'lucide-react';
import { csKnowledgeBase } from '../data/csKnowledgeBase';

interface StudyBuddyProps {
  user: any;
}

interface LearnedData {
  fileName: string;
  content: string;
  timestamp: number;
}

export function StudyBuddy({ user }: StudyBuddyProps) {
  // 1. Core States
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState<{ file: File; type: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. Persistent Memory State (Self-Learning)
  const [learnedSessionData, setLearnedSessionData] = useState<LearnedData[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(`nuconnect_buddy_memory_${user?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync Memory to LocalStorage
  useEffect(() => {
    if (user?.id && typeof window !== 'undefined') {
      localStorage.setItem(`nuconnect_buddy_memory_${user.id}`, JSON.stringify(learnedSessionData));
    }
  }, [learnedSessionData, user?.id]);

  // Initial Greeting
  useEffect(() => {
    setMessages([
      {
        role: 'ai',
        content: `Hello ${user?.name?.split(' ')[0] || 'Student'}! 👋 I'm your **Persistent Self-Learning** Study Buddy.

I remember everything you've taught me from your PDF uploads. ${learnedSessionData.length > 0
            ? `I currently have knowledge from **${learnedSessionData.length} documents** you shared earlier.`
            : "Upload a PDF, and I'll learn its contents and remember them for your future sessions!"}

What should we study today?`
      }
    ]);
  }, [user?.name, learnedSessionData.length]);

  const quickActions = [
    { icon: BookOpen, label: 'Explain OOP', prompt: 'Explain Object Oriented Programming' },
    { icon: Brain, label: 'Data Structures', prompt: 'Tell me about Binary Search Trees' },
    { icon: Trophy, label: 'Normalization', prompt: 'What is Database Normalization?' },
    { icon: Sparkles, label: 'Upload PDF', prompt: 'LEARN_PDF_TRIGGER' }
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
    if (window.confirm("Are you sure you want me to forget everything I've learned from your PDFs?")) {
      setLearnedSessionData([]);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`nuconnect_buddy_memory_${user?.id || 'guest'}`);
      }
      setMessages(prev => [...prev, { role: 'ai', content: "Memory cleared. My brain is now back to its default state." }]);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';

      const maxPages = Math.min(pdf.numPages, 10);
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => {
            return (item && typeof item === 'object' && 'str' in item) ? item.str : '';
          })
          .join(' ');
        fullText += pageText + ' ';
      }
      return fullText;
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
          return `I already remember **${file.name}**. You can ask me anything about its contents!`;
        }

        setLearnedSessionData(prev => [...prev, {
          fileName: file.name,
          content: pdfText,
          timestamp: Date.now()
        }]);

        response += `### 🧠 Long-Term Memory Updated\n\nI've analyzed **${file.name}** and stored it in my brain. I'll remember this for our future sessions! `;

        const matchedCoreTopics = csKnowledgeBase.filter(concept =>
          pdfText.toLowerCase().includes(concept.topic.toLowerCase())
        );

        if (matchedCoreTopics.length > 0) {
          response += `This matches my core brain regarding **${matchedCoreTopics[0].topic}**. `;
        }

        response += `\n\n**Quick Preview:** ${pdfText.substring(0, 150)}...`;
      } else {
        response = "I couldn't read that PDF. Please ensure it has clear, selectable text.";
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
        const end = Math.min(learnedMatch.content.length, start + 500);
        const snippet = learnedMatch.content.substring(start, end);

        response = `### 📖 From My Memorized Data\n\nI found this in **${learnedMatch.fileName}**:\n\n"...${snippet}..."\n\n*Source: Your Uploaded Material*`;
      }
    }

    if (!response) {
      if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
        response = `Hello! I remember **${learnedSessionData.length}** of your documents. How can I help you?`;
      } else {
        response = "I don't have that in my core brain or my memorized documents yet. Try uploading a PDF about it!";
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
      setMessages([...newMessages, { role: 'ai' as const, content: "Sorry, I had trouble processing that. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-[#f8faf9] rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden border border-emerald-100/50 font-sans transition-all">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 p-6 text-white flex items-center justify-between relative shadow-xl z-30">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-white p-3 rounded-2xl shadow-inner-lg border border-white/20">
            <Cpu className="w-8 h-8 text-emerald-800" />
          </div>
          <div>
            <h2 className="font-extrabold text-2xl tracking-tight text-white m-0 leading-tight">Study Buddy AI</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-emerald-50 bg-emerald-400/30 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-md">
                <Zap className="w-3 h-3 fill-emerald-300" /> Offline Memory
              </span>
              {learnedSessionData.length > 0 && (
                <span className="text-[11px] text-emerald-100 font-bold bg-white/10 px-2 py-0.5 rounded-lg border border-white/5 whitespace-nowrap">
                  {learnedSessionData.length} Docs Learned
                </span>
              )}
            </div>
          </div>
        </div>

        {learnedSessionData.length > 0 && (
          <button
            onClick={clearMemory}
            className="p-3 hover:bg-white/10 rounded-2xl transition-all text-white/90 hover:text-white border border-white/10 hover:border-white/30 backdrop-blur-sm shadow-lg group"
            title="Clear AI memory"
          >
            <Trash2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white to-[#f0f4f2]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-2 ${msg.role === 'user' ? 'bg-emerald-700 border-emerald-600' : 'bg-white border-emerald-50'
                }`}>
                {msg.role === 'user' ? <GraduationCap className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-emerald-700" />}
              </div>
              <div className={`p-5 rounded-[2rem] shadow-sm leading-relaxed ${msg.role === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-emerald-100 rounded-tl-none ring-1 ring-emerald-50/50'
                }`}>
                <div className="text-sm md:text-[15px] whitespace-pre-wrap font-semibold tracking-tight">
                  {msg.content}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-emerald-100 px-6 py-4 rounded-full shadow-lg flex gap-2 items-center">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" />
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Bar */}
      {messages.length < 3 && (
        <div className="px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar border-t border-emerald-100/30 bg-white/60 backdrop-blur-xl relative z-10">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => action.prompt === 'LEARN_PDF_TRIGGER' ? fileInputRef.current?.click() : setInputMessage(action.prompt)}
              className="flex items-center gap-2.5 px-4 py-2.5 bg-white text-emerald-800 rounded-2xl text-[13px] font-bold whitespace-nowrap hover:bg-emerald-50 transition-all border border-emerald-100/60 shadow-sm hover:shadow-md hover:-translate-y-0.5"
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
      <div className="p-6 bg-white border-t border-emerald-100/50 space-y-4 shadow-[0_-15px_40px_rgba(0,0,0,0.04)] relative z-20">
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-3xl transition-all border-2 border-emerald-50 hover:border-emerald-200 shadow-sm bg-gray-50/50 active:scale-90"
            title="Attach Study Material (PDF)"
          >
            <Paperclip className="w-6 h-6" />
          </button>

          <div className="flex-1 relative group">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={attachment ? "Ask about this file..." : "Ask me anything..."}
              className="w-full pl-6 pr-16 py-5 bg-gray-50/50 border-2 border-transparent rounded-[2rem] focus:bg-white focus:border-emerald-500/40 focus:ring-[12px] focus:ring-emerald-500/5 transition-all outline-none font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-bold"
            />
            <button
              onClick={handleSendMessage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-4 text-white bg-emerald-700 rounded-[1.5rem] hover:bg-emerald-800 active:scale-95 transition-all shadow-xl shadow-emerald-200"
            >
              <Send className="w-6 h-6 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}