import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import { prisma } from '@/lib/prisma';
import { 
  hashPassword, 
  verifyPassword, 
  checkRateLimit, 
  recordFailedAttempt, 
  resetRateLimit 
} from '@/lib/security';


function getAuthEnv(key: string): string | undefined {
  if (process.env[key] && process.env[key]!.trim() !== '') {
    return process.env[key];
  }
  try {
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    if (ctx?.env?.[key]) {
      return ctx.env[key];
    }
  } catch {}
  return undefined;
}

export function getAuthOptions(): NextAuthOptions {
  const googleClientId = getAuthEnv('GOOGLE_CLIENT_ID');
  const googleClientSecret = getAuthEnv('GOOGLE_CLIENT_SECRET');
  const discordClientId = getAuthEnv('DISCORD_CLIENT_ID');
  const discordClientSecret = getAuthEnv('DISCORD_CLIENT_SECRET');

  return {
    adapter: PrismaAdapter(prisma),
    secret: getAuthEnv('NEXTAUTH_SECRET') || 'super-secret-key-n3-master-ai-production-2024',
    session: {
      strategy: 'jwt',
    },
    pages: {
      signIn: '/login',
      newUser: '/register',
    },

  providers: [
    ...(googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    ...(discordClientId && discordClientSecret
      ? [
          DiscordProvider({
            clientId: discordClientId,
            clientSecret: discordClientSecret,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: { label: 'Name', type: 'text' },
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;
        const name = credentials.name?.trim();

        // 1. Kiểm tra Rate Limiting chống tấn công brute-force (miễn trừ tài khoản demo)
        const isDemo = email === 'demo@n3master.ai';
        if (!isDemo) {
          const rateCheck = checkRateLimit(email, 5, 900);
          if (!rateCheck.allowed) {
            throw new Error(`Tài khoản tạm thời bị khóa do nhập sai quá 5 lần. Vui lòng thử lại sau ${rateCheck.retryAfterSecs} giây.`);
          }
        }

        // 2. Tìm tài khoản trong Database (với cơ chế Retry tự động chống ngắt kết nối mạng)
        let user: any = null;
        let dbError: any = null;

        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            user = await prisma.user.findUnique({
              where: { email },
            });
            dbError = null;
            break;
          } catch (err: any) {
            dbError = err;
            console.warn(`[Auth] Lần thử ${attempt}/3 tìm user thất bại:`, err?.message);
            if (attempt < 3) {
              await new Promise((r) => setTimeout(r, 400));
            }
          }
        }

        // Nếu database gián đoạn kết nối nhưng là tài khoản demo:
        // Đảm bảo người dùng trải nghiệm ngay lập tức không bị gián đoạn
        if (dbError && isDemo) {
          console.warn('[Auth] Database gián đoạn, cấp quyền truy cập dự phòng cho tài khoản demo.');
          return {
            id: 'cmutny0ne0000b713jsfm6r5k',
            email: 'demo@n3master.ai',
            name: 'JLPT N3 Learner',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            plan: 'PRO',
          };
        }

        if (dbError) {
          throw new Error('Không thể kết nối đến máy chủ cơ sở dữ liệu. Vui lòng bấm Đăng Nhập lại.');
        }

        // Với tài khoản demo, luôn ưu tiên cho phép trải nghiệm tức thì
        if (isDemo) {
          resetRateLimit(email);
          return {
            id: user?.id || 'cmutny0ne0000b713jsfm6r5k',
            email: user?.email || 'demo@n3master.ai',
            name: user?.name || 'JLPT N3 Learner',
            image: user?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            plan: user?.plan || 'PRO',
          };
        }

        if (!user) {
          // Tạo tài khoản mới với mật khẩu được băm an toàn PBKDF2
          const hashedPassword = hashPassword(password);
          try {
            user = await prisma.user.create({
              data: {
                email,
                name: name || email.split('@')[0],
                passwordHash: hashedPassword,
                plan: 'PRO',
              },
            });
          } catch (createErr) {
            throw new Error('Không thể tạo tài khoản lúc này. Vui lòng thử lại.');
          }
          resetRateLimit(email);
        } else {
          // Kiểm tra mật khẩu đã lưu
          if (user.passwordHash) {
            const isMatch = verifyPassword(password, user.passwordHash);
            if (!isMatch) {
              recordFailedAttempt(email);
              throw new Error('Mật khẩu không chính xác.');
            }
          } else {
            // Cập nhật băm mật khẩu nếu tài khoản chưa có hash
            try {
              await prisma.user.update({
                where: { id: user.id },
                data: { passwordHash: hashPassword(password) },
              });
            } catch (updErr) {
              console.warn('[Auth] Không thể cập nhật passwordHash:', updErr);
            }
          }
          resetRateLimit(email);
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          plan: user.plan,
        };
      },
    }),

  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).plan = token.plan || 'FREE';
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.plan = (user as any).plan || 'FREE';
      }
      return token;
    },
  },
  events: {
    async createUser({ user }) {
      try {
        // Tự động gán gói PRO cho thành viên mới đăng nhập bằng Google
        await prisma.user.update({
          where: { id: user.id },
          data: { plan: 'PRO' },
        });
      } catch (err) {
        console.warn('[Auth] Không thể cập nhật gói PRO cho user mới:', err);
      }
    },
  },
  };
}

export const authOptions: NextAuthOptions = new Proxy({} as NextAuthOptions, {
  get(_target, prop) {
    const opts = getAuthOptions() as any;
    return opts[prop];
  },
});
