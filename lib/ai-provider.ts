import { N3_SYSTEM_PROMPTS } from './ai';

export interface ChatMessage {
  role: string;
  content: string;
}

export interface AIProviderOptions {
  systemPrompt?: string;
  messages?: ChatMessage[];
  prompt?: string;
  temperature?: number;
  jsonMode?: boolean;
}

/**
 * Gọi AI linh hoạt đa nguồn với thứ tự ưu tiên:
 * 1. Ollama Local (Gemma 2, Qwen 2.5, Llama 3) - Miễn phí 100% không tốn tiền, chạy trên máy
 * 2. Google Gemini API (Nếu có GEMINI_API_KEY) - Miễn phí hạn mức cao từ Google AI Studio
 * 3. OpenAI API (Nếu có OPENAI_API_KEY)
 * 4. Trả về null nếu không có dịch vụ nào khả dụng để tầng trên chạy Mock Offline
 */
export async function callAIWithFallbacks(options: AIProviderOptions): Promise<string | null> {
  const {
    systemPrompt = N3_SYSTEM_PROMPTS.TUTOR_CHAT,
    messages = [],
    prompt = '',
    temperature = 0.7,
    jsonMode = false,
  } = options;

  const finalMessages: ChatMessage[] = [];
  if (systemPrompt) {
    finalMessages.push({ role: 'system', content: systemPrompt });
  }
  if (messages && messages.length > 0) {
    finalMessages.push(...messages);
  } else if (prompt) {
    finalMessages.push({ role: 'user', content: prompt });
  }

  // --- 1. OLLAMA LOCAL AI (Gemma 2, Qwen 2.5, Llama 3, v.v.) ---
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
  const ollamaModel = process.env.OLLAMA_MODEL || 'gemma2'; // Hoặc 'qwen2.5', 'llama3.2', 'gemma:2b'
  const enableOllama = process.env.ENABLE_OLLAMA !== 'false';

  if (enableOllama) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout nếu Ollama chưa bật

      const res = await fetch(`${ollamaBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: ollamaModel,
          messages: finalMessages,
          stream: false,
          format: jsonMode ? 'json' : undefined,
          options: {
            temperature,
          },
        }),
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const content = data?.message?.content;
        if (content && content.trim()) {
          return content.trim();
        }
      }
    } catch (ollamaErr: any) {
      // Ollama chưa chạy trên máy hoặc không kết nối được -> bỏ qua và kiểm tra provider tiếp theo
    }
  }

  // --- 2. GOOGLE GEMINI API (GEMINI_API_KEY) ---
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && !geminiKey.includes('your-gemini-api-key')) {
    try {
      const contents = finalMessages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
            contents,
            generationConfig: {
              temperature,
              responseMimeType: jsonMode ? 'application/json' : undefined,
            },
          }),
        }
      );

      if (geminiRes.ok) {
        const gData = await geminiRes.json();
        const replyText = gData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText && replyText.trim()) {
          return replyText.trim();
        }
      }
    } catch (geminiErr) {
      console.warn('Gemini error:', geminiErr);
    }
  }

  // --- 3. OPENAI API (OPENAI_API_KEY) ---
  const openAiKey = process.env.OPENAI_API_KEY;
  if (openAiKey && !openAiKey.includes('your-openai-api-key') && openAiKey.startsWith('sk-')) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: finalMessages,
          response_format: jsonMode ? { type: 'json_object' } : undefined,
          temperature,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply && reply.trim()) {
          return reply.trim();
        }
      }
    } catch (openAiErr) {
      console.warn('OpenAI error:', openAiErr);
    }
  }

  return null; // Không có AI provider nào phản hồi -> dùng offline engine
}
