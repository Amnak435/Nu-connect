import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, BookOpen, Brain, Trophy, Paperclip, X, FileText, Zap, Trash } from 'lucide-react';
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
      // Dynamic import to avoid build errors with modern PDF.js on Vercel
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

    // 1. Learning Phase (Process Uploads)
    if (file && file.type === 'application/pdf') {
      setIsTyping(true);
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

        response += `### 🧠 Long-Term Memory Updated: ${file.name}\n\nI've analyzed and stored this document in my brain. I will remember this even if you log out and come back later! `;

        const matchedCoreTopics = csKnowledgeBase.filter(concept =>
          pdfText.toLowerCase().includes(concept.topic.toLowerCase())
        );

        if (matchedCoreTopics.length > 0) {
          response += `This document matches my core knowledge about **${matchedCoreTopics[0].topic}**. `;
        }

        response += `\n\n**Quick Preview:** ${pdfText.substring(0, 200)}...`;
      } else {
        response = "I couldn't read that PDF. Please ensure it has clear, selectable text.";
      }
      return response;
    }

    // 2. Retrieval Phase
    const lowerQuery = query.toLowerCase();

    // Check Core Knowledge Base
    const coreMatch = csKnowledgeBase.find(concept =>
      concept.keywords.some(k => lowerQuery.includes(k.toLowerCase())) ||
      lowerQuery.includes(concept.topic.toLowerCase())
    );

    if (coreMatch) {
      response = `### ${coreMatch.topic}\n\n${coreMatch.explanation}\n\n*Related: ${coreMatch.related?.join(', ') || 'None'}*`;
    }
    // Check Persistent Memory (Self-Learning)
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

        response = `### 📖 From My Memorized Data: ${learnedMatch.fileName}\n\nI found this in the documents you taught me:\n\n"...${snippet}..."\n\n*Source: User-Uploaded Memory*`;
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
    <div className="flex flex-col h-[650px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-green-100 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-800 p-5 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl tracking-tight">Study Buddy AI</h2>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-green-50 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                <Zap className="w-3 h-3" /> Offline Learn-Mode
              </span>
              {learnedSessionData.length > 0 && (
                <span className="text-[10px] text-green-200 font-medium">Memory: {learnedSessionData.length} Docs</span>
              )}
            </div>
          </div>
        </div>

        {learnedSessionData.length > 0 && (
          <button
            onClick={clearMemory}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-green-100 hover:text-white"
            title="Clear AI memory"
          >
            <Trash className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50/30">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-green-600' : 'bg-white border border-green-100'
                }`}>
                {msg.role === 'user' ? <Trophy className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-green-600" />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                  ? 'bg-green-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-green-100 rounded-tl-none'
                }`}>
                <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                  {msg.content}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-green-100 px-4 py-3 rounded-2xl shadow-sm flex gap-1.5 items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Bar */}
      {messages.length < 3 && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-gray-100 bg-white">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => action.prompt === 'LEARN_PDF_TRIGGER' ? fileInputRef.current?.click() : setInputMessage(action.prompt)}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold whitespace-nowrap hover:bg-green-100 transition-colors border border-green-100"
            >
              <action.icon className="w-3 h-3" />
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input section */}
      <div className="p-5 bg-white border-t border-green-100 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {attachment && (
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl animate-in fade-in slide-in-from-bottom-2 border border-green-100">
            <FileText className="w-5 h-5 text-green-600" />
            <span className="text-sm font-bold text-green-800 truncate flex-1">{attachment.file.name}</span>
            <button onClick={removeAttachment} className="p-1.5 hover:bg-green-200 rounded-full text-green-700 transition-colors">
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
            className="p-3.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-2xl transition-all border border-gray-200 hover:border-green-200 shadow-sm"
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
              className="w-full pl-5 pr-14 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-green-500/30 focus:ring-4 focus:ring-green-500/5 transition-all outline-none font-medium"
            />
            <button
              onClick={handleSendMessage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-white bg-green-600 rounded-xl hover:bg-green-700 active:scale-95 transition-all shadow-lg shadow-green-200/50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}