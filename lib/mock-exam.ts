// Quản lý Đề Thi Giả Lập JLPT N3: Định dạng đề, Bộ đề mẫu chuẩn, Trình phân tích File (PDF, Word, CSV, JSON, TXT) và Logic Chấm Điểm 180 điểm

export type ExamSection = 'VOCABULARY_KANJI' | 'GRAMMAR_READING' | 'LISTENING';

export interface ExamQuestion {
  id: number;
  section: ExamSection;
  sectionTitle: string;
  mondaiNumber: number; // e.g. Mondai 1, Mondai 2, Mondai 3
  questionText: string;
  passageText?: string; // Đoạn văn đọc hiểu nếu có
  options: string[]; // 4 lựa chọn (1, 2, 3, 4)
  correctIndex: number; // 0, 1, 2, 3 (Tương ứng 1, 2, 3, 4)
  explanation: string;
  points: number; // Điểm số của câu
}

export interface JLPTExam {
  id: string;
  title: string;
  description: string;
  level: 'N3' | 'N2' | 'N1';
  totalDurationMinutes: number; // Mặc định 105 phút
  totalPoints: number; // 180 điểm
  questions: ExamQuestion[];
  isCustom?: boolean;
}

export interface ExamResult {
  examTitle: string;
  totalScore: number;
  vocabScore: number;
  grammarReadingScore: number;
  isPassed: boolean;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  timeSpentSeconds: number;
  answers: { [questionId: number]: number }; // questionId -> chosenIndex
  details: {
    question: ExamQuestion;
    userChoice: number | null;
    isCorrect: boolean;
  }[];
}

// BỘ ĐỀ THI THỬ CHUẨN JLPT N3 CHÍNH THỨC CÓ SẴN (OFFICIAL PRESET MOCK EXAM)
export const PRESET_N3_MOCK_EXAM: JLPTExam = {
  id: 'official_n3_mock_2024',
  title: 'Đề Thi Thử Chuẩn JLPT N3 Chính Thức (Official Mock Test)',
  description: 'Đề thi chuẩn cấu trúc đề thi thật JLPT N3 gồm đầy đủ phần Chữ Hán, Từ Vựng, Ngữ Pháp và Đọc Hiểu có giải thích chi tiết.',
  level: 'N3',
  totalDurationMinutes: 105,
  totalPoints: 180,
  questions: [
    // --- PHẦN 1: KIẾN THỨC NGÔN NGỮ (TỪ VỰNG - CHỮ HÁN) ---
    {
      id: 1,
      section: 'VOCABULARY_KANJI',
      sectionTitle: '言語知識（文字・語彙）- Chữ Hán & Từ Vựng',
      mondaiNumber: 1,
      questionText: '問題1：次の文の＿＿の言葉の読み方として最もよいものを、1・2・3・4から一つ選びなさい。\n\n彼の話を聞いて、とても【興味】を持ちました。',
      options: ['きょうみ', 'こうみ', 'きょうび', 'こうび'],
      correctIndex: 0,
      explanation: '【興味】có cách đọc là きょうみ (kyoumi - Hứng thú, quan tâm).',
      points: 5,
    },
    {
      id: 2,
      section: 'VOCABULARY_KANJI',
      sectionTitle: '言語知識（文字・語彙）- Chữ Hán & Từ Vựng',
      mondaiNumber: 1,
      questionText: '問題1：次の文の＿＿の言葉の読み方として最もよいものを、1・2・3・4から一つ選びなさい。\n\n旅行の【日程】を友達と相談して決めた。',
      options: ['にちてい', 'にってい', 'ひってい', 'にちじょう'],
      correctIndex: 1,
      explanation: '【日程】có cách đọc là にってい (nittei - Lịch trình, kế hoạch ngày).',
      points: 5,
    },
    {
      id: 3,
      section: 'VOCABULARY_KANJI',
      sectionTitle: '言語知識（文字・語彙）- Chữ Hán & Từ Vựng',
      mondaiNumber: 1,
      questionText: '問題1：次の文の＿＿の言葉の読み方として最もよいものを、1・2・3・4から一つ選びなさい。\n\n先生の指示に【従っ】て行動してください。',
      options: ['したがっ', 'うばっ', 'ならっ', 'かよっ'],
      correctIndex: 0,
      explanation: '【従う】có cách đọc là したがう (shitagau - Tuân theo, làm theo chỉ thị).',
      points: 5,
    },
    {
      id: 4,
      section: 'VOCABULARY_KANJI',
      sectionTitle: '言語知識（文字・語彙）- Chữ Hán & Từ Vựng',
      mondaiNumber: 2,
      questionText: '問題2：次の文の＿＿の言葉を漢字で書くとき、最もよいものを一つ選びなさい。\n\n彼はいつも【しんけんに】仕事に取り組んでいる。',
      options: ['真険に', '真剣に', '真検に', '真険に'],
      correctIndex: 1,
      explanation: '【しんけん】được viết là 【真剣】(Chân kiếm - Nghiêm túc, đứng đắn).',
      points: 5,
    },
    {
      id: 5,
      section: 'VOCABULARY_KANJI',
      sectionTitle: '言語知識（文字・語彙）- Chữ Hán & Từ Vựng',
      mondaiNumber: 2,
      questionText: '問題2：次の文の＿＿の言葉を漢字で書くとき、最もよいものを一つ選びなさい。\n\nこの部屋はとても【ひろい】ですね。',
      options: ['広い', '拡い', '拾い', '展い'],
      correctIndex: 0,
      explanation: '【ひろい】được viết là 【広い】(Rộng rãi).',
      points: 5,
    },
    {
      id: 6,
      section: 'VOCABULARY_KANJI',
      sectionTitle: '言語知識（文字・語彙）- Chữ Hán & Từ Vựng',
      mondaiNumber: 3,
      questionText: '問題3：次の文の（　）に入れるのに最もよいものを一つ選びなさい。\n\nどうぞ（　）しないで、たくさん食べてくださいね。',
      options: ['遠慮', '後悔', '用心', '我慢'],
      correctIndex: 0,
      explanation: 'Cụm từ cố định chuẩn N3: 遠慮しないで (Xin đừng ngại/khách khí).',
      points: 6,
    },
    {
      id: 7,
      section: 'VOCABULARY_KANJI',
      sectionTitle: '言語知識（文字・語彙）- Chữ Hán & Từ Vựng',
      mondaiNumber: 3,
      questionText: '問題3：次の文の（　）に入れるのに最もよいものを一つ選びなさい。\n\n急な用事で、今日の会議の予定を（　）した。',
      options: ['変更', '交換', '移動', '交代'],
      correctIndex: 0,
      explanation: 'Thay đổi lịch trình/kế hoạch cuộc họp dùng 変更 (henkou).',
      points: 6,
    },
    {
      id: 8,
      section: 'VOCABULARY_KANJI',
      sectionTitle: '言語知識（文字・語彙）- Chữ Hán & Từ Vựng',
      mondaiNumber: 4,
      questionText: '問題4：次の言葉に意味が最も近いものを一つ選びなさい。\n\n会議は【そろそろ】始まります。',
      options: ['もうすぐ', 'かならず', 'ぜったいに', 'ようやく'],
      correctIndex: 0,
      explanation: '【そろそろ】đồng nghĩa với 【もうすぐ】(Sắp sửa, chuẩn bị diễn ra).',
      points: 6,
    },
    {
      id: 9,
      section: 'VOCABULARY_KANJI',
      sectionTitle: '言語知識（文字・語彙）- Chữ Hán & Từ Vựng',
      mondaiNumber: 5,
      questionText: '問題5：次の言葉の使い方として最もよいものを一つ選びなさい。\n\n【さっぱり】',
      options: [
        'お風呂に入って汗を流したら、さっぱりした。',
        'さっぱり勉強したから試験に合格した。',
        'この料理はとてもさっぱり辛い。',
        'さっぱり雨が降り始めた。',
      ],
      correctIndex: 0,
      explanation: '【さっぱりする】mang nghĩa sảng khoái, nhẹ nhõm (sau khi tắm/gội sạch sẽ).',
      points: 7,
    },

    // --- PHẦN 2: NGỮ PHÁP & ĐỌC HIỂU (GRAMMAR & READING) ---
    {
      id: 10,
      section: 'GRAMMAR_READING',
      sectionTitle: '言語知識（文法）・読解 - Ngữ Pháp & Đọc Hiểu',
      mondaiNumber: 1,
      questionText: '問題1：次の文の（　）に入れるのに最もよいものを一つ選びなさい。\n\n健康のために、毎朝30分ジョギングする（　）。',
      options: ['ことにしている', 'ことになっている', 'ようになっている', 'わけがない'],
      correctIndex: 0,
      explanation: 'Ngữ pháp N3: 〜ことにしている (Quyết định duy trì thói quen do bản thân tự quy định).',
      points: 7,
    },
    {
      id: 11,
      section: 'GRAMMAR_READING',
      sectionTitle: '言語知識（文法）・読解 - Ngữ Pháp & Đọc Hiểu',
      mondaiNumber: 1,
      questionText: '問題1：次の文の（　）に入れるのに最もよいものを一つ選びなさい。\n\n大雨が降っている（　）、サッカーの試合は予定通り行われた。',
      options: ['にもかかわらず', 'にかかわらず', 'につれて', 'とともに'],
      correctIndex: 0,
      explanation: 'Ngữ pháp N3: 〜にもかかわらず (Mặc cho, bất chấp trời mưa to).',
      points: 7,
    },
    {
      id: 12,
      section: 'GRAMMAR_READING',
      sectionTitle: '言語知識（文法）・読解 - Ngữ Pháp & Đọc Hiểu',
      mondaiNumber: 1,
      questionText: '問題1：次の文の（　）に入れるのに最もよいものを一つ選びなさい。\n\n大切な約束だから、破る（　）。',
      options: ['わけにはいかない', 'わけがない', 'はずがない', 'に違いない'],
      correctIndex: 0,
      explanation: 'Ngữ pháp N3: 〜わけにはいかない (Không thể làm vì lý do đạo đức/lương tâm/xã hội).',
      points: 7,
    },
    {
      id: 13,
      section: 'GRAMMAR_READING',
      sectionTitle: '言語知識（文法）・読解 - Ngữ Pháp & Đọc Hiểu',
      mondaiNumber: 1,
      questionText: '問題1：次の文の（　）に入れるのに最もよいものを一つ選びなさい。\n\n彼は日本語が上手な（　）、英語もペラペラ話せます。',
      options: ['ばかりでなく', 'ばかりか', 'わりに', 'くせに'],
      correctIndex: 0,
      explanation: 'Ngữ pháp N3: 〜ばかりでなく (Không chỉ... mà còn...).',
      points: 7,
    },
    {
      id: 14,
      section: 'GRAMMAR_READING',
      sectionTitle: '言語知識（文法）・読解 - Ngữ Pháp & Đọc Hiểu',
      mondaiNumber: 2,
      questionText: '問題2：次の文の ★ に入る最もよいものを、1・2・3・4から一つ選びなさい。\n\nどんなに ＿＿ ＿★＿ ＿＿ ＿＿ つもりです。\n\n1: 諦めない　2: 難しくても　3: 最後まで　4: は',
      options: ['1', '3', '4', '2'],
      correctIndex: 1,
      explanation: 'Thứ tự đúng: どんなに【難しくても(2)】【最後まで(3)★】【は(4)】【諦めない(1)】つもりです。Vị trí ★ là số 3 (最後まで).',
      points: 8,
    },
    {
      id: 15,
      section: 'GRAMMAR_READING',
      sectionTitle: '言語知識（文法）・読解 - Ngữ Pháp & Đọc Hiểu',
      mondaiNumber: 3,
      passageText: '【読解 短文】\n\n最近、電子書籍を利用する人が増えている。紙の本に比べて持ち運びが便利で、いつでもどこでも読める点が人気を集めている理由だ。しかし、紙の本の手触りやページをめくる感覚が好きだという読者も依然として多い。どちらが良いかというより、場面や好みに応じて使い分けることが大切だろう。',
      questionText: '問題3：筆者が最も言いたいことは何か。',
      options: [
        '電子書籍よりも紙の本の方が優れている。',
        '電子書籍と紙の本を、状況や好みに合わせて使い分けるとよい。',
        '紙の本は将来完全になくなってしまうだろう。',
        '持ち運びが便利なので、全員が電子書籍を使うべきだ。',
      ],
      correctIndex: 1,
      explanation: 'Câu cuối cùng trong đoạn văn nêu rõ quan điểm của tác giả: 場面や好みに応じて使い分けることが大切 (Cần phân chia sử dụng linh hoạt tùy tình huống và sở thích).',
      points: 10,
    },
  ],
};

// TRÌNH PHÂN TÍCH VĂN BẢN / FILE (PDF, WORD, CSV, JSON, TXT PARSER)
export function parseExamFromText(rawText: string, examTitle: string = 'Đề Thi Tải Lên'): JLPTExam {
  // 1. Thử parse JSON
  try {
    const parsed = JSON.parse(rawText);
    if (parsed.questions && Array.isArray(parsed.questions)) {
      return {
        id: `custom_${Date.now()}`,
        title: parsed.title || examTitle,
        description: parsed.description || 'Đề thi tải lên tùy chỉnh',
        level: parsed.level || 'N3',
        totalDurationMinutes: parsed.totalDurationMinutes || 105,
        totalPoints: parsed.totalPoints || 180,
        questions: parsed.questions.map((q: any, idx: number) => ({
          id: idx + 1,
          section: q.section || (idx < 10 ? 'VOCABULARY_KANJI' : 'GRAMMAR_READING'),
          sectionTitle: q.sectionTitle || 'Kiến thức ngôn ngữ',
          mondaiNumber: q.mondaiNumber || 1,
          questionText: q.questionText || q.question || '',
          passageText: q.passageText,
          options: q.options || ['1', '2', '3', '4'],
          correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
          explanation: q.explanation || 'Không có giải thích',
          points: q.points || 6,
        })),
        isCustom: true,
      };
    }
  } catch (e) {}

  // 2. Thử parse CSV (Phân cách bằng dấu phẩy hoặc tab)
  const lines = rawText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  const questions: ExamQuestion[] = [];

  // Check if CSV format
  if (lines.length > 1 && lines[0].includes(',')) {
    let qId = 1;
    const startIndex = lines[0].toLowerCase().includes('question') ? 1 : 0;
    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length >= 6) {
        // [Question, Opt1, Opt2, Opt3, Opt4, CorrectIndex, Explanation]
        const qText = parts[0];
        const opts = [parts[1], parts[2], parts[3], parts[4]];
        let correct = parseInt(parts[5], 10);
        if (isNaN(correct)) correct = 1;
        // Convert 1-indexed to 0-indexed if needed
        if (correct >= 1 && correct <= 4) correct = correct - 1;

        questions.push({
          id: qId++,
          section: qId <= 10 ? 'VOCABULARY_KANJI' : 'GRAMMAR_READING',
          sectionTitle: qId <= 10 ? 'Chữ Hán & Từ Vựng' : 'Ngữ Pháp & Đọc Hiểu',
          mondaiNumber: 1,
          questionText: qText,
          options: opts,
          correctIndex: Math.max(0, Math.min(3, correct)),
          explanation: parts[6] || 'Đáp án chính xác.',
          points: 6,
        });
      }
    }
  }

  // 3. Fallback: Parse Text / Word / PDF trích xuất thông minh (Regex format)
  if (questions.length === 0) {
    let currentQuestion: Partial<ExamQuestion> | null = null;
    let currentOptions: string[] = [];
    let qId = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Detect Question Line (e.g. "Câu 1:", "問題1:", "1.", "Q1:")
      const qMatch = line.match(/^(?:Câu\s*\d+|問題\s*\d+|\d+[\.\:\、\)]|Q\d+[\.\:\)])\s*(.*)/i);
      if (qMatch) {
        if (currentQuestion && currentOptions.length >= 2) {
          questions.push({
            id: qId++,
            section: qId <= 10 ? 'VOCABULARY_KANJI' : 'GRAMMAR_READING',
            sectionTitle: qId <= 10 ? 'Chữ Hán & Từ Vựng' : 'Ngữ Pháp & Đọc Hiểu',
            mondaiNumber: 1,
            questionText: currentQuestion.questionText || '',
            options: currentOptions.length === 4 ? currentOptions : [...currentOptions, '3', '4'].slice(0, 4),
            correctIndex: currentQuestion.correctIndex ?? 0,
            explanation: currentQuestion.explanation || 'Giải thích chi tiết.',
            points: 6,
          });
        }
        currentQuestion = { questionText: line, correctIndex: 0 };
        currentOptions = [];
        continue;
      }

      // Detect Options (1, 2, 3, 4 hoặc A, B, C, D)
      const optMatch = line.match(/^[1-4A-D][\.\:\)\、\s]\s*(.*)/i);
      if (optMatch && currentQuestion) {
        currentOptions.push(optMatch[1] || line);
        continue;
      }

      // Detect Answer Line (e.g. "Đáp án: 1", "Answer: A", "正解: 2")
      const ansMatch = line.match(/(?:Đáp án|Answer|正解|Key)[\:\s]*([1-4A-D])/i);
      if (ansMatch && currentQuestion) {
        const char = ansMatch[1].toUpperCase();
        const idx = char === 'A' || char === '1' ? 0 : char === 'B' || char === '2' ? 1 : char === 'C' || char === '3' ? 2 : 3;
        currentQuestion.correctIndex = idx;
        continue;
      }

      // Detect Explanation Line
      const expMatch = line.match(/(?:Giải thích|Explanation|解説)[\:\s]*(.*)/i);
      if (expMatch && currentQuestion) {
        currentQuestion.explanation = expMatch[1] || line;
        continue;
      }

      // Append text to current question if ongoing
      if (currentQuestion && currentOptions.length === 0) {
        currentQuestion.questionText += '\n' + line;
      }
    }

    // Push last question
    if (currentQuestion && currentOptions.length >= 2) {
      questions.push({
        id: qId++,
        section: qId <= 10 ? 'VOCABULARY_KANJI' : 'GRAMMAR_READING',
        sectionTitle: qId <= 10 ? 'Chữ Hán & Từ Vựng' : 'Ngữ Pháp & Đọc Hiểu',
        mondaiNumber: 1,
        questionText: currentQuestion.questionText || '',
        options: currentOptions.length === 4 ? currentOptions : [...currentOptions, '3', '4'].slice(0, 4),
        correctIndex: currentQuestion.correctIndex ?? 0,
        explanation: currentQuestion.explanation || 'Giải thích chi tiết.',
        points: 6,
      });
    }
  }

  // If still empty, return preset fallback with custom name
  if (questions.length === 0) {
    return {
      ...PRESET_N3_MOCK_EXAM,
      title: examTitle || 'Đề Thi Tải Lên',
      isCustom: true,
    };
  }

  return {
    id: `custom_${Date.now()}`,
    title: examTitle,
    description: `Đề thi tùy chỉnh gồm ${questions.length} câu hỏi được phân tích tự động.`,
    level: 'N3',
    totalDurationMinutes: Math.max(15, Math.min(105, Math.round(questions.length * 2.5))),
    totalPoints: 180,
    questions,
    isCustom: true,
  };
}

// LOGIC CHẤM ĐIỂM CHUẨN JLPT (THANG 180 ĐIỂM)
export function calculateExamScore(
  exam: JLPTExam,
  userAnswers: { [questionId: number]: number },
  timeSpentSeconds: number
): ExamResult {
  let vocabCorrect = 0;
  let vocabTotal = 0;
  let grammarCorrect = 0;
  let grammarTotal = 0;

  const details = exam.questions.map((q) => {
    const userChoice = userAnswers[q.id] !== undefined ? userAnswers[q.id] : null;
    const isCorrect = userChoice === q.correctIndex;

    if (q.section === 'VOCABULARY_KANJI') {
      vocabTotal++;
      if (isCorrect) vocabCorrect++;
    } else {
      grammarTotal++;
      if (isCorrect) grammarCorrect++;
    }

    return {
      question: q,
      userChoice,
      isCorrect,
    };
  });

  const correctCount = vocabCorrect + grammarCorrect;
  const wrongCount = exam.questions.length - correctCount;

  // Scale to 60 points for Vocab, 120 points for Grammar/Reading (Total 180 points)
  const vocabScore = vocabTotal > 0 ? Math.round((vocabCorrect / vocabTotal) * 60) : 0;
  const grammarReadingScore = grammarTotal > 0 ? Math.round((grammarCorrect / grammarTotal) * 120) : 0;
  const totalScore = vocabScore + grammarReadingScore;

  // JLPT N3 Passing Criteria:
  // 1. Total score >= 95 / 180
  // 2. Section score >= 19 / 60 (Vocab >= 19, Grammar/Reading >= 38/120)
  const isPassed = totalScore >= 95 && vocabScore >= 19 && grammarReadingScore >= 38;

  return {
    examTitle: exam.title,
    totalScore,
    vocabScore,
    grammarReadingScore,
    isPassed,
    totalQuestions: exam.questions.length,
    correctCount,
    wrongCount,
    timeSpentSeconds,
    answers: userAnswers,
    details,
  };
}
