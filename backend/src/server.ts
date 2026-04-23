import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import contactRoute from "./routes/contact.js";
import type { NextFunction, Request, Response } from "express";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 5000);
const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS ?? "0");

app.use(helmet());
const corsallowed = ["http://localhost:5173", "https://portfolio.seekeru.tech"];
app.use(cors({ origin: corsallowed }));
app.use(express.json({ limit: "100kb" }));
if (Number.isInteger(trustProxyHops) && trustProxyHops > 0) {
  app.set("trust proxy", trustProxyHops);
}

const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions, please try again later." },
});

app.use("/api/contact", contactLimiter, contactRoute);

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

interface RequestError extends Error {
  status?: number;
  statusCode?: number;
  type?: string;
}

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const requestError = err as RequestError;
  const status =
    typeof requestError.status === "number"
      ? requestError.status
      : typeof requestError.statusCode === "number"
        ? requestError.statusCode
        : 500;

  if (requestError.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  if (requestError.type === "entity.too.large" || status === 413) {
    return res.status(413).json({ error: "Payload too large" });
  }

  if (status >= 400 && status < 500) {
    return res.status(status).json({ error: "Invalid request" });
  }

  const message =
    requestError instanceof Error ? requestError.message : "Unknown error";
  console.error("Unhandled backend error:", message);
  return res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
