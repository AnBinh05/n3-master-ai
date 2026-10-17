import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { 
  prisma?: PrismaClient;
  pgPool?: Pool;
};

export function getDatabaseUrl(): string {
  let url = process.env.DATABASE_URL;

  // Đọc từ context Cloudflare Workers qua OpenNext nếu có
  if (!url || url.trim() === '') {
    try {
      const { getCloudflareContext } = require('@opennextjs/cloudflare');
      const ctx = getCloudflareContext();
      if (ctx?.env?.DATABASE_URL) {
        url = ctx.env.DATABASE_URL;
      }
    } catch {
      // Không chạy trong Cloudflare context hoặc module chưa sẵn sàng
    }
  }

  if (!url || url.trim() === '') {
    throw new Error(
      'DATABASE_URL chưa được cấu hình. Vui lòng thêm biến môi trường DATABASE_URL trong Cloudflare Dashboard (Settings > Variables and Secrets) hoặc file .env.'
    );
  }

  // Supabase Pooler trên cổng 6543 (Transaction Mode) yêu cầu cờ pgbouncer=true để Prisma hoạt động tối ưu
  if (url.includes(':6543') && !url.includes('pgbouncer=true')) {
    url += (url.includes('?') ? '&' : '?') + 'pgbouncer=true';
  }

  return url;
}

export function resetPrismaClient() {
  if (globalForPrisma.pgPool) {
    try {
      globalForPrisma.pgPool.end().catch(() => {});
    } catch {}
  }
  globalForPrisma.pgPool = undefined;
  globalForPrisma.prisma = undefined;
}

export function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = getDatabaseUrl();

  // Khởi tạo Pool tối ưu hóa với kết nối ổn định cho Supabase và Cloudflare Workers
  const pool =
    globalForPrisma.pgPool ||
    new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 2,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 5000,
    });

  pool.on('error', (err) => {
    console.warn('[Postgres Pool Warning]:', err?.message);
    resetPrismaClient();
  });

  globalForPrisma.pgPool = pool;

  // Khởi tạo PrismaClient cùng với PrismaPg adapter trên Edge / Cloudflare Workers
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

  globalForPrisma.prisma = client;
  return client;
}

function isConnectionError(err: any): boolean {
  const msg = String(err?.message || err);
  return (
    msg.includes('Connection terminated') ||
    msg.includes('socket hang up') ||
    msg.includes('connection closed') ||
    msg.includes('timeout') ||
    msg.includes('ECONNRESET') ||
    msg.includes('Connection lost')
  );
}

function createModelProxy(modelName: string) {
  return new Proxy({}, {
    get(_target, method) {
      return async (...args: any[]) => {
        let lastError: any = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            const client = getPrismaClient() as any;
            const model = client[modelName];
            if (!model) {
              throw new Error(`Model ${modelName} not found on PrismaClient`);
            }
            if (typeof model[method] === 'function') {
              return await model[method](...args);
            }
            return model[method];
          } catch (err: any) {
            lastError = err;
            if (isConnectionError(err) && attempt < 3) {
              console.warn(
                `[Prisma AutoRetry] Lỗi kết nối "${err?.message}", tự động làm mới pool và thử lại (lần ${attempt + 1}/3)...`
              );
              resetPrismaClient();
              await new Promise((r) => setTimeout(r, 200 * attempt));
              continue;
            }
            throw err;
          }
        }
        throw lastError;
      };
    },
  });
}

// Resilient Proxy: Tự động khởi tạo kết nối lười (lazy load),
// đồng thời tự động phát hiện và thử lại (retry) khi socket TCP bị ngắt bởi Supabase/Cloudflare.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (typeof prop !== 'string') return undefined;

    // Các hàm đặc biệt của Prisma Client ($queryRaw, $transaction, $executeRaw, v.v.)
    if (prop.startsWith('$')) {
      return async (...args: any[]) => {
        let lastError: any = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            const client = getPrismaClient() as any;
            const fn = client[prop];
            if (typeof fn === 'function') {
              return await fn.apply(client, args);
            }
            return fn;
          } catch (err: any) {
            lastError = err;
            if (isConnectionError(err) && attempt < 3) {
              console.warn(
                `[Prisma AutoRetry] Lỗi kết nối trên ${prop}: "${err?.message}", đang thử lại (lần ${attempt + 1}/3)...`
              );
              resetPrismaClient();
              await new Promise((r) => setTimeout(r, 200 * attempt));
              continue;
            }
            throw err;
          }
        }
        throw lastError;
      };
    }

    // Các model delegates: user, account, session, deck, card, v.v.
    return createModelProxy(prop);
  },
});
