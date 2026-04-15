import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import path from "path";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { startScheduler } from "./scheduler";
import { prewarmProductContent, getContentCacheStatus } from "./prewarm-content";
import { warmCache } from "./cache";
import { storage } from "./storage";

const app = express();
const httpServer = createServer(app);

app.use((req: Request, res: Response, next: NextFunction) => {
  const host = req.hostname;
  if (host === "www.rentmygadgets.com") {
    return res.redirect(301, `https://rentmygadgets.com${req.originalUrl}`);
  }
  next();
});

app.use(compression());

app.use(cookieParser());

// Security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.googletagmanager.com", "https://bat.bing.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://www.google-analytics.com", "https://bat.bing.com", "wss:", "ws:"],
      frameSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use((req: Request, _res: Response, next: NextFunction) => {
  const gpcHeader = req.headers["sec-gpc"];
  (req as any).gpcActive = gpcHeader === "1";
  next();
});

// Serve stock images from attached_assets folder
app.use('/stock_images', express.static(path.join(process.cwd(), 'attached_assets/stock_images')));

// Serve all attached assets (for uploaded product images)
app.use('/attached_assets', express.static(path.join(process.cwd(), 'attached_assets')));

// Serve product images from static folder
app.use('/static', express.static(path.join(process.cwd(), 'static')));

// Serve product images from public/images folder
app.use('/images', express.static(path.join(process.cwd(), 'public/images')));

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    async () => {
      log(`serving on port ${port}`);
      
      // Warm in-memory cache asynchronously (fire-and-forget) to not block startup
      warmCache(storage).catch(err => {
        log(`[cache] Warmup error: ${err.message}`);
      });
      
      // Start the nightly image sync scheduler
      startScheduler();
      
      // Pre-warm product content cache in background
      const status = await getContentCacheStatus();
      if (status.missing > 0) {
        log(`[prewarm] ${status.missing}/${status.total} products need content - starting background generation`);
        prewarmProductContent().then(result => {
          log(`[prewarm] Complete: ${result.generated} generated, ${result.skipped} cached, ${result.failed} failed`);
        }).catch(err => {
          log(`[prewarm] Error: ${err.message}`);
        });
      } else {
        log(`[prewarm] All ${status.total} products have cached content - ready for instant load`);
      }
    },
  );
})();
