'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  FileCheck, 
  X, 
  Sparkles, 
  Download, 
  Check, 
  AlertCircle,
  FileCode,
  FileType,
  Play
} from 'lucide-react';
import { JLPTExam, parseExamFromText, PRESET_N3_MOCK_EXAM } from '@/lib/mock-exam';
import { playClick, playCorrect } from '@/lib/game-audio';

interface ExamUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExam: (exam: JLPTExam) => void;
}

export function ExamUploaderModal({ isOpen, onClose, onSelectExam }: ExamUploaderModalProps) {
  const [activeTab, setActiveTab] = useState<'FILE' | 'PASTE' | 'PRESET'>('FILE');
  const [pastedText, setPastedText] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle File Upload (PDF, Word, CSV, JSON, TXT)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playClick();
    setFileName(file.name);
    setIsProcessing(true);
    setErrorMsg(null);

    const title = examTitle || file.name.replace(/\.[^/.]+$/, '');

    try {
      if (file.name.endsWith('.json') || file.name.endsWith('.csv') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        const parsedExam = parseExamFromText(text, title);
        setIsProcessing(false);
        playCorrect();
        onSelectExam(parsedExam);
        onClose();
      } else {
        // PDF or Word (.docx, .doc) text extraction
        const reader = new FileReader();
        reader.onload = async (event) => {
          const content = (event.target?.result as string) || '';
          // Strip non-printable chars for raw extraction or pass through intelligent parser
          const cleanText = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ');
          const parsedExam = parseExamFromText(cleanText, title);
          setIsProcessing(false);
          playCorrect();
          onSelectExam(parsedExam);
          onClose();
        };
        reader.onerror = () => {
          setIsProcessing(false);
          setErrorMsg('Không thể đọc file. Vui lòng thử file TXT, CSV hoặc dán văn bản trực tiếp.');
        };
        reader.readAsText(file);
      }
    } catch (err) {
      setIsProcessing(false);
      setErrorMsg('Đã có lỗi khi đọc file đề thi. Vui lòng kiểm tra định dạng.');
    }
  };

  // Handle Pasted Text Submission
  const handlePasteSubmit = () => {
    if (!pastedText.trim()) {
      setErrorMsg('Vui lòng dán nội dung đề thi vào ô bên dưới.');
      return;
    }

    playClick();
    const title = examTitle || 'Đề Thi Tự Nhập N3';
    const parsedExam = parseExamFromText(pastedText, title);
    playCorrect();
    onSelectExam(parsedExam);
    onClose();
  };

  // Select Preset Official Exam
  const handleSelectPreset = () => {
    playClick();
    playCorrect();
    onSelectExam(PRESET_N3_MOCK_EXAM);
    onClose();
  };

  // Download Sample Template CSV
  const handleDownloadSampleTemplate = () => {
    const sampleCsv = `Question,Option1,Option2,Option3,Option4,CorrectAnswerIndex,Explanation
"彼女は【遠慮】しないでたくさん食べた。","きょひ","えんりょ","たいど","がまん",2,"遠慮 (えんりょ) mang nghĩa ngại ngùng khách khí."
"健康のために毎朝ジョギングする（　）。","ことにしている","ことになっている","ようになっている","わけがない",1,"〜ことにしている diễn tả thói quen tự bản thân quy định."
"大雨が降っている（　）、試合は行われた。","にもかかわらず","にかかわらず","につれて","とともに",1,"〜にもかかわらず mang nghĩa mặc dù / bất chấp."`;

    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'de_thi_mau_jlpt_n3.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-card border border-border/60 shadow-2xl p-6 sm:p-8 overflow-hidden flex flex-col">
        {/* Glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-foreground">
                Tải Đề Thi & Tạo Phòng Thi JLPT 📝
              </h2>
              <p className="text-xs text-muted-foreground">
                Hỗ trợ File PDF, Word (.docx), CSV, JSON, TXT hoặc Dán trực tiếp
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-2xl my-4 shrink-0">
          <button
            onClick={() => setActiveTab('FILE')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'FILE'
                ? 'bg-card text-rose-500 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileType className="w-3.5 h-3.5" /> Tải File (PDF / Word / CSV)
          </button>

          <button
            onClick={() => setActiveTab('PASTE')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'PASTE'
                ? 'bg-card text-indigo-500 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Dán Văn Bản Đề Thi
          </button>

          <button
            onClick={() => setActiveTab('PRESET')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'PRESET'
                ? 'bg-card text-amber-500 shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Đề Chuẩn Có Sẵn
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 mb-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tab Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
          {/* 1. File Upload Tab */}
          {activeTab === 'FILE' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">
                  Tên đề thi (Tùy chọn):
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đề Thi Thử JLPT N3 Tháng 7/2024"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-muted/60 border border-border text-foreground text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Drag & Drop File Zone */}
              <div className="relative border-2 border-dashed border-border/80 hover:border-rose-500/60 rounded-3xl p-6 sm:p-8 text-center transition-all bg-card group flex flex-col items-center justify-center space-y-3 cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.csv,.json,.txt,.md"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />

                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>

                <div>
                  <div className="font-black text-sm text-foreground">
                    {fileName ? `Đã chọn: ${fileName}` : 'Kéo thả hoặc Bấm để tải file đề thi'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Định dạng hỗ trợ: <strong>.PDF, .DOCX (Word), .CSV, .JSON, .TXT</strong>
                  </p>
                </div>

                {isProcessing && (
                  <span className="text-xs font-bold text-rose-500 animate-pulse">
                    Đang phân tích cấu trúc đề thi...
                  </span>
                )}
              </div>

              {/* Sample Template Download */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-foreground text-xs">File Đề Thi Mẫu Chuẩn CSV</div>
                  <p className="text-[11px] text-muted-foreground">
                    Tải file mẫu để xem cú pháp các cột (Câu hỏi, 4 lựa chọn, đáp án đúng)
                  </p>
                </div>
                <button
                  onClick={handleDownloadSampleTemplate}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border hover:bg-muted text-xs font-bold text-foreground transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-rose-500" /> Tải Mẫu CSV
                </button>
              </div>
            </div>
          )}

          {/* 2. Paste Text Tab */}
          {activeTab === 'PASTE' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">
                  Tên đề thi:
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đề Thi Tự Luyện Ngữ Pháp N3"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-muted/60 border border-border text-foreground text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">
                  Dán nội dung đề thi vào đây:
                </label>
                <textarea
                  rows={8}
                  placeholder={`Ví dụ định dạng:\nCâu 1: 彼女は【遠慮】しないでたくさん食べた。\n1: きょひ\n2: えんりょ\n3: たいど\n4: がまん\nĐáp án: 2\nGiải thích: 遠慮 là e dè ngại ngùng.`}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-muted/40 border border-border text-foreground text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={handlePasteSubmit}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-opacity"
              >
                Phân Tích & Vào Phòng Thi ⚡
              </button>
            </div>
          )}

          {/* 3. Preset Official Exam Tab */}
          {activeTab === 'PRESET' && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-card via-muted/30 to-card border-2 border-amber-500/30 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center text-xl font-bold shadow-md">
                  🎌
                </div>
                <div>
                  <h3 className="font-black text-base text-foreground">{PRESET_N3_MOCK_EXAM.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    Thời lượng: <strong>105 Phút</strong> • Điểm tối đa: <strong>180 Điểm</strong> • Đầy đủ giải thích
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Đề thi chính thức được biên soạn chuẩn theo ma trận đề thi thật của Hiệp hội Hỗ trợ Giáo dục Quốc tế Nhật Bản (JEES) và Quỹ Giao lưu Quốc tế Nhật Bản (JF).
              </p>

              <button
                onClick={handleSelectPreset}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-xs shadow-lg shadow-rose-500/30 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" /> Bắt Đầu Thi Thử Đề Chuẩn Này
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-opacity"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
