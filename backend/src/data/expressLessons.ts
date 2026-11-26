import type { TopicLesson, TopicLessonCodeExample } from './topicLessonsFeed.js';

function makeExpressLesson(
  id: string,
  title: string,
  level: TopicLesson['level'],
  estimatedMinutes: number,
  coreQuestion: string,
  simpleHumanAnswer: string,
  realWorldExample: string,
  codeExamples: TopicLessonCodeExample[],
  interviewSpeakingAnswer: string,
  followUpQuestions: string[]
): TopicLesson {
  return {
    id,
    categoryId: 'express',
    categoryName: 'Express.js',
    title,
    level,
    estimatedMinutes,
    coreQuestion,
    simpleHumanAnswer,
    realWorldExample,
    codeExamples,
    interviewSpeakingAnswer,
    followUpQuestions,
  };
}

export const EXPRESS_LESSONS: Record<string, TopicLesson> = {
  'express-fundamentals-setup': makeExpressLesson(
    'express-fundamentals-setup',
    '1. Node.js & Express Fundamentals',
    'beginner',
    25,
    'What is Express.js, and how does Node’s single-threaded event loop handle thousands of API requests?',
    'Express.js is a minimal, fast web framework built on Node.js’s HTTP module. Because Node uses a non-blocking event loop, Express can handle thousands of concurrent I/O requests (DB queries, API calls) without spawning a thread per request.',
    'In Express, never run heavy CPU loops (like synchronous `bcrypt` or huge JSON parsing) on the main thread, because it blocks every other connected user.',
    [
      {
        title: 'Example 1: Minimal Express 5 Server',
        language: 'TypeScript',
        code: `import express from 'express';
const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.listen(4000, () => console.log('API listening on 4000'));`,
        expectedOutput: 'GET /health -> {"ok":true}',
      },
      {
        title: 'Example 2: Non-Blocking Async vs Blocking Sync',
        language: 'TypeScript',
        code: `import { readFile } from 'node:fs/promises';
app.get('/config', async (_req, res) => {
  const data = await readFile('./config.json', 'utf8');
  res.type('json').send(data);
});`,
        expectedOutput: 'Reads file asynchronously without blocking the event loop.',
      },
    ],
    'Express is a thin, unopinionated layer over Node.js HTTP. Keeping handlers async/non-blocking lets one Node process handle high I/O concurrency, while Express 5 automatically forwards rejected async promises to error middleware.',
    ['Why does synchronous CPU work hurt an Express server more than a PHP-FPM server?', 'What changed with async route errors in Express 5 vs Express 4?']
  ),

  'express-routing-params': makeExpressLesson(
    'express-routing-params',
    '2. Routing, Params & Query Strings',
    'beginner',
    30,
    'How do `req.params`, `req.query`, and `express.Router()` differ, and why does route order matter?',
    '`req.params` reads URL path segments (`/users/:id`), `req.query` reads `?page=2&sort=asc`, and `express.Router()` groups related routes into modular mini-apps. Express matches routes top-to-bottom, so `/users/me` MUST be registered before `/users/:id`!',
    'If `/users/:id` comes first, a request to `/users/me` treats `"me"` as `:id` and fails looking up user `"me"` in the database.',
    [
      {
        title: 'Example 1: Modular Router + Route Ordering',
        language: 'TypeScript',
        code: `const router = express.Router();
router.get('/me', requireAuth, getCurrentUser); // Specific route FIRST
router.get('/:id', getUserById);                // Dynamic param SECOND
app.use('/api/users', router);`,
        expectedOutput: 'Routes /api/users/me cleanly before matching :id.',
      },
      {
        title: 'Example 2: Reading Params & Query Safely',
        language: 'TypeScript',
        code: `router.get('/', (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  res.json({ page, tag: String(req.query.tag ?? 'all') });
});`,
        expectedOutput: 'Parses and clamps query parameters safely.',
      },
    ],
    'I organize features with `express.Router()` mounted by domain (`/api/auth`, `/api/orders`) and always place static routes like `/me` above dynamic `:id` routes.',
    ['What happens if you forget `return` after `res.status(404).json(...)`?', 'How does `router.use()` differ from `router.get()`?']
  ),

  'express-req-res-body': makeExpressLesson(
    'express-req-res-body',
    '3. Request & Response Lifecycle',
    'beginner',
    30,
    'Why is `req.body` `undefined` without `express.json()`, and why should you set a body `limit`?',
    'Node’s incoming request is a raw byte stream. `express.json({ limit: "1mb" })` buffers and parses `application/json` payloads into `req.body`. Setting a strict `limit` stops attackers from sending 500 MB JSON payloads to crash your server with OOM.',
    'For Stripe/GitHub webhooks, you need the raw unparsed buffer (`express.raw({ type: "application/json" })`) BEFORE `express.json()` runs so HMAC signatures match.',
    [
      {
        title: 'Example 1: Raw Body for Webhooks vs JSON for API',
        language: 'TypeScript',
        code: `app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), verifyStripe);
app.use(express.json({ limit: '512kb' }));`,
        expectedOutput: 'Preserves raw Buffer for signature check while parsing JSON elsewhere.',
      },
      {
        title: 'Example 2: Streaming Large Downloads',
        language: 'TypeScript',
        code: `import { createReadStream } from 'node:fs';
app.get('/export', (_req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  createReadStream('./report.csv').pipe(res);
});`,
        expectedOutput: 'Streams CSV directly to client in chunks without loading into RAM.',
      },
    ],
    'I always configure `express.json({ limit: ... })` to protect memory, mount `express.raw()` on webhook routes for signature verification, and stream large files with `.pipe(res)` instead of buffering them.',
    ['What error does Express throw if you call `res.json()` twice in one handler?', 'When do you use `res.status(204).send()` instead of `res.json()`?']
  ),

  'express-middleware-pipeline': makeExpressLesson(
    'express-middleware-pipeline',
    '4. Middleware & Execution Order',
    'beginner',
    35,
    'What is Middleware in Express.js, and how do `req`, `res`, and `next` control execution flow?',
    'Middleware is a function `(req, res, next)` that runs between receiving a request and sending a response. Calling `next()` passes control to the next handler; sending `res.status(401).json(...)` stops the chain early; calling `next(err)` jumps straight to error-handling middleware.',
    'In production, our auth middleware verifies the Bearer JWT, attaches `req.user`, and calls `next()`—or returns `401 Unauthorized` immediately if the token is invalid.',
    [
      {
        title: 'Example 1: JWT Auth Middleware',
        language: 'TypeScript',
        code: `export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });
  req.user = verifyJwt(token);
  next();
}`,
        expectedOutput: 'Attaches req.user and continues, or short-circuits with 401.',
      },
      {
        title: 'Example 2: Request Timing Middleware',
        language: 'TypeScript',
        code: `app.use((req, res, next) => {
  const start = performance.now();
  res.on('finish', () => {
    console.log(\`\${req.method} \${req.originalUrl} \${res.statusCode} \${(performance.now() - start).toFixed(1)}ms\`);
  });
  next();
});`,
        expectedOutput: 'Logs HTTP method, status, and exact duration once response finishes.',
      },
    ],
    'Middleware is Express’s core pipeline: each `(req, res, next)` step either enriches `req`/`res` and calls `next()`, short-circuits with an HTTP response, or forwards failures via `next(err)`.',
    ['What happens if a middleware neither calls `next()` nor sends a response?', 'What is the difference between `next()` and `next("route")`?']
  ),

  'express-error-handling': makeExpressLesson(
    'express-error-handling',
    '5. Error-Handling Middleware & Async',
    'beginner',
    35,
    'How does Express error-handling middleware work, and how do you handle async errors cleanly?',
    'Error middleware MUST have **4 parameters** `(err, req, res, next)` and be mounted **last** after all routes. In Express 4, rejected `async` handlers didn’t reach error middleware without `try/catch` or an `asyncHandler` wrapper; Express 5 catches rejected async promises automatically!',
    'Throwing `new AppError("Order not found", 404)` inside any service jumps straight to the centralized error handler, which returns `{ error: "Order not found" }` in dev/prod without leaking stack traces.',
    [
      {
        title: 'Example 1: Custom AppError + 4-Arg Error Middleware',
        language: 'TypeScript',
        code: `class AppError extends Error {
  constructor(message: string, public statusCode = 500) { super(message); }
}

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : 'Internal server error';
  res.status(status).json({ error: message });
});`,
        expectedOutput: 'Maps operational AppErrors to exact status codes and hides 500 internals.',
      },
      {
        title: 'Example 2: Express 4 Safe Async Wrapper',
        language: 'TypeScript',
        code: `const asyncHandler = (fn: RequestHandler): RequestHandler =>
  (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);`,
        expectedOutput: 'Forwards rejected async promises to Express error middleware.',
      },
    ],
    'I always put a 4-argument `(err, req, res, next)` handler at the bottom of `app.ts`, distinguish operational `AppError`s from unexpected 500 bugs, and never expose raw stack traces in production.',
    ['Why does Express require all 4 parameters `(err, req, res, next)` even if `next` is unused?', 'How do you handle a 404 route not found cleanly?']
  ),

  'express-mvc-architecture': makeExpressLesson(
    'express-mvc-architecture',
    '6. MVC, Controllers & Services',
    'intermediate',
    35,
    'How do you structure a scalable Express API using Controllers, Services, and Repositories?',
    'Keep **Routes** for HTTP paths/middleware, **Controllers** for reading `req` and sending `res`, **Services** for business rules (calculations, transactions, events), and **Repositories/Prisma** for database queries. Business logic in Services can be unit-tested without mocking `req` and `res`!',
    'Putting pricing rules in `OrderService.createOrder()` lets both an Express controller and a background queue worker call the exact same tested logic.',
    [
      {
        title: 'Example 1: Thin Controller Calling Service',
        language: 'TypeScript',
        code: `export async function createOrderController(req: Request, res: Response) {
  const order = await orderService.placeOrder(req.user!.id, req.body);
  res.status(201).json({ order });
}`,
        expectedOutput: 'Controller stays focused purely on HTTP input/output.',
      },
      {
        title: 'Example 2: Feature-Based Folder Structure',
        language: 'Text',
        code: `src/
  routes/       # Express routers + validation
  controllers/  # req/res mapping
  services/     # Business logic + transactions
  schemas/      # Zod validation schemas`,
        expectedOutput: 'Clean separation of concerns as the codebase grows.',
      },
    ],
    'Separating Routes -> Controllers -> Services -> DB keeps controllers thin and makes business logic reusable across HTTP, WebSockets, and CLI/cron jobs.',
    ['Why should Services never import `Request` or `Response` from Express?', 'When is a Repository layer helpful vs redundant with Prisma?']
  ),

  'express-validation-zod': makeExpressLesson(
    'express-validation-zod',
    '7. Input Validation & Sanitization',
    'intermediate',
    30,
    'How do you build reusable Zod validation middleware in Express?',
    'Create a higher-order middleware `validate(schema)` that runs `schema.safeParse({ body: req.body, query: req.query, params: req.params })`. On failure return `400`/`422` with structured field errors; on success replace `req.body` with the stripped, typed `parsed.data` so unknown fields cannot sneak through.',
    'Validating `z.object({ email: z.string().email(), qty: z.coerce.number().int().min(1) })` guarantees the controller receives exact types.',
    [
      {
        title: 'Example 1: Generic Zod Validation Middleware',
        language: 'TypeScript',
        code: `export const validate = (schema: z.ZodTypeAny): RequestHandler => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Validation failed', details: result.error.flatten() });
  }
  req.body = result.data;
  next();
};`,
        expectedOutput: 'Rejects invalid payloads with 400 and strips extra keys.',
      },
      {
        title: 'Example 2: Validating Route Params',
        language: 'TypeScript',
        code: `const idSchema = z.object({ id: z.string().uuid() });
// Rejects malformed IDs before hitting the database`,
        expectedOutput: 'Prevents invalid UUID syntax errors in Postgres/MySQL.',
      },
    ],
    'I validate `body`, `query`, and `params` at the router edge using Zod middleware so invalid shapes fail fast with 400 and controllers only work with parsed, whitelisted data.',
    ['Why should validation schemas strip unknown properties by default?', 'When should you return 400 vs 422?']
  ),

  'express-db-mysql-mongo': makeExpressLesson(
    'express-db-mysql-mongo',
    '8. MySQL/Postgres & MongoDB Pooling',
    'intermediate',
    40,
    'Why must Express use a DB connection pool instead of opening a new connection per HTTP request?',
    'Opening a TCP + TLS + DB auth handshake takes ~20–80ms per request and quickly exhausts `max_connections` under load. A **connection pool** keeps a reusable set of open connections in memory and queues/reuses them cleanly across requests.',
    'Sharing one singleton `mysql.createPool({ connectionLimit: 20 })` or `PrismaClient` module across the Express app prevents connection leaks.',
    [
      {
        title: 'Example 1: MySQL2 Promise Pool with Prepared Execute',
        language: 'TypeScript',
        code: `import mysql from 'mysql2/promise';
export const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 20,
});
const [rows] = await pool.execute('SELECT id, email FROM users WHERE id = ?', [userId]);`,
        expectedOutput: 'Reuses pooled connections and uses prepared statements.',
      },
      {
        title: 'Example 2: Releasing Connection in Transaction Finally Block',
        language: 'TypeScript',
        code: `const conn = await pool.getConnection();
try {
  await conn.beginTransaction();
  await conn.execute('UPDATE accounts SET bal = bal - ? WHERE id = ?', [100, 1]);
  await conn.commit();
} catch (err) {
  await conn.rollback();
  throw err;
} finally {
  conn.release(); // CRITICAL: never leak connection on error!
}`,
        expectedOutput: 'Always returns connection to pool even if query throws.',
      },
    ],
    'I always initialize a single shared connection pool at app startup and—whenever checking out a manual connection for a transaction—always call `conn.release()` in a `finally` block so connections never leak.',
    ['What happens if you forget `conn.release()` in a `catch` block?', 'Why should you avoid `new PrismaClient()` inside every route handler?']
  ),

  'express-auth-jwt': makeExpressLesson(
    'express-auth-jwt',
    '9. Authentication, Hashing & JWT',
    'intermediate',
    40,
    'How do you implement secure JWT authentication with Access + Refresh tokens in Express?',
    'Hash passwords with `scrypt`/`argon2`/`bcrypt` + `timingSafeEqual`. Issue short-lived Access JWTs (15 min) plus longer-lived Refresh tokens stored hashed in the DB (and in `HttpOnly; Secure; SameSite=Lax` cookies for web). Verify `alg` explicitly in `jwt.verify()` and rotate refresh tokens on use.',
    'Because a stateless JWT cannot be revoked before expiry, keeping Access tokens short (15m) and storing Refresh tokens in Postgres/Redis lets you revoke compromised sessions on logout.',
    [
      {
        title: 'Example 1: Signing & Verifying JWT Safely',
        language: 'TypeScript',
        code: `import jwt from 'jsonwebtoken';
const accessToken = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
  expiresIn: '15m',
  algorithm: 'HS256',
});
const payload = jwt.verify(accessToken, env.JWT_SECRET, { algorithms: ['HS256'] });`,
        expectedOutput: 'Pins HS256 algorithm and short 15-minute expiry.',
      },
      {
        title: 'Example 2: Safe scrypt Password Verification',
        language: 'TypeScript',
        code: `import { scryptSync, timingSafeEqual } from 'node:crypto';
const [salt, hash] = storedHash.split(':');
const candidate = scryptSync(password, salt, 64);
const ok = timingSafeEqual(Buffer.from(hash, 'hex'), candidate);`,
        expectedOutput: 'Compares password hashes in constant time.',
      },
    ],
    'I never store sensitive data in JWT payloads (they are base64-encoded, not encrypted!), always pin `algorithms` in `jwt.verify()`, and pair short-lived access tokens with revocable refresh tokens.',
    ['Why is base64-encoded JWT payload not secret?', 'Why must you specify `algorithms: ["HS256"]` in `jwt.verify()`?']
  ),

  'express-rbac-authorization': makeExpressLesson(
    'express-rbac-authorization',
    '10. Authorization & RBAC',
    'intermediate',
    35,
    'How do you implement Role-Based Access Control (RBAC) AND resource ownership checks in Express?',
    'Use composable middleware `requireRole("admin", "editor")` for role-level access, AND always check resource ownership (`WHERE id = ? AND user_id = req.user.id`) inside the controller/service so User A cannot edit User B’s records (preventing IDOR!).',
    'Even if two users both have the `"member"` role, checking `order.userId === req.user.id` stops User A from viewing User B’s invoice by guessing `/orders/102`.',
    [
      {
        title: 'Example 1: Composable Role Middleware',
        language: 'TypeScript',
        code: `export const requireRole = (...roles: string[]): RequestHandler => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};`,
        expectedOutput: 'Returns 403 Forbidden if authenticated user lacks required role.',
      },
      {
        title: 'Example 2: Preventing IDOR in DB Query',
        language: 'TypeScript',
        code: `const order = await prisma.order.findFirst({
  where: { id: orderId, userId: req.user!.id },
});
if (!order) return res.status(404).json({ error: 'Order not found' });`,
        expectedOutput: 'Scopes lookup to authenticated userId to prevent IDOR.',
      },
    ],
    'Authentication (401) is only half the story—authorization (403) requires both `requireRole()` middleware and scoping every DB read/write by `req.user.id` or `tenantId` to prevent IDOR.',
    ['What is the difference between 401 Unauthorized and 403 Forbidden?', 'What is an IDOR vulnerability and how do you prevent it?']
  ),

  'express-uploads-multer': makeExpressLesson(
    'express-uploads-multer',
    '11. File Uploads & Multer Streaming',
    'advanced',
    35,
    'How do you handle file uploads securely and at scale in Express.js?',
    'Use `multer` with strict `limits: { fileSize }` and `fileFilter`, verify real MIME magic bytes (e.g. `file-type`), never trust `originalname`, and stream uploads directly to S3/R2 (or better yet, issue **S3 Presigned Upload URLs** so large files bypass your Express server completely!).',
    'For 100 MB video uploads, returning a presigned S3 PUT URL from Express lets the mobile app upload directly to S3 without tying up Express RAM or bandwidth.',
    [
      {
        title: 'Example 1: Multer with Size Limit & MIME Filter',
        language: 'TypeScript',
        code: `const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, ['image/jpeg', 'image/png'].includes(file.mimetype));
  },
});`,
        expectedOutput: 'Caps uploads at 5 MB and filters allowed MIME types.',
      },
      {
        title: 'Example 2: Direct-to-S3 Presigned URL Pattern',
        language: 'TypeScript',
        code: `// Express returns short-lived S3 presigned PUT URL -> client uploads directly to S3
res.json({ uploadUrl, objectKey });`,
        expectedOutput: 'Offloads heavy upload bandwidth away from Node.js.',
      },
    ],
    'For small avatars I enforce strict `fileSize` limits + magic-byte checks; for larger files or multi-server deploys, I generate S3 presigned URLs so clients upload directly to object storage.',
    ['Why is `multer.memoryStorage()` dangerous for large files?', 'Why use presigned S3 URLs instead of proxying uploads through Express?']
  ),

  'express-security-cors-helmet': makeExpressLesson(
    'express-security-cors-helmet',
    '12. Security: Helmet, CORS & Rate Limit',
    'advanced',
    40,
    'What security middleware should every production Express API configure?',
    '1) `helmet()` for security HTTP headers (`X-Content-Type-Options`, `CSP`, `HSTS`). 2) Strict `cors({ origin: allowedList, credentials: true })` (never `*` with `credentials: true`!). 3) `express-rate-limit` backed by Redis on auth/expensive endpoints. 4) `app.set("trust proxy", 1)` behind Nginx/Render so `req.ip` is the real client IP, not the load balancer!',
    'If you forget `app.set("trust proxy", 1)` on Render/Cloudflare, every user shares the same proxy IP and one user’s rate limit blocks everyone.',
    [
      {
        title: 'Example 1: Production Helmet, CORS & Trust Proxy',
        language: 'TypeScript',
        code: `app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: ['https://app.example.com'],
  credentials: true,
}));`,
        expectedOutput: 'Configures security headers, strict origin whitelist, and proxy IP trust.',
      },
      {
        title: 'Example 2: Auth Endpoint Rate Limiter',
        language: 'TypeScript',
        code: `const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
});
app.use('/api/auth', authLimiter);`,
        expectedOutput: 'Caps login/register attempts at 20 per 15 minutes per IP.',
      },
    ],
    'I always pair `helmet()`, a strict CORS origin allowlist, Redis-backed rate limiting on auth/AI routes, and `trust proxy` when behind a reverse proxy like Render or Nginx.',
    ['Why does `cors({ origin: "*", credentials: true })` fail in browsers?', 'Why is `trust proxy` critical for rate limiting behind a load balancer?']
  ),

  'express-pagination-filtering': makeExpressLesson(
    'express-pagination-filtering',
    '13. REST Pagination, Filtering & Sort',
    'advanced',
    35,
    'How do you design safe pagination, filtering, and dynamic sorting in an Express REST API?',
    'Always cap `limit` (e.g. `Math.min(100, limit)`), support cursor pagination for feeds, and **whitelist** allowed `sortBy` columns via a map/enum—never pass `req.query.sortBy` directly into SQL or Prisma `orderBy`!',
    'Allowing `?sortBy=passwordHash` or `?limit=999999` without clamping lets callers scrape or DoS your database.',
    [
      {
        title: 'Example 1: Clamped Pagination & Whitelisted Sort',
        language: 'TypeScript',
        code: `const SORT_FIELDS = new Set(['createdAt', 'title', 'price']);
const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 20)));
const sortBy = SORT_FIELDS.has(String(req.query.sortBy)) ? String(req.query.sortBy) : 'createdAt';`,
        expectedOutput: 'Caps page size at 50 and prevents arbitrary column sorting.',
      },
      {
        title: 'Example 2: Consistent Cursor Response Envelope',
        language: 'TypeScript',
        code: `res.json({
  items: rows.slice(0, limit),
  nextCursor: rows.length > limit ? rows[limit - 1].id : null,
});`,
        expectedOutput: 'Fetches limit + 1 rows to detect if another page exists without COUNT(*).',
      },
    ],
    'I clamp `limit`, whitelist `sortBy` fields explicitly, and fetch `limit + 1` rows for cursor pagination so we know `hasMore` without paying for an extra `COUNT(*)` query.',
    ['How does fetching `limit + 1` rows avoid a separate `COUNT(*)` query?', 'When should you prefer cursor pagination over page/offset pagination?']
  ),

  'express-logging-observability': makeExpressLesson(
    'express-logging-observability',
    '14. Structured Logging & Tracing',
    'advanced',
    35,
    'Why use Pino/Winston JSON logging with Request IDs instead of `console.log` in Express?',
    'Structured JSON logs are fast, searchable in Datadog/CloudWatch/Render, and never block the event loop. Attaching a unique `X-Request-Id` (via `AsyncLocalStorage` or `req.id`) lets you trace all logs and DB queries for one failing user request.',
    'Always redact `authorization`, `password`, and `cookie` headers in logger config so secrets never land in log files.',
    [
      {
        title: 'Example 1: Request Correlation ID Middleware',
        language: 'TypeScript',
        code: `import { randomUUID } from 'node:crypto';
app.use((req, res, next) => {
  const reqId = (req.headers['x-request-id'] as string) || randomUUID();
  res.setHeader('x-request-id', reqId);
  req.id = reqId;
  next();
});`,
        expectedOutput: 'Tags every request and response with a traceable correlation ID.',
      },
      {
        title: 'Example 2: Deep Health Check Endpoint',
        language: 'TypeScript',
        code: `app.get('/health', async (_req, res) => {
  await prisma.$queryRaw\`SELECT 1\`;
  res.json({ status: 'ok', uptime: process.uptime() });
});`,
        expectedOutput: 'Verifies DB connectivity for load balancer readiness probes.',
      },
    ],
    'I use structured JSON logging with Pino, redact sensitive fields like passwords/tokens, attach `x-request-id` for distributed tracing, and expose a `/health` endpoint that checks DB connectivity.',
    ['Why is `console.log` slower than Pino in high-throughput Node services?', 'How does `AsyncLocalStorage` help pass `requestId` into deep service functions?']
  ),

  'express-testing-supertest': makeExpressLesson(
    'express-testing-supertest',
    '15. Integration Testing with Supertest',
    'advanced',
    35,
    'How do you test Express routes cleanly with Supertest without port conflicts?',
    'Export `app` from `app.ts` separately from `app.listen()` in `server.ts`. Passing `app` directly into `supertest(app)` lets Supertest bind an ephemeral port automatically, test middleware + validation + status codes + JSON, and close cleanly.',
    'Separating `app.ts` and `server.ts` prevents `EADDRINUSE` errors when running parallel Jest/Vitest test suites.',
    [
      {
        title: 'Example 1: Separating app.ts from server.ts',
        language: 'TypeScript',
        code: `// app.ts: export const app = express(); ...
// server.ts: app.listen(env.PORT);`,
        expectedOutput: 'Allows Supertest to import app without starting a fixed port.',
      },
      {
        title: 'Example 2: Supertest Auth & Validation Test',
        language: 'TypeScript',
        code: `const res = await request(app)
  .post('/api/auth/login')
  .send({ email: 'bad-email' })
  .expect(400);
expect(res.body.error).toBeDefined();`,
        expectedOutput: 'Tests full Express middleware + Zod validation + JSON response.',
      },
    ],
    'Exporting `app` separately from `app.listen()` lets Supertest run fast HTTP integration tests across real middleware, validation, and error handlers with zero port collisions.',
    ['Why test the Express pipeline with Supertest instead of only unit-testing controller functions?', 'How do you isolate database state between Supertest runs?']
  ),

  'express-caching-redis': makeExpressLesson(
    'express-caching-redis',
    '16. Redis Caching & Background Jobs',
    'expert',
    40,
    'How do you combine Redis Cache-Aside and BullMQ background queues in Express?',
    'For read-heavy endpoints, use **Cache-Aside**: check Redis first -> on miss query DB and `SET EX` with TTL -> invalidate on writes. For slow tasks (emails, AI generation, PDFs), push a job to **BullMQ** (Redis-backed) and return `202 Accepted` immediately.',
    'Returning `202 Accepted` with a `jobId` lets the Express event loop stay free instead of holding an HTTP connection open for 15 seconds.',
    [
      {
        title: 'Example 1: Cache-Aside Pattern with Redis',
        language: 'TypeScript',
        code: `const cached = await redis.get(key);
if (cached) return res.json(JSON.parse(cached));

const data = await fetchDashboardStats();
await redis.set(key, JSON.stringify(data), 'EX', 300);
res.json(data);`,
        expectedOutput: 'Serves hot reads from Redis in <2ms with 5-minute TTL.',
      },
      {
        title: 'Example 2: Enqueuing BullMQ Job',
        language: 'TypeScript',
        code: `await emailQueue.add('welcome', { userId }, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } });
res.status(202).json({ queued: true });`,
        expectedOutput: 'Offloads email delivery with automatic exponential retries.',
      },
    ],
    'Cache-Aside with Redis cuts DB load on read-heavy routes, while BullMQ offloads slow or failure-prone work with retries and backoff so Express P95 latency stays under 50ms.',
    ['What is a Cache Stampede (Thundering Herd) and how do you prevent it?', 'Why should BullMQ workers run in a separate process from the Express API?']
  ),

  'express-transactions-idempotency': makeExpressLesson(
    'express-transactions-idempotency',
    '17. DB Transactions & Idempotency',
    'expert',
    40,
    'How do you prevent duplicate payments or duplicate POST submissions on flaky mobile networks?',
    'Require an `Idempotency-Key` header (UUID generated by the mobile client) on critical `POST` endpoints. Store `(key, userId, responseJson)` in Redis/DB inside a transaction—if the client retries the exact same request due to a timeout, return the saved response instead of charging twice!',
    'If a user taps "Pay" in a subway tunnel and the app retries after 5s, the `Idempotency-Key` guarantees Stripe is only charged once.',
    [
      {
        title: 'Example 1: Idempotency Middleware Pattern',
        language: 'TypeScript',
        code: `const key = req.headers['idempotency-key'] as string;
if (!key) return res.status(400).json({ error: 'Idempotency-Key required' });
const existing = await redis.get(\`idem:\${req.user!.id}:\${key}\`);
if (existing) return res.status(200).json(JSON.parse(existing));`,
        expectedOutput: 'Replays cached response on duplicate retries.',
      },
      {
        title: 'Example 2: Atomic DB Transaction with Prisma',
        language: 'TypeScript',
        code: `await prisma.$transaction(async (tx) => {
  await tx.wallet.update({ where: { id: fromId }, data: { balance: { decrement: 100 } } });
  await tx.wallet.update({ where: { id: toId }, data: { balance: { increment: 100 } } });
});`,
        expectedOutput: 'Guarantees both wallet updates succeed or roll back together.',
      },
    ],
    'Pairing `Idempotency-Key` headers with atomic DB transactions makes payment and order creation endpoints safe against mobile retries and double-taps.',
    ['What should happen if two identical `Idempotency-Key` requests arrive simultaneously before the first finishes?', 'Why should external HTTP calls stay outside DB transactions when possible?']
  ),

  'express-websockets-realtime': makeExpressLesson(
    'express-websockets-realtime',
    '18. WebSockets, SSE & Event Streams',
    'expert',
    40,
    'When should you choose Server-Sent Events (SSE) vs WebSockets in an Express backend?',
    'Use **SSE** (`Content-Type: text/event-stream`) for one-way server-to-client streams like AI token streaming, notifications, or live progress—it works over standard HTTP with auto-reconnect. Use **WebSockets** (Socket.io/`ws`) for low-latency bidirectional apps like chat or multiplayer collaboration, backed by a Redis Pub/Sub adapter when running multiple servers.',
    'Streaming ChatGPT/Gemini responses token-by-token is much simpler and more proxy-friendly over SSE than full WebSockets.',
    [
      {
        title: 'Example 1: Server-Sent Events (SSE) Stream in Express',
        language: 'TypeScript',
        code: `app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.flushHeaders();
  const id = setInterval(() => res.write(\`data: \${Date.now()}\\n\\n\`), 1000);
  req.on('close', () => clearInterval(id));
});`,
        expectedOutput: 'Streams real-time events and cleans up interval on client disconnect.',
      },
      {
        title: 'Example 2: Scaling WebSockets with Redis Pub/Sub',
        language: 'TypeScript',
        code: `// With 3 Express instances behind a load balancer:
// Redis adapter broadcasts room events across all Node instances`,
        expectedOutput: 'Ensures users connected to Server A receive messages sent on Server B.',
      },
    ],
    'I pick SSE for server-to-client streams (AI tokens, live feeds) and WebSockets only when true bidirectional messaging is needed—always cleaning up listeners on `req.on("close")` to prevent memory leaks.',
    ['Why do WebSockets need a Redis Pub/Sub adapter when scaling horizontally?', 'What memory leak happens if you forget `req.on("close")` in an SSE endpoint?']
  ),

  'express-graceful-scaling': makeExpressLesson(
    'express-graceful-scaling',
    '19. Graceful Shutdown & Clustering',
    'expert',
    40,
    'How do you implement Graceful Shutdown on `SIGTERM`, and how do you scale Express across CPU cores?',
    'On `SIGTERM` (sent by Docker/Kubernetes/Render during deploy), stop accepting new connections with `server.close()`, finish in-flight requests, close DB/Redis pools cleanly, and exit. To use all CPU cores, run one process per core via containers/PM2 cluster mode.',
    'Without graceful shutdown, rolling deploys drop active checkout requests mid-flight and return 502 Bad Gateway to users.',
    [
      {
        title: 'Example 1: Graceful Shutdown Handler',
        language: 'TypeScript',
        code: `const server = app.listen(env.PORT);
async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);`,
        expectedOutput: 'Drains active HTTP requests and closes DB connections within 10s.',
      },
      {
        title: 'Example 2: Finding Event Loop Lag / Memory Leaks',
        language: 'TypeScript',
        code: `// Track process.memoryUsage().heapUsed and capture heap snapshots in staging
// Common leak sources: unbounded in-memory Maps, unremoved EventEmitter listeners`,
        expectedOutput: 'Identifies growing heap objects across load tests.',
      },
    ],
    'Zero-downtime deploys require handling `SIGTERM` with `server.close()` + DB disconnect + a hard timeout fallback, and scaling horizontally with stateless containers or PM2 cluster workers.',
    ['Why does `.unref()` matter on the shutdown force-exit timer?', 'How do you diagnose a production Node.js memory leak?']
  ),

  'express-coding-scenarios': makeExpressLesson(
    'express-coding-scenarios',
    '20. Express.js Interview Scenarios',
    'coding',
    50,
    'How would you architect an Express API to survive 10,000 concurrent requests without crashing?',
    '1) Put CDN/Nginx caching in front for public GETs. 2) Keep Express handlers strictly non-blocking (no sync crypto/fs). 3) Cache hot reads in Redis and size DB connection pools carefully (e.g. PgBouncer/pool limits). 4) Add rate limiting + circuit breakers + timeouts on upstream APIs. 5) Offload heavy work to BullMQ workers and scale stateless Express replicas horizontally behind a load balancer.',
    'If an upstream payment API slows down to 30s without `AbortSignal.timeout(3000)`, all pending sockets pile up and exhaust memory; failing fast with a timeout + circuit breaker keeps the rest of the API healthy.',
    [
      {
        title: 'Example 1: Outgoing Fetch with AbortSignal Timeout',
        language: 'TypeScript',
        code: `const res = await fetch('https://upstream.api/data', {
  signal: AbortSignal.timeout(3000),
});`,
        expectedOutput: 'Aborts slow upstream calls after 3s instead of piling up sockets.',
      },
      {
        title: 'Example 2: Token-Bucket / Sliding Rate Limit Guard',
        language: 'TypeScript',
        code: `// Reject excess burst traffic early at edge/Redis with HTTP 429 + Retry-After header`,
        expectedOutput: 'Protects Postgres/MySQL from thundering-herd overload.',
      },
    ],
    'At 10k concurrent requests, the bottleneck is almost always the database or slow downstream APIs—so I protect them with Redis caching, bounded DB pools, strict `AbortSignal.timeout()`, rate limiting, and horizontal stateless replicas.',
    ['Why can increasing DB `connectionLimit` to 500 actually make throughput worse?', 'How do you prevent a thundering herd when a hot Redis key expires?']
  ),
};
