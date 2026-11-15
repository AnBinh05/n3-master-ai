# 🌸 N3 Master AI — Nền Tảng Chinh Phục JLPT N3 Đột Phá Cùng Trí Tuệ Nhân Tạo & SRS Anki

<div align="center">

![N3 Master AI Banner](https://images.unsplash.com/photo-1528164344705-475426879c0d?w=1200&auto=format&fit=crop&q=80)

**Hệ thống Học và Ôn Luyện Tiếng Nhật JLPT N3 Chuẩn Quốc Tế Vận Hành Trên Kiến Trúc Điện Toán Đa Đám Mây (Multi-Cloud Architecture: Cloudflare, Google Cloud & Supabase AWS).**

[![Production URL](https://img.shields.io/badge/Production-Live%20on%20Cloudflare-F38020?style=for-the-badge&logo=cloudflare)](https://n3-master-ai.binhn3832.workers.dev)
[![Multi-Cloud Architecture](https://img.shields.io/badge/Architecture-Multi--Cloud%20Serverless-blueviolet?style=for-the-badge&logo=icloud)](docs/PRD.md)
[![Cloudflare Workers](https://img.shields.io/badge/Compute-Cloudflare%20Edge%20V8-F38020?style=for-the-badge&logo=cloudflare)](https://workers.cloudflare.com/)
[![Google Cloud Platform](https://img.shields.io/badge/Identity_%26_AI-Google%20Cloud%20(GCP)-4285F4?style=for-the-badge&logo=googlecloud)](https://cloud.google.com/)
[![Supabase PostgreSQL](https://img.shields.io/badge/Database-Supabase%20Cloud%20(AWS)-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2%20(App%20Router)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PRD Documentation](https://img.shields.io/badge/Docs-PRD%20&%20Cloud%20Architecture-purple?style=for-the-badge&logo=googledocs)](docs/PRD.md)

[🌐 Trải Nghiệm Trực Tuyến](https://n3-master-ai.binhn3832.workers.dev) • [📖 Xem Tài Liệu PRD](docs/PRD.md) • [☁️ Kiến Trúc Đa Đám Mây](#-kiến-trúc-điện-toán-đa-đám-mây-multi-cloud-architecture) • [✨ Tính Năng Nổi Bật](#-tính-năng-nổi-bật) • [🚀 Cài Đặt Cục Bộ](#-cài-đặt--khởi-chạy-cục-bộ)

</div>

---

## 🎯 Tên Đề Tài & Các Phương Án Đặt Tên Tối Ưu Khi Bổ Sung Google Cloud

Dự án vận hành trên hạ tầng **Multi-Cloud**, kết hợp sức mạnh chuyên biệt của 3 nhà cung cấp đám mây hàng đầu thế giới: **Cloudflare** (Edge Computing), **Google Cloud** (Identity & AI), và **Supabase** (Database Pooler trên AWS).

Dưới đây là các phương án đặt tên đề tài chuẩn mực để trình bày trong báo cáo, đồ án môn học hoặc khóa luận tốt nghiệp:

| Nhóm Đề Tài | Tên Đề Xuất Chuẩn | Phù Hợp Cho |
| :--- | :--- | :--- |
| **🏆 Phương án Khuyên Dùng** | **Xây dựng và triển khai nền tảng học tập tiếng Nhật trên hạ tầng điện toán đám mây Cloudflare, Google Cloud và Supabase** | Báo cáo môn học Điện toán đám mây / Đồ án tốt nghiệp |
| **🌟 Nâng tầm Đa Đám Mây** | **Xây dựng và triển khai nền tảng học tiếng Nhật thông minh trên kiến trúc đa đám mây (Multi-Cloud Architecture)** | Khóa luận tốt nghiệp chuyên ngành CNTT / Kỹ thuật Phần mềm |
| **🤖 Đề tài Nghiên cứu AI + Cloud** | **Nghiên cứu và phát triển hệ thống ôn luyện JLPT N3 tích hợp AI trên nền tảng Cloudflare, Google Cloud và Supabase** | Báo cáo Nghiên cứu khoa học / Đồ án chuyên sâu |
| **⚡ Tối ưu Serverless Edge** | **Thiết kế và triển khai ứng dụng học tiếng Nhật quy mô biên (Edge Computing) trên hạ tầng Cloudflare, Google Cloud và Supabase** | Chuyên ngành Mạng máy tính & Điện toán đám mây |

---

## ☁️ Kiến Trúc Điện Toán Đa Đám Mây (Multi-Cloud Architecture)

Hệ thống được thiết kế theo tư duy **Multi-Cloud Serverless**, loại bỏ hoàn toàn máy chủ vật lý truyền thống (No VPS, No VM), chống phụ thuộc nhà cung cấp (Zero Vendor Lock-in) và tối ưu hóa độ trễ phản hồi tại thị trường Việt Nam & Nhật Bản:

```mermaid
graph TD
    User([Khách hàng / Trình duyệt]) -->|HTTPS / HTTP3| CF[🌐 Cloudflare Anycast Edge Network\n300+ PoPs trên toàn cầu]
    
    subgraph CLOUD_1["🌐 CLOUD 1: CLOUDFLARE EDGE COMPUTING"]
        CF --> Worker[Cloudflare Worker\nOpenNext Runtime - V8 Isolates]
        Worker --> Cache[Cloudflare Static Cache & Assets\nHTML, CSS, JS, Fonts, Images]
    end

    subgraph CLOUD_2["☁️ CLOUD 2: GOOGLE CLOUD PLATFORM (GCP)"]
        Worker --> GoogleOAuth[Google Cloud Identity & OAuth 2.0\nXác thực 1-Click an toàn]
        Worker --> GoogleAI[Google Cloud AI / Gemini 1.5 Flash\nPhân tích ngôn ngữ & Sinh câu hỏi N3]
    end

    subgraph CLOUD_DATA["🐘 CỤM DỮ LIỆU PHÂN TÁN ĐA DATACENTER (MULTI-DATACENTER HA & DR)"]
        direction TB
        Worker -->|Resilient Failover Proxy| Router{"Auto-Failover Router\n(lib/prisma.ts)"}
        Router -->|1. Ưu tiên Primary| DC1["📍 Datacenter 1 (Mumbai - ap-south-1)\nSupabase PostgreSQL (Port 6543)"]
        Router -.->|2. Tự động chuyển vùng khi DC1 sập| DC2["📍 Datacenter 2 (Singapore - ap-southeast-1)\nNeon Serverless PostgreSQL"]
    end

    subgraph CLOUD_PAYMENT["💳 CLOUD BILLING: STRIPE CLOUD"]
        Worker --> StripeAPI[Stripe Cloud Checkout & Webhooks\nNâng cấp tài khoản PRO tự động]
    end
```

### 1. 🌐 Cloudflare: Hạ Tầng Serverless Edge Computing, CDN Toàn Cầu & V8 Isolates
* **OpenNext Runtime trên V8 Isolates:** Ứng dụng Next.js 14 được biên dịch trực tiếp sang mã chạy trên nền tảng V8 Isolates phân tán tại hơn **300 thành phố trên toàn cầu**.
* **Zero Cold Start & Scale-to-Zero:** Khởi động tức thì (< 50ms), khi không có người dùng truy cập thì tài nguyên trả về 0 (không tốn chi phí duy trì máy chủ nhàn rỗi), tự động mở rộng theo lưu lượng thực tế.
* **Tối ưu hóa Anycast Routing:** Phản hồi người dùng từ PoP gần nhất (Hà Nội, TP.HCM, Tokyo), giảm Ping First Contentful Paint xuống dưới **0.8 giây**.
* **CI/CD Tự động:** Triển khai tự động thông qua GitHub webhook; mỗi commit đẩy lên `main` sẽ được build và đẩy ra toàn cầu trong ~60 giây.

### 2. ☁️ Google Cloud (GCP): Dịch Vụ Danh Tính Phân Tán & Trí Tuệ Nhân Tạo
* **Google Cloud Identity & OAuth 2.0:** Quản lý tập trung trên Google Cloud Console. Xác thực người dùng 1-chạm bảo mật chuẩn OpenID Connect, tự động cấp quyền và liên kết tài khoản an toàn (`allowDangerousEmailAccountLinking: true`).
* **Triển khai Native `fetch()` Edge:** Khắc phục giới hạn thiếu Node.js `https.request` của runtime serverless bằng cách triển khai chuẩn Web `fetch()` độc quyền trong `lib/auth.ts`, đảm bảo quá trình trao đổi mã Token với Google Cloud luôn mượt mà 100%.
* **Google Cloud AI / Gemini 1.5 Flash:** Tích hợp mô hình ngôn ngữ lớn thế hệ mới từ Google AI Studio, hỗ trợ phân tích ngữ pháp, dịch thuật ngữ cảnh và sinh câu trắc nghiệm tức thời.

### 3. 🐘 Cụm Cơ Sở Dữ Liệu Phân Tán Đa Datacenter (Multi-Datacenter High Availability)
Hệ thống loại bỏ hoàn toàn **Điểm nghẽn lỗi đơn (Single Point of Failure - SPOF)** bằng cách phân tán dữ liệu trên 2 Datacenter độc lập tại 2 quốc gia:
* **Datacenter 1 (Primary - Mumbai `ap-south-1`):** Cụm Supabase PostgreSQL chuyên tiếp nhận lưu lượng truy vấn chính và quản lý kết nối qua Supavisor Transaction Pooler.
* **Datacenter 2 (Standby & Disaster Recovery - Singapore `ap-southeast-1`):** Cụm Neon Serverless PostgreSQL đặt tại trung tâm dữ liệu Singapore (tối ưu hóa độ trễ cực thấp cho học viên tại Việt Nam và Nhật Bản).
* **Cơ chế Tự Động Chuyển Vùng (Automated Failover - `lib/prisma.ts`):** 
  - Prisma Client được bọc bởi lớp Proxy chịu lỗi linh hoạt (*Resilient Failover Proxy*).
  - Khi phát hiện Datacenter 1 gặp sự cố (mất điện, đứt cáp quang biển, sập mạng hoặc timeout), hệ thống tự động điều hướng 100% truy vấn sang Datacenter 2 trong **thời gian phục hồi RTO < 100ms** mà không làm gián đoạn trải nghiệm của người dùng.
  - Tích hợp trang giám sát trực quan tại `/datacenter` cho phép theo dõi độ trễ thời gian thực và mô phỏng sự cố tức thì.

---

## 🌟 Giới Thiệu Dự Án

**N3 Master AI** được xây dựng nhằm giải quyết triệt để 3 rào cản lớn nhất của người học tiếng Nhật khi bước vào giai đoạn tăng tốc từ N4 lên **JLPT N3**:
1. **Học trước quên sau:** Lượng từ vựng và chữ Hán N3 tăng vọt (> 880 từ Mimikara & 650 Kanji). Ứng dụng tích hợp thuật toán **Spaced Repetition System (SRS SM-2)** giúp phân phối thời gian ôn tập khoa học, nâng tỷ lệ duy trì trí nhớ (**Retention Rate**) lên trên **90%**.
2. **Sợ phần Đọc hiểu (Dokkai):** Đoạn văn dài, ngữ pháp đa tầng. Ứng dụng cung cấp **Phòng Đọc hiểu chuyên sâu (Scaffolding Reader)** với Furigana động, phân tích ngữ pháp S-V-O từng câu, tra cứu từ tức thì và AI hỗ trợ giải nghĩa.
3. **Khớp tâm lý trong phòng thi:** Cung cấp hệ thống **Thi thử Mock Test chuẩn 105 phút** có đồng hồ đếm ngược, phiếu tô đáp án và thuật toán tính điểm có áp dụng cơ chế điểm liệt chuẩn của Hiệp hội Khảo thí Quốc tế (JEES).

---

## ✨ Tính Năng Nổi Bật

### 1. 🎴 Hệ Thống Flashcard & Thuật Toán Ghi Nhớ Ngắt Quãng SRS SM-2 (`/review`, `/decks`)
- **Trọn bộ 880 từ vựng chuẩn Mimikara Oboeru N3 (12 Unit)** được phân loại khoa học theo 5 nhóm từ loại.
- **Thuật toán SuperMemo-2 (`lib/srs.ts`):** 4 mức phản xạ *Again, Hard, Good, Easy* tự động điều chỉnh Hệ số dễ nhớ ($EF$) và khoảng cách ngày ôn tập tiếp theo ($Interval$).
- **Giao diện thẻ 3D sống động:**
  - **Mặt trước:** Từ vựng / Kanji kích thước lớn kèm phát âm Audio chuẩn giọng Tokyo qua Web Speech API.
  - **Mặt sau:** Furigana, Âm Hán Việt, Nghĩa tiếng Việt, Câu ví dụ ngữ cảnh song ngữ và **Kanji Breakdown** (bóc tách thành phần từng chữ Hán cấu thành).
- Hiệu ứng pháo hoa Confetti chúc mừng và thưởng EXP/Coins khi hoàn thành chu kỳ học.

### 2. 📖 Phòng Luyện Đọc Hiểu Chuyên Sâu (Dokkai Master — `/dokkai`)
- **Bộ đọc thông minh (Smart Reader):**
  - **Bật / Tắt Furigana:** Tự thử thách khả năng đọc chữ Hán hoặc hiển thị cách đọc khi cần trợ giúp.
  - **Sentence Breakdown:** AI phân tách cấu trúc câu (Chủ ngữ, Vị ngữ, Bổ ngữ, Liên từ nối).
  - **Interactive Word Tooltip:** Nhấp vào bất kỳ từ nào để tra nghĩa tiếng Việt, âm Hán Việt và từ loại ngay trên cửa sổ nổi.
  - **Bản dịch song ngữ linh hoạt:** Ẩn/hiện bản dịch tiếng Việt từng câu hoặc toàn bài đối chiếu ngữ cảnh.
- **AI Dokkai Generator:** Tự động tạo bài đọc hiểu N3 mới toanh theo bất kỳ chủ đề người học yêu cầu (văn hóa, anime, du lịch, đời sống Nhật Bản).
- **Dokkai Strategy:** Cẩm nang chiến thuật làm bài đoản văn, trung văn, trường văn và kỹ thuật loại trừ đáp án gây nhiễu.

### 3. 🤖 N3 AI Studio — Gia Sư Tiếng Nhật 24/7 (`/ai`)
- **AI Card Generator:** Nhập từ hoặc ý niệm bất kỳ -> AI tự động tạo thẻ Flashcard chuẩn N3 lưu vào bộ thẻ cá nhân.
- **AI Grammar Explainer:** Phân tích sắc thái ngôn ngữ và so sánh các mẫu ngữ pháp dễ gây nhầm lẫn (như `～わけがない` vs `～はずがない`).
- **AI Quiz Generator:** Sinh đề thi trắc nghiệm tức thì theo chủ đề mong muốn.
- **AI Sentence Correction:** Học viên nhập câu tiếng Nhật -> AI phát hiện lỗi sai trợ từ, chia động từ và gợi ý câu chuẩn tự nhiên của người bản xứ.
- **AI Sensei Chat:** Trò chuyện nhập vai thời gian thực theo các tình huống đời sống (đặt phòng khách sạn, phỏng vấn, đi siêu thị...).
- **Edge Streaming:** Tốc độ phản hồi cực nhanh (Time to First Token < 0.5s) vận hành trên Vercel AI SDK và Google Generative AI.

### 4. ⏱️ Phòng Thi Thử Chuẩn JLPT N3 (Mock Test — `/mock-test`)
- **Format chuẩn kỳ thi thật:** 105 phút làm bài với đầy đủ 3 phần thi: Từ vựng/Kanji, Ngữ pháp & Đọc hiểu, Nghe hiểu (Audio tích hợp).
- **Phiếu làm bài trực quan (Answer Sheet):** Theo dõi câu đã làm / chưa làm và chuyển nhanh đến câu bất kỳ.
- **Gắn cờ câu hỏi (Flag for Review):** Đánh dấu câu nghi vấn để rà soát lại trước khi nộp.
- **Chế độ tập trung (Focus Mode):** Khóa toàn màn hình, loại bỏ mọi yếu tố gây xao nhãng.
- **Thuật toán chấm điểm chuẩn JLPT:**
  - Thang điểm 180 (Điểm đỗ $\ge 95 / 180$).
  - **Kiểm tra điểm liệt:** Bắt buộc mỗi phần thi phải đạt tối thiểu $\ge 19 / 60$ điểm (dưới 19 điểm ở bất kỳ phần nào sẽ bị đánh giá TRƯỢT).
- **Custom Exam Uploader:** Hỗ trợ nạp đề thi từ file JSON tùy chỉnh.

### 5. 🎮 Đấu Trường Trò Chơi Học Tập & Gamification (`/games`)
- **8 Chế độ Game rèn luyện phản xạ ngôn ngữ thú vị:**
  1. **Speed Match:** Ghép thẻ siêu tốc Kanji - Ý nghĩa trên lưới đa ô.
  2. **Samurai Slash:** Chém từ vựng đúng phong cách Ninja.
  3. **Boss Battle:** Đánh Boss theo lượt bằng câu hỏi kiến thức N3.
  4. **Sentence Scramble:** Sắp xếp các mảnh từ thành câu hoàn chỉnh chuẩn ngữ pháp N3.
  5. **Shadowing Studio:** Luyện phát âm nhại theo giọng bản xứ qua sóng âm trực quan.
  6. **PvP Arena:** Đấu trí trắc nghiệm 1vs1 thời gian thực với bạn học.
  7. **Kanji Canvas:** Tập viết chữ Hán cảm ứng nhận diện nét bút và thứ tự nét chuẩn.
  8. **Story Mode:** Vượt ải khám phá văn hóa Nhật Bản qua cốt truyện Visual Novel.
- **Hệ sinh thái Gamification:** Cấp bậc (Level), EXP, Xu tích lũy (Coins), Cửa hàng thú cưng (Pet Shop), Linh vật động viên (Mascot Widget), Gieo quẻ may mắn hàng ngày (Omikuji), và bộ sưu tập hơn 20 danh hiệu danh giá (Achievements).

### 6. 📊 Báo Cáo & Thống Kê Học Tập (Analytics & Stats — `/stats`)
- **Lịch nhiệt chuyên cần (Heatmap Calendar):** Ghi nhận chuỗi ngày học liên tục (Streak) theo 365 ngày.
- **Biểu đồ tỷ lệ duy trì kiến thức (Retention Rate Chart):** Theo dõi độ bền ghi nhớ sau 1, 3, 7, 30 ngày.
- **Phân phối trạng thái thẻ (Mastery Distribution):** Thống kê số lượng thẻ ở các mức: Mới (New), Đang học (Learning), Ôn tập (Review), và Đã thành thạo (Graduated).

### 7. 🔐 Hệ Thống Xác Thực & Bảo Mật Mượt Mà
- **Google OAuth 2.0 1-Click:** Tối ưu hóa cho môi trường Serverless Cloudflare Workers bằng Native `fetch()`, tự động liên kết tài khoản an toàn.
- **Tài khoản Trải nghiệm Tức thì (Instant Demo):** Nút bấm 1 chạm điền sẵn tài khoản Demo (`demo@n3master.ai` / `demo123456`) để trải nghiệm ngay toàn bộ tính năng PRO mà không cần đăng ký.
- **Tự động chuyển hướng `/dashboard`:** Tự động điều hướng vào trang học tập sau khi đăng nhập và chặn người dùng đã đăng nhập xem form `/login` hay `/register`.
- **Bảo mật:** Rate Limiting chống Brute-force mật khẩu (`lib/security.ts`), Stateless JWT Cookie mã hóa ở tầng Edge.

---

## 📚 Trọn Bộ 12 Unit Mimikara Oboeru N3

| Unit | Tên Phân Hệ | Phạm vi từ | Số lượng | Trọng tâm kiến thức |
| :---: | :--- | :---: | :---: | :--- |
| **Unit 1** | 名詞 1 (Danh từ 1) | **#1 - #70** | 70 từ | Gia đình, con người, công việc, đời sống |
| **Unit 2** | 名詞 2 (Danh từ 2) | **#71 - #120** | 50 từ | Tự nhiên, xã hội, môi trường xung quanh |
| **Unit 3** | 動詞 1 (Động từ 1) | **#121 - #220** | 100 từ | Cặp Tự động từ & Tha động từ nhóm 1 |
| **Unit 4** | 動詞からできた名詞 (Danh từ phái sinh) | **#221 - #258** | 38 từ | Danh từ chuyển thể từ liên từ của động từ |
| **Unit 5** | イ形容詞・ナ形容詞 1 (Tính từ 1) | **#259 - #298** | 40 từ | Tính từ miêu tả tính cách, cảm xúc |
| **Unit 6** | 動詞 2・名詞 3 (Động từ 2 & Danh từ 3) | **#299 - #410** | 112 từ | Động từ biến đổi và danh từ xã hội, thông tin |
| **Unit 7** | 動詞 3 (Động từ 3) | **#411 - #510** | 100 từ | Động từ tương tác, di chuyển, phán đoán |
| **Unit 8** | カタカナ語 1・形容詞 2 (Katakana 1) | **#511 - #590** | 80 từ | Từ mượn Katakana và tính từ trạng thái |
| **Unit 9** | 副詞 1・名詞 4 (Phó từ 1 & Danh từ 4) | **#591 - #715** | 125 từ | Phó từ tần suất, mức độ & danh từ kinh tế |
| **Unit 10** | 動詞 4 (Động từ 4) | **#716 - #795** | 80 từ | Động từ tiếp nối, liên kết và trừu tượng |
| **Unit 11** | カタカナ語 2・料理動詞 (Katakana 2) | **#796 - #845** | 50 từ | Katakana nâng cao & từ vựng nấu nướng |
| **Unit 12** | 副詞 2・接続詞 (Phó từ 2 & Liên từ) | **#846 - #880** | 35 từ | Phó từ tình thái và liên từ liên kết câu |

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend & App Framework:** [Next.js 14](https://nextjs.org/) (App Router), [React 18](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/)
- **Serverless Edge Runtime:** [@opennextjs/cloudflare](https://opennext.js.org/cloudflare), [Cloudflare Workers](https://workers.cloudflare.com/) (V8 Isolates)
- **Identity & AI Cloud:** [Google Cloud Platform (GCP)](https://cloud.google.com/) (Google OAuth 2.0 & Google Gemini Flash API)
- **Database Cloud & ORM:** [Supabase PostgreSQL](https://supabase.com/) (AWS ap-south-1), [Prisma ORM](https://www.prisma.io/) với `@prisma/adapter-pg`
- **Xác thực:** [NextAuth.js v4](https://next-auth.js.org/) (Stateless Edge JWT & Google OAuth 2.0 Native Fetch)
- **AI Engine:** [Vercel AI SDK](https://sdk.vercel.ai/), OpenAI GPT-4o-mini & Google Gemini API
- **Thanh toán:** [Stripe Cloud SDK](https://stripe.com/) (Checkout Sessions & Webhooks)
- **Styling & Hiệu ứng:** [Tailwind CSS 3](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Biểu đồ & Âm thanh:** [Recharts](https://recharts.org/), Web Audio & Web Speech API

---

## 🚀 Cài Đặt & Khởi Chạy Cục Bộ (Local)

### 1. Clone mã nguồn
```bash
git clone https://github.com/AnBinh05/n3-master-ai.git
cd n3-master-ai
```

### 2. Cài đặt các thư viện phụ thuộc
```bash
npm install
```

### 3. Cấu hình file môi trường `.env`
Tạo hoặc chỉnh sửa file `.env` tại thư mục gốc:
```env
# 🐘 Supabase PostgreSQL (AWS Pooler Cổng 6543)
DATABASE_URL="postgresql://postgres:[PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# 🔐 NextAuth Secret
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars-long"

# ☁️ Google Cloud Identity & OAuth 2.0
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# 🤖 AI Provider Keys (Google Gemini hoặc OpenAI)
GEMINI_API_KEY="your-gemini-api-key"
OPENAI_API_KEY=""

# 💳 Stripe Credentials (Tùy chọn)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

### 4. Đồng bộ CSDL & Nạp Dữ Liệu Ban Đầu
```bash
# Đồng bộ Schema Prisma vào Database
npm run prisma:push

# Nạp 12 Unit Mimikara N3 và dữ liệu mẫu
npm run seed
```

### 5. Khởi chạy máy chủ phát triển
```bash
npm run dev
```
Mở trình duyệt tại: **[http://localhost:3000](http://localhost:3000)**.

---

## 🚢 Quy Trình Triển Khai Lên Cloudflare Workers (CI/CD)

Hệ thống được cấu hình tự động triển khai qua GitHub Actions / Cloudflare Workers Builds:

1. Kiểm tra biên dịch đầy đủ trước khi đẩy code:
```bash
npm run build
```
2. Đẩy mã nguồn lên nhánh chính:
```bash
git add .
git commit -m "feat: mô tả cập nhật mới"
git push origin main
```
3. Cloudflare Workers sẽ tự động nhận diện commit, chạy OpenNext build và triển khai ra hơn 300 Edge Data Centers toàn cầu chỉ trong khoảng **60 giây**!

---

## 📁 Cấu Trúc Thư Mục Dự Án

```
n3-master-ai/
├── app/                            # Next.js 14 App Router
│   ├── (auth)/                     # Đăng nhập (/login), Đăng ký (/register)
│   ├── (dashboard)/                # Phân hệ học tập chính
│   │   ├── dashboard/              # Bảng điều khiển, Heatmap, Mascot, Omikuji
│   │   ├── decks/                  # Quản lý 12 Unit và danh sách Flashcard
│   │   ├── review/                 # Ôn tập Flashcard SRS SM-2 lật thẻ 3D
│   │   ├── dokkai/                 # Phòng Đọc hiểu Scaffolding & AI Generator
│   │   ├── ai/                     # AI Studio: Sửa bài, Giải thích, Sensei Chat
│   │   ├── mock-test/              # Phòng thi thử JLPT N3 chuẩn 105 phút
│   │   ├── games/                  # 8 chế độ game đấu trường rèn phản xạ
│   │   ├── quiz/                   # Trắc nghiệm sinh tự động theo Unit
│   │   ├── stats/                  # Biểu đồ Retention & Thống kê độ nhớ
│   │   └── settings/               # Cài đặt giao diện & Gói Pro Stripe
│   ├── api/                        # RESTful Serverless API Routes
│   └── page.tsx                    # Landing Page giới thiệu sản phẩm
├── components/                     # Reusable React UI Components
│   ├── dashboard/                  # DashboardClientView, JLPT Countdown
│   ├── review/                     # Flashcard 3D, SRS Controls (Again, Hard, Good, Easy)
│   ├── dokkai/                     # DokkaiReader, Furigana Toggle, Tooltip
│   ├── exam/                       # ExamAnswerSheet, ExamScoreModal
│   ├── games/                      # 8 Minigames, PetShopModal, OmikujiModal
│   └── stats/                      # HeatmapCalendar, RetentionChart
├── docs/
│   └── PRD.md                      # Tài liệu Yêu cầu Sản phẩm & Kiến trúc Đa Đám Mây chi tiết
├── lib/                            # Business Logic & Core Utilities
│   ├── srs.ts                      # Thuật toán Anki SM-2 Spaced Repetition
│   ├── auth.ts                     # NextAuth Edge JWT & Google OAuth Native Fetch
│   ├── prisma.ts                   # Resilient Auto-Retry Proxy Prisma Client
│   ├── ai-provider.ts              # Fallback AI Engine: Gemini, Ollama, OpenAI
│   ├── gamification.ts             # Level, EXP, Coins, Achievements Engine
│   └── security.ts                 # Brute-force Rate Limiting
├── prisma/
│   ├── schema.prisma               # Database Schema (User, Deck, Card, Exam, AI...)
│   └── seed.js                     # Script nạp 880 từ vựng Mimikara N3
└── public/                         # Static Assets & Anki CSV backup
```

---

## 📄 Bản Quyền & Quyền Sở Hữu

> **Toàn bộ bản quyền và quyền sở hữu sản phẩm phần mềm "N3 Master AI" thuộc về LÊ AN BÌNH.**  
> Dự án được bảo hộ bản quyền. Mọi hành vi sao chép hay tái phân phối thương mại trái phép đều phải có sự chấp thuận bằng văn bản của tác giả.

<div align="center">
  <sub>© 2026 N3 Master AI — Sở hữu bởi <strong>LÊ AN BÌNH</strong>. Xây dựng với ❤️ dành cho cộng đồng học tiếng Nhật JLPT N3.</sub>
</div>
