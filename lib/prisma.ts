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

export function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = getDatabaseUrl();

  // Khởi tạo Pool tối ưu hóa với kết nối ổn định cho Supabase
  const pool =
    globalForPrisma.pgPool ||
    new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    });

  pool.on('error', (err) => {
    console.warn('Postgres pool idle client warning:', err?.message);
  });

  globalForPrisma.pgPool = pool;

  // Luôn luôn khởi tạo PrismaClient cùng với PrismaPg adapter trên Edge / Cloudflare Workers
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  globalForPrisma.prisma = client;
  return client;
}

// Lazy Proxy: Chỉ khởi tạo PrismaClient khi có query đầu tiên đến,
// đảm bảo biến môi trường trên Cloudflare Workers đã được nạp đầy đủ.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient() as any;
    const value = client[prop];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});


