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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[75vh] sm:h-[650px] w-full max-w-4xl mx-auto relative divide-y divide-gray-50">
      {/* Key Modal */}
      {showKeyModal && (
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-50 p-3 rounded-lg">
                <Key className="w-6 h-6 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">AI Settings</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Enter your OpenRouter API Key to enable advanced AI models like Gemini, Claude, or GPT-4o for your documents.
            </p>
            <input
              type="password"
              placeholder="Paste API Key here..."
              defaultValue={apiKey}
              onKeyDown={(e) => e.key === 'Enter' && saveApiKey((e.target as HTMLInputElement).value)}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg mb-4 focus:ring-2 focus:ring-green-500/20 outline-none transition-all font-mono text-sm"
              id="api-key-input"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowKeyModal(false)}
                className="flex-1 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const val = (document.getElementById('api-key-input') as HTMLInputElement).value;
                  saveApiKey(val);
                }}
                className="flex-1 py-3 bg-green-700 text-white font-bold rounded-lg shadow-md hover:bg-green-800 transition-all"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 p-4 sm:p-5 text-white flex items-center justify-between relative shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-lg backdrop-blur-sm border border-white/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg sm:text-xl tracking-tight text-white leading-none">Study Buddy AI</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`inline-flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-sm ${apiKey ? 'bg-white/20 text-white border-white/30' : 'bg-red-500/20 text-white border-red-500/30'}`}>
                {apiKey ? <Zap className="w-2.5 h-2.5 fill-white" /> : <AlertCircle className="w-2.5 h-2.5" />}
                {apiKey ? 'AI Enabled' : 'Local Mode'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setShowKeyModal(true)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors text-white border border-white/10 shadow-sm" title="AI Settings">
            <Settings className="w-5 h-5 text-white" />
          </button>
          {learnedSessionData.length > 0 && (
            <button onClick={() => { if (confirm("Clear memory?")) setLearnedSessionData([]); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors text-white border border-white/10 shadow-sm" title="Clear Memory">
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-white scrollbar-thin scrollbar-thumb-gray-200">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex gap-3 max-w-[90%] sm:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm border ${msg.role === 'user' ? 'bg-green-700 border-green-800' : 'bg-gray-100 border-gray-200'}`}>
                {msg.role === 'user' ? <Trophy className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-green-700" />}
              </div>
              <div className={`p-4 rounded-xl shadow-sm text-sm ${msg.role === 'user' ? 'bg-green-700 text-white rounded-tr-none' : 'bg-gray-50 text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                <div className="prose prose-sm prose-green max-w-none whitespace-pre-wrap leading-relaxed font-medium">
                  {msg.content}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-1.5 p-3 px-4 bg-gray-50 rounded-full border border-gray-100 shadow-sm">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-green-800 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input */}
      <div className="p-4 sm:p-6 bg-gray-50/50 space-y-4">
        {attachment && (
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm animate-in zoom-in-95">
            <div className="bg-green-50 p-2 rounded-md text-green-700">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-gray-700 truncate flex-1">{attachment.file.name}</span>
            <button onClick={() => setAttachment(null)} className="p-1.5 hover:bg-gray-100 rounded-md text-red-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {messages.length < 3 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {quickActions.map((a, idx) => (
                <button
                  key={idx}
                  onClick={() => a.prompt === 'GEMINI_SETTINGS' ? setShowKeyModal(true) : setInputMessage(a.prompt)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg text-xs font-bold whitespace-nowrap border border-gray-100 shadow-sm hover:border-green-300 hover:text-green-700 transition-all"
                >
                  <a.icon className="w-3.5 h-3.5 text-green-600" /> {a.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf" className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3.5 text-gray-500 hover:text-green-700 bg-white hover:bg-green-50 rounded-lg transition-all border border-gray-100 shadow-sm group"
              title="Attach PDF"
            >
              <Paperclip className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={attachment ? "Ask about your PDF..." : "Ask your study buddy..."}
                className="w-full pl-5 pr-14 py-4 bg-white border border-gray-100 rounded-lg focus:ring-2 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all shadow-sm font-medium"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() && !attachment}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-white bg-green-700 rounded-md hover:bg-green-800 transition-colors shadow-md disabled:opacity-50 disabled:grayscale"
              >
                <Send className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}