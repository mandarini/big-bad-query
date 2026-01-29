# Supabase Test

Simple js package to test fails with a long list of fields in select() call.

## Environment

The environment must be setup prior to running this test case.

### npm

Installs the supabase-js package.

```bash
$ npm install

added 13 packages, and audited 14 packages in 1s

found 0 vulnerabilities
```

### Variables
Set up the environment with the following variables:

```bash
SUPABASE_URL
SUPABASE_KEY
SCHEMA_NAME # (defaults to public)
```

### PostgreSQL

The following table should be created where supabase-js has access before running the script.

```sql
create unlogged table test_query (
    "Field One"   integer default 1,
    "Field Two"   integer default 2,
    "Field Three" integer default 3,
    "Field Four"  integer default 4,
    "Field Five"  integer default 5
);
```

## Execute

```bash
$ npm run start

> big-bad-query@1.0.0 start
> MAX_ATTEMPTS=4 node index.js

[bigBadQuery] trying query.length ~ 1k (1019)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 2k (2039)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 3k (3059)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 4k (4079)
[bigBadQuery] success
test succeeded

Process finished with exit code 0

$ npm run node-fail

> big-bad-query@1.0.0 node-fail
> node index.js

[bigBadQuery] trying query.length ~ 1k (1019)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 2k (2039)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 3k (3059)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 4k (4079)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 5k (5099)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 6k (6119)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 7k (7139)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 8k (8159)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 9k (9179)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 10k (10199)
[bigBadQuery] ERROR: {
  message: 'TypeError: fetch failed',
  details: 'TypeError: fetch failed\n' +
    '\n' +
    'Caused by: HeadersOverflowError: Headers Overflow Error (UND_ERR_HEADERS_OVERFLOW)\n' +
    'HeadersOverflowError: Headers Overflow Error\n' +
    '    at Parser.trackHeader (node:internal/deps/undici/undici:6616:37)\n' +
    '    at Parser.onHeaderValue (node:internal/deps/undici/undici:6607:14)\n' +
    '    at wasm_on_header_value (node:internal/deps/undici/undici:6361:34)\n' +
    '    at wasm://wasm/00032d9a:wasm-function[48]:0x91b5\n' +
    '    at wasm://wasm/00032d9a:wasm-function[20]:0x7801\n' +
    '    at Parser.execute (node:internal/deps/undici/undici:6508:26)\n' +
    '    at Parser.readMore (node:internal/deps/undici/undici:6484:16)\n' +
    '    at TLSSocket.onHttpSocketReadable (node:internal/deps/undici/undici:6918:22)\n' +
    '    at TLSSocket.emit (node:events:508:28)\n' +
    '    at emitReadable_ (node:internal/streams/readable:832:12)',
  hint: '',
  code: ''
}
test failed

Process finished with exit code 0



$ npm run increased-size-fail

> big-bad-query@1.0.0 increased-size-fail
> node --max-http-header-size=80000 index.js

[bigBadQuery] trying query.length ~ 1k (1019)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 2k (2039)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 3k (3059)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 4k (4079)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 5k (5099)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 6k (6119)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 7k (7139)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 8k (8159)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 9k (9179)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 10k (10199)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 11k (11219)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 12k (12239)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 13k (13259)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 14k (14279)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 15k (15299)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 16k (16319)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 17k (17339)
[bigBadQuery] success
[bigBadQuery] trying query.length ~ 18k (18359)
[bigBadQuery] ERROR: { message: 'Bad Request' }
test failed
```

## Timeout Protection Demo

The library now supports automatic timeout protection to prevent hanging requests.

```bash
$ npm run timeout-demo

🚀 Timeout Protection Demo
===========================

Client configured with timeout: 2000ms
This protects against indefinitely hanging requests.

Making query (length: 300 chars)...
If server is slow/unresponsive, request will abort after 2s

✅ Success! Server responded within timeout.
   Returned 1 rows

✅ Demo completed
```

### Configuration

Configure the timeout option when creating the Supabase client:

```javascript
const supabase = createClient(url, key, {
  db: {
    timeout: 2000  // Automatically abort requests after 2 seconds
  }
});
```

When a timeout occurs, you'll see improved error messages:

```javascript
❌ Request failed:

📊 Error Analysis:
  Code: PGRST_TIMEOUT
  Hint: Request was aborted (timeout or manual cancellation). Note: Your request URL is 9179 characters, which may exceed server limits. Consider using views or selecting fewer fields.
  Message: AbortError: The operation was aborted

✅ Timeout protection worked!
   Request was aborted after 2 seconds as configured.
```

### Improved Error Messages

With the latest version, HeadersOverflowError now includes helpful hints:

```javascript
📊 Error Details:
  code: PGRST_HEADERS_OVERFLOW
  hint: HTTP headers exceeded server limits (typically 16KB). Your request URL is 10199 characters. Consider using views, selecting fewer fields, or using POST for complex queries.
  message: TypeError: fetch failed
```
