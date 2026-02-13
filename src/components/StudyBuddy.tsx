import { useState } from 'react';
import { Bot, Send, Sparkles, BookOpen, Brain, Trophy } from 'lucide-react';
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
      content: `Hello ${user.name.split(' ')[0]}! 👋 I'm your Study Buddy AI, powered by Gemini. I'm here to help you with your ${user.semester} courses and any academic questions. How can I assist you today?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    { icon: BookOpen, label: 'Explain a topic', prompt: 'Can you explain Binary Search Trees?' },
    { icon: Brain, label: 'Create study plan', prompt: 'Help me create a study plan for midterms' },
    { icon: Trophy, label: 'Generate quiz', prompt: 'Generate a quiz on Database Normalization' },
    { icon: Sparkles, label: 'Revision tips', prompt: 'Give me revision tips for Data Structures' }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMsg = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Add user message
    const newMessages = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(newMessages);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'your_key_here') {
        throw new Error('API_KEY_MISSING');
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        You are "Study Buddy AI", a helpful assistant for a student at NUTECH university.
        Student Name: ${user.name}
        Semester: ${user.semester}
        Department: Computer Science
        
        Guidelines:
        1. Answer ANY question the user asks. Do not restrict yourself to academic topics.
        2. Be helpful, friendly, and professional.
        3. Use markdown for better formatting.
        
        Previous Conversation:
        ${messages.map(m => `${m.role === 'user' ? 'Student' : 'AI'}: ${m.content}`).join('\n')}
        
        Current Question: ${userMsg}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages([...newMessages, { role: 'ai', content: text }]);
    } catch (error: any) {
      console.error('Gemini Error:', error);
      let errorMessage = "I'm having trouble connecting to my brain right now. Please try again in a moment!";

      if (error.message === 'API_KEY_MISSING') {
        errorMessage = "⚠️ Gemini API Key is missing. Please get a free API key from https://aistudio.google.com/app/apikey and add it to your .env file as VITE_GEMINI_API_KEY.";
      }

      setMessages([...newMessages, { role: 'ai', content: errorMessage }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInputMessage(prompt);
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
            <p className="text-purple-100">Your personal AI learning assistant</p>
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
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
              >
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100">
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-800'
                  }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-green-600">
                    {user.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 This is a demo AI. In production, this would connect to a real AI service.
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
          <h4 className="font-semibold text-gray-800 mb-2">Personalized Learning</h4>
          <p className="text-sm text-gray-600">Study plans tailored to your semester, courses, and exam schedule.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Practice & Assessment</h4>
          <p className="text-sm text-gray-600">Generate quizzes and practice questions to test your knowledge.</p>
        </div>
      </div>
    </div>
  );
}