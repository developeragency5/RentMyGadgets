import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { createServer } from "http";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";

const app = express();
const httpServer = createServer(app);

app.set("trust proxy", 1);

app.use((req: Request, res: Response, next: NextFunction) => {
  const host = req.hostname;
  if (host === "www.rentmygadgets.com") {
    return res.redirect(301, `https://rentmygadgets.com${req.originalUrl}`);
  }
  next();
});

app.use(compression());
app.use(cookieParser());

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

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

let routesReady: Promise<void> | null = null;

async function ensureReady() {
  if (!routesReady) {
    routesReady = (async () => {
      await registerRoutes(httpServer, app);
      app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        res.status(status).json({ message: err.message || "Internal Server Error" });
      });
      // No serveStatic on Vercel - the CDN serves static files,
      // and SPA routes are handled by vercel.json rewrites to /index.html
      app.use("*", (_req: Request, res: Response) => {
        res.status(404).json({ message: "Not found" });
      });
    })();
  }
  return routesReady;
}

export default async function handler(req: Request, res: Response) {
  try {
    await ensureReady();
    return app(req, res);
  } catch (err: any) {
    console.error("[vercel-handler] Fatal error:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server initialization failed", error: err?.message });
    }
  }
}
