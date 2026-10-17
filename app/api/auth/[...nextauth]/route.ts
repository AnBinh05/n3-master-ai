import '@/lib/http-polyfill';
import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/auth';

const handler = (req: any, ctx: any) => {
  return NextAuth(getAuthOptions())(req, ctx);
};

export { handler as GET, handler as POST };

