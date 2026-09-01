import { NextResponse } from 'next/server';
import { N3_SYSTEM_PROMPTS } from '@/lib/ai';
import { callAIWithFallbacks } from '@/lib/ai-provider';
import { findGrammarPoint, findVocabInMimikara } from '@/lib/offline-tutor';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    if (!topic) return NextResponse.json({ error: 'Topic is required' }, { status: 400 });

    // 1. Thử gọi AI (Ollama Local: Gemma/Qwen -> Gemini -> OpenAI)
    const aiResponse = await callAIWithFallbacks({
      systemPrompt: N3_SYSTEM_PROMPTS.EXPLAINER,
      prompt: `Hãy giải thích chi tiết điểm ngữ pháp / từ vựng JLPT N3 này: ${topic}`,
      temperature: 0.5,
    });

    if (aiResponse) {
      return NextResponse.json({ explanation: aiResponse });
    }

    // 2. Smart Offline Mock Explainer
    const matchedGrammar = findGrammarPoint(topic);
    if (matchedGrammar) {
      const explanation = `### 📖 Giải thích chi tiết JLPT N3: **【${matchedGrammar.pattern}】**

#### 1. Ý nghĩa cốt lõi & Cách dùng
- **Romaji / Cách đọc:** *${matchedGrammar.romaji}*
- **Ý nghĩa:** **${matchedGrammar.meaning}**
- **Diễn giải:** ${matchedGrammar.explanation}

#### 2. Cấu trúc kết hợp
- \`${matchedGrammar.formation}\`

#### 3. Bẫy đề thi JLPT N3 cần tránh
- ${matchedGrammar.trap}

#### 4. Ví dụ thực tế chuẩn JLPT N3
${matchedGrammar.examples.map((ex, i) => `${i + 1}. **${ex.jp}**\n   *(Dịch: ${ex.vi})*`).join('\n\n')}`;

      return NextResponse.json({ explanation });
    }

    const matchedVocab = findVocabInMimikara(topic);
    if (matchedVocab) {
      const explanation = `### 📇 Giải thích Từ vựng Mimikara N3: **【${matchedVocab.word}】**

- **Cách đọc (Furigana):** **${matchedVocab.reading}**
${matchedVocab.hanViet ? `- **Âm Hán Việt:** **${matchedVocab.hanViet}**` : ''}
- **Nghĩa tiếng Việt:** **${matchedVocab.meaning}**
${matchedVocab.kanji && matchedVocab.kanji.length > 0 ? `- **Chi tiết Kanji:** ${matchedVocab.kanji.map(k => `${k.kanji} (${k.meaning})`).join(', ')}` : ''}

#### 📌 Câu ví dụ thực tế giáo trình Mimikara Oboeru:
- **${matchedVocab.example}**

#### 💡 Bí quyết ôn tập:
- Thường xuất hiện trong phần thi Mondai 1 (Cách đọc Kanji) và Mondai 3 (Cách dùng từ đúng văn cảnh).
- Hãy thêm từ này vào Flashcard SRS để ôn tập hàng ngày!`;

      return NextResponse.json({ explanation });
    }

    // Generic synthesis if not in exact db
    const genericExplanation = `### 📖 Giải thích chi tiết JLPT N3: **${topic}**

#### 1. Định nghĩa & Ý nghĩa
- Khái niệm / cấu trúc **${topic}** thường gặp trong chương trình và đề thi thực tế JLPT N3.
- Dùng để diễn đạt sắc thái ý nghĩa trong giao tiếp và văn viết tiếng Nhật trình độ trung cấp.

#### 2. Cách sử dụng & Lưu ý
- Chú ý dạng chia của từ kết hợp đứng trước (thể từ điển, thể quá khứ hoặc danh từ/tính từ).
- Hãy nắm chắc sự khác biệt giữa văn phong nói thân mật và văn phong viết trang trọng.

#### 3. Ví dụ tham khảo
1. **「${topic}」について、毎日しっかりと復習しましょう。**
   *(Hãy cùng nhau ôn tập kỹ càng về "${topic}" mỗi ngày nhé.)*
2. **試験でよく出題されるので、用例をたくさん覚えておくと安心です。**
   *(Vì thường xuất hiện trong đề thi nên nhớ nhiều câu ví dụ sẽ rất yên tâm.)*`;

    return NextResponse.json({ explanation: genericExplanation });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 });
  }
}
