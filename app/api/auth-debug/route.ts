import { NextResponse } from 'next/server';
import { getAuthOptions } from '@/lib/auth';
import { Issuer } from 'openid-client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const envStatus: Record<string, any> = {};

  let cfEnvKeys: string[] = [];
  try {
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    if (ctx?.env) {
      cfEnvKeys = Object.keys(ctx.env);
    }
  } catch (e: any) {
    cfEnvKeys = [`error: ${e?.message || e}`];
  }

  const keysToCheck = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_TRUST_HOST',
    'AUTH_TRUST_HOST',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'DATABASE_URL',
  ];

  for (const k of keysToCheck) {
    const val = process.env[k];
    const isSecret = k.includes('SECRET') || k.includes('DATABASE') || k.includes('URL');
    envStatus[k] = {
      inProcessEnv: typeof val === 'string' && val.length > 0,
      length: val ? val.length : 0,
      preview: isSecret ? (val ? 'SET (hidden)' : 'MISSING') : (val ? `${val.substring(0, 12)}...` : null),
    };
  }

  let authOptionsStatus: any = {};
  try {
    const opts = getAuthOptions();
    const google = opts.providers.find((p: any) => p.id === 'google') as any;
    authOptionsStatus = {
      secretSet: !!opts.secret,
      secretLength: opts.secret ? opts.secret.length : 0,
      providersCount: opts.providers.length,
      providerIds: opts.providers.map((p: any) => p.id),
      googleConfig: google
        ? {
            id: google.id,
            type: google.type,
            hasClientId: !!google.options?.clientId,
            hasClientSecret: !!google.options?.clientSecret,
            wellKnown: google.wellKnown,
            authorizationUrl: google.authorization?.url,
          }
        : null,
    };
  } catch (e: any) {
    authOptionsStatus = { error: e?.message || String(e) };
  }

  let discoverStatus: any = {};
  try {
    const t0 = Date.now();
    const issuer = await Issuer.discover('https://accounts.google.com/.well-known/openid-configuration');
    discoverStatus = {
      success: true,
      durationMs: Date.now() - t0,
      issuer: issuer.issuer,
      authorization_endpoint: issuer.authorization_endpoint,
    };
  } catch (e: any) {
    discoverStatus = {
      success: false,
      errorName: e?.name,
      errorMessage: e?.message,
      errorStack: e?.stack,
    };
  }

  return NextResponse.json({
    cfEnvKeys,
    envStatus,
    authOptionsStatus,
    discoverStatus,
  });
}
