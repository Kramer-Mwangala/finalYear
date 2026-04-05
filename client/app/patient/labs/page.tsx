'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Beaker, Mic, Send, Volume2, Clock, DollarSign, CheckCircle } from 'lucide-react';

export default function LabsPage() {
  const [voiceActive, setVoiceActive] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Hello! I\'m your dermatology lab assistant. I can help you understand your test results, order new tests, and answer questions about lab services. How can I help you today?',
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const availableLabs = [
    {
      id: 1,
      name: 'Skin Culture Test',
      description: 'Identifies bacterial or fungal infections',
      price: 'KES 3,500',
      turnaround: '5-7 days',
      recommended: true,
    },
    {
      id: 2,
      name: 'Patch Test',
      description: 'Determines contact dermatitis allergens',
      price: 'KES 4,200',
      turnaround: '10 days',
      recommended: false,
    },
    {
      id: 3,
      name: 'Wood\'s Lamp Examination',
      description: 'Evaluates fungal and bacterial infections',
      price: 'KES 1,500',
      turnaround: 'Immediate',
      recommended: false,
    },
    {
      id: 4,
      name: 'Dermoscopy',
      description: 'Detailed skin lesion analysis',
      price: 'KES 2,800',
      turnaround: '2-3 days',
      recommended: true,
    },
  ];

  const previousTests = [
    {
      id: 1,
      name: 'Skin Culture Test',
      date: 'March 15, 2024',
      result: 'Negative for pathogenic organisms',
      status: 'Completed',
    },
    {
      id: 2,
      name: 'Dermoscopy',
      date: 'February 28, 2024',
      result: 'Normal skin lesion morphology',
      status: 'Completed',
    },
  ];

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const newMessages = [
        ...messages,
        { role: 'user' as const, text: currentMessage },
        {
          role: 'assistant' as const,
          text: 'Thank you for your question. I can help you with information about available lab tests, ordering procedures, and understanding results. What would you like to know?',
        },
      ];
      setMessages(newMessages);
      setCurrentMessage('');
    }
  };

  const handleVoiceCommand = () => {
    setVoiceActive(!voiceActive);
    // Mock voice recording
    if (!voiceActive) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'user', text: 'What tests do you recommend for my skin?' },
          {
            role: 'assistant',
            text: 'Based on your recent analysis showing mild acne and hyperpigmentation, I recommend a skin culture test to rule out bacterial infection and a dermoscopy for detailed lesion analysis.',
          },
        ]);
        setVoiceActive(false);
      }, 2000);
    }
  };

  const handleSpeak = (text: string) => {
    setIsSpeaking(true);
    // Mock text-to-speech
    setTimeout(() => setIsSpeaking(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-blue-50 border border-border p-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Beaker size={32} />
          Laboratory Services
        </h1>
        <p className="text-muted-foreground">
          Order diagnostic tests and speak with our lab assistant about your results.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Available Tests */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Available Tests</h2>
            <div className="space-y-4">
              {availableLabs.map((lab) => (
                <div key={lab.id} className="border border-border p-6 bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{lab.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{lab.description}</p>
                    </div>
                    {lab.recommended && (
                      <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-800 rounded">
                        Recommended
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-6 mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-2 text-foreground">
                      <DollarSign size={16} />
                      <span className="font-semibold">{lab.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Clock size={16} />
                      <span>{lab.turnaround}</span>
                    </div>
                  </div>

                  <Button>Order Test</Button>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Test Results */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Test Results</h2>
            <div className="space-y-4">
              {previousTests.map((test) => (
                <div key={test.id} className="border border-border p-6 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <CheckCircle size={20} className="text-green-600" />
                        {test.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{test.date}</p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-800 rounded">
                      {test.status}
                    </span>
                  </div>
                  <p className="text-foreground mb-4">{test.result}</p>
                  <Button variant="ghost" size="sm">
                    View Full Report
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Voice Assistant Sidebar */}
        <div className="lg:col-span-1">
          <div className="border border-border bg-white sticky top-6">
            {/* Chat Header */}
            <div className="p-6 border-b border-border">
              <h3 className="font-bold text-foreground mb-1">Lab Assistant</h3>
              <p className="text-xs text-muted-foreground">AI-powered voice assistant</p>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-muted/20">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs p-3 rounded ${
                      msg.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-white border border-border text-foreground'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="mt-2 text-xs flex items-center gap-1 opacity-75 hover:opacity-100 transition-opacity"
                      >
                        <Volume2 size={12} />
                        {isSpeaking ? 'Playing...' : 'Listen'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4 space-y-3">
              {/* Voice Button */}
              <button
                onClick={handleVoiceCommand}
                className={`w-full p-3 rounded flex items-center justify-center gap-2 font-semibold transition-colors ${
                  voiceActive
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                <Mic size={18} />
                {voiceActive ? 'Recording...' : 'Speak to Assistant'}
              </button>

              {/* Text Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about tests..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  className="flex-1 px-3 py-2 border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder-muted-foreground"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

            {/* Quick Commands */}
            <div className="p-4 border-t border-border space-y-2">
              <p className="text-xs text-muted-foreground uppercase font-semibold mb-2">Quick Commands</p>
              <div className="space-y-1">
                <button className="w-full text-left text-xs text-primary hover:underline py-1">
                  📋 View my history
                </button>
                <button className="w-full text-left text-xs text-primary hover:underline py-1">
                  💡 Recommended tests
                </button>
                <button className="w-full text-left text-xs text-primary hover:underline py-1">
                  ❓ How to prepare
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lab Information */}
      <div className="border border-border p-8 bg-blue-50">
        <h2 className="text-2xl font-bold text-foreground mb-6">About Our Lab Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-2xl">🏥</span>
              State-of-the-Art Lab
            </h3>
            <p className="text-muted-foreground text-sm">
              Our laboratory is equipped with the latest diagnostic equipment and staffed by certified technicians.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Fast Results
            </h3>
            <p className="text-muted-foreground text-sm">
              Most tests are processed within 2-7 business days. Some results available same-day.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              Secure Results
            </h3>
            <p className="text-muted-foreground text-sm">
              All lab results are securely stored and available in your patient portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
