import { useState } from 'react';
import { Bot, Send, Sparkles, BookOpen, Brain, Trophy } from 'lucide-react';

interface StudyBuddyProps {
  user: any;
}

export function StudyBuddy({ user }: StudyBuddyProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
    {
      role: 'ai',
      content: `Hello ${user.name.split(' ')[0]}! 👋 I'm your Study Buddy AI. I'm here to help you with your ${user.semester} courses. How can I assist you today?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickActions = [
    { icon: BookOpen, label: 'Explain a topic', prompt: 'Can you explain Binary Search Trees?' },
    { icon: Brain, label: 'Create study plan', prompt: 'Help me create a study plan for midterms' },
    { icon: Trophy, label: 'Generate quiz', prompt: 'Generate a quiz on Database Normalization' },
    { icon: Sparkles, label: 'Revision tips', prompt: 'Give me revision tips for Data Structures' }
  ];

  const sampleResponses: Record<string, string> = {
    'binary search tree': 'A Binary Search Tree (BST) is a tree data structure where:\n\n1. Each node has at most two children (left and right)\n2. Left subtree contains only nodes with values less than parent\n3. Right subtree contains only nodes with values greater than parent\n4. Both left and right subtrees must also be BSTs\n\nTime Complexity:\n• Search: O(log n) average, O(n) worst\n• Insert: O(log n) average, O(n) worst\n• Delete: O(log n) average, O(n) worst\n\nWould you like me to explain any specific BST operations?',
    'study plan': 'Here\'s a 2-week study plan for your midterms:\n\n📅 Week 1:\n• Days 1-2: Data Structures (Trees & Graphs)\n• Days 3-4: Database Systems (SQL & Normalization)\n• Days 5-6: Software Engineering (UML & SDLC)\n• Day 7: Review and practice problems\n\n📅 Week 2:\n• Days 8-9: Computer Networks (OSI Model)\n• Days 10-11: Operating Systems (Process Management)\n• Days 12-13: Mock tests and weak area revision\n• Day 14: Final review and relaxation\n\n💡 Tips:\n• Study 2-3 hours daily with breaks\n• Practice past papers\n• Form study groups\n\nWould you like me to detail any specific subject?',
    'quiz': '📝 Database Normalization Quiz:\n\n1. What is the main purpose of normalization?\na) Increase data redundancy\nb) Reduce data redundancy\nc) Make queries slower\nd) Add more tables\n\n2. Which normal form eliminates partial dependencies?\na) 1NF\nb) 2NF\nc) 3NF\nd) BCNF\n\n3. A table is in 1NF if:\na) It has a primary key\nb) All attributes are atomic\nc) No transitive dependencies\nd) All of the above\n\n4. What is a transitive dependency?\na) A → B and B → C, then A → C\nb) Direct dependency\nc) Partial dependency\nd) None of the above\n\nAnswers: 1-b, 2-b, 3-b, 4-a\n\nWould you like more questions or explanations?',
    'revision tips': '🎯 Data Structures Revision Tips:\n\n1. **Master the Basics**\n   • Arrays, Linked Lists operations\n   • Time & Space complexity\n\n2. **Visual Learning**\n   • Draw diagrams for trees/graphs\n   • Trace algorithms step-by-step\n\n3. **Practice Coding**\n   • Implement each data structure\n   • Solve LeetCode easy problems\n\n4. **Focus on These Topics**\n   ⭐ Binary Trees (traversals)\n   ⭐ Stack/Queue applications\n   ⭐ Sorting algorithms\n   ⭐ Hash tables\n\n5. **Before Exam**\n   • Review time complexities\n   • Practice past papers\n   • Sleep well\n\nNeed help with any specific topic?'
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: 'user' as const, content: inputMessage }];
    setMessages(newMessages);

    // Generate AI response based on keywords
    setTimeout(() => {
      let aiResponse = '';
      const lowerInput = inputMessage.toLowerCase();

      if (lowerInput.includes('binary search tree') || lowerInput.includes('bst')) {
        aiResponse = sampleResponses['binary search tree'];
      } else if (lowerInput.includes('study plan') || lowerInput.includes('midterm')) {
        aiResponse = sampleResponses['study plan'];
      } else if (lowerInput.includes('quiz') || lowerInput.includes('normalization')) {
        aiResponse = sampleResponses['quiz'];
      } else if (lowerInput.includes('revision') || lowerInput.includes('tips')) {
        aiResponse = sampleResponses['revision tips'];
      } else {
        aiResponse = `Great question! Let me help you with that. As your AI Study Buddy, I can:\n\n✅ Explain complex topics in simple terms\n✅ Create personalized study plans\n✅ Generate practice quizzes\n✅ Provide revision strategies\n✅ Help with exam preparation\n\nTry asking about specific topics from your courses like:\n• "Explain Binary Search Trees"\n• "Help me with SQL queries"\n• "Create a study plan for finals"\n• "Generate a quiz on Operating Systems"\n\nWhat would you like to know?`;
      }

      setMessages([...newMessages, { role: 'ai', content: aiResponse }]);
    }, 500);

    setInputMessage('');
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
                className={`max-w-[80%] rounded-xl px-4 py-3 ${
                  message.role === 'user'
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
              placeholder="Ask me anything about your courses..."
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