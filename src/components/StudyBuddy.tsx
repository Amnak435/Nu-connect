import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, BookOpen, Brain, Trophy, Paperclip, X, FileText, Zap, Trash2, Cpu, Settings, Key, AlertCircle, Globe } from 'lucide-react';
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
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState(() =>
    localStorage.getItem('nuconnect_openrouter_key') ||
    (import.meta as any).env.VITE_OPENROUTER_API_KEY ||
    ''
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [learnedSessionData, setLearnedSessionData] = useState<LearnedData[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(`nuconnect_buddy_memory_${user?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

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
        content: `Hello ${user?.name?.split(' ')[0] || 'Friend'}! 🎓 I'm your **Multi-Engine** Study Buddy.

I now support **OpenRouter**! ${apiKey ? "🚀 **Global AI Active:** I can think using the world's best models." : "💡 **Architecture Update:** Set your OpenRouter API Key in 'Settings' to use Gemini, Claude, or Llama for your PDFs!"}

What should we master today?`
      }
    ]);
  }, [user?.name, learnedSessionData.length, !!apiKey]);

  const quickActions = [
    { icon: Globe, label: 'OpenRouter Setup', prompt: 'OPENROUTER_DASHBOARD' },
    { icon: BookOpen, label: 'Explain OOP', prompt: 'Explain Object Oriented Programming' },
    { icon: Sparkles, label: 'Set API Key', prompt: 'GEMINI_SETTINGS' }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachment({ file, type: file.type });
  };

  const saveApiKey = (key: string) => {
    localStorage.setItem('nuconnect_openrouter_key', key);
    setApiKey(key);
    setShowKeyModal(false);
    setMessages(prev => [...prev, { role: 'ai', content: "✅ OpenRouter connected! Your Study Buddy is now globally powered." }]);
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';

      const maxPages = Math.min(pdf.numPages, 15);
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || '')
          .join(' ');
        fullText += pageText + '\n';
      }
      return fullText.trim();
    } catch (error) {
      console.error('PDF Extraction Error:', error);
      return '';
    }
  };

  const generateResponse = async (query: string, file?: File): Promise<string> => {
    let contextText = "";

    // Process File if attached
    if (file && file.type === 'application/pdf') {
      const extracted = await extractTextFromPDF(file);
      if (extracted) {
        if (!learnedSessionData.some(d => d.fileName === file.name)) {
          setLearnedSessionData(prev => [...prev, {
            fileName: file.name,
            content: extracted,
            timestamp: Date.now()
          }]);
        }
        contextText = extracted;
      }
    }

    // OpenRouter Logic
    if (apiKey) {
      try {
        const historyContext = learnedSessionData.map(d => `Content from ${d.fileName}: ${d.content.substring(0, 1500)}`).join('\n\n');

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "NUConnect Study Buddy",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "model": "google/gemini-2.0-flash-001", // High performance default
            "messages": [
              {
                "role": "system",
                "content": `You are a professional CS Study Buddy for NUConnect. 
                Use this context from previous documents: ${historyContext} ${contextText ? `\nNew Attachment: ${contextText.substring(0, 3000)}` : ''}
                Be concise, use formal academic tone, and use markdown for formatting.`
              },
              {
                "role": "user",
                "content": query
              }
            ]
          })
        });

        const data = await response.json();
        return data.choices[0].message.content;
      } catch (err) {
        console.error("OpenRouter Error:", err);
        return "❌ OpenRouter Connection Failed. Please check your API key.";
      }
    }

    // Local Fallback Logic
    const q = query.toLowerCase();
    const core = csKnowledgeBase.find(c =>
      c.topic.toLowerCase() === q ||
      c.keywords.some(k => q.includes(k.toLowerCase())) ||
      q.includes(c.topic.toLowerCase())
    );

    if (core) {
      let res = `### ${core.topic} (Semester ${core.semester})\n\n`;
      if (core.definition) res += `**Def:** ${core.definition}\n\n`;
      res += core.explanation;
      if (core.simple) res += `\n\n*💡 ${core.simple}*`;
      return res;
    }

    const memoryMatch = learnedSessionData.find(d =>
      d.content.toLowerCase().includes(q) ||
      q.split(' ').some(w => w.length > 4 && d.content.toLowerCase().includes(w))
    );

    if (memoryMatch) {
      const idx = memoryMatch.content.toLowerCase().indexOf(q);
      const start = Math.max(0, (idx === -1 ? 0 : idx) - 50);
      return `### 📖 Found in ${memoryMatch.fileName}\n\n"...${memoryMatch.content.substring(start, start + 500)}..."`;
    }

    return "I don't have that in my current memory or database. Try uploading a PDF or set an API Key in Settings to use advanced AI!";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !attachment) return;
    const msg = inputMessage;
    const att = attachment;
    setInputMessage('');
    setAttachment(null);
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
    <div className="flex flex-col h-[75vh] sm:h-[650px] bg-white rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden border border-emerald-100/50 w-full max-w-4xl mx-auto relative">
      {/* Key Modal */}
      {showKeyModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-100 p-3 rounded-2xl">
                <Key className="w-6 h-6 text-emerald-800" />
              </div>
              <h3 className="text-xl font-black text-emerald-950">AI Settings</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6 font-bold leading-relaxed">
              Enter your Google Gemini API Key to enable dynamic document analysis and reasoning.
            </p>
            <input
              type="password"
              placeholder="Paste AI Key here..."
              defaultValue={apiKey}
              onKeyDown={(e) => e.key === 'Enter' && saveApiKey((e.target as HTMLInputElement).value)}
              className="w-full p-4 bg-gray-50 border-2 border-emerald-100 rounded-2xl mb-4 focus:border-emerald-500 outline-none transition-all font-mono text-sm"
              id="api-key-input"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowKeyModal(false)}
                className="flex-1 py-4 text-emerald-900 font-black hover:bg-gray-100 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const val = (document.getElementById('api-key-input') as HTMLInputElement).value;
                  saveApiKey(val);
                }}
                className="flex-1 py-4 bg-emerald-800 text-white font-black rounded-2xl shadow-lg hover:bg-emerald-700 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#064e3b] p-4 sm:p-6 text-white flex items-center justify-between relative shadow-xl z-20">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-emerald-50 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-inner">
            <Cpu className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-900" />
          </div>
          <div>
            <h2 className="font-black text-lg sm:text-2xl tracking-tighter text-white m-0 uppercase leading-none">STUDY BUDDY AI</h2>
            <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
              <span className={`flex items-center gap-1 text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 sm:py-1 rounded-lg border ${apiKey ? 'bg-emerald-500/20 text-emerald-100 border-white/10' : 'bg-red-500/20 text-red-100 border-red-500/30'}`}>
                {apiKey ? <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-emerald-400" /> : <AlertCircle className="w-2.5 h-2.5" />}
                {apiKey ? 'API Active' : 'Offline Mode'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setShowKeyModal(true)} className="p-2 sm:p-3 hover:bg-white/10 rounded-xl transition-all text-white/80 border border-white/10">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          {learnedSessionData.length > 0 && (
            <button onClick={() => { if (confirm("Clear memory?")) setLearnedSessionData([]); }} className="p-2 sm:p-3 hover:bg-black/20 rounded-xl transition-all text-white/80 border border-white/10">
              <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-8 bg-[#fdfdfd]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`flex gap-2 sm:gap-4 max-w-[95%] sm:max-w-[88%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-2 ${msg.role === 'user' ? 'bg-emerald-800 border-emerald-700' : 'bg-white border-emerald-50'}`}>
                {msg.role === 'user' ? <Trophy className="w-5 h-5 sm:w-7 sm:h-7 text-white" /> : <Bot className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-800" />}
              </div>
              <div className={`p-3 sm:p-5 rounded-2xl sm:rounded-[2rem] shadow-sm leading-relaxed ${msg.role === 'user' ? 'bg-emerald-800 text-white rounded-tr-none' : 'bg-white text-gray-900 border border-emerald-100 rounded-tl-none font-bold'}`}>
                <div className="text-xs sm:text-[15px] whitespace-pre-wrap tracking-tight">
                  {msg.content}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-1.5 p-3 bg-emerald-50/50 rounded-full animate-pulse border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-emerald-800 rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer */}
      <div className="p-4 sm:p-6 bg-white border-t border-emerald-50 space-y-3 sm:space-y-4">
        {attachment && (
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <FileText className="w-4 h-4 text-emerald-800" />
            <span className="text-xs font-black text-emerald-950 truncate flex-1">{attachment.file.name}</span>
            <button onClick={() => setAttachment(null)} className="p-1 hover:bg-white rounded-lg text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {messages.length < 3 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {quickActions.map((a, idx) => (
                <button key={idx} onClick={() => a.prompt === 'GEMINI_SETTINGS' ? setShowKeyModal(true) : setInputMessage(a.prompt)} className="flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-[#f8faf9] text-emerald-900 rounded-xl text-[10px] sm:text-[13px] font-black whitespace-nowrap border border-emerald-100 hover:bg-emerald-50 transition-all">
                  <a.icon className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" /> {a.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-4">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="p-3 sm:p-5 text-emerald-900 hover:bg-emerald-50 rounded-xl sm:rounded-[1.8rem] transition-all border-2 border-emerald-50">
              <Paperclip className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={attachment ? "Ask AI about file..." : "Ask me anything..."}
                className="w-full pl-4 pr-12 sm:pl-7 sm:pr-16 py-3.5 sm:py-5 bg-[#f8faf9] border-2 border-emerald-50 rounded-xl sm:rounded-[2rem] focus:bg-white focus:border-emerald-600/30 transition-all outline-none font-bold text-xs sm:text-base"
              />
              <button onClick={handleSendMessage} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 sm:p-3.5 text-white bg-emerald-800 rounded-lg sm:rounded-[1.5rem] hover:bg-[#064e3b] shadow-lg flex items-center justify-center">
                <Send className="w-4 h-4 sm:w-6 sm:h-6 fill-current" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}