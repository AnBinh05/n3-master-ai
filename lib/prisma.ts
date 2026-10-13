import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { 
  prisma?: PrismaClient;
  pgPool?: Pool;
};

export function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
    return process.env.DATABASE_URL;
  }

  // Đọc từ context Cloudflare Workers qua OpenNext nếu có
  try {
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    if (ctx?.env?.DATABASE_URL) {
      return ctx.env.DATABASE_URL;
    }
  } catch {
    // Không chạy trong Cloudflare context hoặc module chưa sẵn sàng
  }

  throw new Error(
    'DATABASE_URL chưa được cấu hình. Vui lòng thêm biến môi trường DATABASE_URL trong Cloudflare Dashboard (Settings > Variables and Secrets) hoặc file .env.'
  );
}

export function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = getDatabaseUrl();

  // Khởi tạo Pool với cấu hình SSL dành cho Supabase PostgreSQL trên Serverless / Cloudflare Workers
  const pool =
    globalForPrisma.pgPool ||
    new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 2,
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


