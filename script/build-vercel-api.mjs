import { build } from 'esbuild';
import { rm, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

console.log('[vercel-api] Bundling server/_vercel-handler.ts -> api/index.js ...');

const STUB_MODULES = [
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
];

const stubPlugin = {
  name: 'stub-modules',
  setup(build) {
    const filter = new RegExp(
      '^(' + STUB_MODULES.map(m => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(/.*)?$'
    );
    build.onResolve({ filter }, (args) => ({
      path: args.path,
      namespace: 'stub-ns',
    }));
    build.onLoad({ filter: /.*/, namespace: 'stub-ns' }, () => ({
      contents: `
        const stubFn = () => { throw new Error('Module stubbed for Vercel - not available at runtime'); };
        const stub = new Proxy(stubFn, {
          get: (_t, prop) => prop === 'default' ? stub : stubFn,
          apply: () => { throw new Error('Module stubbed for Vercel'); },
        });
        module.exports = stub;
        module.exports.default = stub;
      `,
      loader: 'js',
    }));
  },
};

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
  plugins: [stubPlugin],
  external: [
    'sharp',
    'pg-native',
    '@neondatabase/serverless',
    'bufferutil',
    'utf-8-validate',
  ],
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.VERCEL': '"1"',
  },
  loader: {
    '.html': 'text',
    '.css': 'text',
  },
  banner: {
    js: '// Auto-generated bundle for Vercel - do not edit',
  },
});

await writeFile(
  'api/package.json',
  JSON.stringify({ type: 'commonjs' }, null, 2)
);

console.log('[vercel-api] Bundle done. Pruning node_modules ...');

const PRUNE_PACKAGES = [
  // Browser automation (huge)
  'puppeteer', 'puppeteer-core', '@puppeteer', 'chromium-bidi',
  'playwright', 'playwright-core', 'electron', 'electron-to-chromium',
  // Frontend UI libraries (not needed by API)
  'lucide-react', 'react-day-picker', '@radix-ui', 'recharts',
  'framer-motion', 'react-hook-form', '@hookform', '@tanstack',
  'react', 'react-dom', 'wouter', 'cmdk', 'vaul', 'sonner',
  'embla-carousel-react', 'input-otp', 'next-themes',
  'class-variance-authority', 'clsx', 'tailwind-merge',
  'tailwindcss-animate', 'tw-animate-css', 'tailwindcss', '@tailwindcss',
  // Build tools (not needed at runtime)
  '@swc', 'typescript', '@types', 'esbuild', '@esbuild', '@esbuild-kit',
  'vite', '@vitejs', 'tsx', 'drizzle-kit', '@babel',
  'lightningcss-linux-x64-gnu', 'lightningcss-linux-x64-musl',
  'lightningcss-darwin-arm64', 'lightningcss-darwin-x64',
  'lightningcss-win32-x64-msvc', 'lightningcss',
  // Other heavy unused
  'web-streams-polyfill', 'date-fns-jalali', 'lodash',
  '@rollup', 'rollup', 'caniuse-lite', '@replit',
];

let prunedCount = 0;
let prunedSize = 0;
for (const pkg of PRUNE_PACKAGES) {
  const path = `node_modules/${pkg}`;
  if (existsSync(path)) {
    try {
      await rm(path, { recursive: true, force: true });
      prunedCount++;
    } catch (e) {
      console.warn(`[vercel-api] Could not prune ${pkg}:`, e.message);
    }
  }
}

console.log(`[vercel-api] Pruned ${prunedCount} packages from node_modules.`);
console.log('[vercel-api] Done.');
