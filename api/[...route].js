/**
 * Catch-all API route for Vercel Serverless Functions.
 * Logs method, path, headers, query, and body to Vercel logs (console.log).
 * Works for GET, POST, PUT, DELETE, PATCH, OPTIONS, etc.
 */
export default async function handler(req, res) {
  // Prefer already-parsed bodies when available; otherwise read the stream
  let rawBody = "";
  if (req.body !== undefined) {
    rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  } else {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    rawBody = Buffer.concat(chunks).toString("utf8");
  }

  const info = {
    method: req.method,
    url: req.url,
    // route is the catch-all param from the filename [...route].js
    path: Array.isArray(req.query?.route) ? `/${req.query.route.join("/")}` : "/",
    query: req.query || {},
    headers: req.headers,
    ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || null,
    rawBody,
  };

  console.log("---- Incoming request ----");
  console.log(JSON.stringify(info, null, 2));

  res.status(200).json({
    ok: true,
    message: "Logged request. Check your Vercel logs.",
    ...info,
  });
}
