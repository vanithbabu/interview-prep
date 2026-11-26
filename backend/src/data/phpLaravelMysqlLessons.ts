import type { TopicLesson, TopicLessonCodeExample } from './topicLessonsFeed.js';

function makeLesson(
  categoryId: 'php' | 'laravel' | 'mysql',
  categoryName: 'PHP' | 'Laravel' | 'MySQL',
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
    categoryId,
    categoryName,
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

export const PHP_LARAVEL_MYSQL_LESSONS: Record<string, TopicLesson> = {
  // ======================== PHP (20) ========================
  'php-fundamentals': makeLesson(
    'php',
    'PHP',
    'php-fundamentals',
    '1. PHP Fundamentals & Syntax',
    'beginner',
    25,
    'What does `declare(strict_types=1)` do in PHP, and how does `==` differ from `===`?',
    '`declare(strict_types=1)` stops PHP from silently converting types (like `"42"` to `42`) when passing arguments or returning values. `==` compares values after type juggling, while `===` checks both value and exact type.',
    'If a checkout function expects `int $cents`, `strict_types=1` throws a `TypeError` if someone accidentally passes `"100abc"` instead of silently coercing it to `100`.',
    [
      {
        title: 'Example 1: Strict Types vs Coercion',
        language: 'PHP',
        code: `<?php
declare(strict_types=1);

function addCents(int $a, int $b): int {
  return $a + $b;
}
echo addCents(150, 250);`,
        expectedOutput: '400',
      },
      {
        title: 'Example 2: Loose == vs Strict === Comparison',
        language: 'PHP',
        code: `<?php
var_dump(0 == '0');   // true
var_dump(0 === '0');  // false
var_dump(0 == '');    // false in PHP 8+ (was true in PHP 7!)`,
        expectedOutput: 'bool(true)\nbool(false)\nbool(false)',
      },
    ],
    'In modern PHP 8+, I always put `declare(strict_types=1)` at the top of files and use `===` everywhere so type mismatches fail loudly in development instead of hiding subtle bugs.',
    ['What changed with `0 == ""` in PHP 8 compared to PHP 7?', 'What is the difference between `const` and `define()` in PHP?']
  ),

  'php-types-arrays': makeLesson(
    'php',
    'PHP',
    'php-types-arrays',
    '2. Data Types & Arrays',
    'beginner',
    30,
    'How do PHP arrays work under the hood, and when do you use `array_map` vs `array_filter`?',
    'In PHP, every array is actually an ordered hash map—supporting both integer keys (lists) and string keys (associative maps). `array_map` transforms each item, while `array_filter` keeps only items matching a condition.',
    'Note that `array_filter` preserves original keys, so wrapping it in `array_values()` re-indexes the list cleanly before encoding to a JSON array.',
    [
      {
        title: 'Example 1: array_filter + array_values for Clean JSON Lists',
        language: 'PHP',
        code: `<?php
$users = [
  ['name' => 'Asha', 'active' => true],
  ['name' => 'Dev', 'active' => false],
  ['name' => 'Kiran', 'active' => true],
];
$active = array_values(array_filter($users, fn($u) => $u['active']));
echo count($active) . ' active, first key: ' . array_key_first($active);`,
        expectedOutput: '2 active, first key: 0',
      },
      {
        title: 'Example 2: Array Unpacking & Null Coalescing',
        language: 'PHP',
        code: `<?php
$defaults = ['role' => 'viewer', 'theme' => 'light'];
$override = ['theme' => 'dark'];
$config = [...$defaults, ...$override];
echo $config['theme'] . ' / ' . ($config['lang'] ?? 'en');`,
        expectedOutput: 'dark / en',
      },
    ],
    'PHP arrays are ordered hash tables, which makes key lookup O(1) while preserving insertion order. When filtering lists for REST APIs, I always re-index with `array_values()` so `json_encode` outputs `[...]` instead of `{"0":..., "2":...}`.',
    ['Why does json_encode sometimes turn a filtered PHP array into a JSON object?', 'What is the difference between array_merge() and + for arrays?']
  ),

  'php-functions-closures': makeLesson(
    'php',
    'PHP',
    'php-functions-closures',
    '3. Functions, Closures & Arrow Fns',
    'beginner',
    30,
    'How do arrow functions (`fn()`) differ from traditional `function () use ($x)` closures in PHP?',
    'Arrow functions (`fn($x) => $x * $factor`) automatically capture outer variables by value, making them concise for callbacks. Traditional `function () use (&$x)` closures allow multi-line bodies and explicit by-reference capture.',
    'In `array_map(fn($item) => $item * $taxRate, $prices)`, you do not need `use ($taxRate)`—whereas updating an outer `$total` counter requires `function ($item) use (&$total) { ... }`.',
    [
      {
        title: 'Example 1: Arrow Function Auto-Capture',
        language: 'PHP',
        code: `<?php
$tax = 1.18;
$prices = [100, 200];
$withTax = array_map(fn(int $p): float => round($p * $tax, 2), $prices);
echo implode(', ', $withTax);`,
        expectedOutput: '118, 236',
      },
      {
        title: 'Example 2: Named Arguments & Union Types (PHP 8+)',
        language: 'PHP',
        code: `<?php
function formatPrice(int|float $amount, string $currency = 'USD', bool $symbol = true): string {
  return ($symbol ? '$' : '') . number_format((float)$amount, 2) . " $currency";
}
echo formatPrice(99.5, symbol: false);`,
        expectedOutput: '99.50 USD',
      },
    ],
    'Arrow functions capture outer scope automatically by value for single expressions, while full closures give multi-statement bodies and `use (&$var)` by-reference capture. Named arguments in PHP 8+ also make boolean flags much clearer at call sites.',
    ['Can an arrow function in PHP modify a variable in the outer scope?', 'What is the `mixed` vs `never` return type in PHP 8?']
  ),

  'php-superglobals-forms': makeLesson(
    'php',
    'PHP',
    'php-superglobals-forms',
    '4. Superglobals & Request Handling',
    'beginner',
    25,
    'How do you safely read and validate input from `$_GET` and `$_POST` without trusting client data?',
    'Never use `$_GET` or `$_POST` values directly in SQL or HTML. Validate types/ranges with `filter_input()` or validation rules, cast numbers explicitly, and escape output with `htmlspecialchars()` using `ENT_QUOTES`.',
    'Reading `$page = max(1, (int) ($_GET["page"] ?? 1))` guarantees a positive integer even if someone passes `?page=-99` or `?page=<script>`.',
    [
      {
        title: 'Example 1: Safe Input Filtering & Escaping',
        language: 'PHP',
        code: `<?php
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$safeName = htmlspecialchars($_POST['name'] ?? 'Guest', ENT_QUOTES, 'UTF-8');
echo $email ? "Valid: $safeName" : 'Invalid email';`,
        expectedOutput: 'Validates email format and escapes HTML entities safely.',
      },
      {
        title: 'Example 2: Reading JSON Body in PHP API',
        language: 'PHP',
        code: `<?php
$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '{}', true, 512, JSON_THROW_ON_ERROR);`,
        expectedOutput: 'Parses JSON request bodies cleanly with strict error throwing.',
      },
    ],
    'I never trust `$_GET`, `$_POST`, or `$_SERVER["HTTP_*"]` headers. For form posts I validate with `filter_var` and escape HTML with `htmlspecialchars(..., ENT_QUOTES, "UTF-8")`; for JSON APIs I decode `php://input` with `JSON_THROW_ON_ERROR`.',
    ['Why is $_POST empty when a client sends application/json?', 'Why is PHP_SELF dangerous if echoed unescaped in a form action?']
  ),

  'php-sessions-cookies': makeLesson(
    'php',
    'PHP',
    'php-sessions-cookies',
    '5. Sessions & Cookies',
    'beginner',
    30,
    'How do PHP sessions work, and what flags must you set on auth cookies to prevent XSS and CSRF?',
    'PHP stores session data on the server (files or Redis) and sends only a `PHPSESSID` cookie to the browser. Always set `httponly: true` (blocks JS `document.cookie`), `secure: true` (HTTPS only), and `samesite: "Lax"` or `"Strict"`, and call `session_regenerate_id(true)` on login.',
    'Calling `session_regenerate_id(true)` right after verifying a user’s password prevents session fixation attacks where an attacker pre-sets a victim’s session ID.',
    [
      {
        title: 'Example 1: Hardened Cookie & Session Setup',
        language: 'PHP',
        code: `<?php
session_set_cookie_params([
  'lifetime' => 3600,
  'path'     => '/',
  'secure'   => true,
  'httponly' => true,
  'samesite' => 'Lax',
]);
session_start();
session_regenerate_id(true);`,
        expectedOutput: 'Starts a hardened session and rotates the session ID.',
      },
      {
        title: 'Example 2: CSRF Token Generation & Verification',
        language: 'PHP',
        code: `<?php
$_SESSION['csrf'] ??= bin2hex(random_bytes(32));
$isValid = hash_equals($_SESSION['csrf'], $_POST['csrf'] ?? '');`,
        expectedOutput: 'Uses constant-time hash_equals() to prevent timing attacks.',
      },
    ],
    'I configure session cookies with `HttpOnly`, `Secure`, and `SameSite=Lax`, regenerate the session ID on login to stop session fixation, and use `hash_equals()` for CSRF token verification.',
    ['Why does session_regenerate_id(true) prevent session fixation?', 'Why use Redis instead of default file sessions when scaling across multiple servers?']
  ),

  'php-oop-classes': makeLesson(
    'php',
    'PHP',
    'php-oop-classes',
    '6. OOP: Classes, Interfaces & Traits',
    'intermediate',
    40,
    'When should you choose an Interface, an Abstract Class, or a Trait in PHP?',
    'An **Interface** defines a strict contract ("can do") without state, allowing multiple implementation. An **Abstract Class** shares base code and state across an "is-a" hierarchy. A **Trait** reuses horizontal helper methods across unrelated classes.',
    'A `PaymentGateway` is an Interface (`charge()`, `refund()`), `BaseController` is an Abstract Class, and `HasTimestamps` or `LogsActivity` is a Trait.',
    [
      {
        title: 'Example 1: Interface + Constructor Property Promotion (PHP 8)',
        language: 'PHP',
        code: `<?php
interface Notifier {
  public function send(string $to, string $msg): void;
}
final class EmailNotifier implements Notifier {
  public function __construct(private readonly string $from) {}
  public function send(string $to, string $msg): void {
    echo "From {$this->from} to $to: $msg";
  }
}`,
        expectedOutput: 'From no-reply@app.dev to dev@app.dev: Welcome!',
      },
      {
        title: 'Example 2: Trait for Reusable Behavior',
        language: 'PHP',
        code: `<?php
trait HasUuid {
  public function generateUuid(): string {
    return bin2hex(random_bytes(8));
  }
}
class Invoice { use HasUuid; }`,
        expectedOutput: 'Adds generateUuid() cleanly without deep inheritance.',
      },
    ],
    'I favor composition over inheritance: interfaces for contracts so dependencies are swappable and testable, abstract classes only when sharing real base state, and traits sparingly for small cross-cutting utilities.',
    ['What is the difference between `self::` and `static::` (late static binding) in PHP?', 'Why mark concrete service classes `final`?']
  ),

  'php-namespaces-composer': makeLesson(
    'php',
    'PHP',
    'php-namespaces-composer',
    '7. Namespaces, PSR-4 & Composer',
    'intermediate',
    30,
    'How does PSR-4 autoloading work with Composer, and why should you commit `composer.lock` for apps?',
    'PSR-4 maps a PHP namespace prefix directly to a folder path (e.g., `App\\` -> `src/`), so Composer loads classes automatically on demand without manual `require` calls. Committing `composer.lock` guarantees every developer and production server installs the exact same dependency versions.',
    'When `new App\\Services\\BillingService()` runs, Composer automatically looks up `src/Services/BillingService.php` and loads it once.',
    [
      {
        title: 'Example 1: composer.json PSR-4 Mapping',
        language: 'JSON',
        code: `{
  "autoload": {
    "psr-4": { "App\\\\": "src/" }
  }
}`,
        expectedOutput: 'Maps App\\Namespace\\Class to src/Namespace/Class.php.',
      },
      {
        title: 'Example 2: Optimizing Autoloader for Production',
        language: 'Bash',
        code: `composer install --no-dev --optimize-autoloader --no-interaction`,
        expectedOutput: 'Builds a fast classmap and excludes dev dependencies in production.',
      },
    ],
    'PSR-4 gives predictable file-to-namespace mapping, and `composer install --no-dev --optimize-autoloader` builds a flat classmap in production so PHP avoids filesystem `stat()` checks.',
    ['What is the difference between composer install and composer update?', 'Why do libraries avoid committing composer.lock while applications commit it?']
  ),

  'php-exceptions-errors': makeLesson(
    'php',
    'PHP',
    'php-exceptions-errors',
    '8. Error Handling & Exceptions',
    'intermediate',
    30,
    'What is the difference between `Error` and `Exception` under `Throwable`, and how do you handle exceptions cleanly?',
    'Both `Error` (engine-level failures like `TypeError`, division by zero) and `Exception` (application errors like `InvalidArgumentException`) implement `Throwable`. Catch specific exceptions first, log context, and never swallow exceptions silently with empty `catch` blocks.',
    'In an API, catching `DomainException` maps to HTTP 422, while uncaught `Throwable` falls through to a global handler that logs the stack trace and returns a safe 500 JSON error.',
    [
      {
        title: 'Example 1: Catching Specific Exceptions + Finally',
        language: 'PHP',
        code: `<?php
try {
  $data = json_decode('{bad', true, 512, JSON_THROW_ON_ERROR);
} catch (JsonException $e) {
  error_log($e->getMessage());
} finally {
  // Always runs (e.g., release lock or close file)
}`,
        expectedOutput: 'Logs malformed JSON cleanly without exposing stack trace.',
      },
      {
        title: 'Example 2: Domain-Specific Custom Exception',
        language: 'PHP',
        code: `<?php
final class InsufficientFundsException extends RuntimeException {
  public static function forAmount(int $cents): self {
    return new self("Insufficient balance for {$cents} cents.");
  }
}`,
        expectedOutput: 'Provides readable named constructor for business rule errors.',
      },
    ],
    'I catch specific exception classes rather than generic `Exception` whenever I can recover, use `Throwable` only at the top-level error boundary, and create domain exceptions so callers know exactly what failed.',
    ['What is the difference between LogicException and RuntimeException in PHP?', 'Why is the @ error suppression operator discouraged?']
  ),

  'php-pdo-prepared': makeLesson(
    'php',
    'PHP',
    'php-pdo-prepared',
    '9. PDO & Prepared Statements',
    'intermediate',
    35,
    'How do PDO prepared statements prevent SQL injection, and why should `ATTR_EMULATE_PREPARES` be `false`?',
    'Prepared statements send the SQL template and parameter values separately to MySQL, so user input is never parsed as SQL syntax. Setting `PDO::ATTR_EMULATE_PREPARES => false` forces native MySQL prepared statements and returns real integer/float types instead of strings.',
    'Even if a user enters `admin\' OR 1=1--`, MySQL treats the entire string literally as a username value rather than executable SQL.',
    [
      {
        title: 'Example 1: Production PDO Connection Setup',
        language: 'PHP',
        code: `<?php
$pdo = new PDO($dsn, $user, $pass, [
  PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  PDO::ATTR_EMULATE_PREPARES   => false,
]);`,
        expectedOutput: 'Configures exceptions, associative arrays, and native prepared statements.',
      },
      {
        title: 'Example 2: Safe Parameterized Query',
        language: 'PHP',
        code: `<?php
$stmt = $pdo->prepare('SELECT id, email FROM users WHERE status = :status LIMIT :limit');
$stmt->execute(['status' => 'active', 'limit' => 20]);
$users = $stmt->fetchAll();`,
        expectedOutput: 'Fetches up to 20 active users safely with bound parameters.',
      },
    ],
    'I configure PDO with `ERRMODE_EXCEPTION`, `FETCH_ASSOC`, and `ATTR_EMULATE_PREPARES => false` so MySQL handles binding natively and SQL errors throw catchable exceptions.',
    ['What is the difference between bindParam() and bindValue() in PDO?', 'Can prepared statements parameterize table or column names?']
  ),

  'php-modern-php8': makeLesson(
    'php',
    'PHP',
    'php-modern-php8',
    '10. Modern PHP 8.x Features',
    'intermediate',
    35,
    'What are the biggest improvements in PHP 8.x (`match`, `enum`, `readonly`, nullsafe `?->`)?',
    '`match` is an expression that uses strict `===` comparison and throws `UnhandledMatchError` if no branch matches (unlike `switch`). Backed `enum`s replace magic string constants, `readonly` properties enforce immutability, and `?->` safely chains nullable method calls.',
    'Using `enum OrderStatus: string { case Paid = "paid"; case Pending = "pending"; }` makes invalid statuses impossible at the type level.',
    [
      {
        title: 'Example 1: Backed Enum + Strict match Expression',
        language: 'PHP',
        code: `<?php
enum Status: string {
  case Draft = 'draft';
  case Published = 'published';
}
$label = match (Status::Published) {
  Status::Draft     => 'In Progress',
  Status::Published => 'Live',
};
echo $label;`,
        expectedOutput: 'Live',
      },
      {
        title: 'Example 2: Readonly DTO & Nullsafe Operator',
        language: 'PHP',
        code: `<?php
readonly class UserDto {
  public function __construct(public string $name, public ?string $city = null) {}
}
$dto = new UserDto('Asha');
echo strtoupper($dto->city ?? 'remote');`,
        expectedOutput: 'REMOTE',
      },
    ],
    'PHP 8.x feels like a modern typed language: I use `readonly` DTOs for immutable data transfer, backed `enum`s instead of magic strings, `match` for exhaustive strict branching, and `?->` for clean null handling.',
    ['How does `match` differ from `switch` in PHP 8?', 'What does `readonly class` enforce in PHP 8.2+?']
  ),

  'php-lifecycle-fpm': makeLesson(
    'php',
    'PHP',
    'php-lifecycle-fpm',
    '11. PHP-FPM & Request Lifecycle',
    'advanced',
    40,
    'How does Nginx + PHP-FPM handle concurrent requests, and what is PHP’s "share-nothing" architecture?',
    'Nginx handles static files and proxies `.php` requests via FastCGI to a pool of PHP-FPM worker processes. Each worker executes one request at a time in isolated memory and tears down all request state afterward ("share-nothing"), while OPcache keeps compiled bytecode in shared memory.',
    'Because each request starts fresh, one request’s memory leak doesn’t crash the whole server—but you need Redis/MySQL for shared state and OPcache so PHP doesn’t re-parse files on every hit.',
    [
      {
        title: 'Example 1: Tuning PHP-FPM Pool Settings (www.conf)',
        language: 'INI',
        code: `pm = dynamic
pm.max_children = 40
pm.start_servers = 8
pm.max_requests = 500`,
        expectedOutput: 'Caps worker count to available RAM and recycles workers after 500 requests.',
      },
      {
        title: 'Example 2: Checking OPcache Status in PHP',
        language: 'PHP',
        code: `<?php
$status = opcache_get_status(false);
echo $status['opcache_enabled'] ? 'OPcache ON' : 'OPcache OFF';`,
        expectedOutput: 'OPcache ON',
      },
    ],
    'PHP’s share-nothing FPM model makes horizontal scaling and isolation simple. In production I size `pm.max_children` based on `(Available RAM / avg worker memory)` and enable OPcache with `validate_timestamps=0` on immutable deploys.',
    ['How do you calculate the right pm.max_children for a server?', 'Why do long-running PHP processes like Laravel Octane change memory rules?']
  ),

  'php-generators-iterators': makeLesson(
    'php',
    'PHP',
    'php-generators-iterators',
    '12. Generators & Memory Efficiency',
    'advanced',
    35,
    'How do PHP Generators (`yield`) prevent out-of-memory crashes when processing millions of rows?',
    'A normal function returning an array loads all 1,000,000 items into RAM at once. A Generator uses `yield` to pause and emit one item at a time, keeping memory usage flat (O(1)) regardless of dataset size.',
    'When exporting a 500,000-row CSV report, yielding one database row at a time uses ~2 MB of RAM instead of crashing with a 512 MB memory limit error.',
    [
      {
        title: 'Example 1: Streaming Large File Lines with yield',
        language: 'PHP',
        code: `<?php
function readCsvRows(string $path): Generator {
  $handle = fopen($path, 'rb');
  while (($row = fgetcsv($handle)) !== false) {
    yield $row;
  }
  fclose($handle);
}`,
        expectedOutput: 'Streams arbitrarily large CSVs in constant memory.',
      },
      {
        title: 'Example 2: Memory-Safe Range Generator',
        language: 'PHP',
        code: `<?php
function lazyRange(int $start, int $end): Generator {
  for ($i = $start; $i <= $end; $i++) yield $i;
}
foreach (lazyRange(1, 3) as $n) echo $n;`,
        expectedOutput: '123',
      },
    ],
    'Whenever I stream large CSVs, logs, or cursor-paginated DB exports, I use a `Generator` with `yield` so memory stays constant instead of building huge intermediate arrays.',
    ['Can you rewind or iterate a PHP Generator twice?', 'What does `yield from` do?']
  ),

  'php-spl-magic': makeLesson(
    'php',
    'PHP',
    'php-spl-magic',
    '13. Magic Methods & Reflection',
    'advanced',
    35,
    'How do DI containers use PHP Reflection, and when should you avoid magic methods like `__get` / `__call`?',
    '`ReflectionClass` inspects constructor parameter type hints at runtime so a DI container can automatically instantiate and inject dependencies. Magic methods (`__get`, `__call`) are useful in ORMs/proxies, but overusing them hides types from IDEs and static analyzers (PHPStan).',
    'When a controller asks for `PaymentService $billing` in `__construct`, the container uses `ReflectionClass` to inspect that type hint and resolve `PaymentService` recursively.',
    [
      {
        title: 'Example 1: Inspecting Constructor Dependencies via Reflection',
        language: 'PHP',
        code: `<?php
$ref = new ReflectionClass(EmailNotifier::class);
$params = $ref->getConstructor()?->getParameters() ?? [];
foreach ($params as $p) {
  echo $p->getName() . ': ' . $p->getType();
}`,
        expectedOutput: 'from: string',
      },
      {
        title: 'Example 2: Invokable Single-Action Class (__invoke)',
        language: 'PHP',
        code: `<?php
final class SendWelcomeEmail {
  public function __invoke(string $email): string {
    return "Sent to $email";
  }
}
$action = new SendWelcomeEmail();
echo $action('dev@app.dev');`,
        expectedOutput: 'Sent to dev@app.dev',
      },
    ],
    'I love `__invoke` for single-action classes, and Reflection powers frameworks and DI containers—but in application code I prefer explicit typed methods over `__get`/`__call` so static analysis catches bugs early.',
    ['Does Reflection hurt runtime performance, and how do frameworks cache it?', 'What is `__sleep` / `__serialize` used for?']
  ),

  'php-security': makeLesson(
    'php',
    'PHP',
    'php-security',
    '14. PHP Security Hardening',
    'advanced',
    40,
    'How do you hash passwords, prevent XSS/SQLi, and handle file uploads securely in PHP?',
    'Use `password_hash($pw, PASSWORD_DEFAULT)` (bcrypt/Argon2) and `password_verify()`, never `md5`/`sha1`. Prevent SQLi with PDO prepared statements, XSS with `htmlspecialchars(..., ENT_QUOTES)`, and for file uploads check `finfo_file()` MIME type, generate a random filename, and store outside the webroot.',
    'A classic upload vulnerability is trusting `$_FILES["file"]["type"]` or saving `avatar.php` inside `public/uploads/` where Nginx executes it.',
    [
      {
        title: 'Example 1: Secure Password Hashing & Rehash Check',
        language: 'PHP',
        code: `<?php
$hash = password_hash('S3cret!2026', PASSWORD_DEFAULT);
if (password_verify('S3cret!2026', $hash)) {
  if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {
    // Re-hash and update DB transparently
  }
  echo 'Authenticated';
}`,
        expectedOutput: 'Authenticated',
      },
      {
        title: 'Example 2: Safe Upload MIME Check & Random Name',
        language: 'PHP',
        code: `<?php
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($tmpPath);
$allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png'];
$ext = $allowed[$mime] ?? throw new RuntimeException('Invalid file type');
$safeName = bin2hex(random_bytes(16)) . '.' . $ext;`,
        expectedOutput: 'Ignores client filename/extension and generates a safe random name.',
      },
    ],
    'For passwords I use `password_hash` / `password_verify` with `PASSWORD_DEFAULT`. For uploads I inspect real magic bytes via `finfo`, whitelist extensions, rename with `random_bytes()`, and serve from S3 or outside `public/`.',
    ['Why is password_hash() much safer than sha256($password . $salt)?', 'Why must uploaded files never keep their original user-supplied filename?']
  ),

  'php-testing-phpunit': makeLesson(
    'php',
    'PHP',
    'php-testing-phpunit',
    '15. Testing with PHPUnit & Pest',
    'advanced',
    35,
    'How do you structure testable PHP code and use mocks vs fakes in PHPUnit/Pest?',
    'Inject dependencies (clock, mailers, payment gateways) via interfaces in the constructor instead of calling static globals or `new` inside methods. Use Data Providers for edge-case inputs and mock only external I/O boundaries.',
    'Testing a discount calculator with a `#[DataProvider]` lets you verify 10 edge cases (0%, 100%, negative, rounding) in one clean test method.',
    [
      {
        title: 'Example 1: PHPUnit Test with Data Provider',
        language: 'PHP',
        code: `<?php
#[DataProvider('discountCases')]
public function testDiscount(int $price, int $pct, int $expected): void {
  $this->assertSame($expected, (new Pricer())->apply($price, $pct));
}
public static function discountCases(): array {
  return [[1000, 10, 900], [1000, 0, 1000]];
}`,
        expectedOutput: 'Runs both cases with clear failure isolation.',
      },
      {
        title: 'Example 2: Pest Expressive Syntax',
        language: 'PHP',
        code: `<?php
it('calculates total with tax', function () {
  expect(calculateTotal(100, 0.18))->toBe(118.0);
});`,
        expectedOutput: 'Clean, readable test assertion using Pest.',
      },
    ],
    'I write unit tests for pure business rules using Data Providers and feature tests for HTTP + DB flows. Mocking external APIs while running real SQL in test transactions catches schema bugs early.',
    ['When should you use a real test database instead of mocking repositories?', 'What is the difference between a Mock and a Stub/Fake?']
  ),

  'php-dependency-injection': makeLesson(
    'php',
    'PHP',
    'php-dependency-injection',
    '16. Dependency Injection & SOLID',
    'expert',
    40,
    'Explain Dependency Inversion and Constructor Injection in PHP with a practical example.',
    'High-level business logic should depend on abstractions (interfaces), not concrete implementations (like Stripe or SendGrid). Passing dependencies through `__construct()` makes classes decoupled, self-documenting, and easy to swap or test.',
    'An `OrderService` depends on `PaymentGatewayInterface`, so switching from Stripe to Razorpay or a `FakeGateway` in tests requires zero changes to `OrderService`.',
    [
      {
        title: 'Example 1: Constructor Injection with Interface',
        language: 'PHP',
        code: `<?php
interface PaymentGateway { public function charge(int $cents): bool; }

final class OrderService {
  public function __construct(private PaymentGateway $gateway) {}
  public function checkout(int $cents): bool {
    return $this->gateway->charge($cents);
  }
}`,
        expectedOutput: 'Decouples OrderService from any specific payment provider.',
      },
      {
        title: 'Example 2: Minimal IoC Container Binding',
        language: 'PHP',
        code: `<?php
$container->bind(PaymentGateway::class, fn() => new StripeGateway($_ENV['STRIPE_KEY']));`,
        expectedOutput: 'Resolves the concrete gateway at the composition root.',
      },
    ],
    'I apply Dependency Inversion via constructor injection of interfaces. A class’s constructor immediately reveals all its collaborators, avoiding hidden global state or service-locator anti-patterns.',
    ['Why is injecting the whole Container (Service Locator) considered an anti-pattern?', 'What does the Interface Segregation Principle prevent?']
  ),

  'php-async-queues': makeLesson(
    'php',
    'PHP',
    'php-async-queues',
    '17. Concurrency, Swoole & Workers',
    'expert',
    40,
    'How do you handle slow background tasks and high concurrency in PHP?',
    'Standard PHP-FPM handles each HTTP request synchronously, so slow tasks (emails, PDFs, webhooks) should be pushed onto a Redis/RabbitMQ queue and processed by background worker processes (`supervisor`). For async/event-loop I/O in PHP, runtimes like Swoole or RoadRunner keep workers alive in memory.',
    'During checkout, pushing "Send Invoice PDF" to a Redis queue lets the HTTP response return in 80ms instead of blocking the user for 3 seconds.',
    [
      {
        title: 'Example 1: Producer Enqueuing Job to Redis',
        language: 'PHP',
        code: `<?php
$redis->rPush('jobs:emails', json_encode([
  'type' => 'invoice',
  'orderId' => 901,
], JSON_THROW_ON_ERROR));`,
        expectedOutput: 'Returns HTTP response immediately while worker processes email.',
      },
      {
        title: 'Example 2: Parallel HTTP Requests with curl_multi',
        language: 'PHP',
        code: `<?php
$mh = curl_multi_init();
// Add multiple cURL handles and execute concurrently in one request`,
        expectedOutput: 'Fetches multiple upstream APIs in parallel instead of sequentially.',
      },
    ],
    'In PHP-FPM, offloading slow work to Redis queue workers supervised by `supervisord` keeps P95 API latency low. When we need persistent memory or WebSockets, Swoole/RoadRunner gives PHP an event loop.',
    ['What risks arise when running PHP in a persistent-memory runtime like Swoole?', 'How do you make queue jobs idempotent if a worker retries?']
  ),

  'php-performance': makeLesson(
    'php',
    'PHP',
    'php-performance',
    '18. Performance & OPcache Tuning',
    'expert',
    40,
    'What gives the biggest performance wins in a slow production PHP application?',
    'First, profile (Xdebug profiler, Blackfire, or slow query logs) before guessing. Typically 80% of slowdowns come from database N+1 queries or missing indexes, followed by disabled OPcache, unoptimized Composer autoloading, or synchronous external HTTP calls.',
    'Enabling OPcache with `opcache.validate_timestamps=0` on immutable container deploys eliminates thousands of disk `stat()` calls per second.',
    [
      {
        title: 'Example 1: Production OPcache Configuration',
        language: 'INI',
        code: `opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0`,
        expectedOutput: 'Keeps compiled PHP bytecode cached in shared RAM.',
      },
      {
        title: 'Example 2: Batching DB Lookups Instead of Loop Queries',
        language: 'PHP',
        code: `<?php
$ids = array_column($orders, 'user_id');
$in  = implode(',', array_fill(0, count($ids), '?'));
$stmt = $pdo->prepare("SELECT id, name FROM users WHERE id IN ($in)");
$stmt->execute($ids);`,
        expectedOutput: 'Replaces N queries inside a foreach loop with 1 IN() query.',
      },
    ],
    'I tune OPcache and PHP-FPM first, then profile SQL and external HTTP calls—because eliminating N+1 queries and adding Redis caching almost always dwarfs micro-optimizations in PHP syntax.',
    ['When does PHP 8 JIT actually help vs not help?', 'Why should you never run Xdebug enabled in production?']
  ),

  'php-api-curl': makeLesson(
    'php',
    'PHP',
    'php-api-curl',
    '19. REST APIs & HTTP Clients',
    'expert',
    35,
    'What best practices matter when building REST APIs and calling external APIs in PHP?',
    'For outgoing calls (Guzzle/cURL), always set explicit connect and request timeouts, handle non-2xx responses, and retry idempotent requests with backoff. For incoming REST APIs, return proper HTTP status codes (`201`, `400`, `401`, `404`, `422`, `429`), consistent JSON error shapes, and `Content-Type: application/json`.',
    'If a payment webhook client omits timeouts, a 60-second third-party outage can tie up all PHP-FPM workers and take down your entire site.',
    [
      {
        title: 'Example 1: Safe cURL Call with Timeouts',
        language: 'PHP',
        code: `<?php
$ch = curl_init('https://api.example.com/v1/status');
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CONNECTTIMEOUT => 2,
  CURLOPT_TIMEOUT        => 5,
]);
$body = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);`,
        expectedOutput: 'Fails fast in 2s connect / 5s total if upstream hangs.',
      },
      {
        title: 'Example 2: Consistent JSON Response Helper',
        language: 'PHP',
        code: `<?php
function jsonResponse(array $data, int $status = 200): never {
  http_response_code($status);
  header('Content-Type: application/json');
  echo json_encode($data, JSON_THROW_ON_ERROR);
  exit;
}`,
        expectedOutput: 'Sends clean JSON with exact HTTP status code and exits.',
      },
    ],
    'Always bound external HTTP calls with short connect and total timeouts so third-party slowness never cascades into PHP-FPM worker exhaustion.',
    ['What is the difference between CURLOPT_CONNECTTIMEOUT and CURLOPT_TIMEOUT?', 'When should an API return 422 vs 400?']
  ),

  'php-coding-scenarios': makeLesson(
    'php',
    'PHP',
    'php-coding-scenarios',
    '20. PHP Interview Coding Scenarios',
    'coding',
    45,
    'How would you design a simple, safe sliding-window or fixed-window rate limiter in PHP + Redis?',
    'Use Redis atomic `INCR` combined with `EXPIRE` (or a Lua script) keyed by client IP or user ID and time bucket. Never do "GET then SET" in PHP, because concurrent requests will race and bypass the limit.',
    'On a login endpoint, limiting `rl:login:{ip}:{minute}` to 10 attempts per 60 seconds blocks brute-force bots atomically.',
    [
      {
        title: 'Example 1: Atomic Fixed-Window Rate Limiter',
        language: 'PHP',
        code: `<?php
function allowRequest(Redis $redis, string $key, int $limit = 10, int $window = 60): bool {
  $count = $redis->incr($key);
  if ($count === 1) {
    $redis->expire($key, $window);
  }
  return $count <= $limit;
}`,
        expectedOutput: 'Atomically counts requests and sets TTL on first hit.',
      },
      {
        title: 'Example 2: Constant-Time Webhook Signature Verification',
        language: 'PHP',
        code: `<?php
$expected = hash_hmac('sha256', $rawBody, $secret);
if (!hash_equals($expected, $headerSignature)) {
  http_response_code(401);
  exit('Invalid signature');
}`,
        expectedOutput: 'Verifies HMAC webhook payload without timing side-channels.',
      },
    ],
    'For rate limiting or counters, I rely on atomic Redis operations (`INCR` + `EXPIRE` or Lua) to avoid check-then-act race conditions, and `hash_equals` for all signature checks.',
    ['What edge case exists with a fixed-window rate limiter at minute boundaries?', 'How would you handle a Redis outage in a rate limiter (fail open vs fail closed)?']
  ),

  // ======================== LARAVEL (20) ========================
  'laravel-lifecycle-routing': makeLesson(
    'laravel',
    'Laravel',
    'laravel-lifecycle-routing',
    '1. Request Lifecycle & Routing',
    'beginner',
    30,
    'Walk me through what happens from `public/index.php` until Laravel returns a response.',
    '`public/index.php` loads Composer’s autoloader and bootstraps the Application in `bootstrap/app.php`. The HTTP Kernel runs global middleware, boots Service Providers (`register` then `boot`), dispatches the request through the Router to route middleware + controller, and sends the Response.',
    'With Route Model Binding (`Route::get("/posts/{post:slug}", ...)`), Laravel automatically queries the `Post` by `slug` and returns a 404 if not found before your controller even runs.',
    [
      {
        title: 'Example 1: Route Model Binding by Custom Column',
        language: 'PHP',
        code: `<?php
Route::get('/courses/{course:slug}', [CourseController::class, 'show'])
  ->name('courses.show');`,
        expectedOutput: 'Resolves Course by slug automatically or throws 404.',
      },
      {
        title: 'Example 2: Grouping Routes with Prefix & Middleware',
        language: 'PHP',
        code: `<?php
Route::middleware(['auth:sanctum', 'throttle:api'])
  ->prefix('v1')
  ->group(function () {
    Route::apiResource('orders', OrderController::class);
  });`,
        expectedOutput: 'Applies auth and rate limiting to all /v1/orders endpoints.',
      },
    ],
    'Laravel boots through `public/index.php` -> HTTP Kernel -> Service Providers (`register` then `boot`) -> Global/Route Middleware -> Controller. Route Model Binding keeps controllers clean by resolving models and 404s automatically.',
    ['What is the difference between register() and boot() in a Service Provider?', 'Why should you avoid closures in routes/web.php in production?']
  ),

  'laravel-controllers-requests': makeLesson(
    'laravel',
    'Laravel',
    'laravel-controllers-requests',
    '2. Controllers & Form Requests',
    'beginner',
    30,
    'Why use `FormRequest` classes instead of validating inside controllers, and what does `$request->validated()` return?',
    'A `FormRequest` encapsulates both authorization (`authorize()`) and validation (`rules()`) before the controller method executes. Calling `$request->validated()` returns ONLY the fields declared in `rules()`, preventing mass-assignment of unexpected fields like `is_admin`.',
    'If a user submits `{"name": "Dev", "role": "admin"}`, `$request->all()` includes `role`, whereas `$request->validated()` strips it out safely.',
    [
      {
        title: 'Example 1: FormRequest with Authorize & Rules',
        language: 'PHP',
        code: `<?php
class StorePostRequest extends FormRequest {
  public function authorize(): bool { return $this->user() !== null; }
  public function rules(): array {
    return [
      'title' => ['required', 'string', 'max:160'],
      'body'  => ['required', 'string'],
    ];
  }
}`,
        expectedOutput: 'Validates and authorizes before StorePostController runs.',
      },
      {
        title: 'Example 2: Thin Controller Using validated()',
        language: 'PHP',
        code: `<?php
public function store(StorePostRequest $request): JsonResponse {
  $post = $request->user()->posts()->create($request->validated());
  return response()->json($post, 201);
}`,
        expectedOutput: 'Creates post using only validated keys and returns 201.',
      },
    ],
    'I put validation and request-level authorization in `FormRequest` classes and always pass `$request->validated()`—never `$request->all()`—into `create()` or `update()`.',
    ['What HTTP status code does Laravel return when FormRequest validation fails on an API request?', 'How do you customize validation error messages in a FormRequest?']
  ),

  'laravel-blade-vite': makeLesson(
    'laravel',
    'Laravel',
    'laravel-blade-vite',
    '3. Blade Templates & Components',
    'beginner',
    25,
    'How does Blade prevent XSS by default, and when is `{!! $var !!}` dangerous?',
    'Blade’s `{{ $var }}` compiles to `htmlspecialchars()`, automatically escaping HTML to stop XSS. `{!! $var !!}` outputs raw unescaped HTML and should ONLY be used for trusted or HTMLPurifier-sanitized content.',
    'Rendering a user’s bio with `{!! $user->bio !!}` lets an attacker inject `<script>fetch(...)</script>`, whereas `{{ $user->bio }}` renders it harmlessly as text.',
    [
      {
        title: 'Example 1: Safe Blade Component with Props',
        language: 'PHP',
        code: `{{-- resources/views/components/alert.blade.php --}}
@props(['type' => 'info', 'message'])
<div {{ $attributes->merge(['class' => "alert alert-$type"]) }}>
  {{ $message }}
</div>`,
        expectedOutput: 'Escapes $message automatically and merges extra HTML attributes.',
      },
      {
        title: 'Example 2: CSRF Directive in Blade Forms',
        language: 'PHP',
        code: `<form method="POST" action="{{ route('posts.store') }}">
  @csrf
  @method('PUT')
  <button type="submit">Save</button>
</form>`,
        expectedOutput: 'Injects hidden _token and _method spoofing inputs.',
      },
    ],
    'Blade compiles templates down to cached plain PHP files. I always use `{{ }}` for escaping, `@csrf` on forms, and Blade components (`<x-alert />`) for reusable UI.',
    ['How does `@method("PUT")` work when HTML forms only support GET and POST?', 'Where does Laravel store compiled Blade views?']
  ),

  'laravel-migrations-seeders': makeLesson(
    'laravel',
    'Laravel',
    'laravel-migrations-seeders',
    '4. Migrations, Seeders & Factories',
    'beginner',
    30,
    'Why should you never edit an already-deployed migration file, and how do Factories help testing?',
    'Once a migration has run in production or on teammates’ machines, Laravel marks it in the `migrations` table and won’t re-run it. Always create a new migration to alter columns. Factories generate realistic fake models cleanly for seeders and automated tests.',
    'Using `User::factory()->count(5)->create()` in a PHPUnit test sets up isolated test data in one line.',
    [
      {
        title: 'Example 1: Migration with Foreign Key & Index',
        language: 'PHP',
        code: `<?php
Schema::create('orders', function (Blueprint $table) {
  $table->id();
  $table->foreignId('user_id')->constrained()->cascadeOnDelete();
  $table->unsignedInteger('total_cents');
  $table->string('status', 32)->index();
  $table->timestamps();
});`,
        expectedOutput: 'Creates orders table with FK constraint and indexed status column.',
      },
      {
        title: 'Example 2: Using Model Factory States in Tests',
        language: 'PHP',
        code: `<?php
$admin = User::factory()->create(['role' => 'admin']);
$orders = Order::factory()->count(3)->for($admin)->create();`,
        expectedOutput: 'Creates an admin user and 3 linked orders for testing.',
      },
    ],
    'Migrations are append-only schema version control: once pushed, I always add a new migration rather than editing old ones, and I use Factories with states for clean test fixtures.',
    ['What is the difference between migrate:fresh and migrate:refresh?', 'How do you run seeders safely in production without duplicating rows?']
  ),

  'laravel-eloquent-basics': makeLesson(
    'laravel',
    'Laravel',
    'laravel-eloquent-basics',
    '5. Eloquent ORM Fundamentals',
    'beginner',
    35,
    'What is Mass Assignment protection (`$fillable` vs `$guarded`), and how do Query Scopes keep queries DRY?',
    '`$fillable` whitelists which attributes can be set via `Model::create($data)` or `$model->update($data)`, blocking attackers from injecting fields like `is_admin` or `balance`. Query Scopes (`scopeActive`) encapsulate reusable `WHERE` clauses on the model.',
    'Defining `public function scopePublished($q) { return $q->where("status", "published"); }` lets you write `Post::published()->latest()->get()` everywhere.',
    [
      {
        title: 'Example 1: $fillable, Casts & Local Scope',
        language: 'PHP',
        code: `<?php
class Course extends Model {
  protected $fillable = ['title', 'slug', 'is_published'];
  protected $casts = ['is_published' => 'boolean'];

  public function scopePublished(Builder $query): void {
    $query->where('is_published', true);
  }
}`,
        expectedOutput: 'Protects attributes, casts booleans, and adds Course::published().',
      },
      {
        title: 'Example 2: Soft Deletes & Chunking Large Datasets',
        language: 'PHP',
        code: `<?php
User::where('active', true)->chunkById(500, function ($users) {
  foreach ($users as $user) { /* process batch */ }
});`,
        expectedOutput: 'Processes users in 500-row batches by ID without OOM.',
      },
    ],
    'I always define `$fillable` explicitly instead of `$guarded = []`, use `$casts` for booleans/enums/JSON, and use `chunkById()` instead of `all()` or `chunk()` when updating large tables.',
    ['Why is chunkById() safer than chunk() when updating rows during iteration?', 'What happens when a model uses SoftDeletes and you run User::find($id)?']
  ),

  'laravel-relationships': makeLesson(
    'laravel',
    'Laravel',
    'laravel-relationships',
    '6. Eloquent Relationships',
    'intermediate',
    40,
    'Explain `hasMany`, `belongsToMany` (pivot), and Polymorphic (`morphMany`) relationships in Eloquent.',
    '`hasMany` / `belongsTo` models a 1-to-many foreign key (`posts.user_id`). `belongsToMany` models many-to-many via a pivot table (`course_user`). `morphMany` lets one table (like `comments` or `images`) belong to multiple parent models via `commentable_id` + `commentable_type`.',
    'A `Comment` model using `morphTo()` can belong to both a `Post` and a `Video` without creating separate `post_comments` and `video_comments` tables.',
    [
      {
        title: 'Example 1: Many-to-Many with Pivot Columns',
        language: 'PHP',
        code: `<?php
public function courses(): BelongsToMany {
  return $this->belongsToMany(Course::class)
    ->withPivot('progress_pct', 'enrolled_at')
    ->withTimestamps();
}`,
        expectedOutput: 'Exposes extra pivot columns via $course->pivot->progress_pct.',
      },
      {
        title: 'Example 2: Polymorphic morphMany',
        language: 'PHP',
        code: `<?php
// On Post & Video models:
public function comments(): MorphMany {
  return $this->morphMany(Comment::class, 'commentable');
}`,
        expectedOutput: 'Links comments to multiple model types via commentable_type/id.',
      },
    ],
    'I use `belongsToMany` with `withPivot()` for many-to-many data and `morphMany` when genuinely shared entities like comments, tags, or media attach to multiple models—while indexing `(commentable_type, commentable_id)`.',
    ['What is the difference between attach(), detach(), and sync() on belongsToMany?', 'What is the trade-off of polymorphic tables in MySQL (no native foreign key constraint)?']
  ),

  'laravel-eager-loading': makeLesson(
    'laravel',
    'Laravel',
    'laravel-eager-loading',
    '7. N+1 Problem & Eager Loading',
    'intermediate',
    35,
    'What is the N+1 query problem in Eloquent, and how do `with()`, `load()`, and `preventLazyLoading()` solve it?',
    'If you fetch 50 posts (1 query) and access `$post->author->name` inside a loop, Eloquent runs 50 extra queries—51 total. Using `Post::with("author")->get()` eager-loads all authors in a single `WHERE id IN (...)` query (2 queries total).',
    'Enabling `Model::preventLazyLoading(!app()->isProduction())` in `AppServiceProvider` throws an exception in local dev the moment you accidentally trigger an N+1 query.',
    [
      {
        title: 'Example 1: Eager Loading Nested Relations & Counts',
        language: 'PHP',
        code: `<?php
$posts = Post::with(['author:id,name', 'tags:id,name'])
  ->withCount('comments')
  ->latest()
  ->paginate(15);`,
        expectedOutput: 'Fetches posts, authors, tags, and comment counts in 3 fast queries.',
      },
      {
        title: 'Example 2: Catching N+1 Automatically in Local Dev',
        language: 'PHP',
        code: `<?php
// In AppServiceProvider::boot()
Model::preventLazyLoading(! $this->app->isProduction());`,
        expectedOutput: 'Throws LazyLoadingViolationException during development.',
      },
    ],
    'I always enable `Model::preventLazyLoading()` outside production so N+1 bugs are caught immediately, use `with()` for eager loading with selected columns, and use `withCount()` instead of loading full collections just to count them.',
    ['What is the difference between `with()` and `load()`?', 'How do you eager-load only specific columns on a `belongsTo` relation without breaking it?']
  ),

  'laravel-middleware': makeLesson(
    'laravel',
    'Laravel',
    'laravel-middleware',
    '8. Middleware & Pipeline Pattern',
    'intermediate',
    30,
    'How does Laravel’s Middleware pipeline work before and after a controller runs?',
    'Middleware wraps the request like onion layers using `Pipeline`. Code before `$next($request)` runs **before** the controller (auth, CORS, rate limit); code after `$next($request)` runs **after** the controller generates a `$response` (adding headers, logging timing).',
    'A `RequestTimingMiddleware` records `microtime(true)` before `$next($request)`, awaits `$response = $next($request)`, and appends an `X-Response-Time` header.',
    [
      {
        title: 'Example 1: Before & After Middleware',
        language: 'PHP',
        code: `<?php
public function handle(Request $request, Closure $next): Response {
  $start = microtime(true);
  $response = $next($request);
  $ms = round((microtime(true) - $start) * 1000, 2);
  return $response->header('X-Response-Time', "{$ms}ms");
}`,
        expectedOutput: 'Measures controller execution time and adds response header.',
      },
      {
        title: 'Example 2: Role-Checking Middleware with Parameter',
        language: 'PHP',
        code: `<?php
public function handle(Request $request, Closure $next, string $role): Response {
  abort_unless($request->user()?->hasRole($role), 403);
  return $next($request);
}`,
        expectedOutput: 'Supports ->middleware("role:admin") on routes.',
      },
    ],
    'Middleware is Laravel’s HTTP pipeline: code before `$next($request)` inspects or rejects incoming requests, and code after `$next($request)` modifies the outgoing response.',
    ['What is a Terminable Middleware (`terminate()`) used for?', 'In Laravel 11+, where are global and alias middleware registered?']
  ),

  'laravel-service-container': makeLesson(
    'laravel',
    'Laravel',
    'laravel-service-container',
    '9. Service Container & Providers',
    'intermediate',
    40,
    'How does Laravel’s Service Container resolve dependencies, and when do you use `bind()` vs `singleton()`?',
    'The Service Container uses PHP Reflection to inspect constructor type hints and auto-inject concrete classes. `bind()` creates a fresh instance every time it’s resolved, whereas `singleton()` creates one shared instance for the entire request lifecycle.',
    'You bind `PaymentGatewayInterface` -> `StripeGateway` in `AppServiceProvider::register()` so any controller or job type-hinting the interface gets `StripeGateway` automatically.',
    [
      {
        title: 'Example 1: Binding Interface to Implementation',
        language: 'PHP',
        code: `<?php
// In AppServiceProvider::register()
$this->app->bind(PaymentGateway::class, StripeGateway::class);
$this->app->singleton(MetricsClient::class, fn() => new MetricsClient(config('services.metrics.key')));`,
        expectedOutput: 'Binds interface and creates a single shared MetricsClient.',
      },
      {
        title: 'Example 2: Contextual Binding for Two Services',
        language: 'PHP',
        code: `<?php
$this->app->when(VideoUploader::class)
  ->needs(Filesystem::class)
  ->give(fn() => Storage::disk('s3'));`,
        expectedOutput: 'Injects S3 disk specifically into VideoUploader.',
      },
    ],
    'Laravel’s container is an auto-wiring IoC container powered by Reflection. I use `bind()` for stateful/per-call services, `singleton()` for stateless shared clients (taking care with Octane!), and never read `config()` inside `register()` before providers boot.',
    ['Why must you be careful with singletons when running Laravel Octane?', 'What is the difference between `app()->make()` and constructor injection?']
  ),

  'laravel-facades-helpers': makeLesson(
    'laravel',
    'Laravel',
    'laravel-facades-helpers',
    '10. Facades & Contracts',
    'intermediate',
    30,
    'How do Laravel Facades (`Cache::get`, `Mail::to`) work under the hood, and are they testable?',
    'A Facade is a static-looking proxy over a real object living inside the Service Container. Calling `Cache::get()` triggers `__callStatic()`, resolves the `cache` binding from the container, and calls `->get()`. Because it resolves from the container, you can mock it cleanly with `Cache::shouldReceive()` or `Mail::fake()`.',
    'In tests, `Mail::fake()` swaps the real mailer in the container with a fake so you can assert `Mail::assertSent(WelcomeMail::class)` without sending real emails.',
    [
      {
        title: 'Example 1: Testing with Built-in Facade Fakes',
        language: 'PHP',
        code: `<?php
Mail::fake();
$this->post('/register', ['email' => 'dev@app.dev', 'password' => 'Secret123!']);
Mail::assertQueued(WelcomeMail::class);`,
        expectedOutput: 'Verifies email was queued without touching an SMTP server.',
      },
      {
        title: 'Example 2: Facade vs Contract Injection',
        language: 'PHP',
        code: `<?php
use Illuminate\\Contracts\\Cache\\Repository as CacheContract;

public function __construct(private CacheContract $cache) {}`,
        expectedOutput: 'Decouples domain classes from Laravel static Facades.',
      },
    ],
    'Facades are container proxies, not rigid static globals—so `Mail::fake()` and `Queue::fake()` make testing effortless. In pure domain/service classes I still prefer injecting Contracts so dependencies stay explicit.',
    ['What is a Real-Time Facade (`Facades\\App\\...`)?', 'When would you inject a Contract instead of calling a Facade?']
  ),

  'laravel-auth-sanctum': makeLesson(
    'laravel',
    'Laravel',
    'laravel-auth-sanctum',
    '11. Auth, Sanctum & Policies',
    'advanced',
    40,
    'How does Laravel Sanctum authenticate SPAs vs Mobile/API tokens, and how do Policies enforce authorization?',
    'Sanctum uses stateful, CSRF-protected HTTP-only cookies for first-party SPAs on the same root domain, and hashed Bearer API tokens (`personal_access_tokens`) for mobile apps (React Native) or third-party clients. Policies organize model-level authorization (`$this->authorize("update", $post)`).',
    'In our React Native app, Sanctum issues a Bearer token on login; then `PostPolicy::update(User $user, Post $post)` ensures only `$user->id === $post->user_id` can edit the post.',
    [
      {
        title: 'Example 1: Issuing & Revoking Sanctum Mobile Tokens',
        language: 'PHP',
        code: `<?php
$token = $user->createToken('mobile-android', ['posts:write'])->plainTextToken;
// On logout:
$request->user()->currentAccessToken()->delete();`,
        expectedOutput: 'Creates scoped Bearer token and revokes only current device on logout.',
      },
      {
        title: 'Example 2: Model Policy for Ownership Check',
        language: 'PHP',
        code: `<?php
class OrderPolicy {
  public function view(User $user, Order $order): bool {
    return $user->id === $order->user_id || $user->isAdmin();
  }
}`,
        expectedOutput: 'Centralizes authorization logic cleanly outside controllers.',
      },
    ],
    'Sanctum gives cookie auth for SPAs and scoped Bearer tokens for mobile clients without OAuth complexity. I pair it with Policies for every resource action so ownership checks never leak into controllers.',
    ['Why does Sanctum hash API tokens in the database before storing them?', 'What is the difference between a Gate and a Policy?']
  ),

  'laravel-queues-jobs': makeLesson(
    'laravel',
    'Laravel',
    'laravel-queues-jobs',
    '12. Queues, Jobs & Horizon',
    'advanced',
    40,
    'How do you configure reliable Laravel Queues (`ShouldQueue`) with retries, backoff, and failed job handling?',
    'Implement `ShouldQueue`, set `$tries`, `$backoff` (exponential retry delays), and `$timeout`, and implement `failed(Throwable $e)` to alert on permanent failures. Use `afterCommit()` when dispatching jobs inside DB transactions so workers never query uncommitted rows.',
    'If you dispatch `ProcessOrderJob` inside `DB::transaction()` without `->afterCommit()`, the Redis worker can pick up the job 2ms later before MySQL commits the order and throw `ModelNotFoundException`.',
    [
      {
        title: 'Example 1: Resilient Queued Job with Exponential Backoff',
        language: 'PHP',
        code: `<?php
class SendWebhookJob implements ShouldQueue {
  use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
  public int $tries = 4;
  public array $backoff = [10, 30, 120];

  public function handle(): void { /* HTTP post */ }
  public function failed(Throwable $e): void { Log::error($e->getMessage()); }
}`,
        expectedOutput: 'Retries 4 times with 10s, 30s, 120s backoff before logging failure.',
      },
      {
        title: 'Example 2: Dispatching After DB Transaction Commit',
        language: 'PHP',
        code: `<?php
DB::transaction(function () use ($order) {
  $order->save();
  SendInvoiceJob::dispatch($order)->afterCommit();
});`,
        expectedOutput: 'Guarantees worker only runs after MySQL commits the order.',
      },
    ],
    'For production queues I use Redis + Horizon, configure `$tries` and `$backoff`, use `->afterCommit()` inside transactions, and make job handlers idempotent in case a worker crashes mid-job and retries.',
    ['What happens if a job takes longer than `retry_after` in `config/queue.php`?', 'Why does `SerializesModels` only store the model ID in Redis?']
  ),

  'laravel-events-listeners': makeLesson(
    'laravel',
    'Laravel',
    'laravel-events-listeners',
    '13. Events, Listeners & Observers',
    'advanced',
    35,
    'When should you use Events & Listeners vs Model Observers in Laravel?',
    'Events & Listeners (`OrderPaid` -> `SendReceipt`, `AwardPoints`) decouple domain actions cleanly and can be queued individually with `ShouldQueue`. Model Observers hook into Eloquent lifecycle (`creating`, `updated`) and are great for audit logs or slugs—but overusing Observers for business side effects creates hidden "magic" that is hard to trace.',
    'Firing `event(new OrderPaid($order))` lets 3 independent listeners send email, update analytics, and notify Slack asynchronously without cluttering `OrderService`.',
    [
      {
        title: 'Example 1: Queued Event Listener',
        language: 'PHP',
        code: `<?php
class SendOrderReceipt implements ShouldQueue {
  public function handle(OrderPaid $event): void {
    Mail::to($event->order->user)->send(new ReceiptMail($event->order));
  }
}`,
        expectedOutput: 'Runs receipt email asynchronously whenever OrderPaid fires.',
      },
      {
        title: 'Example 2: Generating Slug in Model Booted Hook',
        language: 'PHP',
        code: `<?php
static::creating(function (Post $post) {
  $post->slug ??= Str::slug($post->title);
});`,
        expectedOutput: 'Automatically sets slug before inserting a new Post.',
      },
    ],
    'I use explicit Events + queued Listeners for business workflows (emails, webhooks, analytics) and keep Observers limited to local model invariants like generating slugs or clearing a model’s cache.',
    ['How can you temporarily disable Model Observers during a bulk import?', 'What happens when a `creating` listener returns `false`?']
  ),

  'laravel-api-resources': makeLesson(
    'laravel',
    'Laravel',
    'laravel-api-resources',
    '14. API Resources & Versioning',
    'advanced',
    35,
    'Why use Laravel `JsonResource` instead of returning Eloquent models directly from API endpoints?',
    'Returning models directly leaks internal columns (like `password`, `remember_token`, or raw DB structure) and couples your API contract to database column names. `JsonResource` explicitly shapes JSON output and uses `$this->whenLoaded()` to include relations only when eager-loaded.',
    '`"author" => new UserResource($this->whenLoaded("author"))` prevents N+1 queries by omitting `author` unless the controller called `->with("author")`.',
    [
      {
        title: 'Example 1: Conditional Relation Loading in JsonResource',
        language: 'PHP',
        code: `<?php
class PostResource extends JsonResource {
  public function toArray(Request $request): array {
    return [
      'id'     => $this->id,
      'title'  => $this->title,
      'author' => new UserResource($this->whenLoaded('author')),
      'secret' => $this->when($request->user()?->isAdmin(), $this->internal_notes),
    ];
  }
}`,
        expectedOutput: 'Safely shapes API output without accidental lazy loading or data leaks.',
      },
      {
        title: 'Example 2: Returning Paginated Resource Collection',
        language: 'PHP',
        code: `<?php
return PostResource::collection(Post::with('author')->paginate(20));`,
        expectedOutput: 'Includes data array plus pagination links and meta automatically.',
      },
    ],
    'API Resources act as a strict DTO/serialization layer between database schemas and mobile/web clients. Using `whenLoaded()` and `when()` keeps payloads fast, secure, and N+1-free.',
    ['What is the difference between `whenLoaded()` and `when()` in JsonResource?', 'How do you version a Laravel API cleanly without duplicating all controllers?']
  ),

  'laravel-caching-redis': makeLesson(
    'laravel',
    'Laravel',
    'laravel-caching-redis',
    '15. Caching, Tags & Rate Limiting',
    'advanced',
    35,
    'How do `Cache::remember()`, atomic `Cache::lock()`, and `RateLimiter` prevent stampedes and race conditions?',
    '`Cache::remember($key, $ttl, fn)` fetches or computes and caches a value. On high-traffic keys, `Cache::lock()` prevents cache stampedes or double-payments by letting only one process compute/execute at a time. `RateLimiter::for()` protects APIs and logins per user or IP.',
    'Wrapping a payout job in `Cache::lock("payout:{$userId}", 10)->block(5, ...)` guarantees two concurrent clicks cannot trigger a double payout.',
    [
      {
        title: 'Example 1: Cache::remember with Explicit TTL',
        language: 'PHP',
        code: `<?php
$topPosts = Cache::remember('home:top_posts', now()->addMinutes(10), function () {
  return Post::published()->orderByDesc('views')->limit(10)->get();
});`,
        expectedOutput: 'Caches top 10 posts in Redis for 10 minutes.',
      },
      {
        title: 'Example 2: Preventing Double Execution with Atomic Lock',
        language: 'PHP',
        code: `<?php
Cache::lock("checkout:{$cartId}", 10)->get(function () use ($cartId) {
  // Process payment safely once
});`,
        expectedOutput: 'Ensures only one concurrent request processes the checkout.',
      },
    ],
    'In production I use Redis for caching, sessions, and queues, combine `Cache::remember` with `Cache::lock` on hot or financial operations, and run `php artisan optimize` during deploy.',
    ['Why do Redis Cache Tags not work cleanly with file or database cache drivers?', 'What happens if you cache `env()` calls after running `config:cache`?']
  ),

  'laravel-transactions-locks': makeLesson(
    'laravel',
    'Laravel',
    'laravel-transactions-locks',
    '16. DB Transactions & Race Conditions',
    'expert',
    40,
    'How do you prevent overselling inventory when 100 users buy the last item at the same millisecond in Laravel?',
    'Wrap the stock check and decrement inside `DB::transaction()` using pessimistic row locking (`->lockForUpdate()`), OR use an atomic conditional SQL update (`WHERE stock >= $qty`). Reading `$product->stock` first and saving later without a lock causes race conditions.',
    '`Product::where("id", $id)->where("stock", ">=", $qty)->decrement("stock", $qty)` returns `0` affected rows if stock ran out, making overselling impossible.',
    [
      {
        title: 'Example 1: Pessimistic Row Lock Inside Transaction',
        language: 'PHP',
        code: `<?php
DB::transaction(function () use ($productId, $qty) {
  $product = Product::where('id', $productId)->lockForUpdate()->firstOrFail();
  if ($product->stock < $qty) {
    throw new DomainException('Out of stock');
  }
  $product->decrement('stock', $qty);
});`,
        expectedOutput: 'Serializes concurrent updates on the same product row safely.',
      },
      {
        title: 'Example 2: Deadlock Auto-Retry Count',
        language: 'PHP',
        code: `<?php
DB::transaction(function () { /* ... */ }, attempts: 3);`,
        expectedOutput: 'Automatically retries up to 3 times if InnoDB reports a deadlock.',
      },
    ],
    'Never do check-then-act on balances or inventory without a lock. I use `DB::transaction(..., attempts: 3)` with `lockForUpdate()` or atomic conditional `UPDATE ... WHERE stock >= ?` queries.',
    ['What is the difference between `lockForUpdate()` and `sharedLock()`?', 'What is optimistic locking with a `version` column?']
  ),

  'laravel-testing': makeLesson(
    'laravel',
    'Laravel',
    'laravel-testing',
    '17. Feature Testing & Mocking',
    'expert',
    40,
    'How do you write fast, reliable Laravel Feature tests without hitting real external services?',
    'Use `RefreshDatabase` to wrap each test in a rolled-back transaction, `actingAs($user)` to simulate auth, `Http::fake()` to stub external API calls, and `Queue::fake()` / `Notification::fake()` to assert async side effects.',
    '`Http::fake(["api.stripe.com/*" => Http::response(["id" => "ch_123"], 200)])` lets you test your full Stripe checkout endpoint offline in 20ms.',
    [
      {
        title: 'Example 1: Feature Test with Http::fake & actingAs',
        language: 'PHP',
        code: `<?php
use Illuminate\\Foundation\\Testing\\RefreshDatabase;

uses(RefreshDatabase::class);

it('creates an order via API', function () {
  $user = User::factory()->create();
  Http::fake(['*' => Http::response(['ok' => true], 200)]);

  $this->actingAs($user, 'sanctum')
    ->postJson('/api/orders', ['product_id' => 1, 'qty' => 2])
    ->assertCreated()
    ->assertJsonPath('data.qty', 2);
});`,
        expectedOutput: 'Tests routing, validation, auth, DB write, and JSON shape end-to-end.',
      },
      {
        title: 'Example 2: Preventing Stray Real HTTP Requests in Tests',
        language: 'PHP',
        code: `<?php
Http::preventStrayRequests();`,
        expectedOutput: 'Fails immediately if a test accidentally tries to call a real external URL.',
      },
    ],
    'I rely heavily on Feature tests with `RefreshDatabase`, `Http::preventStrayRequests()`, and `Queue::fake()`—they exercise real routes, middleware, validation, and SQL with zero external flakiness.',
    ['How does `RefreshDatabase` keep tests fast across hundreds of tests?', 'Why is `Http::preventStrayRequests()` useful in CI?']
  ),

  'laravel-architecture': makeLesson(
    'laravel',
    'Laravel',
    'laravel-architecture',
    '18. Clean Architecture & Actions',
    'expert',
    40,
    'How do you keep a large Laravel codebase maintainable instead of ending up with 800-line Controllers and Fat Models?',
    'Keep controllers thin (validate via `FormRequest`, call an Action/Service class, return a `JsonResource`). Extract single-purpose Action classes (`CreateOrderAction`), pass typed DTOs, and keep Eloquent Models focused on relationships, casts, and scopes.',
    'Instead of duplicating checkout logic in a web controller, an API controller, and an Artisan command, all three simply call `$createOrder->execute($dto)`.',
    [
      {
        title: 'Example 1: Single-Purpose Action Class + DTO',
        language: 'PHP',
        code: `<?php
final class CancelOrderAction {
  public function execute(Order $order, string $reason): Order {
    return DB::transaction(function () use ($order, $reason) {
      $order->update(['status' => 'cancelled', 'cancel_reason' => $reason]);
      event(new OrderCancelled($order));
      return $order;
    });
  }
}`,
        expectedOutput: 'Reusable across HTTP controllers, CLI commands, and queued jobs.',
      },
      {
        title: 'Example 2: Thin Controller Delegating to Action',
        language: 'PHP',
        code: `<?php
public function cancel(CancelOrderRequest $req, Order $order, CancelOrderAction $action) {
  $updated = $action->execute($order, $req->validated('reason'));
  return new OrderResource($updated);
}`,
        expectedOutput: 'Controller stays 3 lines: validate, execute action, return resource.',
      },
    ],
    'My rule for scaling Laravel apps: `FormRequest` for input, `Action` classes for business workflows, `Policy` for permissions, `JsonResource` for output, and Models strictly for data mapping and scopes.',
    ['When is the Repository Pattern overkill in Laravel?', 'How do you organize a Laravel app by Domain/Module instead of default folders?']
  ),

  'laravel-octane-scaling': makeLesson(
    'laravel',
    'Laravel',
    'laravel-octane-scaling',
    '19. Laravel Octane & Scaling',
    'expert',
    40,
    'What is Laravel Octane, and what bugs happen if you enable it without auditing your code?',
    'Octane boots the Laravel application ONCE into memory using Swoole or RoadRunner and reuses workers across thousands of requests, cutting boot overhead dramatically. However, static properties, singletons holding user/request state, or unclosed memory buffers will leak across users!',
    'If a singleton caches `$this->currentUser = auth()->user()` during Request A, Request B for a completely different user could see User A’s data.',
    [
      {
        title: 'Example 1: Safe Request-Scoped Resolution in Octane',
        language: 'PHP',
        code: `<?php
// BAD in Octane singleton: injecting Request into constructor
// GOOD: pass Request into method or use container binding without stale Request
public function handle(Request $request): void { /* safe per-request */ }`,
        expectedOutput: 'Prevents stale Request instances from leaking across requests.',
      },
      {
        title: 'Example 2: Running Concurrent Tasks in Octane',
        language: 'PHP',
        code: `<?php
[$users, $stats] = Octane::concurrently([
  fn () => User::count(),
  fn () => Order::whereDate('created_at', today())->sum('total_cents'),
]);`,
        expectedOutput: 'Runs independent queries concurrently across Swoole workers.',
      },
    ],
    'Octane gives huge throughput gains by keeping Laravel booted in RAM, but requires strict statelessness: never store user or request state on singletons or static properties, and run `octane:reload` on every deploy.',
    ['How do you clear state between requests in Laravel Octane?', 'When is standard PHP-FPM + Horizon sufficient without Octane?']
  ),

  'laravel-coding-scenarios': makeLesson(
    'laravel',
    'Laravel',
    'laravel-coding-scenarios',
    '20. Laravel Interview Scenarios',
    'coding',
    50,
    'How do you design an idempotent Stripe/payment webhook handler in Laravel?',
    '1) Verify the webhook signature in middleware. 2) Store the unique `event_id` in a `processed_webhooks` table with a `UNIQUE` index inside `DB::transaction()`—if a duplicate webhook arrives, catch the unique constraint violation (or check `firstOrCreate`) and return `200 OK` immediately. 3) Dispatch heavy work to a queued job with `->afterCommit()`.',
    'Payment providers retry webhooks if your server times out or sends 500; without an idempotency table, you might grant a user’s subscription credits twice.',
    [
      {
        title: 'Example 1: Idempotent Webhook Deduplication',
        language: 'PHP',
        code: `<?php
DB::transaction(function () use ($eventId, $payload) {
  $inserted = DB::table('processed_webhooks')->insertOrIgnore([
    'event_id'   => $eventId,
    'created_at' => now(),
  ]);
  if ($inserted === 0) return; // Already processed!

  ProcessPaymentWebhookJob::dispatch($payload)->afterCommit();
});`,
        expectedOutput: 'Safely ignores duplicate webhooks and queues processing once.',
      },
      {
        title: 'Example 2: Multi-Tenant Global Scope Safety',
        language: 'PHP',
        code: `<?php
static::addGlobalScope('tenant', function (Builder $b) {
  if ($tenantId = auth()->user()?->tenant_id) {
    $b->where('tenant_id', $tenantId);
  }
});`,
        expectedOutput: 'Automatically scopes all queries on the model to the active tenant.',
      },
    ],
    'For webhooks I verify the HMAC signature, deduplicate with a `UNIQUE` `event_id` insert inside a transaction, return `200` quickly, and offload processing to a queued `afterCommit()` job.',
    ['Why should a webhook endpoint return 200 OK quickly instead of doing heavy work synchronously?', 'What happens in a queue worker if a Global Scope relies on `auth()->user()`?']
  ),

  // ======================== MYSQL (20) ========================
  'mysql-fundamentals-types': makeLesson(
    'mysql',
    'MySQL',
    'mysql-fundamentals-types',
    '1. MySQL Data Types & Schemas',
    'beginner',
    25,
    'Why use `DECIMAL` for money instead of `FLOAT`/`DOUBLE`, and `utf8mb4` instead of `utf8`?',
    '`FLOAT`/`DOUBLE` use binary floating-point approximation (`0.1 + 0.2 !== 0.3`), causing rounding errors in financial totals. `DECIMAL(10, 2)` (or storing integer `cents` in `BIGINT`) is exact. In MySQL, legacy `utf8` only stores 3-byte characters (breaking emojis!), whereas `utf8mb4` supports full 4-byte Unicode.',
    'Storing `$19.99` as `DECIMAL(10, 2)` or `1999` (`BIGINT UNSIGNED` cents) guarantees invoices balance to the exact penny.',
    [
      {
        title: 'Example 1: Proper E-Commerce Schema Types',
        language: 'SQL',
        code: `CREATE TABLE products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sku VARCHAR(64) NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
        expectedOutput: 'Creates an exact-precision, emoji-safe InnoDB table.',
      },
      {
        title: 'Example 2: VARCHAR vs CHAR vs TEXT',
        language: 'SQL',
        code: `-- Fixed-length 2-char country code: CHAR(2)
-- Variable-length email (indexable): VARCHAR(255)
-- Long article body: TEXT / MEDIUMTEXT`,
        expectedOutput: 'Matches storage engine type to data length and indexing needs.',
      },
    ],
    'I always use `utf8mb4` for full Unicode support, `DECIMAL` or integer cents for currency (never `FLOAT`), `BIGINT UNSIGNED` for growing IDs, and `TIMESTAMP`/`DATETIME` consistently in UTC.',
    ['What is the difference between DATETIME and TIMESTAMP in MySQL?', 'Why is `INT(11)` misunderstood (display width vs storage size)?']
  ),

  'mysql-crud-filtering': makeLesson(
    'mysql',
    'MySQL',
    'mysql-crud-filtering',
    '2. SELECT, WHERE & Sorting',
    'beginner',
    25,
    'Why does `WHERE col = NULL` fail in SQL, and how do leading wildcards (`LIKE "%term"`) hurt performance?',
    'In SQL, `NULL` means "unknown", so `col = NULL` evaluates to `UNKNOWN` (never true); you must use `IS NULL` or `IS NOT NULL`. Leading wildcards (`LIKE "%phone"`) cannot use a standard B-Tree index and force a full table scan, whereas prefix search (`LIKE "phone%"`) can use the index.',
    'Filtering `WHERE deleted_at IS NULL` finds active records, while `WHERE deleted_at = NULL` returns 0 rows.',
    [
      {
        title: 'Example 1: NULL-Safe Filtering & Prefix Search',
        language: 'SQL',
        code: `SELECT id, email
FROM users
WHERE deleted_at IS NULL
  AND email LIKE 'dev%'
ORDER BY created_at DESC
LIMIT 20;`,
        expectedOutput: 'Uses index on email prefix and filters active users cleanly.',
      },
      {
        title: 'Example 2: NULL-Safe Equality Operator <=>',
        language: 'SQL',
        code: `SELECT * FROM users WHERE referral_code <=> NULL;`,
        expectedOutput: 'Returns rows where referral_code IS NULL using <=> operator.',
      },
    ],
    'I always check nulls with `IS NULL` (or `<=>` when comparing two nullable columns), avoid `SELECT *` in production queries, and avoid leading-wildcard `LIKE "%..."` on large tables.',
    ['Why is SELECT * bad for performance and network egress?', 'What is the SQL execution order (FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT)?']
  ),

  'mysql-joins': makeLesson(
    'mysql',
    'MySQL',
    'mysql-joins',
    '3. INNER, LEFT, RIGHT & SELF JOINs',
    'beginner',
    35,
    'What is the difference between `INNER JOIN`, `LEFT JOIN`, and a `WHERE` filter on a `LEFT JOIN`ed table?',
    '`INNER JOIN` returns only rows that match in both tables. `LEFT JOIN` returns all rows from the left table plus matching rows from the right (or `NULL` if none match). Putting a condition on the right table in `WHERE` (instead of `ON`) silently turns a `LEFT JOIN` into an `INNER JOIN`!',
    'To find customers with **zero orders**, you `LEFT JOIN orders ON orders.user_id = users.id` and filter `WHERE orders.id IS NULL`.',
    [
      {
        title: 'Example 1: Finding Customers Without Orders (Anti-Join)',
        language: 'SQL',
        code: `SELECT u.id, u.email
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;`,
        expectedOutput: 'Returns only users who have never placed an order.',
      },
      {
        title: 'Example 2: Filtering Right Table Inside ON vs WHERE',
        language: 'SQL',
        code: `SELECT u.id, COUNT(o.id) AS paid_orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'paid'
GROUP BY u.id;`,
        expectedOutput: 'Keeps users with 0 paid orders in the result (count = 0).',
      },
    ],
    'A classic SQL bug is filtering a `LEFT JOIN`ed table in the `WHERE` clause, which drops unmatched `NULL` rows. Keep right-table filters in the `ON` clause unless you specifically want `WHERE right.id IS NULL` for an anti-join.',
    ['When would you use a SELF JOIN?', 'What is a CROSS JOIN and how can you trigger one accidentally?']
  ),

  'mysql-aggregations': makeLesson(
    'mysql',
    'MySQL',
    'mysql-aggregations',
    '4. GROUP BY, HAVING & Aggregates',
    'beginner',
    30,
    'What is the difference between `WHERE` and `HAVING`, and between `COUNT(*)` and `COUNT(col)`?',
    '`WHERE` filters individual rows **before** grouping (faster because it shrinks the dataset early and can use indexes). `HAVING` filters groups **after** `GROUP BY` and aggregates are computed. `COUNT(*)` counts all rows including `NULL`s, while `COUNT(col)` ignores `NULL` values.',
    'To find customers who spent over $500 this year: filter `WHERE created_at >= "2026-01-01"` first, group by `user_id`, then filter `HAVING SUM(total) > 500`.',
    [
      {
        title: 'Example 1: WHERE Before GROUP BY, HAVING After',
        language: 'SQL',
        code: `SELECT user_id, COUNT(*) AS order_count, SUM(total_cents) AS spent
FROM orders
WHERE status = 'paid'
GROUP BY user_id
HAVING SUM(total_cents) >= 50000
ORDER BY spent DESC;`,
        expectedOutput: 'Filters paid orders first, then returns big spenders.',
      },
      {
        title: 'Example 2: Conditional Aggregation with CASE',
        language: 'SQL',
        code: `SELECT
  COUNT(*) AS total_orders,
  SUM(CASE WHEN status = 'refunded' THEN 1 ELSE 0 END) AS refunded_count
FROM orders;`,
        expectedOutput: 'Computes multiple filtered metrics in one single table scan.',
      },
    ],
    'I push every non-aggregate filter into `WHERE` so MySQL discards rows before grouping, reserve `HAVING` for aggregate conditions, and use `SUM(CASE WHEN ...)` to compute multiple conditional counts in a single pass.',
    ['Why does MySQL 8 ONLY_FULL_GROUP_BY reject non-aggregated columns in SELECT?', 'How does COUNT(DISTINCT user_id) affect performance on huge tables?']
  ),

  'mysql-constraints-keys': makeLesson(
    'mysql',
    'MySQL',
    'mysql-constraints-keys',
    '5. Primary, Foreign & Unique Keys',
    'beginner',
    30,
    'What is the difference between a Primary Key, a Unique Key, and a Foreign Key in InnoDB?',
    'A **Primary Key** uniquely identifies each row, cannot be `NULL`, and defines the InnoDB clustered index order. A **Unique Key** enforces uniqueness (allowing multiple `NULL`s in MySQL). A **Foreign Key** enforces referential integrity between child and parent tables.',
    'If `order_items.order_id` has a Foreign Key referencing `orders.id`, MySQL prevents inserting an `order_item` for a non-existent order.',
    [
      {
        title: 'Example 1: Foreign Key with Safe Delete Behavior',
        language: 'SQL',
        code: `CREATE TABLE order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  qty INT UNSIGNED NOT NULL,
  CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);`,
        expectedOutput: 'Cascades item deletion with order, but blocks deleting ordered products.',
      },
      {
        title: 'Example 2: Composite Unique Constraint',
        language: 'SQL',
        code: `ALTER TABLE enrollments ADD UNIQUE KEY uq_user_course (user_id, course_id);`,
        expectedOutput: 'Prevents duplicate enrollments for the same user and course.',
      },
    ],
    'In InnoDB, the Primary Key IS the physical row storage order (clustered index), so I keep PKs compact and sequential (`BIGINT UNSIGNED AUTO_INCREMENT` or UUIDv7) and use `UNIQUE` constraints for natural business invariants.',
    ['Why do random UUIDv4 primary keys hurt InnoDB insert performance?', 'When might high-scale systems omit Foreign Key constraints at the DB level?']
  ),

  'mysql-normalization': makeLesson(
    'mysql',
    'MySQL',
    'mysql-normalization',
    '6. Normalization (1NF–3NF) & Denorm',
    'intermediate',
    35,
    'Explain 1NF, 2NF, and 3NF simply, and when do you intentionally denormalize in production?',
    '**1NF**: atomic values, no repeating comma-separated lists. **2NF**: no partial dependency on part of a composite key. **3NF**: non-key columns depend only on the key (no transitive dependencies). You intentionally denormalize for read speed or historical snapshots—like storing `unit_price` on `order_items` even though `products.price` exists!',
    'If a product’s price changes from $50 to $60 next month, old `order_items` must still keep the $50 `unit_price` snapshot from the day the customer bought it.',
    [
      {
        title: 'Example 1: Normalized Order + Historical Price Snapshot',
        language: 'SQL',
        code: `-- Denormalized snapshot on order_items preserves historical invoice accuracy
SELECT oi.qty, oi.unit_price, p.name
FROM order_items oi
JOIN products p ON p.id = oi.product_id
WHERE oi.order_id = 1001;`,
        expectedOutput: 'Joins current product name while preserving historical unit_price.',
      },
      {
        title: 'Example 2: Caching Aggregate Count on Parent Row',
        language: 'SQL',
        code: `-- Storing posts.comments_count avoids COUNT(*) on millions of comments per page load
UPDATE posts SET comments_count = comments_count + 1 WHERE id = 42;`,
        expectedOutput: 'Trades a tiny write update for O(1) read speed.',
      },
    ],
    'I always design schemas in 3NF first for data integrity and zero update anomalies, then selectively denormalize for historical snapshots (like order prices) or hot read counters (`comments_count`).',
    ['What is a Junction/Bridge table for Many-to-Many relationships?', 'What anomalies happen if a table is not in 3NF?']
  ),

  'mysql-indexes-btree': makeLesson(
    'mysql',
    'MySQL',
    'mysql-indexes-btree',
    '7. B-Tree Indexes & Composite Keys',
    'intermediate',
    40,
    'How does a MySQL composite index work, and what is the Leftmost Prefix Rule?',
    'A B-Tree composite index on `(a, b, c)` sorts rows by `a`, then `b`, then `c`. MySQL can use it for queries filtering `(a)`, `(a, b)`, or `(a, b, c)`—but NOT `(b)` or `(c)` alone. Put equality columns (`=`) first and range columns (`>`, `<`, `BETWEEN`) last!',
    'An index on `(status, created_at)` speeds up `WHERE status = "paid" AND created_at >= "2026-01-01"` dramatically—whereas `(created_at, status)` stops using `status` cleanly after the range scan.',
    [
      {
        title: 'Example 1: Equality First, Range Second Composite Index',
        language: 'SQL',
        code: `CREATE INDEX idx_orders_user_status_date
ON orders (user_id, status, created_at);

-- Uses all 3 columns:
SELECT id, total_cents FROM orders
WHERE user_id = 42 AND status = 'paid' AND created_at >= '2026-01-01';`,
        expectedOutput: 'Uses the composite B-Tree index cleanly for both filter and range.',
      },
      {
        title: 'Example 2: Covering Index (Zero Table Lookup)',
        language: 'SQL',
        code: `CREATE INDEX idx_users_email_name ON users (email, name);
SELECT name FROM users WHERE email = 'dev@app.dev';`,
        expectedOutput: 'Answered directly from index (Extra: Using index) without reading table rows.',
      },
    ],
    'I design composite indexes using Equality-First, Range-Second and the Leftmost Prefix rule. I also avoid over-indexing write-heavy tables since every `INSERT`/`UPDATE` must update every B-Tree index.',
    ['Why does applying a function like `WHERE YEAR(created_at) = 2026` break index usage?', 'What is index cardinality / selectivity?']
  ),

  'mysql-explain-plan': makeLesson(
    'mysql',
    'MySQL',
    'mysql-explain-plan',
    '8. EXPLAIN & Query Execution Plans',
    'intermediate',
    40,
    'When you run `EXPLAIN` on a slow MySQL query, which columns and red flags do you look for?',
    'Look at `type` (access method: `const`/`eq_ref`/`ref`/`range` are good; `ALL` means full table scan!), `key` (which index was actually chosen), `rows` (estimated rows scanned), and `Extra` (`Using filesort` or `Using temporary` are warning signs; `Using index` is great—a covering index).',
    'If `EXPLAIN` shows `type: ALL` and `rows: 1500000`, MySQL is reading all 1.5 million rows from disk instead of jumping straight via an index.',
    [
      {
        title: 'Example 1: Inspecting Query Plan with EXPLAIN ANALYZE',
        language: 'SQL',
        code: `EXPLAIN ANALYZE
SELECT id, total_cents
FROM orders
WHERE user_id = 42 AND status = 'paid'
ORDER BY created_at DESC
LIMIT 10;`,
        expectedOutput: 'Shows actual execution time, loops, and rows scanned per step (MySQL 8.0.18+).',
      },
      {
        title: 'Example 2: Fixing Non-SARGable Date Filter',
        language: 'SQL',
        code: `-- BAD (type: ALL): WHERE DATE(created_at) = '2026-11-27'
-- GOOD (type: range):
SELECT * FROM orders
WHERE created_at >= '2026-11-27 00:00:00'
  AND created_at <  '2026-11-28 00:00:00';`,
        expectedOutput: 'Allows MySQL to use an index range scan on created_at.',
      },
    ],
    'I check `EXPLAIN` (and `EXPLAIN ANALYZE` in MySQL 8) for `type = ALL`, high `rows`, and `Using filesort`/`Using temporary`. Rewriting non-SARGable expressions (`DATE(col)`) into range predicates immediately restores index usage.',
    ['What is the difference between `EXPLAIN` and `EXPLAIN ANALYZE`?', 'Why might MySQL ignore an index even when one exists?']
  ),

  'mysql-subqueries-cte': makeLesson(
    'mysql',
    'MySQL',
    'mysql-subqueries-cte',
    '9. Subqueries, CTEs & Window Fns',
    'intermediate',
    40,
    'How do CTEs (`WITH`) and Window Functions (`ROW_NUMBER()`, `RANK()`) improve complex MySQL 8 queries?',
    'CTEs (`WITH`) make nested subqueries readable and modular. Window Functions (`OVER (PARTITION BY ... ORDER BY ...)`) compute rankings, running totals, and previous/next row comparisons (`LAG`/`LEAD`) **without collapsing rows** like `GROUP BY` does.',
    'To get the **latest order per customer** in one clean query, you rank orders with `ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC)` and filter `WHERE rn = 1`.',
    [
      {
        title: 'Example 1: Latest Order Per Customer with CTE + Window Function',
        language: 'SQL',
        code: `WITH ranked_orders AS (
  SELECT id, user_id, total_cents, created_at,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
  FROM orders
)
SELECT id, user_id, total_cents, created_at
FROM ranked_orders
WHERE rn = 1;`,
        expectedOutput: 'Returns exact latest order for every customer in one pass.',
      },
      {
        title: 'Example 2: EXISTS vs IN for Correlated Checks',
        language: 'SQL',
        code: `SELECT u.id, u.email
FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id AND o.status = 'paid'
);`,
        expectedOutput: 'Short-circuits on the first matching paid order per user.',
      },
    ],
    'MySQL 8 CTEs and Window Functions replace messy self-joins and temporary tables. I use `ROW_NUMBER()`/`DENSE_RANK()` for Top-N-per-group queries and `EXISTS` when checking existence against large tables.',
    ['What is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?', 'When can `NOT IN (subquery)` return 0 rows unexpectedly (NULL trap)?']
  ),

  'mysql-transactions-acid': makeLesson(
    'mysql',
    'MySQL',
    'mysql-transactions-acid',
    '10. Transactions & ACID Properties',
    'intermediate',
    35,
    'Explain ACID properties in MySQL InnoDB in plain English with a bank transfer example.',
    '**Atomicity**: debit + credit both succeed or both roll back. **Consistency**: total money and constraints remain valid. **Isolation**: concurrent transfers don’t read half-finished balances. **Durability**: once `COMMIT` returns, redo logs guarantee the change survives a power crash.',
    'If a server crashes between debiting Account A and crediting Account B, InnoDB’s undo log rolls back Account A automatically.',
    [
      {
        title: 'Example 1: Explicit Transaction with Rollback Safety',
        language: 'SQL',
        code: `START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1 AND balance >= 100;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;`,
        expectedOutput: 'Commits both updates atomically as one unit of work.',
      },
      {
        title: 'Example 2: Partial Rollback Using SAVEPOINT',
        language: 'SQL',
        code: `START TRANSACTION;
INSERT INTO orders (user_id, total_cents) VALUES (1, 5000);
SAVEPOINT after_order;
-- Optional bonus fails -> ROLLBACK TO after_order;
COMMIT;`,
        expectedOutput: 'Rolls back only the failed step while preserving the order.',
      },
    ],
    'InnoDB implements ACID using undo logs (Atomicity/MVCC) and redo logs (Durability). Keep transactions as short as possible—never hold a DB transaction open while calling a slow external HTTP API!',
    ['Why should you never make external HTTP calls inside a database transaction?', 'What happens in MySQL if you run DDL (`ALTER TABLE`) inside a transaction?']
  ),

  'mysql-isolation-levels': makeLesson(
    'mysql',
    'MySQL',
    'mysql-isolation-levels',
    '11. Isolation Levels & MVCC',
    'advanced',
    40,
    'How does InnoDB’s default `REPEATABLE READ` isolation level work with MVCC, and how does it differ from `READ COMMITTED`?',
    'MySQL’s default `REPEATABLE READ` uses MVCC (Multi-Version Concurrency Control): a `SELECT` takes a consistent snapshot at the first read, so other transactions’ commits won’t change what you read within that transaction—and readers never block writers. `READ COMMITTED` creates a fresh snapshot per statement and uses fewer gap locks.',
    'Because MVCC serves consistent snapshots via undo logs, a 5-second analytics `SELECT` does not block checkout `UPDATE`s.',
    [
      {
        title: 'Example 1: Checking & Setting Session Isolation Level',
        language: 'SQL',
        code: `SELECT @@transaction_isolation;
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;`,
        expectedOutput: 'Inspects current isolation level (REPEATABLE-READ by default).',
      },
      {
        title: 'Example 2: Consistent Snapshot vs Current Locking Read',
        language: 'SQL',
        code: `START TRANSACTION;
SELECT balance FROM accounts WHERE id = 1;           -- Snapshot read (MVCC)
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE; -- Current read (locks row)
COMMIT;`,
        expectedOutput: 'Shows why FOR UPDATE reads latest committed data, not stale snapshot.',
      },
    ],
    'MVCC lets readers and writers run concurrently without blocking each other. Remember that plain `SELECT` reads a snapshot in `REPEATABLE READ`, whereas `SELECT ... FOR UPDATE` reads the latest committed row and acquires a lock.',
    ['What is the difference between a dirty read, non-repeatable read, and phantom read?', 'Why do many high-concurrency apps switch MySQL to READ COMMITTED?']
  ),

  'mysql-locking-deadlocks': makeLesson(
    'mysql',
    'MySQL',
    'mysql-locking-deadlocks',
    '12. Row Locks, Gap Locks & Deadlocks',
    'advanced',
    40,
    'What causes a MySQL deadlock, and how do you diagnose and prevent deadlocks?',
    'A deadlock happens when Transaction A locks Row 1 and waits for Row 2, while Transaction B locks Row 2 and waits for Row 1. InnoDB detects the cycle immediately and rolls back the smaller transaction. Fix deadlocks by always locking rows in a consistent sorted order (e.g., `ORDER BY id ASC`), keeping transactions short, and indexing `WHERE` columns so InnoDB doesn’t lock the whole table.',
    'In a transfer between accounts 10 and 25, always lock `MIN(10, 25)` first and `MAX(10, 25)` second so two opposite transfers never deadlock.',
    [
      {
        title: 'Example 1: Inspecting the Latest Deadlock in InnoDB',
        language: 'SQL',
        code: `SHOW ENGINE INNODB STATUS;`,
        expectedOutput: 'Prints LATEST DETECTED DEADLOCK with exact queries and held locks.',
      },
      {
        title: 'Example 2: Consistent Lock Ordering to Prevent Deadlocks',
        language: 'SQL',
        code: `START TRANSACTION;
SELECT id, balance FROM accounts WHERE id IN (10, 25) ORDER BY id ASC FOR UPDATE;
COMMIT;`,
        expectedOutput: 'Acquires locks in deterministic ascending ID order.',
      },
    ],
    'To prevent deadlocks, I ensure `WHERE` columns are indexed (avoiding wide gap/table scans), lock multiple rows in deterministic ID order, keep transactions short, and wrap critical transactions in a 3-attempt deadlock retry.',
    ['What is a Gap Lock / Next-Key Lock in InnoDB?', 'Why does a missing index on an UPDATE WHERE clause cause huge lock contention?']
  ),

  'mysql-innodb-internals': makeLesson(
    'mysql',
    'MySQL',
    'mysql-innodb-internals',
    '13. InnoDB Architecture & Buffer Pool',
    'advanced',
    40,
    'How do Clustered Indexes and Secondary Indexes work in InnoDB, and what is the Buffer Pool?',
    'In InnoDB, the **Clustered Index** (Primary Key) stores the actual full row data inside its B-Tree leaf nodes. Every **Secondary Index** stores `(indexed_col, primary_key)`—so looking up a row by email first traverses the email B-Tree to get `id`, then traverses the PK B-Tree ("double lookup") unless it’s a covering index. The **Buffer Pool** caches hot index and data pages in RAM.',
    'Keeping `innodb_buffer_pool_size` at ~60–75% of dedicated DB RAM keeps working sets in memory instead of hitting disk IOPS.',
    [
      {
        title: 'Example 1: Checking Buffer Pool Hit Rate / Size',
        language: 'SQL',
        code: `SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
SHOW GLOBAL STATUS LIKE 'Innodb_buffer_pool_read%';`,
        expectedOutput: 'Helps verify whether hot data fits comfortably in RAM.',
      },
      {
        title: 'Example 2: Covering Index Avoiding PK Double Lookup',
        language: 'SQL',
        code: `CREATE INDEX idx_orders_user_total ON orders (user_id, total_cents);
SELECT total_cents FROM orders WHERE user_id = 42;`,
        expectedOutput: 'Reads total_cents directly from secondary index leaf.',
      },
    ],
    'Because InnoDB secondary indexes store the Primary Key at their leaves, keeping Primary Keys small (8-byte `BIGINT` instead of 36-byte `CHAR(36)` UUID) shrinks *every* secondary index too.',
    ['Why do large Primary Keys bloat every secondary index in InnoDB?', 'What happens if a table has no Primary Key in InnoDB?']
  ),

  'mysql-pagination-perf': makeLesson(
    'mysql',
    'MySQL',
    'mysql-pagination-perf',
    '14. Keyset Pagination & Slow Queries',
    'advanced',
    35,
    'Why does `LIMIT 20 OFFSET 100000` get super slow, and how does Keyset (Cursor) Pagination fix it?',
    '`OFFSET 100000` forces MySQL to scan, sort, and discard 100,000 rows before returning 20. **Keyset (Cursor) Pagination** uses `WHERE id < :last_seen_id ORDER BY id DESC LIMIT 20`, jumping straight to the page via the index in constant O(log N) time!',
    'Infinite scroll feeds in mobile apps use `?cursor=98420` (`WHERE id < 98420 LIMIT 20`) so page 5,000 is just as fast as page 1.',
    [
      {
        title: 'Example 1: O(log N) Keyset / Cursor Pagination',
        language: 'SQL',
        code: `SELECT id, title, created_at
FROM posts
WHERE id < 98420
ORDER BY id DESC
LIMIT 20;`,
        expectedOutput: 'Jumps directly to id < 98420 via Primary Key index without scanning prior rows.',
      },
      {
        title: 'Example 2: Composite Cursor When Sorting by Non-Unique Date',
        language: 'SQL',
        code: `SELECT id, created_at, title
FROM posts
WHERE (created_at, id) < ('2026-11-20 10:00:00', 98420)
ORDER BY created_at DESC, id DESC
LIMIT 20;`,
        expectedOutput: 'Uses row-value comparison for tie-free pagination on timestamps.',
      },
    ],
    'For feeds and large tables, I replace deep `OFFSET` with keyset/cursor pagination (`WHERE (created_at, id) < (?, ?)`). It stays fast at any depth and prevents skipped/duplicated items when new rows are inserted.',
    ['What UI trade-off does cursor pagination have vs numbered pages?', 'How do you handle duplicate timestamps in cursor pagination?']
  ),

  'mysql-security-injection': makeLesson(
    'mysql',
    'MySQL',
    'mysql-security-injection',
    '15. SQL Security & Least Privilege',
    'advanced',
    30,
    'Beyond prepared statements, how do you secure a MySQL database in production?',
    'Apply Principle of Least Privilege (the web app user gets `SELECT, INSERT, UPDATE, DELETE` on one DB—never `SUPER` or `DROP`), bind MySQL to private VPC/localhost only, require TLS in transit, encrypt backups, and test Point-in-Time Recovery (binlogs) regularly.',
    'If a web app only runs CRUD queries, its MySQL user shouldn’t have `DROP TABLE`, `FILE`, or `GRANT OPTION` privileges.',
    [
      {
        title: 'Example 1: Creating a Least-Privilege App User',
        language: 'SQL',
        code: `CREATE USER 'app_svc'@'10.0.%' IDENTIFIED BY 'StrongRandomPass!';
GRANT SELECT, INSERT, UPDATE, DELETE ON interview_app.* TO 'app_svc'@'10.0.%';`,
        expectedOutput: 'Restricts app user to private subnet and CRUD-only permissions.',
      },
      {
        title: 'Example 2: Safe Online Backup with mysqldump',
        language: 'Bash',
        code: `mysqldump --single-transaction --routines --triggers -u backup -p interview_app > backup.sql`,
        expectedOutput: 'Takes a consistent InnoDB snapshot without locking tables.',
      },
    ],
    'I enforce least-privilege DB accounts, restrict network access to private subnets with TLS, and take `--single-transaction` backups plus binlogs for point-in-time recovery.',
    ['Why is `--single-transaction` important when running `mysqldump` on InnoDB?', 'Why should schema migrations use a separate DB user from the runtime app?']
  ),

  'mysql-replication-scaling': makeLesson(
    'mysql',
    'MySQL',
    'mysql-replication-scaling',
    '16. Replication, Read Replicas & Lag',
    'expert',
    40,
    'How do MySQL Read Replicas scale read traffic, and how do you handle Replication Lag?',
    'The Primary handles all writes and streams binary log (binlog) events asynchronously to Read Replicas, which serve `SELECT` traffic. Because replication is asynchronous, a replica might lag by milliseconds or seconds—so read-your-own-writes (like right after updating a profile) must still hit the Primary!',
    'After a user submits a checkout form, redirecting them to `/orders/123` should query the Primary (or cache) for a few seconds so they never see a 404 due to replica lag.',
    [
      {
        title: 'Example 1: Checking Replica Lag Status',
        language: 'SQL',
        code: `SHOW REPLICA STATUS\\G
-- Check Seconds_Behind_Source`,
        expectedOutput: 'Reports replication delay in seconds.',
      },
      {
        title: 'Example 2: Laravel Read/Write Sticky Connection',
        language: 'PHP',
        code: `<?php
// config/database.php: 'sticky' => true
// After any write in the request, subsequent reads in that request use Primary.`,
        expectedOutput: 'Prevents read-after-write stale data during the same request.',
      },
    ],
    'Read replicas scale read-heavy apps well, provided you route writes and immediate read-after-write flows to the Primary (using `sticky => true` in Laravel or pinning the user session briefly after writes).',
    ['What is the difference between statement-based and row-based binlog replication?', 'When do Read Replicas NOT solve a MySQL scaling bottleneck?']
  ),

  'mysql-partitioning-sharding': makeLesson(
    'mysql',
    'MySQL',
    'mysql-partitioning-sharding',
    '17. Partitioning & Sharding Strategies',
    'expert',
    40,
    'What is the difference between Table Partitioning and Sharding in MySQL?',
    '**Partitioning** splits one huge table into smaller physical chunks on the **same** MySQL server (great for dropping old monthly logs with `DROP PARTITION` instead of slow `DELETE`). **Sharding** splits data horizontally across **multiple independent MySQL servers** by a shard key (like `tenant_id` or `user_id`) when write volume exceeds a single primary.',
    'Partitioning an `audit_logs` table by month lets you purge 1-year-old logs instantaneously with `ALTER TABLE audit_logs DROP PARTITION p_2025_01`.',
    [
      {
        title: 'Example 1: Monthly Range Partitioning for Logs',
        language: 'SQL',
        code: `CREATE TABLE event_logs (
  id BIGINT UNSIGNED NOT NULL,
  created_at DATE NOT NULL,
  payload JSON,
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (YEAR(created_at) * 100 + MONTH(created_at)) (
  PARTITION p202610 VALUES LESS THAN (202611),
  PARTITION p202611 VALUES LESS THAN (202612),
  PARTITION pmax    VALUES LESS THAN MAXVALUE
);`,
        expectedOutput: 'Enables partition pruning and instant old-month drops.',
      },
      {
        title: 'Example 2: Choosing a Good Shard Key',
        language: 'SQL',
        code: `-- Good shard key in B2B SaaS: tenant_id (keeps all tenant joins local to one shard)`,
        expectedOutput: 'Minimizes cross-shard joins and distributed transactions.',
      },
    ],
    'Before sharding (which adds huge operational complexity and breaks cross-shard joins), I exhaust indexing, query tuning, archiving/partitioning, caching, and read replicas.',
    ['Why must a partition key be part of every UNIQUE/PRIMARY key in MySQL?', 'What problems do cross-shard JOINs and global uniqueness cause?']
  ),

  'mysql-fulltext-json': makeLesson(
    'mysql',
    'MySQL',
    'mysql-fulltext-json',
    '18. JSON Columns & Full-Text Search',
    'expert',
    35,
    'How can you index fields inside a MySQL `JSON` column, and when should you use `FULLTEXT` vs `LIKE`?',
    'You cannot index a raw `JSON` column directly, but you can create a **Generated Column** (`email VARCHAR(255) GENERATED ALWAYS AS (payload->>"$.email") STORED`) and put a normal B-Tree index on it! `FULLTEXT` indexes tokenize words for natural-language search, running orders of magnitude faster than `LIKE "%word%"`.',
    'Storing flexible webhook metadata in a `JSON` column while indexing `payload->>"$.event_type"` gives schema flexibility with B-Tree speed.',
    [
      {
        title: 'Example 1: Indexing a JSON Field via Generated Column',
        language: 'SQL',
        code: `ALTER TABLE webhooks
  ADD COLUMN event_type VARCHAR(64)
    GENERATED ALWAYS AS (JSON_UNQUOTE(JSON_EXTRACT(payload, '$.type'))) STORED,
  ADD INDEX idx_webhooks_event_type (event_type);`,
        expectedOutput: 'Makes JSON $.type lookups use a fast B-Tree index.',
      },
      {
        title: 'Example 2: FULLTEXT Natural Language Search',
        language: 'SQL',
        code: `ALTER TABLE articles ADD FULLTEXT INDEX ft_title_body (title, body);
SELECT id, title FROM articles
WHERE MATCH(title, body) AGAINST('laravel queue' IN NATURAL LANGUAGE MODE);`,
        expectedOutput: 'Searches article text using inverted FULLTEXT index.',
      },
    ],
    'In MySQL 8, Generated Columns let us index hot JSON paths with standard B-Trees, and `FULLTEXT` handles basic keyword search cleanly before needing Elasticsearch/Meilisearch.',
    ['What is the difference between VIRTUAL and STORED generated columns?', 'When should you move from MySQL FULLTEXT to Elasticsearch or OpenSearch?']
  ),

  'mysql-query-tuning': makeLesson(
    'mysql',
    'MySQL',
    'mysql-query-tuning',
    '19. Slow Query Log & Index Tuning',
    'expert',
    40,
    'How do you systematically tune a slow production MySQL database?',
    'Enable the Slow Query Log (`slow_query_log = 1`, `long_query_time = 0.5`, `log_queries_not_using_indexes`), group patterns with `pt-query-digest` (or Performance Schema), and inspect the top total-time offenders with `EXPLAIN ANALYZE`. Often 2–3 missing composite indexes or replacing `OR` / `UNION` with `UNION ALL` solves 90% of CPU load.',
    'A query taking 200ms isn’t scary alone—until `pt-query-digest` reveals it runs 400 times/second and consumes 80% of DB CPU.',
    [
      {
        title: 'Example 1: Replacing OR Across Different Columns with UNION ALL',
        language: 'SQL',
        code: `-- OR on two separate columns often prevents single-index lookup:
SELECT id, email FROM users WHERE primary_email = 'a@b.com'
UNION ALL
SELECT id, email FROM users WHERE backup_email = 'a@b.com';`,
        expectedOutput: 'Uses both separate indexes cleanly without deduplication sort.',
      },
      {
        title: 'Example 2: Finding Slowest Queries in Performance Schema',
        language: 'SQL',
        code: `SELECT DIGEST_TEXT, COUNT_STAR, ROUND(SUM_TIMER_WAIT/1e12, 2) AS total_sec
FROM performance_schema.events_statements_summary_by_digest
ORDER BY SUM_TIMER_WAIT DESC
LIMIT 5;`,
        expectedOutput: 'Ranks top 5 queries by cumulative database time.',
      },
    ],
    'I rank queries by cumulative time (`count * avg_latency`) using the slow query log or `performance_schema`, then fix N+1s, add covering composite indexes, and replace `UNION` with `UNION ALL` when duplicates aren’t possible.',
    ['Why is `UNION ALL` faster than `UNION`?', 'How do you safely add an index to a 50-million-row production table without downtime?']
  ),

  'mysql-coding-scenarios': makeLesson(
    'mysql',
    'MySQL',
    'mysql-coding-scenarios',
    '20. SQL Interview Query Challenges',
    'coding',
    50,
    'Write a SQL query to find the 2nd highest salary per department AND safely deduplicate duplicate email rows.',
    'For Top-N / 2nd highest per group, use `DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC)` inside a CTE and filter `WHERE rnk = 2` (handling ties cleanly). To deduplicate emails keeping the lowest `id`, use a self-delete or CTE with `ROW_NUMBER()`.',
    'Using `DENSE_RANK()` handles tied top salaries properly—unlike `LIMIT 1 OFFSET 1`, which breaks if two people tie for 1st place.',
    [
      {
        title: 'Example 1: 2nd Highest Salary Per Department (Handles Ties)',
        language: 'SQL',
        code: `WITH ranked AS (
  SELECT department_id, name, salary,
    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rnk
  FROM employees
)
SELECT department_id, name, salary
FROM ranked
WHERE rnk = 2;`,
        expectedOutput: 'Returns 2nd highest distinct salary in each department.',
      },
      {
        title: 'Example 2: Deleting Duplicate Emails Keeping Oldest ID',
        language: 'SQL',
        code: `DELETE u1 FROM users u1
INNER JOIN users u2
  ON u1.email = u2.email
 AND u1.id > u2.id;`,
        expectedOutput: 'Removes duplicate rows while preserving the lowest id per email.',
      },
    ],
    'For ranking interviews I reach for `DENSE_RANK()` over `PARTITION BY` because it handles ties cleanly across groups, and for deduplication I join on equality with `u1.id > u2.id` (after backing up or testing in a transaction).',
    ['Why is `DENSE_RANK()` better than `ROW_NUMBER()` for "2nd highest salary"?', 'How would you write a running daily revenue total using Window Functions?']
  ),
};
