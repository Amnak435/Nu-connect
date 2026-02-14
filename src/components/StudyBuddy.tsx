import { useState, useRef } from 'react';
import { Bot, Send, Sparkles, BookOpen, Brain, Trophy, Paperclip, X, FileText } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface StudyBuddyProps {
  user: any;
}

// Initialize Gemini API (User needs to add VITE_GEMINI_API_KEY to .env)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export function StudyBuddy({ user }: StudyBuddyProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
    {
      role: 'ai',
      content: `Hello ${user.name.split(' ')[0]}! 👋 I'm your Study Buddy AI, powered by Gemini. 

I can help you with:
• Explaining complex topics in simple terms
• Teaching CS concepts from Semesters 1-8
• Summarizing uploaded documents
• Creating study plans and quizzes

How can I assist you today?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState<{ file: File; data: string; type: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickActions = [
    { icon: BookOpen, label: 'Explain a topic', prompt: 'Explain the concept of Recursion in simple terms' },
    { icon: Brain, label: 'Create study plan', prompt: 'Create a study plan for my current semester' },
    { icon: Trophy, label: 'Generate quiz', prompt: 'Generate a quiz on Operating Systems' },
    { icon: Sparkles, label: 'Summarize PDF', prompt: 'Please upload a PDF for me to summarize' }
  ];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file type is supported (PDF, images)
    const supportedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      alert('Please upload a PDF or an image (JPEG, PNG, WEBP).');
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Data = reader.result?.toString().split(',')[1];
        if (base64Data) {
          setAttachment({
            file,
            data: base64Data,
            type: file.type
          });
        }
      };
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Failed to read file.");
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && !attachment) || isTyping) return;

    const userMsg = inputMessage;
    const currentAttachment = attachment;

    setInputMessage('');
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setIsTyping(true);

    // Add user message
    const attachmentMsg = currentAttachment ? `\n\n[Attached File: ${currentAttachment.file.name}]` : '';
    const newMessages = [...messages, { role: 'user' as const, content: userMsg + attachmentMsg }];
    setMessages(newMessages);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'your_key_here') {
        throw new Error('API_KEY_MISSING');
      }

      // Initialize API client here to ensure we have the key
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `
        You are "Study Buddy AI", a helpful expert academic tutor for a Computer Science student at NUTECH university.
        Student Name: ${user.name}
        Semester: ${user.semester}
        Department: Computer Science
        
        YOUR CAPABILITIES:
        1. **Complex Topics Simplified**: Explain difficult concepts using analogies, simple language, and examples.
        2. **CS Curriculum Expert**: You have complete knowledge of the Computer Science curriculum from Semesters 1 through 8. You can teach ANY concept from these semesters (e.g., Programming Fundamentals, DSA, OS, db, AI, Networks, Compiler Construction, etc.).
        3. **Document Analysis**: If a PDF or image is provided, READ IT thoroughly and provide a concise summary, key points, or answer specific questions about it.
        
        Guidelines:
        - Be encouraging, friendly, and professional.
        - Use Markdown for clear formatting (bold, italics, code blocks, lists).
        - If the user asks for a specific semester topic, provide a structured explanation suited for that academic level.
        - If the user uploads a document, prioritize analyzing that document.
        
        Previous Conversation:
        ${messages.map(m => `${m.role === 'user' ? 'Student' : 'AI'}: ${m.content}`).join('\n')}
        
        Current Question: ${userMsg}
      `;

      const parts: any[] = [{ text: systemPrompt }];

      if (currentAttachment) {
        parts.push({
          inlineData: {
            data: currentAttachment.data,
            mimeType: currentAttachment.type
          }
        });
      }

      const result = await model.generateContent(parts);
      const response = await result.response;
      const text = response.text();

      setMessages([...newMessages, { role: 'ai', content: text }]);
    } catch (error: any) {
      console.error('Gemini Error:', error);

      let errorMessage = `I'm having trouble connecting to my brain right now. (Error: ${error.message})`;

      if (error.message === 'API_KEY_MISSING') {
        errorMessage = "⚠️ Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your Vercel Environment Variables.";
      } else if (error.message.includes('404')) {
        errorMessage = "⚠️ Error 404: The AI model is currently unavailable. Please try again later.";
      } else if (error.message.includes('SAFETY')) {
        errorMessage = "⚠️ I cannot answer that query due to safety guidelines.";
      }

      setMessages([...newMessages, { role: 'ai', content: errorMessage }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    if (prompt.includes('upload a PDF')) {
      fileInputRef.current?.click();
    } else {
      setInputMessage(prompt);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <Bot className="w-7 h-7 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Study Buddy AI</h2>
            <p className="text-purple-100">Your personal AI learning assistant (Semesters 1-8)</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickAction(action.prompt)}
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group text-left"
              >
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 shrink-0">
                  <Icon className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col" style={{ height: '600px' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-base">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'ai' && (
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-purple-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 ${message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-800'
                  }`}
              >
                <div className="text-sm md:text-base whitespace-pre-line leading-relaxed">
                  {message.content}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-purple-600">
                    {user.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
              <div className="bg-gray-100 rounded-xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-gray-50 space-y-3">
          {attachment && (
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-100 border border-purple-200 rounded-lg w-fit">
              <FileText className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-700 truncate max-w-[200px]">{attachment.file.name}</span>
              <button onClick={removeAttachment} className="ml-2 hover:bg-purple-200 rounded-full p-1">
                <X className="w-3 h-3 text-purple-700" />
              </button>
            </div>
          )}

          <div className="flex gap-2 items-center">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="application/pdf,image/*"
              onChange={handleFileSelect}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Upload PDF or Image"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={attachment ? "Ask about this file..." : "Ask me anything about your courses..."}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && !attachment) || isTyping}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            💡 Supported: Text queries, PDFs, Images. Limits apply.
          </p>
        </div>
      </div>

      {/* AI Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Smart Explanations</h4>
          <p className="text-sm text-gray-600">Get complex topics explained in simple, easy-to-understand language.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Semesters 1-8 Covered</h4>
          <p className="text-sm text-gray-600">Complete knowledge of the Computer Science curriculum for all semesters.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Document Analysis</h4>
          <p className="text-sm text-gray-600">Upload PDFs or images and get instant summaries and answers.</p>
        </div>
      </div>
    </div>
  );
}