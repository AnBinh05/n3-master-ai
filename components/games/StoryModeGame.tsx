'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  CheckCircle2, 
  Award, 
  Trophy,
  ArrowRight,
  Filter,
  Check,
  Compass
} from 'lucide-react';
import { addExpAndCoins } from '@/lib/gamification';
import { playClick, playCorrect, playWrong, playVictory, playLevelUp } from '@/lib/game-audio';

interface StoryModeGameProps {
  onBack: () => void;
}

interface DialogChoice {
  text: string;
  isCorrect: boolean;
  explanation: string;
  reactionText: string;
}

interface StoryScene {
  speaker: string;
  speakerAvatar: string;
  japanese: string;
  vietnamese: string;
  choices: DialogChoice[];
}

interface StoryEpisode {
  id: string;
  title: string;
  subtitle: string;
  category: 'LIFESTYLE' | 'WORK_SOCIAL' | 'CULTURE';
  categoryName: string;
  icon: string;
  bgGradient: string;
  scenes: StoryScene[];
  postcardTitle: string;
  postcardDesc: string;
}

const IRODORI_EPISODES: StoryEpisode[] = [
  // 1. Shibuya Station
  {
    id: 'shibuya',
    title: 'Tập 1: Lạc Bước Tại Ga Shibuya',
    subtitle: 'Hỏi đường cảnh sát Koban tại giao lộ đông đúc nhất thế giới',
    category: 'LIFESTYLE',
    categoryName: 'Đời Sống Thực Tế (Irodori)',
    icon: '🏙️',
    bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
    postcardTitle: '🌸 Bưu Thiếp Kỷ Niệm: Tượng Chó Hachiko',
    postcardDesc: 'Bạn đã thành công hỏi đường đến ga Shibuya và làm quen với bạn bè quốc tế!',
    scenes: [
      {
        speaker: 'Cảnh sát Koban (交番の警察官)',
        speakerAvatar: '👮‍♂️',
        japanese: 'すみません、何かお困りですか？どこへ行きたいですか？',
        vietnamese: 'Xin chào, bạn có gặp khó khăn gì không? Bạn muốn đi đâu vậy?',
        choices: [
          {
            text: '渋谷駅のハチ公口へ行きたいんですが、道を教えていただけませんか。',
            isCorrect: true,
            explanation: 'Sử dụng kính ngữ chuẩn N3 〜ていただけませんか để nhờ vả lịch sự.',
            reactionText: 'あ、ハチ公口ですね！この交差点をまっすぐ進めばすぐですよ。',
          },
          {
            text: 'ハチ公口はどこ？教えて。',
            isCorrect: false,
            explanation: 'Nói thể ngắn thiếu lịch sự với cảnh sát.',
            reactionText: 'えっ...？敬語を使いましょうね。',
          },
        ],
      },
      {
        speaker: 'Yuki-san (Bạn học Nhật Bản)',
        speakerAvatar: '👧',
        japanese: 'あ！無事に着いたね！待たせてごめんね、電車が遅れちゃって。',
        vietnamese: 'A! Bạn đến nơi an toàn rồi! Xin lỗi đã để bạn chờ, tàu điện bị trễ mất.',
        choices: [
          {
            text: '気にしないでください。私も今着いたところですから。',
            isCorrect: true,
            explanation: 'Mẫu câu 〜たところだ (Vừa mới hoàn thành xong việc gì).',
            reactionText: 'よかった！じゃあ、カフェに入ってゆっくり話そう！',
          },
          {
            text: '遅れたから怒っています。',
            isCorrect: false,
            explanation: 'Cách trả lời quá gay gắt và thiếu tế nhị trong văn hóa Nhật.',
            reactionText: 'ご、ごめんなさい...',
          },
        ],
      },
    ],
  },

  // 2. Baito Interview
  {
    id: 'baito',
    title: 'Tập 2: Phỏng Vấn Việc Làm Thêm (Baito)',
    subtitle: 'Ứng tuyển vị trí phục vụ tại quán Ramen phố Akihabara',
    category: 'WORK_SOCIAL',
    categoryName: 'Công Việc & Giao Tiếp',
    icon: '🍜',
    bgGradient: 'from-amber-950 via-slate-900 to-orange-950',
    postcardTitle: '🍜 Bưu Thiếp Kỷ Niệm: Quán Ramen Thân Thiện',
    postcardDesc: 'Chủ quán Tenchou rất ấn tượng với khả năng kính ngữ N3 của bạn và đã nhận bạn vào làm!',
    scenes: [
      {
        speaker: 'Chủ quán Ramen (店長)',
        speakerAvatar: '👨‍🍳',
        japanese: '本日面接に来てくれてありがとう。志望動機を聞かせてください。',
        vietnamese: 'Cảm ơn bạn hôm nay đã đến phỏng vấn. Hãy cho tôi biết lý do bạn muốn làm việc tại đây.',
        choices: [
          {
            text: '日本の接客マナーを学びながら、お客様に美味しいラーメンを提供したいと思い、応募いたしました。',
            isCorrect: true,
            explanation: 'Sử dụng thể khiêm nhường ngữ いたす chuẩn phỏng vấn xin việc N3.',
            reactionText: '素晴らしいですね！しっかりとした目標を持っていますね。',
          },
          {
            text: 'お金が欲しいから働きたいです。',
            isCorrect: false,
            explanation: 'Câu trả lời quá thô và thiếu chuyên nghiệp.',
            reactionText: 'うーん...もう少し具体的な理由が欲しいですね。',
          },
        ],
      },
      {
        speaker: 'Chủ quán Ramen (店長)',
        speakerAvatar: '👨‍🍳',
        japanese: '週に何日くらいシフトに入れますか？土日は大丈夫ですか？',
        vietnamese: 'Một tuần bạn có thể đi làm được mấy buổi? Thứ 7, Chủ nhật có làm được không?',
        choices: [
          {
            text: '週に3日、特に土日はいつでも入ることができます。頑張ります！',
            isCorrect: true,
            explanation: 'Trả lời rõ ràng, thể hiện sự linh hoạt và nhiệt tình với công việc.',
            reactionText: '助かります！来週の月曜日からよろしくお願いしますね！',
          },
          {
            text: '土日は遊びたいので無理です。',
            isCorrect: false,
            explanation: 'Từ chối cộc lốc, không phù hợp khi đi xin việc.',
            reactionText: 'そうですか...土日に人が足りないのですが...',
          },
        ],
      },
    ],
  },

  // 3. Move in & Greeting Neighbors (Irodori Life)
  {
    id: 'moving',
    title: 'Tập 3: Chuyển Nhà & Chào Hỏi Hàng Xóm',
    subtitle: 'Nét đẹp văn hóa tặng quà chào hỏi người xung quanh căn hộ mới',
    category: 'LIFESTYLE',
    categoryName: 'Đời Sống Thực Tế (Irodori)',
    icon: '🏡',
    bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    postcardTitle: '🎁 Bưu Thiếp Kỷ Niệm: Món Quà Chào Hỏi Hàng Xóm',
    postcardDesc: 'Bác Tanaka hàng xóm rất quý mến bạn vì bạn hiểu đúng văn hóa挨拶 (Aisatsu) của Nhật Bản!',
    scenes: [
      {
        speaker: 'Bác Tanaka Hàng Xóm (隣人の田中さん)',
        speakerAvatar: '👵',
        japanese: 'はい、どちら様でしょうか？',
        vietnamese: 'Vâng, xin hỏi ai đang bấm chuông đấy ạ?',
        choices: [
          {
            text: '隣の201号室に引っ越してきたグエンと申します。ご挨拶に伺いました。',
            isCorrect: true,
            explanation: 'Cách xưng tên khiêm nhường と申します và xin phép vào chào hỏi chuẩn mực.',
            reactionText: 'あら！お隣さんですね。わざわざご丁寧にありがとうございます！',
          },
          {
            text: '隣の人です。開けてください。',
            isCorrect: false,
            explanation: 'Nói cộc lốc khiến người nghe hoang mang.',
            reactionText: 'えっ...どちら様ですか？少し怖いです...',
          },
        ],
      },
      {
        speaker: 'Bác Tanaka Hàng Xóm (隣人の田中さん)',
        speakerAvatar: '👵',
        japanese: 'こちらこそ、よろしくお願いしますね。何か困ったことがあったら何でも聞いてね。',
        vietnamese: 'Tôi cũng mong được bạn giúp đỡ nhé. Có việc gì khó khăn cứ hỏi tôi nhé.',
        choices: [
          {
            text: '心ばかりの品ですが、どうぞお使いください。これからよろしくお願いいたします。',
            isCorrect: true,
            explanation: 'Câu nói lịch sự kinh điển khi tặng quà 心ばかりの品 (Món quà nhỏ tấm lòng).',
            reactionText: 'まあ、タオルセットですね！ありがとうございます。仲良くしましょうね！',
          },
          {
            text: 'これ、あげます。安物ですけど。',
            isCorrect: false,
            explanation: 'Dùng từ 安物 (Đồ rẻ tiền) là hạ thấp giá trị món quà, không phù hợp.',
            reactionText: 'あ、ありがとうございます...',
          },
        ],
      },
    ],
  },

  // 4. Hospital & Medical Clinic (Irodori)
  {
    id: 'clinic',
    title: 'Tập 4: Khám Bệnh Tại Phòng Khám Nhật',
    subtitle: 'Khai báo triệu chứng sốt đau họng và xuất trình thẻ bảo hiểm y tế',
    category: 'LIFESTYLE',
    categoryName: 'Đời Sống Thực Tế (Irodori)',
    icon: '🏥',
    bgGradient: 'from-rose-950 via-slate-900 to-pink-950',
    postcardTitle: '💊 Bưu Thiếp Kỷ Niệm: Phòng Khám Sức Khỏe Tokyo',
    postcardDesc: 'Bác sĩ đã kê đơn thuốc hiệu quả giúp bạn nhanh chóng khỏi ốm và khỏe mạnh!',
    scenes: [
      {
        speaker: 'Lễ tân Bệnh viện (受付スタッフ)',
        speakerAvatar: '👩‍⚕️',
        japanese: '本日は初診ですか？保険証はお持ちでしょうか？',
        vietnamese: 'Hôm nay là lần đầu bạn đến khám đúng không ạ? Bạn có mang theo thẻ bảo hiểm không?',
        choices: [
          {
            text: 'はい、初めてです。こちらの健康保険証をお願いします。',
            isCorrect: true,
            explanation: 'Xuất trình thẻ bảo hiểm y tế (Hokensho) lịch sự.',
            reactionText: 'はい、お預かりいたします。問診票にご記入をお願いします。',
          },
          {
            text: 'ないです。お金で払います。',
            isCorrect: false,
            explanation: 'Không xuất trình bảo hiểm sẽ phải chịu 100% chi phí y tế đắt đỏ.',
            reactionText: '保険証がないと自費診療になってしまいますよ。',
          },
        ],
      },
      {
        speaker: 'Bác sĩ Nội khoa (内科の医師)',
        speakerAvatar: '👨‍⚕️',
        japanese: 'どうされましたか？いつ頃から症状がありますか？',
        vietnamese: 'Bạn cảm thấy trong người thế nào? Bị các triệu chứng từ khi nào vậy?',
        choices: [
          {
            text: '一昨日から熱が38度あって、喉の痛みと頭痛が続いています。',
            isCorrect: true,
            explanation: 'Mô tả chính xác thời gian (一昨日 - hôm kia) và triệu chứng (熱, 喉の痛み, 頭痛).',
            reactionText: 'なるほど。風邪の初期症状ですね。解熱剤と喉の薬を出しておきますね。',
          },
          {
            text: '体が死にそうです。',
            isCorrect: false,
            explanation: 'Nói quá mức, không giúp bác sĩ nắm bắt được triệu chứng bệnh học.',
            reactionText: '落ち着いてください。具体的にどこが痛いですか？',
          },
        ],
      },
    ],
  },

  // 5. Trash Sorting Rules (Irodori)
  {
    id: 'trash_sorting',
    title: 'Tập 5: Quy Tắc Phân Loại & Vứt Rác',
    subtitle: 'Nắm vững phân loại rác cháy được, chai nhựa PET và ngày vứt rác',
    category: 'LIFESTYLE',
    categoryName: 'Đời Sống Thực Tế (Irodori)',
    icon: '♻️',
    bgGradient: 'from-teal-950 via-slate-900 to-green-950',
    postcardTitle: '🌱 Bưu Thiếp Kỷ Niệm: Khu Phố Xanh Sạch Đẹp',
    postcardDesc: 'Bác trưởng khu phố khen ngợi bạn vì luôn phân loại rác đúng ngày và quy định!',
    scenes: [
      {
        speaker: 'Bác Trưởng Ban Quản Lý (管理人さん)',
        speakerAvatar: '👨‍💼',
        japanese: 'グエンさん、ペットボトルを捨てる時はキャップとラベルを剥がしていますか？',
        vietnamese: 'Bạn Nguyen ơi, khi vứt chai nhựa PET bạn đã bóc nhãn và tháo nắp chai chưa?',
        choices: [
          {
            text: 'はい！中を水で洗ってから、ラベルとキャップを外して資源ゴミに出しています。',
            isCorrect: true,
            explanation: 'Quy trình chuẩn Nhật: Tráng nước, bóc nhãn (Shigen gomi), vứt nắp riêng.',
            reactionText: '素晴らしい！よくルールを理解してくれていますね。感心しました！',
          },
          {
            text: '面倒くさいのでそのまま燃えるゴミに捨てました。',
            isCorrect: false,
            explanation: 'Vi phạm quy định phân loại rác của Nhật Bản, xe rác sẽ từ chối thu gom.',
            reactionText: 'それはダメですよ！ゴミ袋に警告シールが貼られてしまいます。',
          },
        ],
      },
    ],
  },

  // 6. Delivery Package & Redelivery (Irodori)
  {
    id: 'delivery',
    title: 'Tập 6: Nhận Hàng Bưu Điện & Hẹn Giao Lại',
    subtitle: 'Đọc phiếu báo vắng nhà (Fuzaihyo) và gọi tổng đài hẹn giờ giao hàng',
    category: 'LIFESTYLE',
    categoryName: 'Đời Sống Thực Tế (Irodori)',
    icon: '📦',
    bgGradient: 'from-amber-950 via-slate-900 to-yellow-950',
    postcardTitle: '📦 Bưu Thiếp Kỷ Niệm: Shipper Thân Thiện Kuroneko',
    postcardDesc: 'Bạn đã thành thạo kỹ năng đọc phiếu báo vắng nhà và nhận kiện hàng an toàn!',
    scenes: [
      {
        speaker: 'Nhân viên Giao Hàng Yamato (ヤマト配達員)',
        speakerAvatar: '🚚',
        japanese: 'お電話ありがとうございます。不在連絡票の再配達受付でございます。',
        vietnamese: 'Cảm ơn quý khách đã gọi. Đây là tổng đài hẹn lịch giao lại bưu phẩm vắng nhà.',
        choices: [
          {
            text: '不在連絡票が入っていたのですが、本日の18時から20時の間に再配達をお願いできますか。',
            isCorrect: true,
            explanation: 'Sử dụng mẫu hẹn khung giờ chuẩn 〜の間に再配達をお願いできますか.',
            reactionText: 'かしこまりました。伝票番号をお知らせいただけますでしょうか。',
          },
          {
            text: '荷物持ってきて。今すぐ。',
            isCorrect: false,
            explanation: 'Nói cộc lốc và đòi hỏi giao ngay tức khắc là bất khả thi.',
            reactionText: '恐れ入りますが、時間帯の指定をお願いできますでしょうか。',
          },
        ],
      },
    ],
  },

  // 7. Earthquake & Disaster Preparedness (Irodori)
  {
    id: 'earthquake',
    title: 'Tập 7: Ứng Phó Động Đất & Di Tản An Toàn',
    subtitle: 'Bình tĩnh bảo vệ bản thân, tắt van ga và di chuyển đến trường học lánh nạn',
    category: 'LIFESTYLE',
    categoryName: 'Đời Sống Thực Tế (Irodori)',
    icon: '🚨',
    bgGradient: 'from-red-950 via-slate-900 to-rose-950',
    postcardTitle: '🛡️ Bưu Thiếp Kỷ Niệm: Dũng Sĩ An Toàn Thiên Tai',
    postcardDesc: 'Bạn đã nắm vững kỹ năng sinh tồn trong cẩm nang phòng chống thiên tai (Bosai)!',
    scenes: [
      {
        speaker: 'Còi Báo Động Khẩn Cấp (緊急地震速報)',
        speakerAvatar: '📢',
        japanese: '【警告】強い揺れに警戒してください。身の安全を確保してください。',
        vietnamese: '【Cảnh báo khẩn cấp】Động đất mạnh sắp xảy ra. Hãy bảo đảm an toàn thân thể.',
        choices: [
          {
            text: 'すぐに頭を保護して机の下に隠れ、揺れが収まるのを待つ。',
            isCorrect: true,
            explanation: 'Kỹ tắc bảo vệ đầu dưới bàn chắc chắn (Drop, Cover, Hold On).',
            reactionText: '揺れが収まりました。火の元を確認して避難経路を確保しましょう。',
          },
          {
            text: '慌てて外に飛び出す。',
            isCorrect: false,
            explanation: 'Rất nguy hiểm vì kính vỡ và biển hiệu có thể rơi trúng đầu.',
            reactionText: '危ない！落下物に当たってしまう危険があります！',
          },
        ],
      },
    ],
  },

  // 8. Workplace Nomikai (Irodori)
  {
    id: 'nomikai',
    title: 'Tập 8: Tiệc Rượu Nomikai Với Đồng Nghiệp',
    subtitle: 'Nét văn hóa Kanpai, rót bia cho tiền bối Senpai và thanh toán Warikan',
    category: 'WORK_SOCIAL',
    categoryName: 'Công Việc & Giao Tiếp',
    icon: '🍻',
    bgGradient: 'from-indigo-950 via-slate-900 to-purple-950',
    postcardTitle: '🍻 Bưu Thiếp Kỷ Niệm: Tiệc Rượu Izakaya Vui Vẻ',
    postcardDesc: 'Các anh chị tiền bối trong công ty rất yêu quý vì bạn khéo léo trong giao tiếp tiệc rượu!',
    scenes: [
      {
        speaker: 'Trưởng phòng Sato (佐藤課長)',
        speakerAvatar: '👔',
        japanese: '今週もお疲れ様でした！みんな、グラスは持ちましたか？',
        vietnamese: 'Tuần này mọi người đã vất vả rồi! Tất cả đã cầm ly nước trên tay chưa?',
        choices: [
          {
            text: 'お疲れ様でした！今週もご指導いただきありがとうございました。乾杯！',
            isCorrect: true,
            explanation: 'Cảm ơn sự chỉ bảo tận tình (ご指導いただき) và chúc mừng nâng ly.',
            reactionText: 'かんぱーい！グエンさんも今週よく頑張ってくれたね！',
          },
          {
            text: '疲れたから早く飲みましょう。',
            isCorrect: false,
            explanation: 'Thiếu lời cảm ơn và không đúng lễ nghi tiệc công ty.',
            reactionText: 'ははは...まあ、乾杯しましょうか。',
          },
        ],
      },
      {
        speaker: 'Tiền bối Takahashi (先輩の高橋さん)',
        speakerAvatar: '👨‍💼',
        japanese: 'グエンさん、ビールのおかわりはどうですか？注ぎましょうか？',
        vietnamese: 'Nguyen ơi, bạn có muốn uống thêm bia không? Để tôi rót cho nhé?',
        choices: [
          {
            text: 'ありがとうございます！両手でグラスを持って「いただきます」。',
            isCorrect: true,
            explanation: 'Khi được tiền bối rót bia, luôn dùng 2 tay nâng ly để thể hiện sự tôn trọng.',
            reactionText: '礼儀正しいね！どんどん食べて飲んでね！',
          },
          {
            text: '自分で注ぐから置いといて。',
            isCorrect: false,
            explanation: 'Từ chối thô lỗ thiện ý của tiền bối.',
            reactionText: 'あ、そう...？じゃあ置いておくね。',
          },
        ],
      },
    ],
  },

  // 9. Onsen & Ryokan Etiquette (Culture)
  {
    id: 'onsen',
    title: 'Tập 9: Văn Hóa Tắm Suối Nước Nóng Onsen',
    subtitle: 'Trải nghiệm nhà nghỉ truyền thống Ryokan và quy tắc giữ gìn nước tắm Onsen',
    category: 'CULTURE',
    categoryName: 'Văn Hóa & Du Lịch',
    icon: '♨️',
    bgGradient: 'from-cyan-950 via-slate-900 to-blue-950',
    postcardTitle: '♨️ Bưu Thiếp Kỷ Niệm: Suối Nước Nóng Hakone',
    postcardDesc: 'Bạn đã tận hưởng trọn vẹn cảm giác thư giãn tuyệt đỉnh trong làn suối nước nóng thiên nhiên!',
    scenes: [
      {
        speaker: 'Bác Chủ Nhà Nghỉ Ryokan (女将さん)',
        speakerAvatar: '👘',
        japanese: 'いらっしゃいませ。温泉に入る前のマナーはご存知でしょうか？',
        vietnamese: 'Kính chào quý khách. Quý khách đã nắm rõ quy tắc trước khi bước vào bồn tắm Onsen chưa ạ?',
        choices: [
          {
            text: 'はい！湯船に入る前に体をしっかり洗い、タオルを湯船の中に入れないようにします。',
            isCorrect: true,
            explanation: 'Quy tắc vàng Onsen: Tắm sạch trước khi ngâm, không thả khăn vào bồn nước.',
            reactionText: '素晴らしいですね！よく日本の温泉マナーをご存知で安心いたしました。',
          },
          {
            text: 'お風呂の中で石鹸を使って体を洗います。',
            isCorrect: false,
            explanation: 'Tuyệt đối cấm dùng xà phòng trong bồn ngâm Onsen vì làm bẩn nước chung.',
            reactionText: 'それは絶対にダメです！お湯が汚れてしまいます！',
          },
        ],
      },
    ],
  },

  // 10. Workplace Horenso & Paid Leave (Irodori)
  {
    id: 'horenso',
    title: 'Tập 10: Báo Cáo Horenso & Xin Nghỉ Phép (Yukyu)',
    subtitle: 'Kỹ năng Báo cáo - Liên lạc - Thảo luận và xin phép nghỉ dưỡng sức chuẩn công sở',
    category: 'WORK_SOCIAL',
    categoryName: 'Công Việc & Giao Tiếp',
    icon: '💼',
    bgGradient: 'from-slate-950 via-slate-900 to-zinc-900',
    postcardTitle: '🏆 Bưu Thiếp Kỷ Niệm: Nhân Viên Xuất Sắc Công Ty Nhật',
    postcardDesc: 'Trưởng phòng đánh giá rất cao tinh thần trách nhiệm và kỹ năng Horenso của bạn!',
    scenes: [
      {
        speaker: 'Trưởng phòng Sato (佐藤課長)',
        speakerAvatar: '👔',
        japanese: 'グエンさん、頼んでいたプロジェクトの進捗状況はどうなっていますか？',
        vietnamese: 'Nguyen ơi, tiến độ của dự án tôi giao cho bạn hiện tại đang thế nào rồi?',
        choices: [
          {
            text: 'はい、現在80％ほど完了しており、予定通り明日の15時までに提出できる見込みです。',
            isCorrect: true,
            explanation: 'Báo cáo con số định lượng (80%) và mốc thời gian hoàn thành chính xác.',
            reactionText: '完璧な報告ですね！その調子で引き続きよろしくお願いします。',
          },
          {
            text: 'たぶん大丈夫だと思います。まだ終わってないけど。',
            isCorrect: false,
            explanation: 'Dùng từ mơ hồ (たぶん) không tạo được sự tin tưởng trong công việc.',
            reactionText: '具体的にいつ終わるのか教えてもらえますか？心配です。',
          },
        ],
      },
      {
        speaker: 'Trưởng phòng Sato (佐藤課長)',
        speakerAvatar: '👔',
        japanese: '何か他に相談したいことはありますか？',
        vietnamese: 'Bạn có điều gì cần thảo luận thêm với tôi không?',
        choices: [
          {
            text: '恐れ入りますが、来週の金曜日に有給休暇を1日いただきたいのですが、よろしいでしょうか。',
            isCorrect: true,
            explanation: 'Cách xin nghỉ phép có lương (有給休暇) lịch sự và đúng quy trình trước ngày nghỉ.',
            reactionText: 'いつも頑張ってくれていますからね。しっかりリフレッシュしてきてください！',
          },
          {
            text: '来週の金曜日、休みます。来ません。',
            isCorrect: false,
            explanation: 'Thông báo một chiều thiếu tôn trọng cấp trên.',
            reactionText: '突然ですね...理由と事前申請書を出してくださいね。',
          },
        ],
      },
    ],
  },
];

export function StoryModeGame({ onBack }: StoryModeGameProps) {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'LIFESTYLE' | 'WORK_SOCIAL' | 'CULTURE'>('ALL');
  const [selectedEpisode, setSelectedEpisode] = useState<StoryEpisode>(IRODORI_EPISODES[0]);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [chosenOption, setChosenOption] = useState<DialogChoice | null>(null);
  const [episodeCompleted, setEpisodeCompleted] = useState(false);

  const filteredEpisodes = IRODORI_EPISODES.filter(
    (ep) => selectedCategory === 'ALL' || ep.category === selectedCategory
  );

  const scene = selectedEpisode.scenes[currentSceneIdx];

  const handleSelectEpisode = (ep: StoryEpisode) => {
    playClick();
    setSelectedEpisode(ep);
    setCurrentSceneIdx(0);
    setChosenOption(null);
    setEpisodeCompleted(false);
  };

  const handlePickChoice = (choice: DialogChoice) => {
    playClick();
    setChosenOption(choice);

    if (choice.isCorrect) {
      playCorrect();
      addExpAndCoins(80, 50);
    } else {
      playWrong();
    }
  };

  const handleNextScene = () => {
    playClick();
    setChosenOption(null);
    if (currentSceneIdx + 1 < selectedEpisode.scenes.length) {
      setCurrentSceneIdx((idx) => idx + 1);
    } else {
      setEpisodeCompleted(true);
      playVictory();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ja-JP';
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-3xl border border-border/50 shadow-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Arcade Hub
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground hidden sm:inline">Chủ đề Irodori:</span>
          <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                selectedCategory === 'ALL' ? 'bg-card text-rose-500 shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Tất Cả (10 Tập)
            </button>
            <button
              onClick={() => setSelectedCategory('LIFESTYLE')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                selectedCategory === 'LIFESTYLE' ? 'bg-card text-rose-500 shadow-sm' : 'text-muted-foreground'
              }`}
            >
              🏡 Đời Sống
            </button>
            <button
              onClick={() => setSelectedCategory('WORK_SOCIAL')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                selectedCategory === 'WORK_SOCIAL' ? 'bg-card text-amber-500 shadow-sm' : 'text-muted-foreground'
              }`}
            >
              💼 Công Sở
            </button>
            <button
              onClick={() => setSelectedCategory('CULTURE')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                selectedCategory === 'CULTURE' ? 'bg-card text-purple-500 shadow-sm' : 'text-muted-foreground'
              }`}
            >
              ♨️ Văn Hóa
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            setCurrentSceneIdx(0);
            setChosenOption(null);
            setEpisodeCompleted(false);
          }}
          className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Chơi lại tập này"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Episode Horizontal Scroll Selector */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
        {filteredEpisodes.map((ep) => (
          <button
            key={ep.id}
            onClick={() => handleSelectEpisode(ep)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
              selectedEpisode.id === ep.id
                ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white border-transparent shadow-md shadow-rose-500/20 scale-105'
                : 'bg-card border-border/60 text-muted-foreground hover:text-foreground hover:border-rose-500/40'
            }`}
          >
            <span className="text-base">{ep.icon}</span>
            <span>{ep.title.split(':')[0]}</span>
          </button>
        ))}
      </div>

      {/* Visual Novel Theater Stage */}
      <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-b ${selectedEpisode.bgGradient} border-2 border-border/80 shadow-2xl text-white space-y-6 min-h-[500px] flex flex-col justify-between`}>
        {/* Episode Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" /> Giáo trình Irodori JF Nhật Bản
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">{selectedEpisode.title}</h3>
            <p className="text-xs text-slate-300">{selectedEpisode.subtitle}</p>
          </div>
          <span className="text-xs font-bold text-slate-400 self-start sm:self-center">
            Cảnh {currentSceneIdx + 1}/{selectedEpisode.scenes.length}
          </span>
        </div>

        {!episodeCompleted && scene ? (
          <div className="space-y-6 py-2">
            {/* Speaker Visual & Dialogue Box */}
            <div className="flex items-start gap-4 bg-slate-900/85 backdrop-blur-md p-5 rounded-3xl border border-white/15 shadow-lg">
              <div className="text-4xl sm:text-5xl shrink-0 p-3 rounded-2xl bg-slate-800/80 border border-white/10 shadow-inner">
                {scene.speakerAvatar}
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-amber-300">{scene.speaker}</h4>
                  <button
                    onClick={() => handleSpeak(scene.japanese)}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-rose-300 transition-colors"
                    title="Phát âm tiếng Nhật"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  "{scene.japanese}"
                </p>
                <p className="text-xs text-slate-300 italic">
                  ({scene.vietnamese})
                </p>
              </div>
            </div>

            {/* Response Choice Buttons */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-rose-400">
                👉 Lựa chọn câu thoại phản hồi chuẩn văn hóa của bạn:
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {scene.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    disabled={chosenOption !== null}
                    onClick={() => handlePickChoice(choice)}
                    className={`p-4 rounded-2xl text-left font-bold text-xs sm:text-sm transition-all border ${
                      chosenOption === choice
                        ? choice.isCorrect
                          ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 shadow-md'
                          : 'bg-rose-500/30 border-rose-400 text-rose-200 shadow-md'
                        : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-rose-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="inline-block w-5 h-5 rounded-full bg-slate-700 text-center leading-5 text-[10px] mr-2 font-black">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {choice.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Reaction Feedback */}
            <AnimatePresence>
              {chosenOption && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border ${
                    chosenOption.isCorrect
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
                      : 'bg-rose-500/20 border-rose-400/40 text-rose-200'
                  } space-y-2`}
                >
                  <div className="font-bold text-xs">
                    {chosenOption.isCorrect ? '✅ Phản hồi chính xác chuẩn ngữ cảnh!' : '❌ Chưa tối ưu theo văn hóa Nhật!'}
                  </div>
                  <p className="text-sm font-semibold italic">"{chosenOption.reactionText}"</p>
                  <p className="text-xs opacity-90">💡 <strong>Giải thích:</strong> {chosenOption.explanation}</p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextScene}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-white text-slate-950 font-black text-xs hover:bg-slate-200 transition-colors shadow-md"
                    >
                      Tiếp tục cảnh sau <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Episode Postcard Reward */
          <div className="text-center py-6 space-y-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 text-white flex items-center justify-center mx-auto shadow-2xl">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl sm:text-3xl font-black text-amber-300">
                {selectedEpisode.postcardTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                {selectedEpisode.postcardDesc}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onBack}
                className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition-colors"
              >
                Arcade Hub
              </button>
              <button
                onClick={() => {
                  setCurrentSceneIdx(0);
                  setChosenOption(null);
                  setEpisodeCompleted(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs shadow-lg shadow-rose-500/30 hover:opacity-90 transition-opacity"
              >
                Trải Nghiệm Lại 📖
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
