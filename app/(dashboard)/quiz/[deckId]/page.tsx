'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  Trophy, 
  HelpCircle, 
  BookOpen, 
  ArrowRight,
  Volume2,
  Award
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  type: 'KANJI_TO_MEANING' | 'MEANING_TO_KANJI' | 'FILL_IN_BLANK';
  question: string;
  subQuestion?: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  reading?: string;
  hanViet?: string;
  word: string;
}

export default function UnitQuizPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;

  const [deck, setDeck] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [wrongCards, setWrongCards] = useState<any[]>([]);

  useEffect(() => {
    fetchCardsAndGenerateQuiz();
  }, [deckId]);

  const fetchCardsAndGenerateQuiz = async () => {
    try {
      setLoading(true);
      const [resDecks, resCards] = await Promise.all([
        fetch('/api/decks'),
        fetch(`/api/cards?deckId=${deckId}`),
      ]);

      const dataDecks = await resDecks.json();
      const matchDeck = (dataDecks.decks || []).find((d: any) => d.id === deckId);
      if (matchDeck) setDeck(matchDeck);

      const dataCards = await resCards.json();
      const rawCards = dataCards.cards || [];
      setCards(rawCards);

      if (rawCards.length > 0) {
        generateQuizQuestions(rawCards);
      }
    } catch (e) {
      console.error('Error fetching quiz data:', e);
    } finally {
      setLoading(false);
    }
  };

  // Helper shuffle
  const shuffle = <T,>(arr: T[]): T[] => {
    return [...arr].sort(() => Math.random() - 0.5);
  };

  const generateQuizQuestions = (cardList: any[]) => {
    // Pick up to 10-15 random words from this unit
    const count = Math.min(cardList.length, 12);
    const selectedCards = shuffle(cardList).slice(0, count);

    const generated: QuizQuestion[] = selectedCards.map((targetCard, idx) => {
      // Pick 3 random distractors from the remaining cards
      const otherCards = cardList.filter((c) => c.id !== targetCard.id);
      const distractors = shuffle(otherCards).slice(0, 3);

      const qType = idx % 3 === 0 ? 'FILL_IN_BLANK' : idx % 3 === 1 ? 'MEANING_TO_KANJI' : 'KANJI_TO_MEANING';

      if (qType === 'FILL_IN_BLANK' && targetCard.backText && targetCard.backText.includes(targetCard.frontText)) {
        // Cloze sentence test
        const blankedSentence = targetCard.backText.replace(targetCard.frontText, '【 _____ 】');
        const correct = targetCard.frontText;
        const options = shuffle([correct, ...distractors.map((d) => d.frontText)]);

        return {
          id: idx + 1,
          type: 'FILL_IN_BLANK',
          question: blankedSentence,
          subQuestion: `Điền từ thích hợp vào chỗ trống để hoàn thành câu:`,
          correctAnswer: correct,
          options,
          explanation: `Đáp án đúng là: ${targetCard.frontText} (${targetCard.backReading}) - ${targetCard.backMeaning}`,
          reading: targetCard.backReading,
          word: targetCard.frontText,
        };
      } else if (qType === 'MEANING_TO_KANJI') {
        // Meaning -> Pick Kanji
        const correct = targetCard.frontText;
        const options = shuffle([correct, ...distractors.map((d) => d.frontText)]);

        return {
          id: idx + 1,
          type: 'MEANING_TO_KANJI',
          question: targetCard.backMeaning,
          subQuestion: `Hãy chọn Kanji tương ứng với nghĩa:`,
          correctAnswer: correct,
          options,
          explanation: `Từ đúng: ${targetCard.frontText} (${targetCard.backReading}) : ${targetCard.backMeaning}`,
          reading: targetCard.backReading,
          word: targetCard.frontText,
        };
      } else {
        // Kanji -> Pick Meaning
        const correct = `${targetCard.backReading ? targetCard.backReading + ' : ' : ''}${targetCard.backMeaning}`;
        const options = shuffle([
          correct,
          ...distractors.map((d) => `${d.backReading ? d.backReading + ' : ' : ''}${d.backMeaning}`),
        ]);

        return {
          id: idx + 1,
          type: 'KANJI_TO_MEANING',
          question: targetCard.frontText,
          subQuestion: `Hãy chọn cách đọc và nghĩa chính xác của từ vựng:`,
          correctAnswer: correct,
          options,
          explanation: `Ý nghĩa chính xác: ${targetCard.backMeaning}. Ví dụ: ${targetCard.backText || ''}`,
          reading: targetCard.backReading,
          word: targetCard.frontText,
        };
      }
    });

    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setCompleted(false);
    setWrongCards([]);
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;

    setSelectedOption(opt);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    if (opt === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    } else {
      // Record wrong card
      const wrongCard = cards.find((c) => c.frontText === currentQ.word);
      if (wrongCard) {
        setWrongCards((prev) => [...prev, wrongCard]);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setCompleted(true);
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  };

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Sparkles className="w-10 h-10 text-rose-500 animate-spin" />
        <p className="text-sm font-bold text-muted-foreground">Đang khởi tạo bài kiểm tra từ vựng...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-card rounded-3xl border border-border text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Chưa có đủ thẻ để tạo bài kiểm tra</h2>
        <p className="text-xs text-muted-foreground">Vui lòng thêm ít nhất 4 từ vựng vào Unit này để kích hoạt bài test.</p>
        <Link href={`/decks/${deckId}`} className="px-5 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs inline-block">
          Quay Lại Unit
        </Link>
      </div>
    );
  }

  if (completed) {
    const percent = Math.round((score / questions.length) * 100);
    const isPassed = percent >= 80;

    return (
      <div className="max-w-xl mx-auto my-12 p-8 sm:p-10 bg-card rounded-3xl border border-rose-500/30 text-center shadow-2xl space-y-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl ${
          isPassed 
            ? 'bg-gradient-to-tr from-amber-400 to-emerald-500 text-white shadow-emerald-500/30'
            : 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-rose-500/30'
        }`}>
          {isPassed ? <Trophy className="w-10 h-10" /> : <Award className="w-10 h-10" />}
        </div>

        <div>
          <span className="text-[11px] font-black uppercase px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
            {deck?.title || 'Kiểm Tra Unit'}
          </span>
          <h2 className="text-3xl font-black text-foreground mt-3">
            {isPassed ? 'Xuất Sắc! Bạn Đã Ghi Nhớ Tốt! 🎉' : 'Hoàn Thành Bài Kiểm Tra! 📚'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isPassed 
              ? 'Bạn đã làm chủ được các từ vựng cốt lõi trong Unit này!' 
              : 'Hãy ôn lại các từ chưa nhớ rõ để nâng cao khả năng ghi nhớ dài hạn nhé.'}
          </p>
        </div>

        {/* Score Badge */}
        <div className="p-5 rounded-2xl bg-muted/60 border border-border/60 flex items-center justify-around">
          <div>
            <div className="text-xs font-bold text-muted-foreground">Số Câu Đúng</div>
            <div className="text-3xl font-black text-foreground">{score} / {questions.length}</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div>
            <div className="text-xs font-bold text-muted-foreground">Tỷ Lệ Chính Xác</div>
            <div className={`text-3xl font-black ${isPassed ? 'text-emerald-500' : 'text-rose-500'}`}>
              {percent}%
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => generateQuizQuestions(cards)}
            className="flex-1 py-3.5 rounded-2xl bg-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-md hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Làm Lại Test (Đổi Câu Hỏi)
          </button>

          <Link
            href={`/review/${deckId}`}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Ôn Lại Bằng Flashcard
          </Link>
        </div>

        <Link
          href="/dashboard"
          className="inline-block text-xs font-bold text-muted-foreground hover:text-rose-500 transition-colors pt-2"
        >
          ← Quay Lại Bảng Điều Khiển
        </Link>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/decks/${deckId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-rose-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {deck?.title || 'Quay lại Unit'}
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold text-rose-500">
            Câu {currentIndex + 1} / {questions.length}
          </span>
          <div className="w-28 sm:w-36 h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-xl space-y-6 relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              Kiểm tra củng cố Unit
            </span>
            <div className="text-xs font-bold text-amber-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Điểm hiện tại: {score}
            </div>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
            {currentQ.subQuestion}
          </p>

          <div className="flex items-center gap-3 mt-3">
            <h3 className={`font-black text-foreground font-japanese ${
              currentQ.type === 'FILL_IN_BLANK' ? 'text-xl sm:text-2xl leading-relaxed' : 'text-3xl sm:text-4xl'
            }`}>
              {currentQ.question}
            </h3>

            {currentQ.word && (
              <button
                onClick={() => speak(currentQ.word)}
                className="p-2 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors shrink-0"
                title="Nghe phát âm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQ.correctAnswer;

            let buttonStyle = 'bg-muted/50 border-border/60 hover:bg-muted text-foreground';

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold ring-2 ring-emerald-500/30';
              } else if (isSelected) {
                buttonStyle = 'bg-rose-500/15 border-rose-500 text-rose-600 dark:text-rose-400 font-extrabold ring-2 ring-rose-500/30';
              } else {
                buttonStyle = 'opacity-40 border-border/40 text-muted-foreground';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between gap-2 ${buttonStyle}`}
              >
                <span className="font-semibold">{option}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation Banner */}
        {isAnswered && (
          <div className="p-4 rounded-2xl bg-muted/80 border border-border space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              {selectedOption === currentQ.correctAnswer ? (
                <span className="text-xs font-black text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Chính xác!
                </span>
              ) : (
                <span className="text-xs font-black text-rose-500 flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> Chưa chính xác!
                </span>
              )}
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed font-medium">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Next Question Button */}
        {isAnswered && (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-sm shadow-lg shadow-rose-500/25 hover:opacity-95 transition-opacity flex items-center gap-2"
            >
              {currentIndex + 1 < questions.length ? 'Câu Tiếp Theo' : 'Xem Kết Quả'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
