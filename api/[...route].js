export default async function handler(req, res) {
  // ---- Read raw body (works for POST/PUT/PATCH/etc.)
  let rawBody = "";
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    rawBody = Buffer.concat(chunks).toString("utf8");
  } catch {
    rawBody = "";
  }

  // Try to parse JSON when content-type indicates JSON
  let parsedBody = null;
  const ct = (req.headers["content-type"] || "").toLowerCase();
  if (ct.includes("application/json") && rawBody) {
    try { parsedBody = JSON.parse(rawBody); } catch { /* ignore */ }
  }

  // ---- Extract the catch-all path from query (key name is "...route")
  const catchAll =
    (Array.isArray(req.query?.route) && req.query.route) ||
    (Array.isArray(req.query?.["...route"]) && req.query["...route"]) ||
    (typeof req.query?.["...route"] === "string" ? [req.query["...route"]] : null);

  const path = catchAll ? `/${catchAll.join("/")}` : "/";

  const info = {
    method: req.method,
    url: req.url,
    path,
    query: req.query || {},
    headers: req.headers,
    ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || null,
    rawBody,
    parsedBody,
  };

  console.log("---- Incoming request ----");
  console.log(JSON.stringify(info, null, 2));

  res.status(200).json({
    ok: true,
    message: "Logged request. Check your Vercel logs.",
    ...info,
  });
}

