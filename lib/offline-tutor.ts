import { ALL_880_WORDS } from '@/prisma/data/mimikara_n3_880';

// Database ngữ pháp N3 trọng tâm giải thích chi tiết
export interface GrammarPoint {
  pattern: string;
  romaji: string;
  meaning: string;
  formation: string;
  explanation: string;
  trap: string;
  examples: { jp: string; vi: string }[];
}

export const N3_GRAMMAR_DATABASE: GrammarPoint[] = [
  {
    pattern: '〜ことにしている',
    romaji: 'koto ni shite iru',
    meaning: 'Quyết định / Thói quen do bản thân tự quy định',
    formation: 'V-ru / V-nai + ことにしている',
    explanation: 'Dùng để diễn tả một quy tắc, thói quen hoặc quyết tâm mà chính bản thân người nói tự đặt ra cho mình và đang duy trì thực hiện.',
    trap: 'Tránh nhầm lẫn với 〜ことになっている (quy định do tập thể, công ty, luật pháp đặt ra).',
    examples: [
      { jp: '健康のために、毎朝30分ジョギングすることにしている。', vi: 'Vì sức khỏe, tôi tự quy định mỗi sáng chạy bộ 30 phút.' },
      { jp: '夜10時以降はスマホを見ないことにしている。', vi: 'Tôi tự đặt luật cho mình là không xem điện thoại sau 10 giờ đêm.' },
    ],
  },
  {
    pattern: '〜ことになっている',
    romaji: 'koto ni natte iru',
    meaning: 'Quy định, luật lệ chung (do tập thể / cơ quan / xã hội đặt ra)',
    formation: 'V-ru / V-nai + ことになっている',
    explanation: 'Diễn tả những quy định, tập quán, lịch trình hoặc thỏa thuận chung không do ý chí cá nhân người nói quyết định.',
    trap: 'Thường xuất hiện trong đề thi N3 phần kính ngữ hoặc hội thoại công sở.',
    examples: [
      { jp: 'この部屋ではタバコを吸ってはいけないことになっている。', vi: 'Trong phòng này có quy định không được hút thuốc.' },
      { jp: '法律で20歳未満の飲酒は禁止されていることになっている。', vi: 'Theo luật định, người dưới 20 tuổi không được uống rượu.' },
    ],
  },
  {
    pattern: '〜ようにする',
    romaji: 'you ni suru',
    meaning: 'Cố gắng làm / không làm việc gì đó (nỗ lực tạo thói quen)',
    formation: 'V-ru / V-nai + ようにする / ようにしている',
    explanation: 'Nhấn mạnh vào sự cố gắng, nỗ lực từng bước để tạo lập một thói quen tốt hoặc phòng tránh điều xấu.',
    trap: 'Khác với 〜ことにしている (quyết định dứt khoát), 〜ようにする thiên về sự nỗ lực, cố gắng trong khả năng.',
    examples: [
      { jp: '毎日野菜をたくさん食べるようにしています。', vi: 'Tôi đang cố gắng ăn nhiều rau củ mỗi ngày.' },
      { jp: '忘れ物をしないように、メモを取るようにしてください。', vi: 'Để không bị quên đồ, hãy cố gắng ghi chú lại nhé.' },
    ],
  },
  {
    pattern: '〜ようになる',
    romaji: 'you ni naru',
    meaning: 'Trở nên có thể làm gì / Thay đổi trạng thái sang...',
    formation: 'V-khả năng / V-ru + ようになる',
    explanation: 'Diễn tả sự biến đổi năng lực hoặc thói quen từ trước đến nay không làm được, nay đã làm được.',
    trap: 'Thường đi với động từ thể khả năng (話せるようになる, 読めるようになる).',
    examples: [
      { jp: '日本語のニュースが少し聞き取れるようになりました。', vi: 'Tôi đã bắt đầu nghe hiểu được một chút tin tức tiếng Nhật rồi.' },
    ],
  },
  {
    pattern: '〜わけがない',
    romaji: 'wake ga nai',
    meaning: 'Tuyệt đối không thể nào / Chắc chắn không có chuyện...',
    formation: 'Thể thông thường (Na な / N の) + わけがない',
    explanation: 'Thể hiện sự phủ định mạnh mẽ dựa trên lý do xác đáng và logic vững chắc của người nói.',
    trap: 'Đồng nghĩa với 〜はずがない. Rất hay gặp trong đề thi đọc hiểu và nghe hiểu để biểu lộ thái độ nhân vật.',
    examples: [
      { jp: '彼がそんな嘘をつくわけがない。', vi: 'Anh ấy tuyệt đối không thể nào nói dối như thế.' },
      { jp: 'こんな難しい試験、一日で合格できるわけがない。', vi: 'Kỳ thi khó thế này, không đời nào đỗ chỉ sau 1 ngày học.' },
    ],
  },
  {
    pattern: '〜わけではない',
    romaji: 'wake dewa nai',
    meaning: 'Không hẳn là / Không có nghĩa là... (Phủ định một phần)',
    formation: 'Thể thông thường (Na な / N な) + わけではない',
    explanation: 'Dùng để phủ định một phần, đính chính lại sự việc để người nghe không hiểu lầm cực đoan.',
    trap: 'Khác hoàn toàn với 〜わけがない (phủ định 100%). 〜わけではない chỉ phủ định tính chất tuyệt đối.',
    examples: [
      { jp: '日本料理が嫌いなわけではないが、納豆は苦手だ。', vi: 'Không hẳn là tôi ghét món Nhật, nhưng món Natto thì tôi chịu.' },
      { jp: '暇なわけではないが、手伝ってあげるよ。', vi: 'Không phải là tôi rảnh đâu, nhưng tôi sẽ giúp bạn.' },
    ],
  },
  {
    pattern: '〜おかげで',
    romaji: 'okage de',
    meaning: 'Nhờ có / Nhờ ơn... (Kết quả tốt đẹp)',
    formation: 'Thể thông thường (Na な / N の) + おかげで / おかげだ',
    explanation: 'Diễn tả nguyên nhân dẫn đến một kết quả tích cực, thể hiện sự biết ơn.',
    trap: 'Đôi khi dùng mỉa mai châm biếm, nhưng trong JLPT N3 90% nghĩa tích cực. Trái ngược với 〜せいで.',
    examples: [
      { jp: '先生のご指導のおかげで、JLPT N3に合格できました。', vi: 'Nhờ có sự chỉ dẫn của thầy cô, em đã đỗ JLPT N3.' },
    ],
  },
  {
    pattern: '〜せいで',
    romaji: 'sei de',
    meaning: 'Do / Tại vì... (Kết quả tiêu cực, đổ lỗi)',
    formation: 'Thể thông thường (Na な / N の) + せいで / せいだ',
    explanation: 'Chỉ nguyên nhân dẫn tới hậu quả xấu, trách móc hoặc đổ lỗi.',
    trap: 'Luôn đi với kết quả xấu (thất bại, trễ hẹn, bị mắng...).',
    examples: [
      { jp: '大雨のせいで、電車が止まって遅刻してしまった。', vi: 'Tại vì mưa to nên tàu dừng và tôi đã bị muộn.' },
    ],
  },
  {
    pattern: '〜うちに',
    romaji: 'uchi ni',
    meaning: 'Trong lúc còn... / Tranh thủ khi...',
    formation: 'V-ru / V-nai / V-teiru / A-i / A-na / N-no + うちに',
    explanation: '1. Tranh thủ làm việc gì đó trước khi trạng thái thay đổi. 2. Trong lúc đang làm việc này thì có sự thay đổi khác tự nhiên diễn ra.',
    trap: 'Khác với 〜あいだに (nhấn mạnh khoảng thời gian cố định), 〜うちに nhấn mạnh trạng thái sắp đổi (nóng, trẻ, sáng).',
    examples: [
      { jp: 'スープが温かいうちに、早く召し上がってください。', vi: 'Trong lúc súp còn nóng, xin mời dùng ngay ạ.' },
      { jp: '日本にいるうちに、一度富士山に登りたい。', vi: 'Trong lúc còn ở Nhật, tôi muốn leo núi Phú Sĩ một lần.' },
    ],
  },
  {
    pattern: '〜たびに',
    romaji: 'tabi ni',
    meaning: 'Cứ mỗi lần... thì lại...',
    formation: 'V-ru / N の + たびに',
    explanation: 'Diễn tả hành động hễ cứ lặp lại sự việc A thì luôn luôn kéo theo sự việc B diễn ra.',
    trap: 'Không dùng cho những hiện tượng hiển nhiên hàng ngày (như sáng dậy, ăn cơm).',
    examples: [
      { jp: 'この曲を聞くたびに、学生時代を思い出す。', vi: 'Cứ mỗi lần nghe bài hát này, tôi lại nhớ về thời học sinh.' },
    ],
  },
  {
    pattern: '〜おそれがある',
    romaji: 'osore ga aru',
    meaning: 'E rằng / Có nguy cơ / Lo ngại rằng...',
    formation: 'V-ru / V-nai / N の + おそれがある',
    explanation: 'Dùng nhiều trong tin tức, thời sự để cảnh báo về một khả năng xấu có thể xảy ra trong tương lai.',
    trap: 'Văn phong trang trọng, thời sự, dùng cho sự kiện tiêu cực lớn (thiên tai, dịch bệnh, tai nạn).',
    examples: [
      { jp: '台風の影響で、土砂崩れが起きるおそれがあります。', vi: 'Do ảnh hưởng của bão, e rằng có nguy cơ sạt lở đất.' },
    ],
  },
  {
    pattern: '〜に対して',
    romaji: 'ni taishite',
    meaning: '1. Đối với (đối tượng) / 2. Trái ngược với...',
    formation: 'N + に対して / N1 に対する N2',
    explanation: 'Chỉ đối tượng hướng tới của hành vi/thái độ, hoặc so sánh tương phản giữa 2 chủ thể.',
    trap: 'Phân biệt với 〜にとって (đứng trên lập trường/đánh giá: "Đối với tôi bài này khó").',
    examples: [
      { jp: 'お客様に対して、いつも丁寧な言葉遣いを心がけている。', vi: 'Đối với khách hàng, tôi luôn chú ý dùng lời lẽ lịch sự.' },
      { jp: '兄が無口なのに対して、弟はとてもおしゃべりだ。', vi: 'Trái ngược với anh trai ít nói thì em trai lại rất hay nói.' },
    ],
  },
  {
    pattern: '〜にとって',
    romaji: 'ni totte',
    meaning: 'Đối với (Đứng trên lập trường / quan điểm của...)',
    formation: 'N (người/tổ chức) + にとって',
    explanation: 'Dùng để đưa ra nhận xét, đánh giá đứng từ góc nhìn của chủ thể đó (quan trọng, khó, cần thiết...).',
    trap: 'Đằng sau thường là tính từ đánh giá (大切, 難しい, 必要, 有益).',
    examples: [
      { jp: '留学生にとって、ビザの更新はとても重要な問題だ。', vi: 'Đối với du học sinh, việc gia hạn visa là vấn đề cực kỳ quan trọng.' },
    ],
  },
  {
    pattern: '〜反面',
    romaji: 'hanmen',
    meaning: 'Mặt khác / Ngược lại / Nhưng mặt trái là...',
    formation: 'Thể thông thường (Na な/である / N である) + 反面',
    explanation: 'Diễn tả 2 mặt đối lập tồn tại song song trong cùng một sự vật, hiện tượng.',
    trap: 'Hay gặp trong các bài đọc hiểu N3 về công nghệ, xã hội, cuộc sống hiện đại.',
    examples: [
      { jp: '一人暮らしは自由な反面、寂しさを感じることもある。', vi: 'Sống một mình tự do nhưng mặt khác đôi khi cũng thấy cô đơn.' },
    ],
  },
  {
    pattern: '〜ぎみ',
    romaji: 'gimi',
    meaning: 'Có vẻ / Hơi có triệu chứng... (Cảm giác nhẹ)',
    formation: 'V-masu (bỏ masu) / N + 気味 (ぎみ)',
    explanation: 'Biểu thị cảm giác hơi có chiều hướng hoặc triệu chứng tiêu cực nào đó.',
    trap: 'Phân biệt: 〜ぎみ (triệu chứng tạm thời như 风邪ぎみ - hơi cảm), 〜がち (thường xuyên có xu hướng như 忘れがち - hay quên).',
    examples: [
      { jp: '最近、残業続きで風邪気味だ。', vi: 'Dạo này tăng ca liên tục nên tôi hơi có triệu chứng cảm cúm.' },
    ],
  },
  {
    pattern: '〜がち',
    romaji: 'gachi',
    meaning: 'Thường hay / Dễ có xu hướng... (Thói quen tiêu cực)',
    formation: 'V-masu (bỏ masu) / N + がち',
    explanation: 'Diễn tả một sự việc tiêu cực dễ xảy ra hoặc thường xuyên bị lặp lại.',
    trap: 'Thường đi với: 忘れがち (hay quên), 遠慮しがち (dễ e ngại), 遅れがち (hay trễ).',
    examples: [
      { jp: '一人暮らしだと、野菜不足になりがちだ。', vi: 'Khi sống một mình thì dễ có xu hướng bị thiếu rau củ.' },
    ],
  },
  {
    pattern: '〜っぽい',
    romaji: 'ppoi',
    meaning: 'Hay... / Đậm chất... / Mang nhiều tính chất của...',
    formation: 'N / A-i (bỏ i) / V-masu (bỏ masu) + っぽい',
    explanation: 'Diễn tả cảm giác có nhiều tính chất hoặc khuynh hướng giống như từ đi trước (văn nói).',
    trap: 'Thường dùng trong hội thoại thân mật: 怒りっぽい (dễ nổi nóng), 子どもっぽい (trẻ con).',
    examples: [
      { jp: '彼は怒りっぽい性格だから、気をつけたほうがいい。', vi: 'Anh ấy tính cách dễ nổi nóng nên bạn hãy cẩn thận.' },
    ],
  },
  {
    pattern: '〜わりに（は）',
    romaji: 'wari ni',
    meaning: 'So với... thì khá là... (Bất ngờ so với mức tiêu chuẩn thông thường)',
    formation: 'Thể thông thường (Na な / N の) + わりに(は)',
    explanation: 'Diễn tả sự đánh giá không tương xứng giữa nguyên nhân và kết quả (So với giá thì món này ngon bất ngờ).',
    trap: 'Khác với 〜にしては (thường đi với con số/thời gian cụ thể hoặc đối tượng cụ thể).',
    examples: [
      { jp: 'このレストランは値段のわりに、料理がとても美味しい。', vi: 'Nhà hàng này so với mức giá thì món ăn ngon vượt trội.' },
    ],
  },
];

// Mock Quiz Questions for Interactive Practice
export const MOCK_QUIZ_LIST = [
  {
    question: '健康のために、毎朝ジョギング____にしている。',
    options: ['こと', 'もの', 'よう', 'わけ'],
    correctIndex: 0,
    explanation: '〜ことにしている: Quyết định/thói quen do chính bản thân tự quy định để rèn luyện.',
  },
  {
    question: '天気予報____と、明日の午後は雨が降るそうだ。',
    options: ['によると', 'によって', 'について', 'として'],
    correctIndex: 0,
    explanation: '〜によると: Trích dẫn nguồn thông tin (đi kèm với cấu trúc truyền đạt そうだ/ということだ).',
  },
  {
    question: '彼女がそんなひどいことを言う____がない。きっと誤解だ。',
    options: ['わけ', 'はず', 'つもり', 'とおり'],
    correctIndex: 0,
    explanation: '〜わけがない: Tuyệt đối không thể nào / chắc chắn không có chuyện đó.',
  },
  {
    question: 'お客様____対して、いつも丁寧な言葉遣いを心がけてください。',
    options: ['に', 'を', 'で', 'から'],
    correctIndex: 0,
    explanation: '〜に対して (Ni taishite): Hướng tới đối tượng (khách hàng, cấp trên...).',
  },
  {
    question: 'スープが温かい____、早く召し上がってください。',
    options: ['うちに', 'あいだに', 'までに', 'ながら'],
    correctIndex: 0,
    explanation: '〜うちに: Tranh thủ trong lúc trạng thái tốt còn đang duy trì (súp còn nóng).',
  },
];

// Helper để tìm từ vựng trong 880 từ Mimikara
export function findVocabInMimikara(query: string) {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return null;

  // 1. Exact Kanji / Hiragana Match
  const exact = ALL_880_WORDS.find(
    (w) => w.word === query.trim() || w.reading === query.trim()
  );
  if (exact) return exact;

  // 2. Partial Search in Word, Reading, HanViet, Meaning
  const partial = ALL_880_WORDS.find((w) => {
    const wordMatch = w.word.includes(query.trim());
    const readingMatch = w.reading.includes(query.trim());
    const hanVietMatch = w.hanViet && w.hanViet.toLowerCase().includes(cleanQ);
    const meaningMatch = w.meaning && w.meaning.toLowerCase().includes(cleanQ);
    return wordMatch || readingMatch || hanVietMatch || meaningMatch;
  });

  return partial || null;
}

// Helper tìm điểm ngữ pháp
export function findGrammarPoint(query: string) {
  const cleanQ = query.trim().toLowerCase();
  
  return N3_GRAMMAR_DATABASE.find((g) => {
    const rawPattern = g.pattern.replace(/〜/g, '').trim().toLowerCase();
    return (
      cleanQ.includes(rawPattern) ||
      rawPattern.includes(cleanQ) ||
      cleanQ.includes(g.romaji.toLowerCase()) ||
      cleanQ.includes(g.meaning.toLowerCase())
    );
  });
}

// Bộ xử lý hội thoại N3 Sensei thông minh
export function generateSmartTutorResponse(userMessage: string, history: { role: string; content: string }[] = []): string {
  const msg = userMessage.trim();
  const lower = msg.toLowerCase();

  // 1. CHÀO HỎI & GIỚI THIỆU
  if (
    /^(chào|xin chào|hello|hi|konnichiwa|chào sensei|chào thầy|chào cô|ohayou|hajimemashite)/i.test(lower) ||
    lower.includes('bạn là ai') ||
    lower.includes('giới thiệu')
  ) {
    return `こんにちは！ (Konnichiwa!) Sensei rất vui được đồng hành cùng bạn trên con đường chinh phục JLPT N3! 🌸✨

Tôi có thể hỗ trợ bạn mọi lúc 24/7 về:
1. 📖 **Tra cứu 880 từ vựng Mimikara N3** (nhập từ bất kỳ như *解決, 遠慮, 収穫...*)
2. 🧠 **Giải thích & phân biệt ngữ pháp N3** (nhập *ことにしている, わけがない, おかげで...*)
3. 📝 **Đố vui trắc nghiệm N3** (hãy gõ *"làm bài tập"* hoặc *"đố vui"*)
4. 💡 **Mẹo làm bài Đọc hiểu, Nghe hiểu & Phân bổ thời gian thi**
5. ✍️ **Sửa lỗi câu tiếng Nhật do bạn tự viết**

Hôm nay bạn muốn bắt đầu ôn luyện phần nào trước nào?`;
  }

  // 2. YÊU CẦU ĐỐ VUI / BÀI TẬP TRẮC NGHIỆM
  if (
    lower.includes('đố') ||
    lower.includes('bài tập') ||
    lower.includes('quiz') ||
    lower.includes('trắc nghiệm') ||
    lower.includes('luyện tập') ||
    lower.includes('test') ||
    lower.includes('câu hỏi')
  ) {
    const randomQuiz = MOCK_QUIZ_LIST[Math.floor(Math.random() * MOCK_QUIZ_LIST.length)];
    return `🎯 **Thử thách Trắc nghiệm JLPT N3 dành cho bạn:**

**Câu hỏi:**
👉 「${randomQuiz.question}」

**Các lựa chọn:**
1️⃣ ${randomQuiz.options[0]}
2️⃣ ${randomQuiz.options[1]}
3️⃣ ${randomQuiz.options[2]}
4️⃣ ${randomQuiz.options[3]}

---
*(Gợi ý: Hãy suy nghĩ xem đáp án nào đi đúng với ngữ cảnh nhé! Bạn có thể chọn số 1, 2, 3 hoặc 4 rồi hỏi lại Sensei!)*

✨ **Đáp án đúng:** **Số ${randomQuiz.correctIndex + 1} (${randomQuiz.options[randomQuiz.correctIndex]})**
💡 **Giải thích chi tiết:** ${randomQuiz.explanation}`;
  }

  // 3. MẸO THI / ĐỌC HIỂU / NGHE HIỂU / PHÂN BỔ THỜI GIAN
  if (
    lower.includes('đọc hiểu') ||
    lower.includes('dokkai') ||
    lower.includes('đọc')
  ) {
    return `📚 **Bí quyết săn điểm Đọc hiểu (Dokkai) JLPT N3 từ Sensei:**

1. ⏱️ **Phân bổ thời gian chuẩn:** Bạn có 70 phút cho phần Ngữ pháp + Đọc hiểu. Hãy dành tối đa **45-50 phút cho Đọc hiểu**:
   - Đoản văn (4 bài): 2 - 3 phút/bài
   - Trung văn (2 bài): 6 - 8 phút/bài
   - Trường văn (1 bài): 10 phút
   - Tìm kiếm thông tin: 4 - 5 phút (Nhìn câu hỏi trước, quét từ khóa bảng biểu).
2. 🎯 **Chiến thuật Đọc Đoản/Trung văn:**
   - Đọc kỹ **câu hỏi** và **gạch chân từ khóa** trước khi đọc bài.
   - Chú ý đặc biệt các liên từ chuyển ý: **しかし, だが, ところが, つまり, 要するに**. Tác giả thường gửi gắm thông điệp cốt lõi ngay sau các từ này!
   - Đoạn văn chứa **〜と思う, 〜のではないだろうか** chính là quan điểm của tác giả.`;
  }

  if (
    lower.includes('nghe hiểu') ||
    lower.includes('choukai') ||
    lower.includes('nghe')
  ) {
    return `🎧 **Bí quyết bứt phá Nghe hiểu (Choukai) JLPT N3:**

1. ⚡ **Mondai 1 & 2 (Hiểu nhiệm vụ & trọng điểm):**
   - Đọc lướt nhanh 4 đáp án trong thời gian nghỉ.
   - Tập trung nghe câu hỏi đầu tiên: *"Người phụ nữ/đàn ông sẽ làm gì TIẾP THEO?"* (まず何をするか).
2. ⚡ **Mondai 4 (Ứng đáp nhanh - Trả lời lập tức):**
   - Rất ngắn (chỉ 1 câu chào/hỏi và 3 câu đáp lại).
   - Nắm thật chắc các mẫu kính ngữ, nhờ vả, rủ rê và từ cảm thán (〜てくれない？, 〜ていただけますか？).
3. 🔁 **Luyện Shadowing mỗi ngày:** Hãy bật tính năng **Phòng Thu Shadowing** trong ứng dụng N3 Master AI và nhại lại theo người bản xứ 10 phút mỗi ngày!`;
  }

  if (
    lower.includes('mẹo') ||
    lower.includes('kinh nghiệm') ||
    lower.includes('lộ trình') ||
    lower.includes('thời gian thi') ||
    lower.includes('điểm chuẩn')
  ) {
    return `🏆 **Tổng quan & Chiến lược thi JLPT N3 toàn diện:**

- **Cấu trúc bài thi N3:**
  1. Kiến thức ngôn ngữ (Từ vựng/Kanji): 30 phút (Mục tiêu: 35+ / 60 điểm)
  2. Ngữ pháp & Đọc hiểu: 70 phút (Mục tiêu: 35+ / 60 điểm)
  3. Nghe hiểu: 40 phút (Mục tiêu: 35+ / 60 điểm)
- **Điểm đỗ N3:** Tổng điểm từ **95 / 180** trở lên và **không bị điểm liệt** bất kỳ phần nào (< 19 điểm).
- 💡 **Phương pháp ôn tập hiệu quả nhất:**
  - Ôn từ vựng theo chu kỳ lặp lại ngắt quãng **SRS Flashcard** (20 từ mới + 40 từ ôn/ngày).
  - Làm trọn vẹn 1 đề Mock Exam hàng tuần tại tab **Phòng Thi JLPT** để quen áp lực thời gian!`;
  }

  // 4. ĐỘNG VIÊN / TÂM LÝ KHI HỌC MỆT
  if (
    lower.includes('mệt') ||
    lower.includes('nản') ||
    lower.includes('khó') ||
    lower.includes('lười') ||
    lower.includes('quên') ||
    lower.includes('áp lực') ||
    lower.includes('sợ')
  ) {
    return `💪 **Ganbatte ne! (Cố lên nào bạn ơi!)** 🌸✨

Việc học ngoại ngữ, đặc biệt là lượng Kanji và từ vựng phong phú của N3, việc quên là **hoàn toàn tự nhiên** của não bộ theo đường cong quên lãng Ebbinghaus!

Lời khuyên từ Sensei để vượt qua giai đoạn này:
1. 🧘 **Không cần học quá nhiều một lúc:** Chỉ cần 15-20 phút học tập trung mỗi ngày với Flashcard SRS.
2. 🐕 **Chăm sóc Linh Thú:** Vào trang chính cho Pet cưng ăn Sushi, thư giãn với mini-game Ninja Chém Chữ để vừa chơi vừa nhớ từ.
3. 🌱 Nhớ rằng: *"Học 1 từ hôm nay là bạn đã tiến gần hơn đến tấm bằng N3 một bước!"* 

Hãy thử ôn lại 1 Unit ngắn hoặc hỏi Sensei một câu bất kỳ nhé!`;
  }

  // 5. TRA CỨU ĐIỂM NGỮ PHÁP N3
  const grammarMatch = findGrammarPoint(msg);
  if (grammarMatch) {
    return `📖 **Sensei giải thích Ngữ pháp N3: 【${grammarMatch.pattern}】**

🔹 **Romaji / Cách đọc:** *${grammarMatch.romaji}*
🔹 **Ý nghĩa:** **${grammarMatch.meaning}**
🔹 **Cấu trúc kết hợp:** \`${grammarMatch.formation}\`

📝 **Giải thích chi tiết:**
${grammarMatch.explanation}

⚠️ **Bẫy đề thi JLPT N3 cần lưu ý:**
${grammarMatch.trap}

📌 **Ví dụ minh họa thực tế:**
${grammarMatch.examples.map((ex, i) => `${i + 1}. **${ex.jp}**\n   *(Dịch: ${ex.vi})*`).join('\n')}

---
*Bạn có muốn đặt thử 1 câu với mẫu ngữ pháp này để Sensei sửa giúp không?*`;
  }

  // 6. TRA CỨU TỪ VỰNG TRONG KHO 880 TỪ MIMIKARA N3
  const vocabMatch = findVocabInMimikara(msg);
  if (vocabMatch) {
    return `📇 **Sensei tra cứu Từ vựng Mimikara N3: 【${vocabMatch.word}】**

🔸 **Cách đọc (Furigana):** **${vocabMatch.reading}**
${vocabMatch.hanViet ? `🔸 **Âm Hán Việt:** **${vocabMatch.hanViet}**` : ''}
🔸 **Nghĩa tiếng Việt:** **${vocabMatch.meaning}**
${vocabMatch.kanji && vocabMatch.kanji.length > 0 ? `🔸 **Phân tích Kanji:** ${vocabMatch.kanji.map(k => `${k.kanji} (${k.meaning})`).join(', ')}` : ''}

📌 **Câu ví dụ chuẩn đề thi N3:**
👉 **${vocabMatch.example}**
*(Ví dụ sử dụng thực tế chuẩn giáo trình Mimikara Oboeru)*

💡 **Mẹo ghi nhớ từ vựng:** Hãy tạo Flashcard SRS cho từ này trong bộ thẻ để ôn tập theo chu kỳ ngắt quãng nhé!`;
  }

  // 7. KIỂM TRA / SỬA CÂU TIẾNG NHẬT
  if (
    /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(msg) &&
    (msg.length > 8 || lower.includes('sửa') || lower.includes('đúng không'))
  ) {
    return `✍️ **Nhận xét & Sửa câu tiếng Nhật từ N3 Sensei:**

**Câu của bạn:** 「${msg}」

✨ **Đánh giá sơ bộ:**
- Câu có ý tứ rõ ràng và bám sát ngữ cảnh giao tiếp.
- Để diễn đạt tự nhiên hơn theo phong cách JLPT N3, bạn nên chú ý sự kết hợp trợ từ và thể lịch sự/thể thông thường thống nhất.

💡 **Gợi ý hoàn thiện:**
- Nếu là văn viết trang trọng: Chú ý kết thúc bằng **です / ます** hoặc dạng **である** tuỳ thể loại bài viết.
- Hãy chú ý trợ từ **は / が / を / に** để làm nổi bật chủ ngữ hoặc đối tượng tiếp nhận hành động!

*Bạn muốn Sensei giải thích thêm về trợ từ hay từ vựng nào trong câu này không?*`;
  }

  // 8. TỔNG HỢP LINH HOẠT CHO CÁC CÂU HỎI KHÁC
  return `こんにちは！ Sensei đã nhận được câu hỏi của bạn: **"${msg}"**.

Để học tốt phần này trong kỳ thi JLPT N3, bạn nên lưu ý:
1. 🎯 **Từ vựng & Kanji:** Nắm chắc các từ đồng nghĩa, từ trái nghĩa và cách đọc âm On/Kun thông dụng.
2. 🧩 **Cấu trúc ngữ pháp liên quan:** Kết nối các cấu trúc chỉ nguyên nhân (〜おかげで, 〜せいで), mục đích (〜ように, 〜ために) hoặc điều kiện (〜ば, 〜なら, 〜たら).
3. ⚡ **Luyện tập hàng ngày:** Hãy làm đều đặn 10-15 câu trắc nghiệm mỗi ngày để tạo phản xạ nhanh.

💡 **Bạn muốn Sensei hướng dẫn chi tiết thêm về:**
- Tra cứu một từ vựng / Kanji cụ thể
- Giải thích một mẫu ngữ pháp N3 bất kỳ
- Thử sức với một câu đố trắc nghiệm N3?`;
}
