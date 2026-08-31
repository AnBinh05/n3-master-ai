'use client';

import { useState } from 'react';
import { Sparkles, Brain, BookOpen, CheckCircle2, MessageSquare, Send, Plus, Volume2 } from 'lucide-react';

export default function AIStudioPage() {
  const [activeTab, setActiveTab] = useState<'card' | 'explain' | 'quiz' | 'correction' | 'tutor'>('card');

  // Tab 1: AI Card State
  const [cardPrompt, setCardPrompt] = useState('');
  const [cardResult, setCardResult] = useState<any>(null);
  const [cardLoading, setCardLoading] = useState(false);

  // Tab 2: AI Explain State
  const [explainTopic, setExplainTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [explainLoading, setExplainLoading] = useState(false);

  // Tab 3: AI Quiz State
  const [quizList, setQuizList] = useState<any[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});

  // Tab 4: AI Correction State
  const [sentenceInput, setSentenceInput] = useState('');
  const [correctionResult, setCorrectionResult] = useState<any>(null);
  const [correctionLoading, setCorrectionLoading] = useState(false);

  // Tab 5: AI Tutor Chat State
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'こんにちは！ (Konnichiwa!) N3 Sensei đây. Hôm nay bạn muốn luyện tập phần nào trong kỳ thi JLPT N3?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Handlers
  const handleGenerateCard = async () => {
    if (!cardPrompt) return;
    setCardLoading(true);
    try {
      const res = await fetch('/api/ai/generate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: cardPrompt }),
      });
      const data = await res.json();
      if (data.card) setCardResult(data.card);
    } catch (e) {
      console.error(e);
    } finally {
      setCardLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!explainTopic) return;
    setExplainLoading(true);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: explainTopic }),
      });
      const data = await res.json();
      if (data.explanation) setExplanation(data.explanation);
    } catch (e) {
      console.error(e);
    } finally {
      setExplainLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    try {
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'VOCAB_GRAMMAR' }),
      });
      const data = await res.json();
      if (data.quiz) setQuizList(data.quiz);
    } catch (e) {
      console.error(e);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleCorrectSentence = async () => {
    if (!sentenceInput) return;
    setCorrectionLoading(true);
    try {
      const res = await fetch('/api/ai/correction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: sentenceInput }),
      });
      const data = await res.json();
      if (data.correction) setCorrectionResult(data.correction);
    } catch (e) {
      console.error(e);
    } finally {
      setCorrectionLoading(false);
    }
  };

  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const newMsg = { role: 'user', content: chatInput };
    const updatedMessages = [...chatMessages, newMsg];
    setChatMessages(updatedMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      if (data.message) {
        setChatMessages((prev) => [...prev, data.message]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Superpowers
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-foreground">
          N3 Master <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">AI Studio</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Hệ thống trí tuệ nhân tạo chuyên sâu luyện thi JLPT N3.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/50">
        <button
          onClick={() => setActiveTab('card')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
            activeTab === 'card' ? 'bg-rose-500 text-white shadow-md' : 'bg-muted/60 text-muted-foreground hover:bg-muted'
          }`}
        >
          <Sparkles className="w-4 h-4" /> AI Generate Flashcard
        </button>

        <button
          onClick={() => setActiveTab('explain')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
            activeTab === 'explain' ? 'bg-rose-500 text-white shadow-md' : 'bg-muted/60 text-muted-foreground hover:bg-muted'
          }`}
        >
          <Brain className="w-4 h-4" /> AI Grammar Explainer
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
            activeTab === 'quiz' ? 'bg-rose-500 text-white shadow-md' : 'bg-muted/60 text-muted-foreground hover:bg-muted'
          }`}
        >
          <BookOpen className="w-4 h-4" /> AI Mock Quiz
        </button>

        <button
          onClick={() => setActiveTab('correction')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
            activeTab === 'correction' ? 'bg-rose-500 text-white shadow-md' : 'bg-muted/60 text-muted-foreground hover:bg-muted'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> AI Correction
        </button>

        <button
          onClick={() => setActiveTab('tutor')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
            activeTab === 'tutor' ? 'bg-rose-500 text-white shadow-md' : 'bg-muted/60 text-muted-foreground hover:bg-muted'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> AI N3 Tutor Chat
        </button>
      </div>

      {/* Tab 1: AI Card Creator */}
      {activeTab === 'card' && (
        <div className="bg-card p-6 sm:p-8 rounded-3xl border border-border/60 shadow-sm space-y-6 max-w-2xl">
          <h2 className="text-lg font-bold text-foreground">AI Tự Tạo Thẻ Flashcard N3 Hoàn Chỉnh</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nhập từ vựng/kanji/ngữ pháp (VD: 解決, 遠慮, わけがない)"
              value={cardPrompt}
              onChange={(e) => setCardPrompt(e.target.value)}
              className="flex-1 p-3 rounded-2xl bg-muted/60 border border-border text-sm focus:ring-2 focus:ring-rose-500"
            />
            <button
              onClick={handleGenerateCard}
              disabled={cardLoading}
              className="px-6 py-3 rounded-2xl bg-rose-500 text-white font-extrabold text-xs shadow-md hover:bg-rose-600 disabled:opacity-50"
            >
              {cardLoading ? 'AI Đang Tạo...' : 'Tạo Thẻ AI'}
            </button>
          </div>

          {cardResult && (
            <div className="p-6 rounded-3xl bg-muted/40 border border-rose-500/20 space-y-3">
              <h3 className="text-3xl font-black font-japanese text-foreground">{cardResult.frontText}</h3>
              <p className="text-xs font-semibold text-muted-foreground">{cardResult.backReading}</p>
              <p className="text-base font-bold text-rose-500">{cardResult.backMeaning}</p>
              <p className="text-xs text-foreground/90 bg-card p-3 rounded-xl border border-border">&quot;{cardResult.backText}&quot;</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: AI Explain */}
      {activeTab === 'explain' && (
        <div className="bg-card p-6 sm:p-8 rounded-3xl border border-border/60 shadow-sm space-y-6 max-w-3xl">
          <h2 className="text-lg font-bold text-foreground">AI Giải Thích Ngữ Pháp / Từ Vựng N3 Chuyên Sâu</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nhập mẫu ngữ pháp hoặc từ vựng (VD: 〜ことにしている)"
              value={explainTopic}
              onChange={(e) => setExplainTopic(e.target.value)}
              className="flex-1 p-3 rounded-2xl bg-muted/60 border border-border text-sm focus:ring-2 focus:ring-rose-500"
            />
            <button
              onClick={handleExplain}
              disabled={explainLoading}
              className="px-6 py-3 rounded-2xl bg-rose-500 text-white font-extrabold text-xs shadow-md hover:bg-rose-600 disabled:opacity-50"
            >
              {explainLoading ? 'Đang Phân Tích...' : 'Giải Thích'}
            </button>
          </div>

          {explanation && (
            <div className="p-6 rounded-3xl bg-muted/40 border border-border text-sm whitespace-pre-wrap leading-relaxed">
              {explanation}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: AI Quiz */}
      {activeTab === 'quiz' && (
        <div className="bg-card p-6 sm:p-8 rounded-3xl border border-border/60 shadow-sm space-y-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Tạo Bài Thi Thử JLPT N3 Trắc Nghiệm</h2>
            <button
              onClick={handleGenerateQuiz}
              disabled={quizLoading}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-xs shadow-md hover:opacity-95 disabled:opacity-50"
            >
              {quizLoading ? 'AI Đang Tạo Đề...' : 'Tạo Bộ 3 Câu Hỏi Mới'}
            </button>
          </div>

          {quizList.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nhấp nút bên trên để AI khởi tạo đề thi N3 trắc nghiệm.</p>
          ) : (
            <div className="space-y-6">
              {quizList.map((q, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3">
                  <p className="text-sm font-bold text-foreground">
                    Câu {idx + 1}: {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options?.map((opt: string, optIdx: number) => {
                      const isSelected = selectedAnswers[idx] === optIdx;
                      const isCorrect = q.correctIndex === optIdx;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [idx]: optIdx })}
                          className={`p-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                            isSelected
                              ? isCorrect
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-rose-500 text-white border-rose-500'
                              : 'bg-card border-border hover:bg-muted'
                          }`}
                        >
                          {optIdx + 1}. {opt}
                        </button>
                      );
                    })}
                  </div>

                  {selectedAnswers[idx] !== undefined && (
                    <div className="p-3 rounded-xl bg-card border border-border text-xs text-muted-foreground">
                      <strong>Giải thích:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: AI Sentence Correction */}
      {activeTab === 'correction' && (
        <div className="bg-card p-6 sm:p-8 rounded-3xl border border-border/60 shadow-sm space-y-6 max-w-2xl">
          <h2 className="text-lg font-bold text-foreground">AI Sửa Lỗi Diễn Đạt & Ngữ Pháp N3</h2>
          <textarea
            placeholder="Nhập câu tiếng Nhật do bạn tự viết (VD: 毎朝、野菜を食べるです。)"
            value={sentenceInput}
            onChange={(e) => setSentenceInput(e.target.value)}
            className="w-full p-4 rounded-2xl bg-muted/60 border border-border text-sm focus:ring-2 focus:ring-rose-500 h-28"
          />
          <button
            onClick={handleCorrectSentence}
            disabled={correctionLoading}
            className="px-6 py-3 rounded-2xl bg-rose-500 text-white font-extrabold text-xs shadow-md hover:bg-rose-600 disabled:opacity-50"
          >
            {correctionLoading ? 'Đang Kiểm Tra...' : 'AI Sửa Lỗi Ngay'}
          </button>

          {correctionResult && (
            <div className="p-6 rounded-3xl bg-muted/40 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Điểm tự nhiên:</span>
                <span className="text-lg font-black text-rose-500">{correctionResult.score}/100</span>
              </div>
              <p className="text-sm text-foreground"><strong>Câu đã sửa:</strong> {correctionResult.corrected}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{correctionResult.feedback}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: AI N3 Tutor Chat */}
      {activeTab === 'tutor' && (
        <div className="bg-card p-6 rounded-3xl border border-border/60 shadow-sm space-y-4 max-w-3xl flex flex-col h-[550px]">
          <div className="flex items-center gap-2 pb-3 border-b border-border">
            <MessageSquare className="w-5 h-5 text-rose-500" />
            <h2 className="text-base font-bold text-foreground">N3 Sensei - AI Chatbot 24/7</h2>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-rose-500 text-white rounded-br-none'
                      : 'bg-muted/80 text-foreground rounded-bl-none border border-border/50'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2 border-t border-border">
            <input
              type="text"
              placeholder="Đặt câu hỏi cho Sensei N3..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              className="flex-1 p-3 rounded-2xl bg-muted/60 border border-border text-sm focus:ring-2 focus:ring-rose-500"
            />
            <button
              onClick={handleSendChatMessage}
              disabled={chatLoading}
              className="p-3 rounded-2xl bg-rose-500 text-white hover:bg-rose-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
