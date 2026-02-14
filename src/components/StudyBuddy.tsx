import { useState, useRef } from 'react';
import { Bot, Send, Sparkles, BookOpen, Brain, Trophy, Paperclip, X, FileText } from 'lucide-react';
// import { GoogleGenerativeAI } from '@google/generative-ai'; // Removed Gemini
import { csKnowledgeBase } from '../data/csKnowledgeBase';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for PDF.js - attempting to use a CDN to avoid local build issues
// In a production app, you might want to bundle the worker.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


interface StudyBuddyProps {
  user: any;
}

export function StudyBuddy({ user }: StudyBuddyProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
    {
      role: 'ai',
      content: `Hello ${user.name.split(' ')[0]}! 👋 I'm your Offline Study Buddy. 

I can help you with:
• Explaining CS concepts from Semesters 1-8
• Analyzing uploaded documents (PDFs)
• Creating study plans

How can I assist you today?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState<{ file: File; type: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickActions = [
    { icon: BookOpen, label: 'Explain a topic', prompt: 'Explain OOP' },
    { icon: Brain, label: 'Data Structures', prompt: 'Tell me about BST' },
    { icon: Trophy, label: 'Database', prompt: 'What is Normalization?' },
    { icon: Sparkles, label: 'Upload PDF', prompt: 'Analyze this PDF for me' }
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

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      // Limit to first 3 pages to be fast
      const maxPages = Math.min(pdf.numPages, 3);
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
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
    let context = '';

    if (file && file.type === 'application/pdf') {
      const pdfText = await extractTextFromPDF(file);
      if (pdfText) {
        context = pdfText.toLowerCase();
        response += `**Document Analysis (${file.name}):**\nI've scanned the document. `;

        // Key Concept Extraction from PDF
        const foundTopics = csKnowledgeBase.filter(concept =>
          concept.keywords.some(k => context.includes(k.toLowerCase()))
        );

        if (foundTopics.length > 0) {
          const uniqueTopics = [...new Set(foundTopics.map(t => t.topic))];
          response += `It seems to cover: **${uniqueTopics.slice(0, 3).join(', ')}**.\n\n`;
        } else {
          response += `It contains general text about: "${pdfText.substring(0, 50)}..."\n\n`;
        }
      } else {
        response += `(I couldn't read the text from ${file.name}, but I see it's a PDF.)\n\n`;
      }
    }

    // Keyword Matching for Query
    const lowerQuery = query.toLowerCase();
    const match = csKnowledgeBase.find(concept =>
      concept.keywords.some(k => lowerQuery.includes(k.toLowerCase())) ||
      lowerQuery.includes(concept.topic.toLowerCase())
    );

    if (match) {
      response += `### ${match.topic}\n\n${match.explanation}\n\n*Related: ${match.related?.join(', ') || 'None'}*`;
    } else if (!file && query.trim()) {
      // Fallback for greetings or unknown topics
      if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
        response += "Hello! ask me about any CS topic.";
      } else {
        response += "I don't have that specific topic in my offline database yet. Try asking about **OOP**, **BST**, **Normalization**, **Process**, or **Compilers**.";
      }
    }

    if (!response && file) {
      response = "I've analyzed the file.";
    }

    return response || "I've processed your request.";
  };

  const handleSendMessage = async () => {
    if ((!inputMessage.trim() && !attachment) || isTyping) return;

    const userMsg = inputMessage;
    const currentAttachment = attachment;

    setInputMessage('');
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setIsTyping(true);

    const attachmentMsg = currentAttachment ? `\n[Attached: ${currentAttachment.file.name}]` : '';
    const newMessages = [...messages, { role: 'user' as const, content: userMsg + attachmentMsg }];
    setMessages(newMessages);

    // Simulate AI Delay
    setTimeout(async () => {
      const responseText = await generateOfflineResponse(userMsg, currentAttachment?.file);
      setMessages([...newMessages, { role: 'ai', content: responseText }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickAction = (prompt: string) => {
    if (prompt.includes('Upload') || prompt.includes('PDF')) {
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
            <h2 className="text-2xl font-bold">Study Buddy (Offline Mode)</h2>
            <p className="text-purple-100">Instant answers from Semesters 1-8 Database</p>
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
              accept="application/pdf"
              onChange={handleFileSelect}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Upload PDF"
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
            💡 Offline Mode Active. Supports: PDF Analysis & Core CS Topics.
          </p>
        </div>
      </div>

      {/* AI Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-800 mb-2">Detailed Explanations</h4>
          <p className="text-sm text-gray-600">Access a database of CS concepts from basic algorithms to advanced compilers.</p>
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
          <h4 className="font-semibold text-gray-800 mb-2">Document Scanner</h4>
          <p className="text-sm text-gray-600">Scans PDFs for known keywords and summarizes based on course material.</p>
        </div>
      </div>
    </div>
  );
}