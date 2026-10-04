const { execSync } = require('child_process');

if (process.env.OPENNEXT_BUILD) {
  console.log('Building Next.js app (inner build)...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  execSync('npx next build', { stdio: 'inherit' });
} else {
  console.log('Triggering OpenNext Cloudflare build (outer build)...');
  execSync('npx opennextjs-cloudflare build', {
    stdio: 'inherit',
    env: { ...process.env, OPENNEXT_BUILD: '1' }
  });
}
