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


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
      ? [
          DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        // 1. Kiểm tra Rate Limiting chống tấn công brute-force
        const rateCheck = checkRateLimit(email, 5, 900);
        if (!rateCheck.allowed) {
          throw new Error(`Tài khoản tạm thời bị khóa do nhập sai quá 5 lần. Vui lòng thử lại sau ${rateCheck.retryAfterSecs} giây.`);
        }

        // 2. Tìm tài khoản trong Database
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // Tạo tài khoản mới với mật khẩu được băm an toàn PBKDF2
          const hashedPassword = hashPassword(password);
          user = await prisma.user.create({
            data: {
              email,
              name: email.split('@')[0],
              passwordHash: hashedPassword,
              plan: 'PRO',
            },
          });
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
            await prisma.user.update({
              where: { id: user.id },
              data: { passwordHash: hashPassword(password) },
            });
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
};
