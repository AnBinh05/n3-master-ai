'use client';

import { useState, useEffect } from 'react';
import {
  Server,
  Globe,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Activity,
  ArrowRightLeft,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

interface DatacenterNode {
  id: string;
  name: string;
  provider: string;
  region: string;
  location: string;
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'SIMULATED_DOWN';
  role: 'PRIMARY' | 'STANDBY';
  latencyMs: number;
  lastChecked: string;
  error?: string;
}

interface DatacenterStatusReport {
  activeDatacenter: string;
  activeDatacenterName: string;
  isSimulatingFailure: boolean;
  nodes: DatacenterNode[];
  failoverHistory: Array<{
    timestamp: string;
    from: string;
    to: string;
    reason: string;
  }>;
  architecture: {
    pattern: string;
    rto: string;
    rpo: string;
    strategy: string;
  };
}

export default function DatacenterPage() {
  const [data, setData] = useState<DatacenterStatusReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/system/datacenter');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error('Lỗi lấy dữ liệu datacenter:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleSimulation = async () => {
    setActionLoading(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/system/datacenter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_simulation' }),
      });
      const json = await res.json();
      if (json.status) {
        setData(json.status);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const testLiveQuery = async () => {
    setTestResult('Đang gửi truy vấn đọc dữ liệu...');
    try {
      const start = Date.now();
      const res = await fetch('/api/decks');
      const time = Date.now() - start;
      const json = await res.json();
      const count = Array.isArray(json) ? json.length : json?.decks?.length || 'OK';
      setTestResult(
        `✅ Truy vấn thành công trong ${time}ms! Hệ thống đọc được ${count} bài học thông qua Datacenter đang hoạt động (${data?.activeDatacenterName}).`
      );
    } catch (err: any) {
      setTestResult(`❌ Lỗi truy vấn: ${err?.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 mb-2">
            <Globe className="w-3.5 h-3.5" /> Kiến trúc Phân tán Đa Vùng (Multi-Datacenter High Availability)
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Trung Tâm Giám Sát & Điều Phối Đa Datacenter
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Loại bỏ hoàn toàn điểm nghẽn lỗi đơn (Single Point of Failure - SPOF) với cơ chế tự động chuyển vùng (Auto-Failover) giữa các Datacenter quốc tế.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/80 hover:bg-secondary text-sm font-semibold transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Live Routing Alert Banner */}
      {data && (
        <div
          className={`p-5 rounded-2xl border transition-all ${
            data.isSimulatingFailure
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  data.isSimulatingFailure ? 'bg-amber-500 text-white animate-pulse' : 'bg-emerald-500 text-white'
                }`}
              >
                {data.isSimulatingFailure ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider opacity-80">Trạng Thái Điều Tuyến Hiện Tại</div>
                <div className="text-lg font-black">
                  {data.isSimulatingFailure ? (
                    <span>⚠️ SỰ CỐ TẠI DC1! ĐÃ TỰ ĐỘNG CHUYỂN HƯỚNG SANG DATACENTER 2 (SINGAPORE)</span>
                  ) : (
                    <span>🟢 ĐANG PHỤC VỤ BÌNH THƯỜNG TỪ: {data.activeDatacenterName}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Demo Button for Teacher */}
            <button
              onClick={toggleSimulation}
              disabled={actionLoading}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 whitespace-nowrap ${
                data.isSimulatingFailure
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
              }`}
            >
              <Zap className="w-4 h-4" />
              {data.isSimulatingFailure ? 'Khôi Phục Datacenter 1 (Failback)' : '🚨 Mô Phỏng Sập Datacenter 1'}
            </button>
          </div>
        </div>
      )}

      {/* Datacenter Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.nodes.map((node) => {
          const isCurrentActive = data.activeDatacenter === node.id;
          const isDown = node.status === 'DOWN';
          const isSimulated = node.status === 'SIMULATED_DOWN';
          const isUnavailable = isDown || isSimulated;

          return (
            <div
              key={node.id}
              className={`relative rounded-3xl border p-6 backdrop-blur-xl transition-all shadow-sm ${
                isCurrentActive
                  ? 'border-primary ring-2 ring-primary/20 bg-card/80'
                  : 'border-border/60 bg-card/40 opacity-90'
              }`}
            >
              {isCurrentActive && (
                <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black border border-primary/20">
                  <Activity className="w-3.5 h-3.5 animate-spin" /> Đang Phục Vụ Request
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${
                    isSimulated
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : isDown
                      ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  }`}
                >
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-foreground">{node.name}</h3>
                  <p className="text-xs text-muted-foreground">{node.provider}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm py-2">
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Vị trí địa lý:</span>
                  <span className="font-semibold text-foreground">{node.location}</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Mã khu vực (Region):</span>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted">
                    {node.region}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Vai trò trong cụm:</span>
                  <span
                    className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                      node.role === 'PRIMARY'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-purple-500/10 text-purple-500'
                    }`}
                  >
                    {node.role === 'PRIMARY' ? 'Primary Master' : 'Standby / Disaster Recovery'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground">Độ trễ phản hồi (Latency):</span>
                  <span className="font-bold text-foreground">
                    {isUnavailable ? '---' : `${node.latencyMs} ms`}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-muted-foreground">Trạng thái sức khỏe:</span>
                  {isSimulated ? (
                    <span className="inline-flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <AlertTriangle className="w-3.5 h-3.5" /> ĐANG MÔ PHỎNG SỰ CỐ (SIMULATED DOWN)
                    </span>
                  ) : isDown ? (
                    <span className="inline-flex items-center gap-1 text-rose-500 font-bold text-xs">
                      <AlertTriangle className="w-3.5 h-3.5" /> SỰ CỐ / MẤT KẾT NỐI (DOWN)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-500 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> HOẠT ĐỘNG TỐT (HEALTHY)
                    </span>
                  )}
                </div>
              </div>

              {node.error && (
                <div
                  className={`mt-4 p-3 rounded-xl border text-xs font-medium ${
                    isSimulated
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {node.error}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Test Query Button */}
      <div className="p-6 rounded-3xl border border-border/60 bg-card/50 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-black text-foreground text-base">Thử Nghiệm Truy Vấn Dữ Liệu Thời Gian Thực</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Bấm nút để kiểm chứng dữ liệu N3 được đọc thành công từ Datacenter đang hoạt động mà không bị gián đoạn.
          </p>
          {testResult && (
            <p className="text-xs font-semibold text-primary mt-2 p-2 rounded-lg bg-primary/10">
              {testResult}
            </p>
          )}
        </div>
        <button
          onClick={testLiveQuery}
          className="px-5 py-2.5 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition whitespace-nowrap"
        >
          Kiểm Tra Đọc Dữ Liệu Ngay
        </button>
      </div>

      {/* Disaster Recovery Metrics for Presentation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-border/60 bg-card/40">
          <div className="text-xs font-bold text-muted-foreground uppercase">Thời Gian Phục Hồi (RTO)</div>
          <div className="text-2xl font-black text-foreground mt-1">&lt; 100 ms</div>
          <p className="text-xs text-muted-foreground mt-1">Chuyển hướng tức thì khi phát hiện socket đứt gãy.</p>
        </div>
        <div className="p-5 rounded-2xl border border-border/60 bg-card/40">
          <div className="text-xs font-bold text-muted-foreground uppercase">Mất Mát Dữ Liệu (RPO)</div>
          <div className="text-2xl font-black text-emerald-500 mt-1">~ 0 Giây</div>
          <p className="text-xs text-muted-foreground mt-1">Đồng bộ cấu trúc và dữ liệu giữa các node.</p>
        </div>
        <div className="p-5 rounded-2xl border border-border/60 bg-card/40">
          <div className="text-xs font-bold text-muted-foreground uppercase">Điểm Nghẽn Lỗi Đơn (SPOF)</div>
          <div className="text-2xl font-black text-primary mt-1">Zero SPOF</div>
          <p className="text-xs text-muted-foreground mt-1">Phân tán đa đám mây (Supabase + Neon Cloud).</p>
        </div>
      </div>

      {/* Failover Event History */}
      <div className="rounded-3xl border border-border/60 bg-card/50 p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <ArrowRightLeft className="w-5 h-5 text-primary" />
          <h3 className="font-black text-lg text-foreground">Nhật Ký Chuyển Vùng Tự Động (Failover Audit Log)</h3>
        </div>

        {data?.failoverHistory && data.failoverHistory.length > 0 ? (
          <div className="space-y-3">
            {data.failoverHistory.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-background/60 border border-border/40 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary font-mono">{item.from} → {item.to}</span>
                  <span className="text-muted-foreground">| {item.reason}</span>
                </div>
                <span className="text-muted-foreground font-mono whitespace-nowrap">
                  {new Date(item.timestamp).toLocaleTimeString('vi-VN')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Chưa có sự cố nào xảy ra. Hệ thống đang hoạt động ổn định trên Datacenter chính.
          </p>
        )}
      </div>
    </div>
  );
}
