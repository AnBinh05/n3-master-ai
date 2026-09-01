// Dữ liệu & Cấu trúc cho phân hệ Luyện Đọc Hiểu N3 Chuyên Sâu (Dokkai Master)
// Thiết kế đặc biệt cho người học còn yếu / mất gốc đọc hiểu với phương pháp Scaffolding (Trợ lực từng bước)

export type DokkaiLevel = 'warmup' | 'short' | 'medium' | 'info_retrieval';

export interface PreReadingVocab {
  word: string;
  reading: string;
  hanViet?: string;
  meaning: string;
  note?: string;
}

export interface SentenceAnalysis {
  sentenceIndex: number;
  jp: string;
  furiganaHtml?: string;
  vi: string;
  subject?: string;      // Chủ ngữ chính (が / は)
  predicate?: string;    // Vị ngữ / Động từ cốt lõi
  connector?: string;    // Từ nối (Tuyệt chiêu bẻ khóa: しかし, だから, つまり...)
  connectorNote?: string;// Ý nghĩa chiến thuật của từ nối
  isClue?: boolean;      // Câu văn này có chứa manh mối trả lời câu hỏi hay không
}

export interface DokkaiQuestion {
  id: number;
  question: string;
  options: string[]; // 4 lựa chọn (1, 2, 3, 4)
  correctIndex: number; // 0..3
  explanation: string;
  trapAnalysis: {
    optionIndex: number;
    reason: string;
  }[];
  clueSentenceIndices: number[]; // Index của các câu trong sentenceBreakdown chứa đáp án
  tacticalHint: string; // Gợi ý chiến thuật làm nhanh cho người yếu
}

export interface DokkaiPassage {
  id: string;
  title: string;
  level: DokkaiLevel;
  levelLabel: string;
  category: string; // Đời sống, Công việc, Văn hóa, Thông báo, Tâm lý/Khoa học
  badgeColor: string;
  estimatedMinutes: number;
  targetSkill: string; // Kỹ năng rèn luyện chính: Tìm đại từ chỉ thị, Ý chính tác giả, Lọc bẫy điều kiện...
  plainPassage: string;
  furiganaPassage: string;
  sentenceBreakdown: SentenceAnalysis[];
  preReadingVocab: PreReadingVocab[];
  grammarNotes: string[];
  questions: DokkaiQuestion[];
  isAiGenerated?: boolean;
}

// BỘ CẨM NANG CHIẾN THUẬT DOKKAI DÀNH CHO NGƯỜI CÒN YẾU
export interface DokkaiStrategy {
  id: string;
  title: string;
  icon: string;
  summary: string;
  goldenRule: string;
  keySignals: { keyword: string; meaning: string; action: string }[];
  examplePassage: string;
  analysisGuide: string;
}

export const DOKKAI_STRATEGIES: DokkaiStrategy[] = [
  {
    id: 'indicators',
    title: 'Bí kíp 1: Phá giải Chỉ từ (これ・それ・あれ・その)',
    icon: '🎯',
    summary: 'Chỉ từ thường hỏi về một nội dung vừa được nhắc đến ngay trước đó.',
    goldenRule: 'Khi gặp câu hỏi 「これ」hay「そのこと」chỉ cái gì, hãy quét mắt đọc NGAY 1 ĐẾN 2 CÂU ĐỨNG TRƯỚC nó!',
    keySignals: [
      { keyword: 'これ / この+N', meaning: 'Cái này', action: 'Chỉ sự vật, ý tưởng của người nói vừa nêu ngay câu trước.' },
      { keyword: 'それ / その+N', meaning: 'Cái đó', action: 'Chỉ điều đối phương vừa nói hoặc điều đã nhắc trong đoạn trước.' },
      { keyword: 'あれ / あの+N', meaning: 'Cái kia', action: 'Chỉ tri thức, sự việc mà cả 2 bên đều đã biết từ trước.' },
      { keyword: 'そう (そう思う / そうする)', meaning: 'Như thế', action: 'Thay thế cho toàn bộ hành động hoặc vế câu đứng trước.' },
    ],
    examplePassage: `多くの人は毎朝コーヒーを飲む。**これ**によって頭がすっきりし、仕事の能率が上がるからだ。
    
❓ Hỏi:「これ」ở đây chỉ điều gì?
💡 Đáp án: Chính là việc "uống cà phê mỗi sáng" (毎朝コーヒーを飲むこと).`,
    analysisGuide: 'Thay thế cụm từ ở các đáp án vào vị trí của chỉ từ xem câu có tạo thành nghĩa hợp lý không.',
  },
  {
    id: 'contrast-connectors',
    title: 'Bí kíp 2: Bắt mạch Liên từ đảo chiều (Sau しかし luôn là Ý TÁC GIẢ)',
    icon: '⚡',
    summary: 'Tác giả thường mượn ý kiến số đông ở đầu đoạn, rồi dùng liên từ đảo chiều để nêu quan điểm thật của mình.',
    goldenRule: 'Đoạn trước しかし chỉ là nền. Quan điểm CỐT LÕI và ĐÁP ÁN ĐÚNG luôn nằm NGAY SAU: しかし, だが, けれども, ところが!',
    keySignals: [
      { keyword: 'しかし / だが / けれども', meaning: 'Tuy nhiên / Nhưng', action: 'Tác giả lật lại vấn đề. Ý chính bắt đầu từ đây.' },
      { keyword: 'つまり / 要するに', meaning: 'Tóm lại / Nói cách khác', action: 'Câu đúc kết toàn bộ tư tưởng của bài đọc.' },
      { keyword: '実は / 本当は', meaning: 'Thực ra thì...', action: 'Tiết lộ sự thật bất ngờ, thường là đáp án câu hỏi.' },
      { keyword: '一方 / それに対して', meaning: 'Mặt khác / Ngược lại', action: 'Dấu hiệu so sánh giữa 2 đối tượng A và B.' },
    ],
    examplePassage: `最近はスマホで本を読む人が増えている。便利だという意見も多い。**しかし、私は紙の本を手にとってページをめくる時間こそ大切だと思う。**

❓ Hỏi: Tác giả muốn nói điều gì nhất?
💡 Đáp án: Tác giả coi trọng việc đọc sách giấy truyền thống (sau chữ しかし).`,
    analysisGuide: 'Khi thời gian làm bài gần hết, hãy lướt nhanh tìm chữ しかし/だが và đọc kỹ câu đó để chọn đáp án!',
  },
  {
    id: 'author-opinion',
    title: 'Bí kíp 3: Nhận diện Dấu hiệu Quan điểm Tác giả',
    icon: '💡',
    summary: 'Đề thi N3 luôn hỏi: "Tác giả muốn truyền tải điều gì nhất qua bài viết?"',
    goldenRule: 'Tìm các đuôi câu thể hiện suy nghĩ chủ quan của người viết (thường ở cuối bài hoặc cuối đoạn văn).',
    keySignals: [
      { keyword: '〜のではないだろうか / 〜のではないか', meaning: 'Chẳng phải là... hay sao?', action: 'Cách tác giả khẳng định quan điểm mạnh mẽ một cách lịch sự.' },
      { keyword: '〜と思う / 〜と考える', meaning: 'Tôi nghĩ là...', action: 'Khẳng định trực tiếp ý kiến bản thân.' },
      { keyword: '〜べきだ / 〜てはいけない', meaning: 'Nên / Không được làm...', action: 'Lời khuyên, lập trường dứt khoát của tác giả.' },
      { keyword: '〜に違いない / 〜はずだ', meaning: 'Chắc chắn là...', action: 'Sự suy đoán với độ chắc chắn cao của tác giả.' },
    ],
    examplePassage: `忙しい毎日だが、1日に10分でも自分の好きなことをする時間を持つべき**ではないだろうか**。

💡 Tác giả muốn khuyên: Dù bận rộn cũng nên dành 10 phút mỗi ngày cho sở thích của mình.`,
    analysisGuide: 'Những đáp án dùng từ tuyệt đối như ぜんぶ, かならず, けっして thường là đáp án sai bẫy.',
  },
  {
    id: 'info-retrieval',
    title: 'Bí kíp 4: Chiến thuật Mondai 13 (Tìm kiếm thông tin siêu tốc)',
    icon: '📋',
    summary: 'Mondai 13 (Tờ rơi, bảng giá, thông báo) KHÔNG CẦN đọc hết cả bài từ đầu đến cuối.',
    goldenRule: 'Bước 1: Đọc câu hỏi -> Bước 2: Xác định điều kiện của người hỏi -> Bước 3: Dò bảng biểu & Đọc kỹ các ghi chú hoa thị (※)!',
    keySignals: [
      { keyword: '※ / （注）/ 注意', meaning: 'Lưu ý / Chú ý', action: 'Bẫy đề thi 90% nằm ở các dòng chữ nhỏ có dấu ※ ở cuối bảng!' },
      { keyword: '〜以上 / 〜以下 / 〜未満', meaning: 'Trên / Dưới / Chưa đủ', action: 'Kiểm tra kỹ độ tuổi, số người, số tiền điều kiện.' },
      { keyword: '〜を除く / 〜のみ / 〜に限る', meaning: 'Ngoại trừ / Chỉ dành riêng cho...', action: 'Điều kiện loại trừ.' },
      { keyword: '締切 / 申込期間', meaning: 'Hạn chót / Thời hạn đăng ký', action: 'Kiểm tra ngày tháng năm.' },
    ],
    examplePassage: `【Thư viện thành phố】
- Mượn sách: Tối đa 5 cuốn (Miễn phí)
- Người ngoài thành phố: Phí 500 yên
※ Chú ý: Học sinh - sinh viên ngoài thành phố được miễn phí nếu xuất trình thẻ học sinh.`,
    analysisGuide: 'Người học yếu chỉ cần khoanh vùng đúng dòng có điều kiện là lấy trọn điểm phần này!',
  },
  {
    id: 'trap-elimination',
    title: 'Bí kíp 5: Kỹ năng Loại trừ 3 dạng Đáp án Bẫy',
    icon: '🛡️',
    summary: 'Nếu không chắc đáp án đúng, hãy loại trừ 3 đáp án sai để nâng tỷ lệ đúng lên 100%.',
    goldenRule: 'Bẫy 1: Quá tuyệt đối | Bẫy 2: Không được nhắc đến trong bài | Bẫy 3: Ngược nghĩa hoàn toàn.',
    keySignals: [
      { keyword: 'Bẫy 1: Từ tuyệt đối', meaning: '必ず, 絶対に, すべて, 一切〜ない', action: 'Văn phong Nhật Bản hiếm khi tuyệt đối. 90% các câu chứa từ này là bẫy.' },
      { keyword: 'Bẫy 2: Tự suy diễn', meaning: 'Nội dung nghe có vẻ đúng trong thực tế nhưng bài đọc KHÔNG HỀ VIẾT', action: 'Chỉ dựa vào dữ liệu trong bài, không dùng kiến thức cá nhân suy diễn.' },
      { keyword: 'Bẫy 3: Đảo lộn chủ - vị', meaning: 'Người A làm nhưng đáp án ghi người B làm', action: 'Kiểm tra kỹ trợ từ は / が / に.' },
    ],
    examplePassage: `Trong bài ghi: "Nhiều người trẻ thích làm việc tại nhà." -> Đáp án bẫy: "Tất cả mọi người đều ghét đến công ty." (Sai vì có từ 'tất cả').`,
    analysisGuide: 'Gạch bỏ ngay các đáp án có từ tuyệt đối hoặc sai nhân vật chính.',
  },
];

// DANH SÁCH BÀI ĐỌC MẪU N3 CHUẨN ĐƯỢC THIẾT KẾ ĐẶC BIỆT CHO NGƯỜI CÒN YẾU
export const PRESET_DOKKAI_PASSAGES: DokkaiPassage[] = [
  // ==========================================
  // LEVEL 1: KHỞI ĐỘNG / ĐOẠN SIÊU NGẮN (MICRO-READING)
  // ==========================================
  {
    id: 'dokkai_warmup_1',
    title: '1. Thói quen buổi sáng & Cà phê (Bắt ý Chỉ từ)',
    level: 'warmup',
    levelLabel: 'Khởi động (Siêu ngắn)',
    category: 'Đời sống',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    estimatedMinutes: 2,
    targetSkill: 'Kỹ năng xác định Đại từ chỉ thị 「これ」',
    plainPassage: `私は毎朝、仕事に行く前に必ず温かいコーヒーを飲むことにしている。これによって、眠気がとれて頭がすっきりし、午前中の作業を集中して進めることができるからだ。`,
    furiganaPassage: `<ruby>私<rt>わたし</rt></ruby>は<ruby>毎朝<rt>まいあさ</rt></ruby>、<ruby>仕事<rt>しごと</rt></ruby>に<ruby>行<rt>い</rt></ruby>く<ruby>前<rt>まえ</rt></ruby>に<ruby>必<rt>かなら</rt></ruby>ず<ruby>温<rt>あたた</rt></ruby>かいコーヒーを<ruby>飲<rt>の</rt></ruby>むことにしている。<span class="bg-amber-400/30 px-1 rounded font-bold text-amber-600">これ</span>によって、<ruby>眠気<rt>ねむけ</rt></ruby>がとれて<ruby>頭<rt>あたま</rt></ruby>がすっきりし、<ruby>午前中<rt>ごぜんちゅう</rt></ruby>の<ruby>作業<rt>さぎょう</rt></ruby>を<ruby>集中<rt>しゅうちゅう</rt></ruby>して<ruby>進<rt>すす</rt></ruby>めることができるからだ。`,
    preReadingVocab: [
      { word: '眠気', reading: 'ねむけ', hanViet: 'Miên khí', meaning: 'Cơn buồn ngủ' },
      { word: 'すっきり', reading: 'sukkiri', meaning: 'Sảng khoái, tỉnh táo, nhẹ nhõm' },
      { word: '作業', reading: 'さぎょう', hanViet: 'Tác nghiệp', meaning: 'Công việc, thao tác' },
      { word: '集中する', reading: 'しゅうちゅうする', hanViet: 'Tập trung', meaning: 'Tập trung cao độ' },
    ],
    grammarNotes: [
      'V-ru + ことにしている: Thói quen / Quyết định do bản thân tự đặt ra.',
      '〜によって: Do / Nhờ có / Bằng cách...',
    ],
    sentenceBreakdown: [
      {
        sentenceIndex: 0,
        jp: '私は毎朝、仕事に行く前に必ず温かいコーヒーを飲むことにしている。',
        vi: 'Tôi tự đặt thói quen mỗi sáng trước khi đi làm nhất định phải uống một tách cà phê ấm.',
        subject: '私は (Tôi)',
        predicate: '飲むことにしている (Đặt thói quen uống)',
        connector: '前に (Trước khi)',
        isClue: true,
      },
      {
        sentenceIndex: 1,
        jp: 'これによって、眠気がとれて頭がすっきりし、午前中の作業を集中して進めることができるからだ。',
        vi: 'Bởi vì nhờ việc này, cơn buồn ngủ tan biến, đầu óc trở nên tỉnh táo và tôi có thể tập trung tiến hành công việc buổi sáng.',
        subject: '眠気が (Cơn buồn ngủ)',
        predicate: '進めることができるからだ (Vì có thể tiến hành...)',
        connector: 'これによって (Nhờ việc này)',
        connectorNote: '「これ」ở đây thay thế cho hành động vừa được nêu ở câu số 0.',
        isClue: true,
      },
    ],
    questions: [
      {
        id: 1,
        question: '「これ」は何を指していますか。(「これ」ở đây chỉ điều gì?)',
        options: [
          '毎朝温かいコーヒーを飲むこと (Việc mỗi sáng uống cà phê ấm)',
          '午前中に集中して作業を進めること (Việc tập trung làm việc buổi sáng)',
          '毎朝早く仕事に行くこと (Việc mỗi sáng đi làm sớm)',
          '頭をすっきりさせること (Việc làm cho đầu óc tỉnh táo)',
        ],
        correctIndex: 0,
        explanation: 'Áp dụng Bí kíp 1: 「これ」nằm ở đầu câu thứ 2, thay thế cho toàn bộ hành động ở câu thứ 1 ngay trước đó: "mỗi sáng trước khi đi làm nhất định uống cà phê ấm".',
        trapAnalysis: [
          { optionIndex: 1, reason: 'Đây là KẾT QUẢ sau khi uống cà phê, không phải là đối tượng mà 「これ」thay thế.' },
          { optionIndex: 2, reason: 'Trong bài chỉ nói đi làm, không hề nói "đi làm sớm" (tự suy diễn bẫy).' },
          { optionIndex: 3, reason: 'Đây cũng là kết quả/trạng thái sau khi uống cà phê.' },
        ],
        clueSentenceIndices: [0],
        tacticalHint: 'Hãy nhìn câu văn số 0 ngay trước chữ 「これによって」!',
      },
    ],
  },
  {
    id: 'dokkai_warmup_2',
    title: '2. Mua sắm trực tuyến (Bắt mạch Liên từ Tuy nhiên)',
    level: 'warmup',
    levelLabel: 'Khởi động (Siêu ngắn)',
    category: 'Đời sống',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    estimatedMinutes: 2,
    targetSkill: 'Kỹ năng bắt mạch Liên từ đảo chiều 「しかし」',
    plainPassage: `インターネットでの買い物は、店に行かなくても欲しいものが手に入るので非常に便利だ。しかし、実物を直接見ることができないため、届いた商品のサイズや色が思っていたものと違うという失敗も少なくない。`,
    furiganaPassage: `インターネットでの<ruby>買<rt>か</rt></ruby>い<ruby>物<rt>もの</rt></ruby>は、<ruby>店<rt>みせ</rt></ruby>に<ruby>行<rt>い</rt></ruby>かなくても<ruby>欲<rt>ほ</rt></ruby>しいものが<ruby>手<rt>て</rt></ruby>に<ruby>入<rt>はい</rt></ruby>るので<ruby>非常<rt>ひじょう</rt></ruby>に<ruby>便利<rt>べんり</rt></ruby>だ。<span class="bg-rose-400/30 px-1 rounded font-bold text-rose-600">しかし</span>、<ruby>実物<rt>じつぶつ</rt></ruby>を<ruby>直接<rt>ちょくせつ</rt></ruby><ruby>見<rt>み</rt></ruby>ることができないため、<ruby>届<rt>とど</rt></ruby>いた<ruby>商品<rt>しょうひん</rt></ruby>のサイズや<ruby>色<rt>いろ</rt></ruby>が<ruby>思<rt>おも</rt></ruby>っていたものと<ruby>違<rt>ちが</rt></ruby>うという<ruby>失敗<rt>しっぱい</rt></ruby>も<ruby>少<rt>すく</rt></ruby>なくない。`,
    preReadingVocab: [
      { word: '手に入る', reading: 'てにはいる', meaning: 'Có được, sở hữu được trong tay' },
      { word: '実物', reading: 'じつぶつ', hanViet: 'Thực vật', meaning: 'Hàng thật, đồ thật ngoài đời' },
      { word: '直接', reading: 'ちょくせつ', hanViet: 'Trực tiếp', meaning: 'Trực tiếp, tận mắt' },
      { word: '少なくない', reading: 'すくなくない', meaning: 'Không hề ít (nghĩa là khá nhiều)' },
    ],
    grammarNotes: [
      'V-なくても: Dù không cần làm V...',
      '〜ため: Do / Vì (nguyên nhân, lý do)',
      '〜少なくない: Không ít (cách nói khẳng định gián tiếp)',
    ],
    sentenceBreakdown: [
      {
        sentenceIndex: 0,
        jp: 'インターネットでの買い物は、店に行かなくても欲しいものが手に入るので非常に便利だ。',
        vi: 'Mua sắm qua mạng rất tiện lợi vì không cần đến cửa hàng cũng có được món đồ mình muốn.',
        subject: 'インターネットでの買い物は (Mua sắm qua mạng)',
        predicate: '非常に便利だ (Rất là tiện lợi)',
        connector: '〜ので (Bởi vì)',
      },
      {
        sentenceIndex: 1,
        jp: 'しかし、実物を直接見ることができないため、届いた商品のサイズや色が思っていたものと違うという失敗も少なくない。',
        vi: 'Tuy nhiên, do không thể xem trực tiếp sản phẩm thật, nên những thất bại như kích thước hay màu sắc của món hàng khi nhận khác với tưởng tượng cũng không hề ít.',
        subject: '失敗も (Những thất bại cũng...)',
        predicate: '少なくない (Không hề ít)',
        connector: 'しかし (Tuy nhiên)',
        connectorNote: 'Sau しかし chính là điểm tác giả muốn cảnh báo người đọc.',
        isClue: true,
      },
    ],
    questions: [
      {
        id: 1,
        question: 'ネットショッピングについて、筆者はどのように述べていますか。(Tác giả nói điều gì về việc mua sắm trực tuyến?)',
        options: [
          '便利だが、実物を見られないので失敗することもある (Tiện lợi nhưng vì không được xem đồ thật nên cũng có lúc gặp thất bại)',
          '失敗が多いので、インターネットで買い物をするべきではない (Vì nhiều thất bại nên không nên mua hàng qua mạng)',
          '店に行くより常に実物通りの商品が届く (Lúc nào cũng nhận được hàng chuẩn hơn là đến cửa hàng)',
          '商品のサイズや色を自由に選ぶことができない (Không thể tự do lựa chọn màu sắc kích thước hàng hóa)',
        ],
        correctIndex: 0,
        explanation: 'Áp dụng Bí kíp 2: Tác giả thừa nhận ưu điểm tiện lợi ở câu 1, nhưng sau「しかし」ở câu 2 nhấn mạnh việc không xem được đồ thật nên không ít lần thất bại.',
        trapAnalysis: [
          { optionIndex: 1, reason: 'Bẫy quá tiêu cực: Tác giả không hề bảo "không nên mua hàng qua mạng" (chỉ nêu lưu ý).' },
          { optionIndex: 2, reason: 'Trái ngược hoàn toàn với ý trong bài.' },
          { optionIndex: 3, reason: 'Sai nghĩa: người mua vẫn chọn được nhưng khi hàng về có thể khác suy nghĩ.' },
        ],
        clueSentenceIndices: [1],
        tacticalHint: 'Đọc kỹ câu số 1 ngay sau liên từ 「しかし」!',
      },
    ],
  },

  // ==========================================
  // LEVEL 2: ĐOẢN VĂN N3 (SHORT PASSAGES - MONDAI 10)
  // ==========================================
  {
    id: 'dokkai_short_1',
    title: '3. Email thông báo đổi lịch họp công ty (Mondai 10)',
    level: 'short',
    levelLabel: 'Đoản văn (Mondai 10)',
    category: 'Công việc',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    estimatedMinutes: 3,
    targetSkill: 'Kỹ năng đọc hiểu Email công việc & Tìm kiếm nguyên nhân - chỉ thị',
    plainPassage: `社員の皆様へ
お疲れ様です。総務部の田中です。
明日（10月15日）の午後2時から予定しておりました「新企画会議」ですが、担当部長の急な出張のため、開始時間を【午後4時】に変更させていただきます。場所は第3会議室のままで変更ありません。
急な変更で大変ご迷惑をおかけしますが、ご都合がつかない方は本日中に田中までメールでご連絡ください。`,
    furiganaPassage: `<ruby>社員<rt>しゃいん</rt></ruby>の<ruby>皆様<rt>みなさま</rt></ruby>へ
お<ruby>疲<rt>つか</rt></ruby>れ<ruby>様<rt>さま</rt></ruby>です。<ruby>総務部<rt>そうむぶ</rt></ruby>の<ruby>田中<rt>たなか</rt></ruby>です。
<ruby>明日<rt>あす</rt></ruby>（10<ruby>月<rt>がつ</rt></ruby>15<ruby>日<rt>にち</rt></ruby>）の<ruby>午後<rt>ごご</rt></ruby>2<ruby>時<rt>じ</rt></ruby>から<ruby>予定<rt>よてい</rt></ruby>しておりました「<ruby>新企画会議<rt>しんきかくかいぎ</rt></ruby>」ですが、<span class="bg-amber-400/30 px-1 rounded font-bold">担当部長の急な出張のため</span>、<ruby>開始時間<rt>かいしじかん</rt></ruby>を<span class="bg-rose-400/30 px-1 rounded font-bold text-rose-600">【午後4時】に変更</span>させていただきます。<ruby>場所<rt>ばしょ</rt></ruby>は<ruby>第<rt>だい</rt></ruby>3<ruby>会議室<rt>かいぎしつ</rt></ruby>のままで<ruby>変更<rt>へんこう</rt></ruby>ありません。
<ruby>急<rt>きゅう</rt></ruby>な<ruby>変更<rt>へんこう</rt></ruby>で<ruby>大変<rt>たいへん</rt></ruby>ご<ruby>迷惑<rt>めいわく</rt></ruby>をおかけしますが、<ruby>都合<rt>つごう</rt></ruby>がつかない<ruby>方<rt>かた</rt></ruby>は<ruby>本日中<rt>ほんじつちゅう</rt></ruby>に<ruby>田中<rt>たなか</rt></ruby>までメールでご<ruby>連絡<rt>れんらく</rt></ruby>ください。`,
    preReadingVocab: [
      { word: '総務部', reading: 'そうむぶ', hanViet: 'Tổng vụ bộ', meaning: 'Phòng Hành chính Tổng hợp' },
      { word: '新企画', reading: 'しんきかく', hanViet: 'Tân xí hoạch', meaning: 'Kế hoạch mới, dự án mới' },
      { word: '急な出張', reading: 'きゅうなしゅっちょう', meaning: 'Chuyến công tác đột xuất' },
      { word: '都合がつかない', reading: 'つごうがつかない', meaning: 'Không sắp xếp được thời gian, bị bận' },
      { word: '本日中', reading: 'ほんじつちゅう', meaning: 'Trong ngày hôm nay' },
    ],
    grammarNotes: [
      '〜予定しておりました: Chúng tôi đã từng dự định... (kính ngữ khiêm nhường)',
      '〜させていただきます: Cho phép chúng tôi xin được... (kính ngữ N3 hay gặp)',
      '〜のままで: Giữ nguyên trạng thái như...',
    ],
    sentenceBreakdown: [
      {
        sentenceIndex: 0,
        jp: '明日（10月15日）の午後2時から予定しておりました「新企画会議」ですが、担当部長の急な出張のため、開始時間を【午後4時】に変更させていただきます。',
        vi: 'Về cuộc họp Kế hoạch mới dự kiến diễn ra lúc 2h chiều ngày mai (15/10), do Trưởng phòng phụ trách có chuyến công tác đột xuất nên chúng tôi xin phép dời giờ bắt đầu sang [4h chiều].',
        subject: '開始時間を (Giờ bắt đầu)',
        predicate: '変更させていただきます (Xin phép đổi)',
        connector: '〜のため (Do/Vì)',
        connectorNote: 'Chỉ lý do thay đổi là "Trưởng phòng phụ trách đi công tác đột xuất".',
        isClue: true,
      },
      {
        sentenceIndex: 1,
        jp: '場所は第3会議室のままで変更ありません。',
        vi: 'Địa điểm vẫn giữ nguyên tại Phòng họp số 3, không thay đổi.',
        subject: '場所は (Địa điểm)',
        predicate: '変更ありません (Không đổi)',
      },
      {
        sentenceIndex: 2,
        jp: '急な変更で大変ご迷惑をおかけしますが、ご都合がつかない方は本日中に田中までメールでご連絡ください。',
        vi: 'Rất xin lỗi vì sự thay đổi gấp này, những ai không sắp xếp tham gia được vui lòng liên hệ email cho anh Tanaka trong ngày hôm nay.',
        subject: 'ご都合がつかない方は (Những ai bận)',
        predicate: 'ご連絡ください (Hãy liên lạc)',
        isClue: true,
      },
    ],
    questions: [
      {
        id: 1,
        question: '会議の変更点について、正しいものはどれですか。(Điều nào sau đây là đúng về thay đổi của cuộc họp?)',
        options: [
          '場所も時間も変更された (Cả địa điểm và thời gian đều bị thay đổi)',
          '時間は午後4時からになり、場所は変わらない (Thời gian chuyển sang 4h chiều, địa điểm không đổi)',
          '担当部長が来られないので、会議は中止になった (Vì Trưởng phòng không tới nên cuộc họp bị hủy)',
          '会議に参加する人は全員、本日中にメールを送らなければならない (Tất cả người tham gia đều phải gửi email trong hôm nay)',
        ],
        correctIndex: 1,
        explanation: 'Trong bài ghi rõ: "開始時間を午後4時に変更" (Đổi sang 4h chiều) và "場所は第3会議室のままで変更ありません" (Địa điểm giữ nguyên không đổi).',
        trapAnalysis: [
          { optionIndex: 0, reason: 'Địa điểm không đổi (Phòng họp 3).' },
          { optionIndex: 2, reason: 'Cuộc họp chỉ dời giờ chứ không bị hủy (中止).' },
          { optionIndex: 3, reason: 'Bẫy từ "toàn bộ": Chỉ những ai KHÔNG tham gia được (都合がつかない方) mới cần gửi email.' },
        ],
        clueSentenceIndices: [0, 1],
        tacticalHint: 'Đối chiếu dòng thông báo giờ mới và câu nói về địa điểm họp!',
      },
    ],
  },
  {
    id: 'dokkai_short_2',
    title: '4. Lời khen và động lực học tập (Mondai 10)',
    level: 'short',
    levelLabel: 'Đoản văn (Mondai 10)',
    category: 'Tâm lý & Đời sống',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    estimatedMinutes: 3,
    targetSkill: 'Nhận biết Quan điểm người viết qua mẫu câu 「〜のではないか」',
    plainPassage: `子どもを育てる時、叱るよりも褒めたほうがやる気が出るとよく言われる。確かに褒められると誰でも嬉しいものだ。しかし、ただ何でも褒めればいいというわけではない。結果だけではなく、努力したプロセスを認めて褒めることこそが、子どもの本当の自信につながるのではないだろうか。`,
    furiganaPassage: `<ruby>子<rt>こ</rt></ruby>どもを<ruby>育<rt>そだ</rt></ruby>てる<ruby>時<rt>とき</rt></ruby>、<ruby>叱<rt>しか</rt></ruby>るよりも<ruby>褒<rt>ほ</rt></ruby>めたほうがやる<ruby>気<rt>き</rt></ruby>が<ruby>出<rt>で</rt></ruby>るとよく<ruby>言<rt>い</rt></ruby>われる。<ruby>確<rt>たし</rt></ruby>かに<ruby>褒<rt>ほ</rt></ruby>められると<ruby>誰<rt>だれ</rt></ruby>でも<ruby>嬉<rt>うれ</rt></ruby>しいものだ。<span class="bg-rose-400/30 px-1 rounded font-bold text-rose-600">しかし</span>、ただ<ruby>何<rt>なん</rt></ruby>でも<ruby>褒<rt>ほ</rt></ruby>めればいいというわけではない。<span class="bg-amber-400/30 px-1 rounded font-bold text-amber-600">結果だけではなく、努力したプロセスを認めて褒めることこそが、子どもの本当の自信につながるのではないだろうか。</span>`,
    preReadingVocab: [
      { word: '叱る', reading: 'しかる', hanViet: 'Sất', meaning: 'La mắng, trách phạt' },
      { word: '褒める', reading: 'ほめる', hanViet: 'Bao', meaning: 'Khen ngợi, tán thưởng' },
      { word: 'やる気', reading: 'やるき', meaning: 'Động lực, sự hứng thú làm việc' },
      { word: 'プロセス', reading: 'purosesu', meaning: 'Quá trình, tiến trình (Process)' },
      { word: '自信', reading: 'じしん', hanViet: 'Tự tín', meaning: 'Sự tự tin' },
    ],
    grammarNotes: [
      '〜というわけではない: Không hẳn là / Không có nghĩa là...',
      'N + だけではなく: Không chỉ N mà còn...',
      'N + こそ: Chính N...',
      '〜のではないだろうか: Chẳng phải là... hay sao? (Bí kíp 3: Ý tác giả)',
    ],
    sentenceBreakdown: [
      {
        sentenceIndex: 0,
        jp: '子どもを育てる時、叱るよりも褒めたほうがやる気が出るとよく言われる。',
        vi: 'Khi nuôi dạy con cái, người ta thường nói rằng khen ngợi sẽ tạo ra nhiều động lực hơn là la mắng.',
        subject: '褒めたほうが (Việc khen ngợi)',
        predicate: 'よく言われる (Thường được nói)',
      },
      {
        sentenceIndex: 1,
        jp: '確かに褒められると誰でも嬉しいものだ。',
        vi: 'Đúng là khi được khen thì ai cũng vui mừng.',
        subject: '誰でも (Bất kỳ ai)',
        predicate: '嬉しいものだ (Là điều đương nhiên vui)',
        connector: '確かに (Quả thật/Đúng là)',
      },
      {
        sentenceIndex: 2,
        jp: 'しかし、ただ何でも褒めればいいというわけではない。',
        vi: 'Tuy nhiên, không hẳn là cứ khen bừa bất cứ thứ gì là tốt.',
        connector: 'しかし (Tuy nhiên)',
        connectorNote: 'Bắt đầu lật lại quan điểm thông thường.',
      },
      {
        sentenceIndex: 3,
        jp: '結果だけではなく、努力したプロセスを認めて褒めることこそが、子どもの本当の自信につながるのではないだろうか。',
        vi: 'Chẳng phải chính việc công nhận và khen ngợi quá trình nỗ lực chứ không chỉ kết quả mới đem lại sự tự tin thực sự cho đứa trẻ hay sao?',
        subject: '褒めることこそが (Chính việc khen...)',
        predicate: 'つながるのではないだろうか (Chẳng phải sẽ dẫn tới... hay sao)',
        connector: 'のではないだろうか (Ý tác giả khẳng định)',
        isClue: true,
      },
    ],
    questions: [
      {
        id: 1,
        question: '筆者が最も伝えたいことは何ですか。(Điều tác giả muốn truyền đạt nhất là gì?)',
        options: [
          '子どもは絶対に叱らず、どんなことでも褒めるべきだ (Tuyệt đối không mắng mà nên khen trẻ mọi điều)',
          '結果が出た時だけ褒めることで、やる気が高まる (Chỉ khi có kết quả mới khen thì động lực mới tăng)',
          '結果だけでなく、努力した過程を認めて褒めることが大切だ (Quan trọng là công nhận và khen ngợi cả quá trình nỗ lực chứ không chỉ kết quả)',
          '褒められても子どもは自信を持てない (Dù có được khen thì trẻ cũng không có được tự tin)',
        ],
        correctIndex: 2,
        explanation: 'Áp dụng Bí kíp 2 & 3: Tác giả nhấn mạnh ở câu cuối cùng mang đuôi 「〜のではないだろうか」rằng "công nhận và khen ngợi cả quá trình nỗ lực (プロセス) mới giúp trẻ có tự tin thật sự".',
        trapAnalysis: [
          { optionIndex: 0, reason: 'Bẫy từ tuyệt đối "tuyệt đối không mắng / khen mọi điều" (bị tác giả bác bỏ ở câu 2).' },
          { optionIndex: 1, reason: 'Ngược với bài: bài khuyên không nên chỉ nhìn vào kết quả.' },
          { optionIndex: 3, reason: 'Sai hoàn toàn ý tác giả.' },
        ],
        clueSentenceIndices: [3],
        tacticalHint: 'Đọc kỹ câu cuối cùng chứa cụm 「結果だけではなく、努力したプロセス」!',
      },
    ],
  },

  // ==========================================
  // LEVEL 3: TRUNG VĂN N3 (MEDIUM PASSAGE - MONDAI 11)
  // ==========================================
  {
    id: 'dokkai_medium_1',
    title: '5. Thói quen đọc sách & Thời đại số (Mondai 11)',
    level: 'medium',
    levelLabel: 'Trung văn (Mondai 11)',
    category: 'Văn hóa & Xã hội',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    estimatedMinutes: 5,
    targetSkill: 'Kỹ năng đọc văn bản dài, nắm bắt bố cục 3 đoạn & Tìm ý chính từng đoạn',
    plainPassage: `近年、スマートフォンや電子書籍の普及により、活字離れが進んでいると言われる。電車の中でも、本や新聞を読んでいる人を見かけることが少なくなった。多くの人が画面を見つめ、SNSや短い動画に時間を費やしている。
確かに、スマホを使えば必要な情報を一瞬で検索できる。要約された短い文章を読めば、効率よく知識を得ることも可能だ。
しかし、1冊の本をじっくり読むことには、ネットの断片的な情報では得られない大きな価値がある。最初から最後まで著者の考えの流れを追うことで、物事を深く論理的に考える力が身につくからだ。短時間で得られる情報ばかりを追うのではなく、時間をかけて本と向き合う習慣を失わないようにしたいものだ。`,
    furiganaPassage: `<ruby>近年<rt>きんねん</rt></ruby>、スマートフォンや<ruby>電子書籍<rt>でんししょせき</rt></ruby>の<ruby>普及<rt>ふきゅう</rt></ruby>により、<ruby>活字離<rt>かつじばな</rt></ruby>れが<ruby>進<rt>すす</rt></ruby>んでいると<ruby>言<rt>い</rt></ruby>われる。<ruby>電車<rt>でんしゃ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>でも、<ruby>本<rt>ほん</rt></ruby>や<ruby>新聞<rt>しんぶん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んでいる<ruby>人<rt>ひと</rt></ruby>を<ruby>見<rt>み</rt></ruby>かけることが<ruby>少<rt>すく</rt></ruby>なくなった。<ruby>多<rt>おお</rt></ruby>くの<ruby>人<rt>ひと</rt></ruby>が<ruby>画面<rt>がめん</rt></ruby>を<ruby>見<rt>み</rt></ruby>つめ、SNSや<ruby>短<rt>みじか</rt></ruby>い<ruby>動画<rt>どうが</rt></ruby>に<ruby>時間<rt>じかん</rt></ruby>を<ruby>費<rt>ついや</rt></ruby>している。
<ruby>確<rt>たし</rt></ruby>かに、スマホを<ruby>使<rt>つか</rt></ruby>えば<ruby>必要<rt>ひつよう</rt></ruby>な<ruby>情報<rt>じょうほう</rt></ruby>を<ruby>一瞬<rt>いっしゅん</rt></ruby>で<ruby>検索<rt>けんさく</rt></ruby>できる。<ruby>要約<rt>ようやく</rt></ruby>された<ruby>短<rt>みじか</rt></ruby>い<ruby>文章<rt>ぶんしょう</rt></ruby>を<ruby>読<rt>よ</rt></ruby>めば、<ruby>効率<rt>こうりつ</rt></ruby>よく<ruby>知識<rt>ちしき</rt></ruby>を<ruby>得<rt>え</rt></ruby>ることも<ruby>可能<rt>かのう</rt></ruby>だ。
<span class="bg-rose-400/30 px-1 rounded font-bold text-rose-600">しかし</span>、1<ruby>冊<rt>さつ</rt></ruby>の<ruby>本<rt>ほん</rt></ruby>をじっくり<ruby>読<rt>よ</rt></ruby>むことには、ネットの<ruby>断片的<rt>だんぺんてき</rt></ruby>な<ruby>情報<rt>じょうほう</rt></ruby>では<ruby>得<rt>え</rt></ruby>られない<ruby>大<rt>おお</rt></ruby>きな<ruby>価値<rt>かち</rt></ruby>がある。<span class="bg-amber-400/30 px-1 rounded font-bold text-amber-600">最初から最後まで著者の考えの流れを追うことで、物事を深く論理的に考える力が身につくからだ。</span><ruby>短時間<rt>たんじかん</rt></ruby>で<ruby>得<rt>え</rt></ruby>られる<ruby>情報<rt>じょうほう</rt></ruby>ばかりを<ruby>追<rt>お</rt></ruby>うのではなく、<ruby>時間<rt>じかん</rt></ruby>をかけて<ruby>本<rt>ほん</rt></ruby>と<ruby>向<rt>む</rt></ruby>き<ruby>合<rt>あ</rt></ruby>う<ruby>習慣<rt>しゅうかん</rt></ruby>を<ruby>失<rt>うしな</rt></ruby>わないようにしたいものだ。`,
    preReadingVocab: [
      { word: '活字離れ', reading: 'かつじばなれ', hanViet: 'Hoạt tự ly', meaning: 'Hiện tượng lười đọc sách báo chữ in' },
      { word: '見かける', reading: 'みかける', meaning: 'Bắt gặp, nhìn thấy thoáng qua' },
      { word: '費やす', reading: 'ついやす', hanViet: 'Phí', meaning: 'Dành (thời gian), tiêu tốn (tiền bạc)' },
      { word: '断片的', reading: 'だんぺんてき', hanViet: 'Đoạn phiến đích', meaning: 'Rời rạc, manh mún, từng mẩu nhỏ' },
      { word: '論理的', reading: 'ろんりてき', hanViet: 'Luận lý đích', meaning: 'Một cách logic, có lập luận chặt chẽ' },
      { word: '向き合う', reading: 'むきあう', meaning: 'Đối diện, dành trọn tâm trí cho...' },
    ],
    grammarNotes: [
      '〜により / 〜によって: Do, nhờ vào (nguyên nhân)',
      '〜ものだ: Biểu thị tâm trạng, ước muốn sâu sắc ("ước gì...", "rất mong muốn...")',
      '〜ばかり: Toàn là... / Chỉ chăm chăm...',
    ],
    sentenceBreakdown: [
      {
        sentenceIndex: 0,
        jp: '近年、スマートフォンや電子書籍の普及により、活字離れが進んでいると言われる。',
        vi: 'Những năm gần đây, do sự phổ biến của smartphone và sách điện tử, người ta nói rằng hiện tượng xa rời sách báo đang gia tăng.',
        subject: '活字離れが (Hiện tượng xa rời sách báo)',
        predicate: '進んでいると言われる (Được nói là đang gia tăng)',
      },
      {
        sentenceIndex: 1,
        jp: '電車の中でも、本や新聞を読んでいる人を見かけることが少なくなった。',
        vi: 'Ngay cả trên tàu điện, số người đọc sách báo mà ta bắt gặp cũng trở nên ít đi.',
      },
      {
        sentenceIndex: 2,
        jp: '確かに、スマホを使えば必要な情報を一瞬で検索できる。',
        vi: 'Đúng là nếu dùng smartphone thì có thể tra cứu thông tin cần thiết trong chớp mắt.',
        connector: '確かに (Đúng là/Quả thật)',
      },
      {
        sentenceIndex: 3,
        jp: 'しかし、1冊の本をじっくり読むことには、ネットの断片的な情報では得られない大きな価値がある。',
        vi: 'Tuy nhiên, việc đọc kỹ một cuốn sách chứa đựng giá trị to lớn mà những mẩu thông tin rời rạc trên mạng không thể mang lại.',
        connector: 'しかし (Tuy nhiên)',
        connectorNote: 'Bắt đầu đưa ra luận điểm chính trị giá điểm số.',
        isClue: true,
      },
      {
        sentenceIndex: 4,
        jp: '最初から最後まで著者の考えの流れを追うことで、物事を深く論理的に考える力が身につくからだ。',
        vi: 'Bởi vì bằng cách theo dõi mạch suy nghĩ của tác giả từ đầu đến cuối, người đọc sẽ trau dồi được khả năng tư duy mọi việc một cách sâu sắc và logic.',
        subject: '物事を深く論理的に考える力が (Năng lực tư duy sâu sắc logic)',
        predicate: '身につくからだ (Vì sẽ tiếp thu/trau dồi được)',
        isClue: true,
      },
      {
        sentenceIndex: 5,
        jp: '短時間で得られる情報ばかりを追うのではなく、時間をかけて本と向き合う習慣を失わないようにしたいものだ。',
        vi: 'Thay vì chỉ chăm chăm đuổi theo những thông tin lấy được trong chớp nhoáng, tôi mong chúng ta không đánh mất thói quen dành thời gian đọc sách.',
        predicate: '失わないようにしたいものだ (Rất muốn không để mất đi...)',
        isClue: true,
      },
    ],
    questions: [
      {
        id: 1,
        question: '筆者によると、1冊の本をじっくり読むことのメリットは何ですか。(Theo tác giả, lợi ích của việc đọc kỹ một cuốn sách là gì?)',
        options: [
          'スマホよりも短時間で効率よく知識が得られる (Tiếp thu kiến thức ngắn thời gian và hiệu quả hơn smartphone)',
          '著者の考えの流れを追うことで、深く論理的に考える力がつく (Theo dõi mạch tư duy của tác giả giúp nâng cao năng lực suy nghĩ sâu sắc và logic)',
          'ネットに載っていない新しい情報だけを検索できる (Chỉ tra cứu được những thông tin mới chưa có trên mạng)',
          '電車の中で退屈な時間を過ごさずに済む (Không bị chán khi ngồi trên tàu điện)',
        ],
        correctIndex: 1,
        explanation: 'Khớp chính xác với câu 4 trong bài: "最初から最後まで著者の考えの流れを追うことで、物事を深く論理的に考える力が身につくからだ".',
        trapAnalysis: [
          { optionIndex: 0, reason: 'Ngắn thời gian là ưu điểm của smartphone, không phải của đọc sách cả quyển.' },
          { optionIndex: 2, reason: 'Bài đọc không hề nói về việc sách chỉ có tin chưa có trên mạng.' },
          { optionIndex: 3, reason: 'Chi tiết phụ không phải là giá trị cốt lõi tác giả bàn luận.' },
        ],
        clueSentenceIndices: [3, 4],
        tacticalHint: 'Đọc câu số 4 chứa chữ 「論理的に考える力」!',
      },
      {
        id: 2,
        question: 'この文章で筆者が最も言いたいことはどれですか。(Điều tác giả muốn nói nhất trong đoạn văn này là gì?)',
        options: [
          'スマホや電子書籍の利用は完全にやめるべきだ (Nên dừng hoàn toàn việc dùng smartphone và sách điện tử)',
          '短い動画やSNSを見るのは時間の無駄である (Xem video ngắn và mạng xã hội là lãng phí thời gian)',
          '手軽なネット情報だけでなく、じっくり本を読む習慣も大切にすべきだ (Không chỉ thông tin tiện lợi trên mạng, mà cũng nên trân trọng thói quen đọc sách nghiền ngẫm)',
          '現代人は電車の中で新聞を読む時間を増やす必要がある (Người hiện đại cần tăng thời gian đọc báo trên tàu)',
        ],
        correctIndex: 2,
        explanation: 'Áp dụng Bí kíp 2 & 3: Đoạn cuối kết hợp câu ước vọng 「〜したいものだ」thể hiện mong muốn duy trì thói quen dành thời gian cho sách bên cạnh sự tiện lợi của mạng xã hội.',
        trapAnalysis: [
          { optionIndex: 0, reason: 'Bẫy tuyệt đối: Tác giả không bảo "dừng hoàn toàn" (完全にやめる).' },
          { optionIndex: 1, reason: 'Bài chỉ nêu thực trạng chứ không kết luận gay gắt là "lãng phí thời gian".' },
          { optionIndex: 3, reason: 'Báo in chỉ là ví dụ minh họa ở đầu bài, không phải trọng tâm.' },
        ],
        clueSentenceIndices: [5],
        tacticalHint: 'Nhìn vào câu đúc kết cuối cùng ở câu số 5!',
      },
    ],
  },

  // ==========================================
  // LEVEL 4: TÌM KIẾM THÔNG TIN (MONDAI 13 - INFO RETRIEVAL)
  // ==========================================
  {
    id: 'dokkai_info_1',
    title: '6. Thông báo Khóa học Làm gốm & Ưu đãi thành viên (Mondai 13)',
    level: 'info_retrieval',
    levelLabel: 'Tìm kiếm thông tin (Mondai 13)',
    category: 'Thông báo & Biểu mẫu',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    estimatedMinutes: 4,
    targetSkill: 'Kỹ năng quét bảng biểu, dò tìm điều kiện giá tiền & bẫy hoa thị ※',
    plainPassage: `【さくら陶芸教室 1日体験コースのご案内】
日本の伝統的な陶芸（お皿や湯のみ作り）を気軽に体験できる特別コースです！

■ 開催日：毎週土曜日・日曜日（要予約）
■ 時間：午前の部 10:00〜12:00 / 午後の部 14:00〜16:00
■ 参加費：
  ・一般（大人）：3,000円
  ・学生（高校生・大学生）：2,000円（※学生証の提示が必要）
  ・中学生以下：1,000円
■ 割引特典：
  ①「ペア割引」：2名以上で同時に申し込むと、1人あたり500円引き！
  ②「早割」：参加日の1週間前までに申し込むと、さらに300円引き！
※ 注意事項：
  ※ 材料費・焼き代はすべて参加費に含まれています。
  ※ エプロンは無料で貸し出します。
  ※ キャンセルは参加日の2日前まで無料です。前日・当日のキャンセルは参加費の50%がかかります。`,
    furiganaPassage: `【さくら<ruby>陶芸教室<rt>とうげいきょうしつ</rt></ruby> 1<ruby>日体験<rt>にちたいけん</rt></ruby>コースのご<ruby>案内<rt>あんない</rt></ruby>】
<ruby>日本<rt>にほん</rt></ruby>の<ruby>伝統的<rt>でんとうてき</rt></ruby>な<ruby>陶芸<rt>とうげい</rt></ruby>（お<ruby>皿<rt>さら</rt></ruby>や<ruby>湯<rt>ゆ</rt></ruby>のみ<ruby>作<rt>づく</rt></ruby>り）を<ruby>気軽<rt>きがる</rt></ruby>に<ruby>体験<rt>たいけん</rt></ruby>できる<ruby>特別<rt>とくべつ</rt></ruby>コースです！

■ <ruby>開催日<rt>かいさいび</rt></ruby>：<ruby>毎週<rt>まいしゅう</rt></ruby><ruby>土曜日<rt>どようび</rt></ruby>・<ruby>日曜日<rt>にちようび</rt></ruby>（<ruby>要予約<rt>ようよやく</rt></ruby>）
■ <ruby>時間<rt>じかん</rt></ruby>：<ruby>午前<rt>ごぜん</rt></ruby>の<ruby>部<rt>ぶ</rt></ruby> 10:00〜12:00 / <ruby>午後<rt>ごご</rt></ruby>の<ruby>部<rt>ぶ</rt></ruby> 14:00〜16:00
■ <ruby>参加費<rt>さんかひ</rt></ruby>：
  ・<ruby>一般<rt>いっぱん</rt></ruby>（<ruby>大人<rt>おとな</rt></ruby>）：3,000<ruby>円<rt>えん</rt></ruby>
  ・<ruby>学生<rt>がくせい</rt></ruby>（<ruby>高校生<rt>こうこうせい</rt></ruby>・<ruby>大学生<rt>だいがくせい</rt></ruby>）：<span class="bg-emerald-400/30 px-1 rounded font-bold text-emerald-600">2,000円</span>（※<ruby>学生証<rt>がくせいしょう</rt></ruby>の<ruby>提示<rt>ていじ</rt></ruby>が<ruby>必要<rt>ひつよう</rt></ruby>）
  ・<ruby>中学生以下<rt>ちゅうがくせいいか</rt></ruby>：1,000<ruby>円<rt>えん</rt></ruby>
■ <ruby>割引特典<rt>わりびきとくてん</rt></ruby>：
  ①「ペア<ruby>割引<rt>わりびき</rt></ruby>」：2<ruby>名以上<rt>めいいじょう</rt></ruby>で<ruby>同時<rt>どうじ</rt></ruby>に<ruby>申<rt>もう</rt></ruby>し<ruby>込<rt>こ</rt></ruby>むと、<span class="bg-amber-400/30 px-1 rounded font-bold">1人あたり500円引き</span>！
  ②「<ruby>早割<rt>はやわり</rt></ruby>」：<ruby>参加日<rt>さんかび</rt></ruby>の1<ruby>週間前<rt>しゅうかんまえ</rt></ruby>までに<ruby>申<rt>もう</rt></ruby>し<ruby>込<rt>こ</rt></ruby>むと、<span class="bg-amber-400/30 px-1 rounded font-bold">さらに300円引き</span>！
※ <ruby>注意事項<rt>ちゅういじこう</rt></ruby>：
  ※ <ruby>材料費<rt>ざいりょうひ</rt></ruby>・<ruby>焼<rt>や</rt></ruby>き<ruby>代<rt>だい</rt></ruby>はすべて<ruby>参加費<rt>さんかひ</rt></ruby>に<ruby>含<rt>ふく</rt></ruby>まれています。
  ※ エプロンは<ruby>無料<rt>むりょう</rt></ruby>で<ruby>貸<rt>か</rt></ruby>し<ruby>出<rt>だ</rt></ruby>します。
  ※ キャンセルは<ruby>参加日<rt>さんかび</rt></ruby>の2<ruby>日前<rt>にちまえ</rt></ruby>まで<ruby>無料<rt>むりょう</rt></ruby>です。<ruby>前日<rt>ぜんじつ</rt></ruby>・<ruby>当日<rt>とうじつ</rt></ruby>のキャンセルは<ruby>参加費<rt>さんかひ</rt></ruby>の50%がかかります。`,
    preReadingVocab: [
      { word: '陶芸', reading: 'とうげい', hanViet: 'Đào nghệ', meaning: 'Nghệ thuật làm đồ gốm sứ' },
      { word: '湯のみ', reading: 'ゆのみ', meaning: 'Tách uống trà kiểu Nhật' },
      { word: '要予約', reading: 'ようよやく', meaning: 'Bắt buộc phải đặt chỗ trước' },
      { word: '提示', reading: 'ていじ', hanViet: 'Đề thị', meaning: 'Xuất trình (giấy tờ, thẻ)' },
      { word: '早割', reading: 'はやわり', meaning: 'Giảm giá khi đăng ký sớm' },
      { word: 'エプロン', reading: 'epuron', meaning: 'Tạp dề bảo hộ' },
    ],
    grammarNotes: [
      '〜あたり: Tính trên mỗi đơn vị (1人あたり: tính trên mỗi người)',
      '〜までに: Trước thời hạn...',
      '〜以下: Từ mức đó trở xuống (bao gồm cả mức đó)',
    ],
    sentenceBreakdown: [
      {
        sentenceIndex: 0,
        jp: 'さくら陶芸教室 1日体験コースのご案内。日本の伝統的な陶芸を手軽に体験できるコースです。',
        vi: 'Hướng dẫn khóa trải nghiệm làm gốm 1 ngày tại Sakura. Khóa học giúp trải nghiệm nghệ thuật gốm truyền thống một cách dễ dàng.',
      },
      {
        sentenceIndex: 1,
        jp: '参加費：一般3,000円、学生2,000円（要学生証）、中学生以下1,000円。',
        vi: 'Học phí: Người lớn 3,000 yên, Học sinh sinh viên 2,000 yên (cần thẻ HSSV), Học sinh cấp 2 trở xuống 1,000 yên.',
        isClue: true,
      },
      {
        sentenceIndex: 2,
        jp: '割引：ペア割（2名以上で1人500円引き）、早割（1週間前までの申込でさらに300円引き）。',
        vi: 'Giảm giá: Cặp đôi (2 người trở lên giảm 500 yên/người), Đăng ký sớm (trước 1 tuần giảm thêm 300 yên).',
        isClue: true,
      },
      {
        sentenceIndex: 3,
        jp: '注意事項：材料費込み、エプロン無料貸出、2日前までキャンセル無料。',
        vi: 'Lưu ý: Đã gồm tiền nguyên liệu, mượn tạp dề miễn phí, hủy trước 2 ngày không mất phí.',
      },
    ],
    questions: [
      {
        id: 1,
        question: '大学生のアンさんと友達のリンさん（大学生）の2人が、参加日の10日前に一緒に申し込みました。2人が支払う合計金額はいくらですか。(Bạn An và bạn Linh (đều là sinh viên đại học) cùng đăng ký trước ngày tham gia 10 ngày. Tổng số tiền 2 người phải trả là bao nhiêu?)',
        options: [
          '4,000円',
          '3,000円',
          '2,400円',
          '2,000円',
        ],
        correctIndex: 2,
        explanation: 'Áp dụng Bí kíp 4:\n1. Giá gốc sinh viên: 2,000円/người.\n2. Cả 2 cùng đăng ký (2 người) -> Hưởng Giảm giá đôi (ペア割): -500円.\n3. Đăng ký trước 10 ngày (trước hơn 1 tuần) -> Hưởng Giảm giá sớm (早割): -300円.\n=> Giá mỗi người: 2,000 - 500 - 300 = 1,200円.\n=> Tổng 2 người: 1,200 x 2 = 2,400円.',
        trapAnalysis: [
          { optionIndex: 0, reason: 'Chưa trừ bất kỳ khoản khuyến mãi nào (2,000 x 2).' },
          { optionIndex: 1, reason: 'Chỉ mới trừ giảm giá đôi (ペア割) mà quên trừ giảm giá sớm (早割).' },
          { optionIndex: 3, reason: 'Tính nhầm mức giá trẻ em.' },
        ],
        clueSentenceIndices: [1, 2],
        tacticalHint: 'Tính theo công thức: (Giá HSSV 2000 - Cặp đôi 500 - Sớm 300) x 2 người!',
      },
    ],
  },

  // ==========================================
  // BÀI MỞ RỘNG 7: KHỞI ĐỘNG (WARM-UP 3)
  // ==========================================
  {
    id: 'dokkai_warmup_3',
    title: '7. Thông báo bảo trì thang máy tòa nhà (Bắt ý Nguyên nhân)',
    level: 'warmup',
    levelLabel: 'Khởi động (Siêu ngắn)',
    category: 'Đời sống chung cư',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    estimatedMinutes: 2,
    targetSkill: 'Kỹ năng tìm nguyên nhân & thời gian bảo trì qua mẫu câu 〜ため',
    plainPassage: `マンション住民の皆様へ。明日（11月20日）の午前10時から午後1時まで、定期安全点検のためエレベーターのご利用ができません。ご不便をおかけしますが、その間は階段をご利用くださいますようお願い申し上げます。`,
    furiganaPassage: `マンション<ruby>住民<rt>じゅうみん</rt></ruby>の<ruby>皆様<rt>みなさま</rt></ruby>へ。<ruby>明日<rt>あす</rt></ruby>（11<ruby>月<rt>がつ</rt></ruby>20<ruby>日<rt>にち</rt></ruby>）の<ruby>午前<rt>ごぜん</rt></ruby>10<ruby>時<rt>じ</rt></ruby>から<ruby>午後<rt>ごご</rt></ruby>1<ruby>時<rt>じ</rt></ruby>まで、<span class="bg-amber-400/30 px-1 rounded font-bold">定期安全点検のため</span>エレベーターのご<ruby>利用<rt>りよう</rt></ruby>ができません。ご<ruby>不便<rt>ふべん</rt></ruby>をおかけしますが、その<ruby>間<rt>あいだ</rt></ruby>は<ruby>階段<rt>かいだん</rt></ruby>をご<ruby>利用<rt>りよう</rt></ruby>くださいますようお<ruby>願<rt>ねが</rt></ruby>い<ruby>申<rt>もう</rt></ruby>し<ruby>上<rt>あ</rt></ruby>げます。`,
    preReadingVocab: [
      { word: '住民', reading: 'じゅうみん', hanViet: 'Trú dân', meaning: 'Cư dân, người sinh sống' },
      { word: '定期点検', reading: 'ていきてんけん', hanViet: 'Định kỳ điểm kiểm', meaning: 'Kiểm tra, bảo dưỡng định kỳ' },
      { word: 'ご不便', reading: 'ごふべん', hanViet: 'Bất tiện', meaning: 'Sự bất tiện' },
      { word: '階段', reading: 'かいだん', hanViet: 'Giai đoạn', meaning: 'Cầu thang bộ' },
    ],
    grammarNotes: [
      '〜のため: Do / Vì (chỉ nguyên nhân mang tính khách quan)',
      '〜くださいますようお願い申し上げます: Kính mong quý khách... (kính ngữ N3)',
    ],
    sentenceBreakdown: [
      {
        sentenceIndex: 0,
        jp: '明日（11月20日）の午前10時から午後1時まで、定期安全点検のためエレベーターのご利用ができません。',
        vi: 'Từ 10h sáng đến 1h chiều ngày mai (20/11), do kiểm tra an toàn định kỳ nên quý vị không thể sử dụng thang máy.',
        subject: 'エレベーターのご利用が (Việc dùng thang máy)',
        predicate: 'できません (Không thể)',
        connector: '〜のため (Do kiểm tra định kỳ)',
        isClue: true,
      },
      {
        sentenceIndex: 1,
        jp: 'ご不便をおかけしますが、その間は階段をご利用くださいますようお願い申し上げます。',
        vi: 'Rất xin lỗi vì sự bất tiện này, trong khoảng thời gian đó kính mong quý vị vui lòng sử dụng cầu thang bộ.',
        subject: 'その間は (Trong khoảng thời gian đó)',
        predicate: '階段をご利用ください (Hãy đi thang bộ)',
        isClue: true,
      },
    ],
    questions: [
      {
        id: 1,
        question: '明日の午前11時に出かける住民はどうしなければなりませんか。(Cư dân ra ngoài lúc 11h sáng mai thì phải làm gì?)',
        options: [
          'エレベーターが点検中なので階段を使う (Dùng thang bộ vì thang máy đang bảo trì)',
          '午後1時まで外出してはいけない (Không được ra ngoài cho tới 1h chiều)',
          '安全点検を手伝わなければならない (Phải phụ giúp việc kiểm tra an toàn)',
          'エレベーターの利用予約をする (Phải đặt lịch hẹn trước để dùng thang máy)',
        ],
        correctIndex: 0,
        explanation: 'Khung giờ 11h sáng nằm trong khoảng 10h00 - 13h00 (bảo trì định kỳ) nên cư dân phải sử dụng thang bộ (階段を利用する).',
        trapAnalysis: [
          { optionIndex: 1, reason: 'Cư dân vẫn được ra ngoài bình thường, chỉ là phải đi thang bộ.' },
          { optionIndex: 2, reason: 'Hoàn toàn bịa đặt ngoài nội dung bài.' },
          { optionIndex: 3, reason: 'Thang máy ngừng hoàn toàn, không có chế độ đặt chỗ.' },
        ],
        clueSentenceIndices: [0, 1],
        tacticalHint: 'Đối chiếu thời gian 11h với khoảng giờ 10:00 - 13:00 trong câu 0!',
      },
    ],
  },

  // ==========================================
  // BÀI MỞ RỘNG 8: ĐOẢN VĂN (SHORT 3)
  // ==========================================
  {
    id: 'dokkai_short_3',
    title: '8. Văn hóa im lặng trong giao tiếp Nhật (Mondai 10)',
    level: 'short',
    levelLabel: 'Đoản văn (Mondai 10)',
    category: 'Văn hóa giao tiếp',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    estimatedMinutes: 3,
    targetSkill: 'Kỹ năng bẻ khóa câu đúc kết có từ nối 「つまり・要するに」',
    plainPassage: `外国人の多くは、会話の中で沈黙が続くと「何か悪いことを言っただろうか」と不安になる。しかし、日本人にとって沈黙は必ずしも拒絶や否定を意味するわけではない。相手の言葉を真剣に受け止め、じっくり考えている証拠であることも多いのだ。つまり、沈黙も大切なコミュニケーションの一部なのである。`,
    furiganaPassage: `<ruby>外国人<rt>がいこくじん</rt></ruby>の<ruby>多<rt>おお</rt></ruby>くは、<ruby>会話<rt>かいわ</rt></ruby>の<ruby>中<rt>なか</rt></ruby>で<ruby>沈黙<rt>ちんもく</rt></ruby>が<ruby>続<rt>つづ</rt></ruby>くと「<ruby>何<rt>なに</rt></ruby>か<ruby>悪<rt>わる</rt></ruby>いことを<ruby>言<rt>い</rt></ruby>っただろうか」と<ruby>不安<rt>ふあん</rt></ruby>になる。<span class="bg-rose-400/30 px-1 rounded font-bold text-rose-600">しかし</span>、<ruby>日本人<rt>にほんじん</rt></ruby>にとって<ruby>沈黙<rt>ちんもく</rt></ruby>は<ruby>必<rt>かなら</rt></ruby>ずしも<ruby>拒絶<rt>きょぜつ</rt></ruby>や<ruby>否定<rt>ひてい</rt></ruby>を<ruby>意味<rt>いみ</rt></ruby>するわけではない。<ruby>相手<rt>あいて</rt></ruby>の<ruby>言葉<rt>ことば</rt></ruby>を<ruby>真剣<rt>しんけん</rt></ruby>に<ruby>受<rt>う</rt></ruby>け<ruby>止<rt>と</rt></ruby>め、じっくり<ruby>考<rt>かんが</rt></ruby>えている<ruby>証拠<rt>しょうこ</rt></ruby>であることも<ruby>多<rt>おお</rt></ruby>いのだ。<span class="bg-amber-400/30 px-1 rounded font-bold text-amber-600">つまり、沈黙も大切なコミュニケーションの一部なのである。</span>`,
    preReadingVocab: [
      { word: '沈黙', reading: 'ちんもく', hanViet: 'Trầm mặc', meaning: 'Sự im lặng, khoảng lặng' },
      { word: '拒絶', reading: 'きょぜつ', hanViet: 'Cự tuyệt', meaning: 'Sự từ chối, khước từ' },
      { word: '真剣に', reading: 'しんけんに', hanViet: 'Chân kiếm', meaning: 'Một cách nghiêm túc' },
      { word: '証拠', reading: 'しょうこ', hanViet: 'Chứng cứ', meaning: 'Bằng chứng, minh chứng' },
    ],
    grammarNotes: [
      '〜にとって: Đối với đối tượng nào đó...',
      '必ずしも〜わけではない: Không nhất thiết / không hẳn là... (phủ định 1 phần)',
      'つまり: Tóm lại / Nói cách khác (Bí kíp 2: câu sau つまり là đáp án)',
    ],
    sentenceBreakdown: [
      {
        sentenceIndex: 0,
        jp: '外国人の多くは、会話の中で沈黙が続くと「何か悪いことを言っただろうか」と不安になる。',
        vi: 'Nhiều người nước ngoài khi thấy khoảng im lặng kéo dài trong hội thoại sẽ lo lắng tự hỏi: "Liệu mình có lỡ lời điều gì không tốt?".',
      },
      {
        sentenceIndex: 1,
        jp: 'しかし、日本人にとって沈黙は必ずしも拒絶や否定を意味するわけではない。',
        vi: 'Tuy nhiên, đối với người Nhật, im lặng không hẳn đồng nghĩa với sự từ chối hay phủ định.',
        connector: 'しかし (Tuy nhiên)',
        connectorNote: 'Bắt đầu lật lại nhận thức sai lầm thông thường.',
        isClue: true,
      },
      {
        sentenceIndex: 2,
        jp: '相手の言葉を真剣に受け止め、じっくり考えている証拠であることも多いのだ。',
        vi: 'Đó thường là minh chứng cho việc họ đang nghiêm túc tiếp thu lời của đối phương và suy nghĩ thấu đáo.',
        isClue: true,
      },
      {
        sentenceIndex: 3,
        jp: 'つまり、沈黙も大切なコミュニケーションの一部なのである。',
        vi: 'Nói cách khác, sự im lặng cũng là một phần quan trọng của giao tiếp.',
        connector: 'つまり (Nói cách khác / Tóm lại)',
        connectorNote: 'Câu kết luận chứa đựng quan điểm cốt lõi của tác giả.',
        isClue: true,
      },
    ],
    questions: [
      {
        id: 1,
        question: '日本人との会話における「沈黙」について、筆者はどう考えていますか。(Tác giả nghĩ gì về "sự im lặng" trong giao tiếp với người Nhật?)',
        options: [
          '相手の話に興味がないという拒絶のサインである (Là dấu hiệu từ chối vì không hứng thú với câu chuyện)',
          '相手の話を真剣に考え、大切に受け止めている表現の一つである (Là một cách thể hiện việc đang nghiêm túc suy nghĩ và trân trọng lời nói của đối phương)',
          '外国人と話すときには絶対に避けるべき悪い習慣である (Là thói quen xấu nhất định phải tránh khi nói chuyện với người nước ngoài)',
          '何も言いたいことがない時にだけ生じるものである (Là điều chỉ xảy ra khi không có gì để nói)',
        ],
        correctIndex: 1,
        explanation: 'Sau「しかし」và「つまり」, tác giả khẳng định im lặng là lúc người Nhật suy nghĩ nghiêm túc và là một phần quan trọng của giao tiếp.',
        trapAnalysis: [
          { optionIndex: 0, reason: 'Trái ngược với câu 1 trong bài.' },
          { optionIndex: 2, reason: 'Bẫy từ tuyệt đối: "tuyệt đối tránh / thói quen xấu" sai hoàn toàn.' },
          { optionIndex: 3, reason: 'Sai lệch bản chất văn hóa giao tiếp.' },
        ],
        clueSentenceIndices: [1, 2, 3],
        tacticalHint: 'Đọc kỹ câu số 2 và câu đúc kết số 3 sau chữ 「つまり」!',
      },
    ],
  },

  // ==========================================
  // BÀI MỞ RỘNG 9: ĐOẢN VĂN (SHORT 4)
  // ==========================================
  {
    id: 'dokkai_short_4',
    title: '9. Làm việc từ xa (Telework) và ranh giới cuộc sống (Mondai 10)',
    level: 'short',
    levelLabel: 'Đoản văn (Mondai 10)',
    category: 'Công việc & Lối sống',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    estimatedMinutes: 3,
    targetSkill: 'Nhận biết cấu trúc so sánh đối lập qua liên từ 「一方で」',
    plainPassage: `在宅勤務（テレワーク）は、満員電車に乗るストレスがなく自分のペースで働ける利点がある。その一方で、仕事とプライベートの時間の境界が曖昧になり、気づかないうちに長時間労働になってしまう人が増えている。自宅でも仕事のオンとオフを意識的に切り替える工夫が必要だ。`,
    furiganaPassage: `<ruby>在宅勤務<rt>ざいたくきんむ</rt></ruby>（テレワーク）は、<ruby>満員電車<rt>まんいんでんしゃ</rt></ruby>に<ruby>乗<rt>の</rt></ruby>るストレスがなく<ruby>自分<rt>じぶん</rt></ruby>のペースで<ruby>働<rt>はたら</rt></ruby>ける<ruby>利点<rt>りてん</rt></ruby>がある。<span class="bg-purple-400/30 px-1 rounded font-bold text-purple-600">その一方で</span>、<ruby>仕事<rt>しごと</rt></ruby>とプライベートの<ruby>時間<rt>じかん</rt></ruby>の<ruby>境界<rt>きょうかい</rt></ruby>が<ruby>曖昧<rt>あいまい</rt></ruby>になり、<ruby>気<rt>き</rt></ruby>づかないうちに<ruby>長時間労働<rt>ちょうじかんろうどう</rt></ruby>になってしまう<ruby>人<rt>ひと</rt></ruby>が<ruby>増<rt>ふ</rt></ruby>えている。<span class="bg-amber-400/30 px-1 rounded font-bold">自宅でも仕事のオンとオフを意識的に切り替える工夫が必要だ。</span>`,
    preReadingVocab: [
      { word: '満員電車', reading: 'まんいんでんしゃ', meaning: 'Tàu điện chật ních người' },
      { word: '利点', reading: 'りてん', hanViet: 'Lợi điểm', meaning: 'Ưu điểm, điểm thuận lợi' },
      { word: '境界', reading: 'きょうかい', hanViet: 'Cảnh giới', meaning: 'Ranh giới, đường phân định' },
      { word: '曖昧', reading: 'あいまい', hanViet: 'Ái muội', meaning: 'Mơ hồ, không rõ ràng' },
      { word: '意識的に', reading: 'いしきてきに', meaning: 'Một cách có ý thức, chủ động' },
    ],
    grammarNotes: [
      '〜一方で: Mặt khác / Trái lại (so sánh hai mặt đối lập)',
      '〜うちに: Trong khi không để ý thì đã...',
    ],
    sentenceBreakdown: [
      {
        sentenceIndex: 0,
        jp: '在宅勤務（テレワーク）は、満員電車に乗るストレスがなく自分のペースで働ける利点がある。',
        vi: 'Làm việc tại nhà có ưu điểm là không bị căng thẳng khi đi tàu đông đúc và có thể làm việc theo nhịp độ riêng.',
      },
      {
        sentenceIndex: 1,
        jp: 'その一方で、仕事とプライベートの時間の境界が曖昧になり、気づかないうちに長時間労働になってしまう人が増えている。',
        vi: 'Mặt khác, ranh giới giữa công việc và đời sống cá nhân trở nên mập mờ, ngày càng có nhiều người vô tình bị cuốn vào làm việc quá giờ.',
        connector: 'その一方で (Mặt khác)',
        connectorNote: 'Đưa ra mặt hạn chế / hệ quả tiêu cực của làm việc từ xa.',
        isClue: true,
      },
      {
        sentenceIndex: 2,
        jp: '自宅でも仕事のオンとオフを意識的に切り替える工夫が必要だ。',
        vi: 'Ngay cả ở nhà cũng cần có biện pháp chủ động phân định rạch ròi giữa lúc làm việc và lúc nghỉ ngơi.',
        isClue: true,
      },
    ],
    questions: [
      {
        id: 1,
        question: '在宅勤務の課題として、文章に書かれていることは何ですか。(Vấn đề của làm việc tại nhà được nêu trong bài là gì?)',
        options: [
          '満員電車のストレスが解消されないこと (Không giải tỏa được căng thẳng tàu điện)',
          '自分のペースで仕事が全くできなくなること (Hoàn toàn không làm việc theo nhịp độ của mình được)',
          '仕事と私生活の区別があいまいになり、働きすぎてしまうこと (Ranh giới giữa công việc và đời tư mập mờ dẫn tới làm việc quá sức)',
          '会社の人と連絡が完全に取れなくなること (Mất liên lạc hoàn toàn với người trong công ty)',
        ],
        correctIndex: 2,
        explanation: 'Khớp với câu 1 sau「その一方で」: "仕事とプライベートの時間の境界が曖昧になり、気づかないうちに長時間労働になってしまう".',
        trapAnalysis: [
          { optionIndex: 0, reason: 'Ngược với bài: làm việc tại nhà giúp tránh được tàu điện.' },
          { optionIndex: 1, reason: 'Trái với ưu điểm đã nêu ở câu 0.' },
          { optionIndex: 3, reason: 'Không hề được nhắc tới trong bài đọc.' },
        ],
        clueSentenceIndices: [1],
        tacticalHint: 'Đọc câu số 1 ngay sau liên từ 「その一方で」!',
      },
    ],
  },

  // ==========================================
  // BÀI MỞ RỘNG 10: TRUNG VĂN (MEDIUM 2)
  // ==========================================
  {
    id: 'dokkai_medium_2',
    title: '10. Tinh thần Omoiyari - Nét đẹp thấu cảm của người Nhật (Mondai 11)',
    level: 'medium',
    levelLabel: 'Trung văn (Mondai 11)',
    category: 'Văn hóa & Tâm lý',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    estimatedMinutes: 5,
    targetSkill: 'Kỹ năng tổng hợp ý chính của toàn bài văn nghị luận 3 đoạn',
    plainPassage: `日本には昔から「思いやり」という言葉がある。これは、相手の立場に立ってその人の気持ちを察し、配慮することを意味する。
例えば、雨の日に店に入るとき、傘についた水滴を払ってから入るのも思いやりの一つだ。自分が床を濡らさないように気をつけることで、次に歩く人が滑って転ばないようにするためである。誰かに頼まれたわけではなく、自発的に相手を気遣う行動なのだ。
言葉で直接「ありがとう」と伝えることも大切だが、言われる前に行動する思いやりの心こそが、お互いに心地よい人間関係を築く基礎になるのではないだろうか。`,
    furiganaPassage: `<ruby>日本<rt>にほん</rt></ruby>には<ruby>昔<rt>むかし</rt></ruby>から「<ruby>思<rt>おも</rt></ruby>いやり」という<ruby>言葉<rt>ことば</rt></ruby>がある。これは、<ruby>相手<rt>あいて</rt></ruby>の<ruby>立場<rt>たちば</rt></ruby>に<ruby>立<rt>た</rt></ruby>ってその<ruby>人<rt>ひと</rt></ruby>の<ruby>気持<rt>きも</rt></ruby>ちを<ruby>察<rt>さっ</rt></ruby>し、<ruby>配慮<rt>はいりょ</rt></ruby>することを<ruby>意味<rt>いみ</rt></ruby>する。
<ruby>例<rt>たと</rt></ruby>えば、<ruby>雨<rt>あめ</rt></ruby>の<ruby>日<rt>ひ</rt></ruby>に<ruby>店<rt>みせ</rt></ruby>に<ruby>入<rt>はい</rt></ruby>るとき、<ruby>傘<rt>かさ</rt></ruby>についた<ruby>水滴<rt>すいてき</rt></ruby>を<ruby>払<rt>はら</rt></ruby>ってから<ruby>入<rt>はい</rt></ruby>るのも<ruby>思<rt>おも</rt></ruby>いやりの<ruby>一<rt>ひと</rt></ruby>つだ。<span class="bg-amber-400/30 px-1 rounded font-bold">自分が床を濡らさないように気をつけることで、次に歩く人が滑って転ばないようにするためである。</span><ruby>誰<rt>だれ</rt></ruby>かに<ruby>頼<rt>たの</rt></ruby>まれたわけではなく、<ruby>自発的<rt>じはつてき</rt></ruby>に<ruby>相手<rt>あいて</rt></ruby>を<ruby>気遣<rt>きづか</rt></ruby>う<ruby>行動<rt>こうどう</rt></ruby>なのだ。
<ruby>言葉<rt>ことば</rt></ruby>で<ruby>直接<rt>ちょくせつ</rt></ruby>「ありがとう」と<ruby>伝<rt>つた</rt></ruby>えることも<ruby>大切<rt>たいせつ</rt></ruby>だが、<span class="bg-rose-400/30 px-1 rounded font-bold text-rose-600">言われる前に行動する思いやりの心こそが、お互いに心地よい人間関係を築く基礎になるのではないだろうか。</span>`,
    preReadingVocab: [
      { word: '思いやり', reading: 'おもいやり', meaning: 'Sự thấu cảm, chu đáo, biết nghĩ cho người khác' },
      { word: '察する', reading: 'さっする', hanViet: 'Sát', meaning: 'Cảm nhận, đoán biết tâm tư đối phương' },
      { word: '配慮', reading: 'はいりょ', hanViet: 'Phối lự', meaning: 'Sự quan tâm, để ý chu toàn' },
      { word: '水滴', reading: 'すいてき', hanViet: 'Thủy tích', meaning: 'Giọt nước đọng' },
      { word: '自発的', reading: 'じはつてき', hanViet: 'Tự phát đích', meaning: 'Một cách tự nguyện, tự giác' },
      { word: '気遣う', reading: 'きづかう', meaning: 'Quan tâm, lo lắng cho ai đó' },
    ],
    grammarNotes: [
      '〜ように: Để mà... (mục đích phòng tránh sự cố)',
      '〜わけではない: Không hẳn là...',
      '〜のではないだろうか: Chẳng phải là... hay sao (Bí kíp 3: quan điểm tác giả)',
    ],
    sentenceBreakdown: [
      {
        sentenceIndex: 0,
        jp: '日本には昔から「思いやり」という言葉がある。これは、相手の立場に立ってその人の気持ちを察し、配慮することを意味する。',
        vi: 'Ở Nhật từ xa xưa đã có từ "Omoiyari". Từ này có nghĩa là đặt mình vào vị trí của đối phương để cảm nhận và chu đáo quan tâm tới họ.',
      },
      {
        sentenceIndex: 1,
        jp: '例えば、雨の日に店に入るとき、傘についた水滴を払ってから入るのも思いやりの一つだ。',
        vi: 'Ví dụ, vào ngày mưa khi bước vào cửa hàng, việc giũ sạch nước đọng trên ô rồi mới vào cũng là một nét Omoiyari.',
      },
      {
        sentenceIndex: 2,
        jp: '自分が床を濡らさないように気をつけることで、次に歩く人が滑って転ばないようにするためである。',
        vi: 'Bởi vì bằng cách cẩn thận không làm ướt sàn nhà, ta sẽ giúp người đi sau không bị trượt ngã.',
        isClue: true,
      },
      {
        sentenceIndex: 3,
        jp: '言われる前に行動する思いやりの心こそが、お互いに心地よい人間関係を築く基礎になるのではないだろうか。',
        vi: 'Chẳng phải chính tinh thần biết hành động trước khi được yêu cầu mới là nền tảng xây dựng mối quan hệ thoải mái cho đôi bên hay sao?',
        isClue: true,
      },
    ],
    questions: [
      {
        id: 1,
        question: '雨の日に傘の水滴を払って店に入るのはなぜですか。(Vì sao vào ngày mưa người ta lại giũ nước trên ô trước khi vào quán?)',
        options: [
          '店の人に注意されて怒られないようにするため (Để không bị nhân viên cửa hàng nhắc nhở mắng mỏ)',
          '次に歩く人が濡れた床で滑って転ばないようにするため (Để người đi sau không bị trượt ngã vì sàn ướt)',
          '自分の傘を早く乾かして長持ちさせるため (Để ô của mình nhanh khô và dùng được bền hơn)',
          '店の床掃除を手伝う義務があるため (Vì có nghĩa vụ phải giúp dọn dẹp sàn quán)',
        ],
        correctIndex: 1,
        explanation: 'Trong đoạn 2 ghi rõ: "自分が床を濡らさないように気をつけることで、次に歩く人が滑って転ばないようにするためである".',
        trapAnalysis: [
          { optionIndex: 0, reason: 'Bài nói đây là hành động tự nguyện (自発的), không phải do bị nhắc nhở.' },
          { optionIndex: 2, reason: 'Tự suy diễn sai mục đích quan tâm tới người khác.' },
          { optionIndex: 3, reason: 'Khách hàng không có nghĩa vụ dọn dẹp.' },
        ],
        clueSentenceIndices: [2],
        tacticalHint: 'Đọc câu số 2 có chữ 「滑って転ばないようにするため」!',
      },
    ],
  },

  // ==========================================
  // BÀI MỞ RỘNG 11: TRUNG VĂN (MEDIUM 3)
  // ==========================================
  {
    id: 'dokkai_medium_3',
    title: '11. Rác thải nhựa đại dương và hành động xanh (Mondai 11)',
    level: 'medium',
    levelLabel: 'Trung văn (Mondai 11)',
    category: 'Môi trường & Xã hội',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    estimatedMinutes: 5,
    targetSkill: 'Kỹ năng xác định nguyên nhân - hậu quả và đề xuất giải pháp của tác giả',
    plainPassage: `プラスチック製品は軽くて丈夫で安いため、私たちの生活に欠かせないものとなっている。スーパーのレジ袋やペットボトルなど、毎日多くのプラスチックが消費されている。
しかし、適切に処分されなかったプラスチックごみが川を通じて海へ流れ出し、深刻な海洋汚染を引き起こしている。プラスチックは自然に分解されるまでに数百年かかると言われており、魚や鳥が誤って飲み込んで命を落とす被害も後を絶たない。
この問題を解決するためには、国や企業の努力はもちろんのこと、私たち一人ひとりがマイバッグやマイボトルを持ち歩くなど、身近なところからプラスチックの使用を減らす意識を持つべきだ。`,
    furiganaPassage: `プラスチック<ruby>製品<rt>せいひん</rt></ruby>は<ruby>軽<rt>かる</rt></ruby>くて<ruby>丈夫<rt>じょうぶ</rt></ruby>で<ruby>安<rt>やす</rt></ruby>いため、<ruby>私<rt>わたし</rt></ruby>たちの<ruby>生活<rt>せいかつ</rt></ruby>に<ruby>欠<rt>か</rt></ruby>かせないものとなっている。スーパーのレジ<ruby>袋<rt>ぶくろ</rt></ruby>やペットボトルなど、<ruby>毎日<rt>まいにち</rt></ruby><ruby>多<rt>おお</rt></ruby>くのプラスチックが<ruby>消費<rt>しょうひん</rt></ruby>されている。
<span class="bg-rose-400/30 px-1 rounded font-bold text-rose-600">しかし</span>、<ruby>適切<rt>てきせつ</rt></ruby>に<ruby>処分<rt>しょぶん</rt></ruby>されなかったプラスチックごみが<ruby>川<rt>かわ</rt></ruby>を<ruby>通<rt>つう</rt></ruby>じて<ruby>海<rt>うみ</rt></ruby>へ<ruby>流<rt>なが</rt></ruby>れ<ruby>出<rt>だ</rt></ruby>し、<ruby>深刻<rt>しんこく</rt></ruby>な<ruby>海洋汚染<rt>かいようおせん</rt></ruby>を<ruby>引<rt>ひ</rt></ruby>き<ruby>起<rt>お</rt></ruby>こしている。
<span class="bg-amber-400/30 px-1 rounded font-bold">この問題を解決するためには、国や企業の努力はもちろんのこと、私たち一人ひとりがマイバッグを持ち歩くなど、身近なところからプラスチックの使用を減らす意識を持つべきだ。</span>`,
    preReadingVocab: [
      { word: '欠かせない', reading: 'かかせない', meaning: 'Không thể thiếu được' },
      { word: '適切に', reading: 'てきせつに', hanViet: 'Thích thiết', meaning: 'Một cách thích hợp, đúng cách' },
      { word: '海洋汚染', reading: 'かいようおせん', hanViet: 'Hải dương ô nhiễm', meaning: 'Ô nhiễm môi trường biển' },
      { word: '引き起こす', reading: 'ひきおこす', meaning: 'Gây ra, dẫn đến hậu quả' },
      { word: '後を絶たない', reading: 'あとをたたない', meaning: 'Liên tiếp xảy ra không dứt' },
    ],
    grammarNotes: [
      'N + はもちろんのこと: Không chỉ N mà ngay cả... (huống chi là)',
      '〜べきだ: Cần phải / Nên làm... (lời khuyên kiên quyết của tác giả)',
    ],
    sentenceBreakdown: [
      {
        sentenceIndex: 0,
        jp: 'プラスチック製品は軽くて丈夫で安いため、私たちの生活に欠かせないものとなっている。',
        vi: 'Đồ nhựa nhẹ, bền và rẻ nên đã trở thành vật dụng không thể thiếu trong cuộc sống chúng ta.',
      },
      {
        sentenceIndex: 1,
        jp: 'しかし、適切に処分されなかったプラスチックごみが川を通じて海へ流れ出し、深刻な海洋汚染を引き起こしている。',
        vi: 'Tuy nhiên, rác nhựa không được xử lý đúng cách trôi qua sông ra biển, gây ra tình trạng ô nhiễm đại dương nghiêm trọng.',
        connector: 'しかし (Tuy nhiên)',
        isClue: true,
      },
      {
        sentenceIndex: 2,
        jp: 'この問題を解決するためには、国や企業の努力はもちろんのこと、私たち一人ひとりがマイバッグやマイボトルを持ち歩くなど、身近なところからプラスチックの使用を減らす意識を持つべきだ。',
        vi: 'Để giải quyết vấn đề này, không chỉ nỗ lực của chính phủ và doanh nghiệp, mà mỗi cá nhân chúng ta cũng nên có ý thức giảm dùng đồ nhựa từ những việc gần gũi như mang theo túi vải riêng.',
        predicate: '意識を持つべきだ (Nên có ý thức...)',
        isClue: true,
      },
    ],
    questions: [
      {
        id: 1,
        question: 'プラスチックごみの問題に対して、筆者は何を提案していますか。(Đối với vấn đề rác thải nhựa, tác giả đề xuất điều gì?)',
        options: [
          'プラスチック製品の生産を法律で完全に禁止すること (Cấm hoàn toàn việc sản xuất đồ nhựa bằng luật pháp)',
          '国や企業だけにすべての責任を任せること (Giao toàn bộ trách nhiệm cho chính phủ và doanh nghiệp)',
          '個人もマイバッグを使うなど、身近なところから使用を減らす意識を持つこと (Cá nhân cũng cần có ý thức giảm sử dụng từ những việc gần gũi như dùng túi riêng)',
          'プラスチックごみをすべて川に流すこと (Xả toàn bộ rác nhựa ra sông)',
        ],
        correctIndex: 2,
        explanation: 'Khớp chính xác với câu cuối mang đuôi 「〜べきだ」: "私たち一人ひとりがマイバッグやマイボトルを持ち歩くなど、身近なところからプラスチックの使用を減らす意識を持つべきだ".',
        trapAnalysis: [
          { optionIndex: 0, reason: 'Bẫy cực đoan "cấm hoàn toàn bằng luật" không có trong bài.' },
          { optionIndex: 1, reason: 'Ngược với bài: tác giả kêu gọi nỗ lực của từng cá nhân.' },
          { optionIndex: 3, reason: 'Hoàn toàn sai trái.' },
        ],
        clueSentenceIndices: [2],
        tacticalHint: 'Nhìn vào câu cuối cùng có cấu trúc 「〜べきだ」!',
      },
    ],
  },

  // ==========================================
  // BÀI MỞ RỘNG 12: TÌM THÔNG TIN (MONDAI 13 - 2)
  // ==========================================
  {
    id: 'dokkai_info_2',
    title: '12. Bảng phân loại rác & Lịch thu gom đồ cồng kềnh (Mondai 13)',
    level: 'info_retrieval',
    levelLabel: 'Tìm kiếm thông tin (Mondai 13)',
    category: 'Thông báo & Đời sống',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    estimatedMinutes: 4,
    targetSkill: 'Kỹ năng tra cứu bảng quy định ngày giờ & điều kiện thu gom rác cồng kềnh',
    plainPassage: `【みどり市 粗大ごみ（大型ごみ）の出し方ガイド】
家庭から出る家具や自転車など、1辺が30cmを超えるものは「粗大ごみ」です。

■ 収集日：毎月 第2・第4水曜日（要事前予約）
■ 申込手順：
  1. 電話またはインターネットで「粗大ごみ受付センター」に申し込む。
     （受付締切：収集日の3日前まで）
  2. 市内のコンビニ等で「粗大ごみ処理券（シール）」を購入する。
     ・小（30cm〜1m未満）：500円
     ・大（1m以上）：1,000円
  3. シールに名前を書いてごみに貼り、収集日当日の朝8:30までに出す。
※ 注意事項：
  ※ 家電リサイクル法対象品（テレビ、冷蔵庫、洗濯機、エアコン）は市では収集できません。
  ※ 予約のないごみやシールの貼っていないごみは収集しません。`,
    furiganaPassage: `【みどり<ruby>市<rt>し</rt></ruby> <ruby>粗大<rt>そだい</rt></ruby>ごみ（<ruby>大型<rt>おおがた</rt></ruby>ごみ）の<ruby>出<rt>だ</rt></ruby>し<ruby>方<rt>かた</rt></ruby>ガイド】
<ruby>家庭<rt>かてい</rt></ruby>から<ruby>出<rt>で</rt></ruby>る<ruby>家具<rt>かぐ</rt></ruby>や<ruby>自転車<rt>じてんしゃ</rt></ruby>など、1<ruby>辺<rt>ぺん</rt></ruby>が30cmを<ruby>超<rt>こ</rt></ruby>えるものは「<ruby>粗大<rt>そだい</rt></ruby>ごみ」です。

■ <ruby>収集日<rt>しゅうしゅうび</rt></ruby>：<ruby>毎月<rt>まいつき</rt></ruby> <ruby>第<rt>だい</rt></ruby>2・<ruby>第<rt>だい</rt></ruby>4<ruby>水曜日<rt>すいようび</rt></ruby>（<ruby>要事前予約<rt>ようじぜんよやく</rt></ruby>）
■ <ruby>申込手順<rt>もうしこみてじゅん</rt></ruby>：
  1. <ruby>電話<rt>でんわ</rt></ruby>またはインターネットで「<ruby>粗大<rt>そだい</rt></ruby>ごみ<ruby>受付<rt>うけつけ</rt></ruby>センター」に<ruby>申<rt>もう</rt></ruby>し<ruby>込<rt>こ</rt></ruby>む。（<ruby>締切<rt>しめきり</rt></ruby>：<ruby>収集日<rt>しゅうしゅうび</rt></ruby>の3<ruby>日前<rt>にちまえ</rt></ruby>まで）
  2. <ruby>市内<rt>しない</rt></ruby>のコンビニ<ruby>等<rt>とう</rt></ruby>で「<ruby>処理券<rt>しょりけん</rt></ruby>」を<ruby>購入<rt>こうにゅう</rt></ruby>する。
     ・<ruby>小<rt>しょう</rt></ruby>（30cm〜1m<ruby>未満<rt>みまん</rt></ruby>）：500<ruby>円<rt>えん</rt></ruby>
     ・<ruby>大<rt>だい</rt></ruby>（1m<ruby>以上<rt>いじょう</rt></ruby>）：1,000<ruby>円<rt>えん</rt></ruby>
  3. シールにごみを<ruby>貼<rt>は</rt></ruby>り、<ruby>当日<rt>とうじつ</rt></ruby>の<ruby>朝<rt>あさ</rt></ruby>8:30までにごみを<ruby>出<rt>だ</rt></ruby>す。
※ <ruby>注意事項<rt>ちゅういじこう</rt></ruby>：
  ※ <span class="bg-rose-400/30 px-1 rounded font-bold text-rose-600">テレビ、冷蔵庫、洗濯機、エアコンは市では収集できません。</span>`,
    preReadingVocab: [
      { word: '粗大ごみ', reading: 'そだいごみ', hanViet: 'Thô đại', meaning: 'Rác cồng kềnh (bàn ghế, xe đạp...)' },
      { word: '収集日', reading: 'しゅうしゅうび', hanViet: 'Thu tập nhật', meaning: 'Ngày thu gom rác' },
      { word: '処理券', reading: 'しょりけん', hanViet: 'Xử lý khoán', meaning: 'Tem / Phiếu trả phí xử lý rác' },
      { word: '未満', reading: 'みまん', hanViet: 'Vị mãn', meaning: 'Chưa đủ, nhỏ hơn (dưới 1m)' },
    ],
    grammarNotes: [
      '〜を超える: Vượt quá mốc...',
      '〜未満: Dưới mức... (không bao gồm chính mốc đó)',
    ],
    sentenceBreakdown: [
      {
        sentenceIndex: 0,
        jp: 'みどり市粗大ごみの出し方ガイド。1辺が30cmを超える家具や自転車が対象。',
        vi: 'Hướng dẫn đổ rác cồng kềnh thành phố Midori. Đối tượng là đồ đạc, xe đạp có 1 cạnh trên 30cm.',
      },
      {
        sentenceIndex: 1,
        jp: '収集日は第2・第4水曜日（要事前予約）。処理券は小500円、大1,000円。',
        vi: 'Ngày thu gom: Thứ 4 tuần 2 và 4 (cần đặt trước). Tem phí: Nhỏ 500 yên, Lớn 1.000 yên.',
        isClue: true,
      },
      {
        sentenceIndex: 2,
        jp: '注意事項：テレビ・冷蔵庫・洗濯機・エアコンは市で収集できません。',
        vi: 'Lưu ý: Tivi, tủ lạnh, máy giặt, điều hòa thì thành phố KHÔNG thu gom.',
        isClue: true,
      },
    ],
    questions: [
      {
        id: 1,
        question: 'みどり市の粗大ごみとして出せないものはどれですか。(Đồ vật nào KHÔNG THỂ vứt theo diện rác cồng kềnh của thành phố?)',
        options: [
          '長さ80cmの古い木の机 (Bàn gỗ cũ dài 80cm)',
          '使わなくなった大人用の自転車 (Xe đạp người lớn không dùng nữa)',
          '壊れたテレビ (Tivi bị hỏng)',
          '高さ1m20cmの本棚 (Kệ sách cao 1m20cm)',
        ],
        correctIndex: 2,
        explanation: 'Áp dụng Bí kíp 4: Đọc dòng dấu hoa thị ※注意事項 ở cuối bảng: "テレビ、冷蔵庫、洗濯機、エアコンは市では収集できません" (Tivi, tủ lạnh, máy giặt, điều hòa KHÔNG ĐƯỢC THU GOM).',
        trapAnalysis: [
          { optionIndex: 0, reason: 'Bàn 80cm vứt được (mua tem nhỏ 500 yên).' },
          { optionIndex: 1, reason: 'Xe đạp vứt được (mua tem lớn 1000 yên).' },
          { optionIndex: 3, reason: 'Kệ sách 1m20cm vứt được (mua tem lớn 1000 yên).' },
        ],
        clueSentenceIndices: [2],
        tacticalHint: 'Đọc kỹ dòng hoa thị ※ ở cuối bảng về các thiết bị điện gia dụng bị cấm!',
      },
    ],
  },
];
