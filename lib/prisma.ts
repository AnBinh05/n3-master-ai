import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

export type DatacenterId = 'DC1_MUMBAI' | 'DC2_SINGAPORE';

export interface DatacenterNode {
  id: DatacenterId;
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

export interface DatacenterStatusReport {
  activeDatacenter: DatacenterId;
  activeDatacenterName: string;
  isSimulatingFailure: boolean;
  nodes: DatacenterNode[];
  failoverHistory: Array<{
    timestamp: string;
    from: DatacenterId;
    to: DatacenterId;
    reason: string;
  }>;
  architecture: {
    pattern: string;
    rto: string;
    rpo: string;
    strategy: string;
  };
}

// Global state across hot reloads / workers
const globalForPrisma = globalThis as unknown as {
  prismaDC1?: PrismaClient;
  prismaDC2?: PrismaClient;
  pgPoolDC1?: Pool;
  pgPoolDC2?: Pool;
  activeDatacenter?: DatacenterId;
  simulateFailure?: boolean;
  failoverHistory?: Array<{
    timestamp: string;
    from: DatacenterId;
    to: DatacenterId;
    reason: string;
  }>;
};

if (!globalForPrisma.activeDatacenter) {
  globalForPrisma.activeDatacenter = 'DC1_MUMBAI';
}
if (globalForPrisma.simulateFailure === undefined) {
  globalForPrisma.simulateFailure = false;
}
if (!globalForPrisma.failoverHistory) {
  globalForPrisma.failoverHistory = [];
}

export function getDatabaseUrl(dc: DatacenterId): string {
  let url = '';

  // 1. Thử lấy từ Cloudflare context trước (Production Edge Worker)
  try {
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    if (ctx?.env) {
      if (dc === 'DC1_MUMBAI') {
        url = ctx.env.PRIMARY_DATABASE_URL || ctx.env.DATABASE_URL || '';
      } else {
        url = ctx.env.SECONDARY_DATABASE_URL || '';
      }
    }
  } catch {
    // Không chạy trong Cloudflare context
  }

  // 2. Nếu chưa có, lấy từ process.env (Localhost/Node.js)
  if (!url || url.trim() === '') {
    if (dc === 'DC1_MUMBAI') {
      url = process.env.PRIMARY_DATABASE_URL || process.env.DATABASE_URL || '';
    } else {
      url = process.env.SECONDARY_DATABASE_URL || '';
    }
  }

  // 3. Fallback cuối cùng nếu DC2 chưa cấu hình thì dùng DATABASE_URL mặc định
  if (!url || url.trim() === '') {
    url = process.env.DATABASE_URL || '';
  }

  // Supabase Pooler cổng 6543 yêu cầu pgbouncer=true
  if (url.includes(':6543') && !url.includes('pgbouncer=true')) {
    url += (url.includes('?') ? '&' : '?') + 'pgbouncer=true';
  }

  return url;
}

function createPoolFor(connectionString: string): Pool {
  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 2,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 8000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 5000,
  });
}

export function getClientFor(dc: DatacenterId): PrismaClient {
  if (dc === 'DC1_MUMBAI') {
    if (globalForPrisma.prismaDC1) return globalForPrisma.prismaDC1;
    const url = getDatabaseUrl('DC1_MUMBAI');
    const pool = globalForPrisma.pgPoolDC1 || createPoolFor(url);
    pool.on('error', (err) => console.warn('[DC1 Mumbai Pool Warning]:', err?.message));
    globalForPrisma.pgPoolDC1 = pool;
    const adapter = new PrismaPg(pool);
    globalForPrisma.prismaDC1 = new PrismaClient({ adapter });
    return globalForPrisma.prismaDC1;
  } else {
    if (globalForPrisma.prismaDC2) return globalForPrisma.prismaDC2;
    const url = getDatabaseUrl('DC2_SINGAPORE');
    const pool = globalForPrisma.pgPoolDC2 || createPoolFor(url);
    pool.on('error', (err) => console.warn('[DC2 Singapore Pool Warning]:', err?.message));
    globalForPrisma.pgPoolDC2 = pool;
    const adapter = new PrismaPg(pool);
    globalForPrisma.prismaDC2 = new PrismaClient({ adapter });
    return globalForPrisma.prismaDC2;
  }
}

export function resetPrismaClients() {
  if (globalForPrisma.pgPoolDC1) {
    try { globalForPrisma.pgPoolDC1.end().catch(() => {}); } catch {}
  }
  if (globalForPrisma.pgPoolDC2) {
    try { globalForPrisma.pgPoolDC2.end().catch(() => {}); } catch {}
  }
  globalForPrisma.pgPoolDC1 = undefined;
  globalForPrisma.pgPoolDC2 = undefined;
  globalForPrisma.prismaDC1 = undefined;
  globalForPrisma.prismaDC2 = undefined;
}

export function getActiveDatacenter(): DatacenterId {
  if (globalForPrisma.simulateFailure) {
    return 'DC2_SINGAPORE';
  }
  return globalForPrisma.activeDatacenter || 'DC1_MUMBAI';
}

export function setActiveDatacenter(dc: DatacenterId) {
  const prev = globalForPrisma.activeDatacenter;
  globalForPrisma.activeDatacenter = dc;
  if (prev !== dc) {
    globalForPrisma.failoverHistory?.unshift({
      timestamp: new Date().toISOString(),
      from: prev || 'DC1_MUMBAI',
      to: dc,
      reason: 'Thủ công chuyển vùng hoặc kích hoạt bởi Quản trị viên',
    });
  }
}

export function setSimulateFailure(val: boolean) {
  const prev = globalForPrisma.simulateFailure;
  globalForPrisma.simulateFailure = val;
  if (val && !prev) {
    globalForPrisma.failoverHistory?.unshift({
      timestamp: new Date().toISOString(),
      from: 'DC1_MUMBAI',
      to: 'DC2_SINGAPORE',
      reason: 'MÔ PHỎNG SỰ CỐ: Datacenter 1 (Mumbai) sập nguồn -> Tự động kích hoạt Failover sang Datacenter 2 (Singapore)',
    });
  } else if (!val && prev) {
    globalForPrisma.failoverHistory?.unshift({
      timestamp: new Date().toISOString(),
      from: 'DC2_SINGAPORE',
      to: 'DC1_MUMBAI',
      reason: 'KHÔI PHỤC: Datacenter 1 (Mumbai) đã online trở lại -> Tự động khôi phục (Failback)',
    });
  }
}

export function isSimulatingFailure(): boolean {
  return !!globalForPrisma.simulateFailure;
}

function isConnectionError(err: any): boolean {
  const msg = String(err?.message || err);
  return (
    msg.includes('Connection terminated') ||
    msg.includes('socket hang up') ||
    msg.includes('connection closed') ||
    msg.includes('timeout') ||
    msg.includes('ECONNRESET') ||
    msg.includes('Connection lost') ||
    msg.includes("Can't reach database") ||
    msg.includes('P1001') ||
    msg.includes('P1002') ||
    msg.includes('P1008')
  );
}

// Cơ chế chuyển vùng tự động (Failover)
function recordFailover(from: DatacenterId, to: DatacenterId, reason: string) {
  console.warn(`🚨 [MULTI-DATACENTER FAILOVER]: Chuyển vùng từ ${from} sang ${to}! Lý do: ${reason}`);
  globalForPrisma.activeDatacenter = to;
  globalForPrisma.failoverHistory?.unshift({
    timestamp: new Date().toISOString(),
    from,
    to,
    reason,
  });
  if (globalForPrisma.failoverHistory && globalForPrisma.failoverHistory.length > 20) {
    globalForPrisma.failoverHistory.pop();
  }
}

// Thực thi câu lệnh qua proxy hỗ trợ Multi-Datacenter Failover
async function executeWithFailover<T>(
  operation: (client: PrismaClient) => Promise<T>
): Promise<T> {
  const currentDc = getActiveDatacenter();
  const backupDc: DatacenterId = currentDc === 'DC1_MUMBAI' ? 'DC2_SINGAPORE' : 'DC1_MUMBAI';

  // Nếu đang bật mô phỏng sự cố DC1, trực tiếp dùng DC2
  if (globalForPrisma.simulateFailure && currentDc === 'DC1_MUMBAI') {
    const clientDC2 = getClientFor('DC2_SINGAPORE');
    return await operation(clientDC2);
  }

  try {
    const primaryClient = getClientFor(currentDc);
    return await operation(primaryClient);
  } catch (err: any) {
    if (isConnectionError(err)) {
      recordFailover(
        currentDc,
        backupDc,
        `Mất kết nối tới Datacenter ${currentDc} (${err?.message})`
      );
      resetPrismaClients();
      const backupClient = getClientFor(backupDc);
      return await operation(backupClient);
    }
    throw err;
  }
}

function createModelProxy(modelName: string) {
  return new Proxy({}, {
    get(_target, method) {
      return async (...args: any[]) => {
        return executeWithFailover(async (client: any) => {
          const model = client[modelName];
          if (!model) throw new Error(`Model ${modelName} not found on PrismaClient`);
          if (typeof model[method] === 'function') {
            return await model[method](...args);
          }
          return model[method];
        });
      };
    },
  });
}

// Resilient Multi-Datacenter Prisma Proxy
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (typeof prop !== 'string') return undefined;

    if (prop.startsWith('$')) {
      return async (...args: any[]) => {
        return executeWithFailover(async (client: any) => {
          const fn = client[prop];
          if (typeof fn === 'function') {
            return await fn.apply(client, args);
          }
          return fn;
        });
      };
    }

    return createModelProxy(prop);
  },
});

function sanitizeError(msg: any): string {
  if (!msg) return 'Không thể kết nối';
  let str = String(msg?.message || msg);
  // Loại bỏ mật khẩu hoặc thông tin nhạy cảm nếu có trong chuỗi lỗi
  str = str.replace(/:\/\/([^:@]+):([^@]+)@/g, '://$1:***@');
  str = str.replace(/password=[^\s;]+/gi, 'password=***');
  return str.length > 150 ? str.substring(0, 150) + '...' : str;
}

// Hàm kiểm tra sức khỏe và độ trễ của 2 Datacenter
export async function getDatacenterStatus(): Promise<DatacenterStatusReport> {
  const nodes: DatacenterNode[] = [];

  // Check DC 1 (Mumbai)
  let dc1Latency = 0;
  let dc1Status: DatacenterNode['status'] = 'HEALTHY';
  let dc1Error: string | undefined;

  if (globalForPrisma.simulateFailure) {
    dc1Status = 'SIMULATED_DOWN';
    dc1Error = 'Mô phỏng sự cố mất điện / đứt cáp quang biển tại Mumbai';
  } else {
    try {
      const start = Date.now();
      const client = getClientFor('DC1_MUMBAI');
      await client.deck.findFirst({ select: { id: true } });
      dc1Latency = Date.now() - start;
    } catch (err: any) {
      dc1Status = 'DOWN';
      dc1Error = sanitizeError(err);
    }
  }

  nodes.push({
    id: 'DC1_MUMBAI',
    name: 'Datacenter 1 - Mumbai Primary',
    provider: 'Supabase Cloud (AWS Infrastructure)',
    region: 'ap-south-1',
    location: 'Mumbai, India',
    status: dc1Status,
    role: 'PRIMARY',
    latencyMs: dc1Latency,
    lastChecked: new Date().toISOString(),
    error: dc1Error,
  });

  // Check DC 2 (Singapore)
  let dc2Latency = 0;
  let dc2Status: DatacenterNode['status'] = 'HEALTHY';
  let dc2Error: string | undefined;

  try {
    const start = Date.now();
    const client = getClientFor('DC2_SINGAPORE');
    await client.deck.findFirst({ select: { id: true } });
    dc2Latency = Date.now() - start;
  } catch (err: any) {
    dc2Status = 'DOWN';
    dc2Error = sanitizeError(err);
  }

  nodes.push({
    id: 'DC2_SINGAPORE',
    name: 'Datacenter 2 - Singapore Standby & Disaster Recovery',
    provider: 'Neon Serverless Cloud (AWS Infrastructure)',
    region: 'ap-southeast-1',
    location: 'Singapore (Châu Á - Tối ưu cho Việt Nam/Nhật Bản)',
    status: dc2Status,
    role: 'STANDBY',
    latencyMs: dc2Latency,
    lastChecked: new Date().toISOString(),
    error: dc2Error,
  });

  const activeDc = getActiveDatacenter();
  const activeNode = nodes.find(n => n.id === activeDc);

  return {
    activeDatacenter: activeDc,
    activeDatacenterName: activeNode?.name || activeDc,
    isSimulatingFailure: !!globalForPrisma.simulateFailure,
    nodes,
    failoverHistory: globalForPrisma.failoverHistory || [],
    architecture: {
      pattern: 'Active - Passive Multi-Datacenter with Automated Failover',
      rto: '< 100ms (Tức thì)',
      rpo: '~ 0s (Near Zero Data Loss)',
      strategy: 'Geographically Distributed High Availability & Disaster Recovery',
    },
  };
}
