import { build } from 'esbuild';
import { rm, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

console.log('[vercel-api] Bundling server/_vercel-handler.ts -> api/index.js ...');

await build({
  entryPoints: ['server/_vercel-handler.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outfile: 'api/index.js',
  minify: false,
  sourcemap: false,
  logLevel: 'warning',
  external: [
    'sharp',
    'pg-native',
    'puppeteer',
    'puppeteer-core',
    '@puppeteer/browsers',
    'chromium-bidi',
    'playwright',
    'playwright-core',
    'electron',
    '@swc/core',
    'esbuild',
    'vite',
    '@vitejs/plugin-react',
    'tsx',
    'drizzle-kit',
    '@replit/vite-plugin-cartographer',
    '@replit/vite-plugin-runtime-error-modal',
    '@replit/vite-plugin-shadcn-theme-json',
  ],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  loader: {
    '.html': 'text',
    '.css': 'text',
  },
  banner: {
    js: '// Auto-generated bundle for Vercel - do not edit',
  },
});

if (existsSync('api/index.ts')) {
  await rm('api/index.ts');
  console.log('[vercel-api] Removed api/index.ts to prevent Vercel TS check');
}

await writeFile(
  'api/package.json',
  JSON.stringify({ type: 'commonjs' }, null, 2)
);

console.log('[vercel-api] Done.');
