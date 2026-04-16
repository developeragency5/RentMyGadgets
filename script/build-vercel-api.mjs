import { build } from 'esbuild';
import { writeFile } from 'fs/promises';

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

console.log('[vercel-api] Done.');
