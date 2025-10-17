# verify_
Ultra-minimal Vercel Serverless Functions project that logs every incoming request.

- Any request to `/api/*` is handled by `api/[...route].js`.
- Logs appear in Vercel deployment logs (console.log output).
- Supports GET/POST/PUT/PATCH/DELETE/OPTIONS, etc.

## Local test (with Vercel CLI)
npx vercel@latest dev

## CURL examples
curl -i http://localhost:3000/api/ping
curl -i -X POST http://localhost:3000/api/hook -H "content-type: application/json" -d '{"hello":"world"}'
