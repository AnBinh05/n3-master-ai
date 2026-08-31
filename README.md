# 🌸 N3 Master AI — Nền Tảng Học Flashcard JLPT N3 Đột Phá Hỗ Trợ AI

<div align="center">

![N3 Master AI Banner](https://images.unsplash.com/photo-1528164344705-475426879c0d?w=1200&auto=format&fit=crop&q=80)

**Ứng dụng Web Học Tiếng Nhật JLPT N3 theo phương pháp Lặp Lại Ngắt Quãng (Anki Spaced Repetition System - SM-2) tích hợp Trí Tuệ Nhân Tạo (AI).**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Tính Năng Chính](#-tính-năng-nổi-bật) • [Cài Đặt & Khởi Chạy](#-cài-đặt--khởi-chạy) • [12 Unit Mimikara N3](#-trọn-bộ-12-unit-mimikara-oboeru-n3) • [Công Nghệ](#-công-nghệ-sử-dụng) • [Deploy Vercel](#-triển-khai-lên-vercel)

</div>

---

## 🌟 Giới Thiệu Sản Phẩm

**N3 Master AI** được xây dựng nhằm giải quyết bài toán lớn nhất của người học tiếng Nhật chuẩn bị cho kỳ thi **JLPT N3**: *học trước quên sau và thiếu ngữ cảnh thực tế*.

Bằng cách kết hợp giữa **thuật toán ghi nhớ kinh điển Anki SM-2 (Spaced Repetition)** và sức mạnh của **Trí Tuệ Nhân Tạo (OpenAI GPT-4o / N3 AI Studio)**, ứng dụng giúp bạn tối ưu hóa thời gian học, ghi nhớ sâu 880 từ vựng Mimikara N3 và tự tin vượt qua kỳ thi với điểm số cao nhất.

---

## ✨ Tính Năng Nổi Bật

### 1. 🎴 Trọn Bộ 880 Từ Vựng Chuẩn Sách Mimikara Oboeru N3 (12 Unit)
- **Dữ liệu chuẩn gốc 100%** từ giáo trình *耳から覚える N3 語彙*.
- Phân chia bài bản thành **12 Unit học riêng biệt** theo đúng lộ trình sách.
- Mỗi thẻ gồm đầy đủ: **Từ Vựng (Kanji)**, **Cách đọc Hiragana (Furigana)**, **Âm Hán Việt**, **Ý nghĩa Tiếng Việt**, **English Meaning** và **Câu ví dụ ngữ cảnh thực tế**.
- Cung cấp sẵn file sao lưu chuẩn Anki Desktop: `public/mimikara_n3_880.csv`.

### 2. 🧠 Thuật Toán Ghi Nhớ Ngắt Quãng Anki (SM-2 SRS Algorithm)
- Phân loại 4 mức đánh giá độ nhớ chuẩn Anki:
  - 🔄 **Lại (Again)**: Chưa nhớ thẻ, ôn lại ngay sau 1 ngày.
  - ⚡ **Khó (Hard)**: Nhớ mang máng, tăng nhẹ khoảng cách ôn tập.
  - 👍 **Nhớ rõ (Good)**: Nhớ tốt, nhân hệ số Ease Factor theo chu kỳ SM-2.
  - ✨ **Rất dễ (Easy)**: Thuộc làu, nhảy vọt khoảng cách ôn tập.
- Tính toán chính xác thời điểm thẻ cần xuất hiện lại (Due Date) để đạt tỷ lệ duy trì trí nhớ (**Retention Rate > 90%**).

### 3. 🎨 Thẻ 3D Flashcard Tương Tác & Phát Âm Bản Xứ (TTS)
- Giao diện lật thẻ 3D sống động (Framer Motion 3D CSS).
- Tích hợp **Web Speech API (`SpeechSynthesis`)** phát âm tiếng Nhật chuẩn Tokyo (`ja-JP`) với tốc độ chuẩn học thuật `0.85x` hỗ trợ Shadowing.
- Tự động ẩn cách đọc ở mặt trước để người học tự tư duy, chỉ hiển thị đầy đủ giải thích khi lật thẻ.

### 4. 🤖 N3 AI Studio (Trợ Lý Trí Tuệ Nhân Tạo Chuyên Sâu)
- **AI Flashcard Generator**: Nhập bất kỳ từ vựng / ngữ pháp nào, AI tự phân tích và tạo thẻ chuẩn format N3.
- **AI Grammar Explainer**: Phân tích chi tiết các điểm ngữ pháp dễ nhầm lẫn và bẫy thường gặp trong đề thi JLPT.
- **AI Quiz Generator**: Tự động sinh đề thi trắc nghiệm theo đúng cấu trúc đề thi JLPT thật.
- **AI Chatbot & Sentence Correction**: Trò chuyện tiếng Nhật và nhận sửa lỗi ngữ pháp câu văn theo thời gian thực.
- *Hỗ trợ cơ chế Hybrid:* Chạy mượt mà cả khi chưa có API Key (nhờ Offline N3 Dictionary) và khi có OpenAI GPT-4o Key.

### 5. 📊 Bảng Thống Kê & Heatmap Lịch Sử Học Tập (Github-style)
- **Heatmap Calendar**: Theo dõi chuỗi ngày học tập liên tục (Streak).
- **Retention Rate Chart**: Biểu đồ phân tích tỷ lệ nhớ thẻ và tiến độ làm chủ kiến thức theo thời gian.
- **Due Cards Counter**: Thống kê số lượng thẻ cần ôn mỗi ngày theo từng Unit.

### 6. 📱 Mobile-First & PWA-Ready
- Tương thích hoàn hảo trên điện thoại di động, máy tính bảng và máy tính.
- Hỗ trợ **Progressive Web App (PWA)**: Có thể "Cài đặt vào Màn hình chính" (Add to Home Screen) để sử dụng như một ứng dụng Native trên iOS / Android.

---

## 📚 Trọn Bộ 12 Unit Mimikara Oboeru N3

| Unit | Tên Unit | Phạm vi từ | Số lượng | Nội dung trọng tâm |
| :---: | :--- | :---: | :---: | :--- |
| **Unit 1** | 名詞 1 (Danh từ 1) | **#1 - #70** | 70 từ | Gia đình, con người, công việc, quan hệ đời sống |
| **Unit 2** | 名詞 2 (Danh từ 2) | **#71 - #120** | 50 từ | Thiên nhiên, xã hội, môi trường, đồ vật xung quanh |
| **Unit 3** | 動詞 1 (Động từ 1) | **#121 - #220** | 100 từ | Tự động từ & tha động từ cơ bản nhóm 1 |
| **Unit 4** | 動詞からできた名詞 (Danh từ phái sinh) | **#221 - #258** | 38 từ | Danh từ bắt nguồn từ thể liên từ của động từ |
| **Unit 5** | イ形容詞・ナ形容詞 1 (Tính từ 1) | **#259 - #298** | 40 từ | Tính từ miêu tả tính cách, cảm xúc và con người |
| **Unit 6** | 動詞 2・名詞 3 (Động từ 2 & Danh từ 3) | **#299 - #410** | 112 từ | Động từ biến đổi và danh từ xã hội, kỹ thuật, thông tin |
| **Unit 7** | 動詞 3 (Động từ 3) | **#411 - #510** | 100 từ | Động từ tương tác, phán đoán, di chuyển và cảm giác |
| **Unit 8** | カタカナ語 1・形容詞 2 (Katakana 1 & Tính từ 2) | **#511 - #590** | 80 từ | Từ mượn Katakana đời sống và tính từ trạng thái |
| **Unit 9** | 副詞 1・名詞 4 (Phó từ 1 & Danh từ 4) | **#591 - #715** | 125 từ | Phó từ tần suất/mức độ & danh từ kinh tế, y tế |
| **Unit 10** | 動詞 4 (Động từ 4) | **#716 - #795** | 80 từ | Động từ chuyển dịch, tiếp nối, liên kết và trừu tượng |
| **Unit 11** | カタカナ語 2・料理動詞 (Katakana 2 & Nấu ăn) | **#796 - #845** | 50 từ | Katakana nâng cao & bộ động từ chuyên về nấu nướng |
| **Unit 12** | 副詞 2・接続詞・連語 (Phó từ 2 & Liên từ) | **#846 - #880** | 35 từ | Phó từ tình thái, từ nối câu trọng tâm đề thi N3 |
| **Bonus** | Ngữ Pháp N3 Trọng Tâm | Mẫu chọn lọc | Đa dạng | Tổng hợp mẫu câu ngữ pháp trọng điểm đề thi JLPT |

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend & Core Framework**: [Next.js 14](https://nextjs.org/) (App Router), [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts & Visualization**: [Recharts](https://recharts.org/)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) (SQLite cho phát triển cục bộ, PostgreSQL / Supabase cho Production)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/), OpenAI GPT-4o-mini API
- **Spaced Repetition**: Anki SM-2 Algorithm implementation

---

## 🚀 Cài Đặt & Khởi Chạy Cục Bộ (Local)

### 1. Clone hoặc Mở Dự Án
```bash
cd d:\N3
```

### 2. Cài đặt các thư viện phụ thuộc
```bash
npm install
```

### 3. Cấu hình file môi trường `.env`
Tạo hoặc chỉnh sửa file `.env` tại thư mục gốc:
```env
# Database SQLite chạy cục bộ (Không cần cài đặt gì thêm)
DATABASE_URL="file:./dev.db"

# NextAuth Secret
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars-long"

# OpenAI Key (Tùy chọn - Để trống hệ thống vẫn chạy tốt bằng Offline Engine)
OPENAI_API_KEY=""

# Public URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Đồng bộ CSDL & Nạp 880 Từ Vựng Mimikara N3
```bash
# Tạo bảng CSDL
npx prisma db push

# Nạp 12 Unit Mimikara N3 và dữ liệu ngữ pháp
npm run seed
```

### 5. Chạy Server Phát Triển
```bash
npm run dev
```
Truy cập: **[http://localhost:3000](http://localhost:3000)** trên trình duyệt.

---

## 🚢 Triển Khai Lên Vercel

Ứng dụng được tối ưu hóa 100% để deploy lên **Vercel** chỉ trong vài phút:

1. **Chuẩn bị CSDL PostgreSQL trên Cloud** (Miễn phí từ [Supabase](https://supabase.com) hoặc [Neon](https://neon.tech)).
2. Trong `prisma/schema.prisma`, đổi `provider = "sqlite"` thành `provider = "postgresql"`.
3. Đẩy mã nguồn lên GitHub.
4. Import Repository vào Vercel.
5. Thiết lập các biến môi trường (`Environment Variables`) trên Vercel:
   - `DATABASE_URL`: Connection string PostgreSQL của Supabase/Neon.
   - `NEXTAUTH_URL`: Domain của bạn trên Vercel (VD: `https://n3-master-ai.vercel.app`).
   - `NEXTAUTH_SECRET`: Khóa bảo mật ngẫu nhiên.
   - `OPENAI_API_KEY`: Key OpenAI của bạn (nếu có).
6. Nhấp **Deploy**!

---

## 📁 Cấu Trúc Dự Án

```
d:/N3/
├── app/                            # Next.js 14 App Router
│   ├── (auth)/                     # Đăng nhập, Đăng ký
│   ├── (dashboard)/                # Khu vực học tập chính
│   │   ├── dashboard/              # Tổng quan, Heatmap, 12 Unit
│   │   ├── decks/                  # Quản lý 12 Bộ thẻ & Thêm thẻ mới
│   │   ├── review/                 # Ôn tập Flashcard SRS 3D
│   │   ├── ai-studio/              # AI Generator, Quiz, Explainer
│   │   └── settings/               # Cài đặt tài khoản & Gói học
│   ├── api/                        # RESTful API Endpoints (Cards, Decks, Review, AI)
│   └── page.tsx                    # Landing Page giới thiệu sản phẩm
├── components/                     # Reusable React UI Components
│   ├── review/                     # Flashcard 3D, SRS Controls (Again, Hard, Good, Easy)
│   ├── stats/                      # HeatmapCalendar, RetentionChart
│   └── layout/                     # Header, Sidebar, Navigation
├── lib/                            # Business Logic & Utilities
│   ├── srs.ts                      # Thuật toán Anki SM-2 Spaced Repetition
│   ├── ai.ts                       # AI Prompts & OpenAI Client
│   ├── auth.ts                     # Cấu hình NextAuth
│   └── prisma.ts                   # Prisma Client Singleton
├── prisma/
│   ├── schema.prisma               # Database Schema
│   ├── seed.js                     # Script nạp 880 từ vựng & 12 Unit
│   └── data/                       # Dữ liệu 12 Unit Mimikara N3
└── public/
    ├── mimikara_n3_880.csv          # File CSV chuẩn để tải về hoặc import Anki
    └── manifest.json               # Cấu hình PWA Mobile
```

---

## 📄 Bản Quyền & Quyền Sở Hữu

> **Toàn bộ bản quyền và quyền sở hữu sản phẩm phần mềm "N3 Master AI" thuộc về LÊ AN BÌNH.**  
> Dự án được bảo hộ bản quyền. Mọi hành vi sao chép hay tái phân phối trái phép đều phải có sự chấp thuận của tác giả.

<div align="center">
  <sub>© 2026 N3 Master AI — Sở hữu bởi <strong>LÊ AN BÌNH</strong>. Xây dựng với ❤️ dành cho cộng đồng học tiếng Nhật JLPT N3.</sub>
</div>
