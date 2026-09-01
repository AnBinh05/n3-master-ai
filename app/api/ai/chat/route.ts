import { NextResponse } from 'next/server';
import { N3_SYSTEM_PROMPTS } from '@/lib/ai';
import { callAIWithFallbacks } from '@/lib/ai-provider';
import { generateSmartTutorResponse } from '@/lib/offline-tutor';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMsg = messages?.[messages.length - 1]?.content || 'Xin chào Sensei';

    // 1. Thử gọi AI (Ollama Local: Gemma/Qwen/Llama -> Gemini -> OpenAI)
    const aiResponse = await callAIWithFallbacks({
      systemPrompt: N3_SYSTEM_PROMPTS.TUTOR_CHAT,
      messages: messages || [],
      temperature: 0.7,
    });

    if (aiResponse) {
      return NextResponse.json({ message: { role: 'assistant', content: aiResponse } });
    }

    // 2. Chế độ Mock AI Chatbot Offline Thông Minh (Tra từ Mimikara, Ngữ pháp, Đố vui, Mẹo thi)
    const smartReply = generateSmartTutorResponse(lastUserMsg, messages || []);
    return NextResponse.json({ message: { role: 'assistant', content: smartReply } });
  } catch (error: any) {
    console.error('AI Tutor Chat Error:', error);
    return NextResponse.json({
      message: {
        role: 'assistant',
        content: 'Sensei đã ghi nhận câu hỏi của bạn. Hãy thử hỏi về từ vựng Mimikara N3, ngữ pháp hoặc gõ "đố vui" nhé!',
      },
    });
  }
}
