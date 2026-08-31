import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_API_KEY || 'sk_test_mock_stripe_key', {
  apiVersion: '2024-06-20',
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: '100% Free Plan (Toàn bộ 880 từ Mimikara N3)',
    description: 'Miễn phí 100% toàn bộ 12 Unit Mimikara N3 & AI Assistant',
    maxReviewsPerDay: Infinity,
    maxAiCallsPerDay: Infinity,
    price: 0,
    priceId: '',
    features: [
      '⚡ Ôn tập KHÔNG GIỚI HẠN mỗi ngày',
      '📚 Trọn bộ 880 từ vựng Mimikara N3 chia theo 12 Unit',
      '🤖 AI Assistant, AI Quiz & Sửa lỗi câu KHÔNG GIỚI HẠN',
      '🔊 Audio phát âm tiếng Nhật chuẩn Tokyo',
      '📱 Offline Mode (PWA) cài trực tiếp điện thoại',
      '📊 Thống kê Heatmap 365 ngày & Phân tích điểm yếu',
    ],
  },
  PRO: {
    name: 'Supporter VIP Plan',
    description: 'Dành cho người dùng muốn ủng hộ server phát triển thêm tính năng',
    maxReviewsPerDay: Infinity,
    maxAiCallsPerDay: Infinity,
    price: 4.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_supporter_vip',
    features: [
      '👑 Huy hiệu Supporter VIP',
      '⚡ Ưu tiên tài nguyên AI siêu tốc độ cao',
      '🚀 Hỗ trợ trực tiếp từ đội ngũ phát triển N3',
    ],
  },
};

export async function checkAiQuota(
  userId: string,
  userPlan: 'FREE' | 'PRO',
  currentUsageToday: number,
  lastResetDate: Date
): Promise<{ allowed: boolean; remaining: number }> {
  // Cho phép 100% FREE không giới hạn cho mọi người dùng
  return { allowed: true, remaining: 99999 };
}
