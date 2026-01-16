module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const n8nUrl =
    process.env.N8N_WEBHOOK_URL ||
    process.env.URL_do_WEBHOOK_N8N ||
    "https://n8n-n8n.ynlng8.easypanel.host/webhook/revic-joias";
  const payload = req.body || {};

  try {
    const r = await fetch(n8nUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "order", ...payload }),
    });
    const text = await r.text();
    res.status(200).json({ success: true, forwarded_status: r.status, forwarded_body: text });
  } catch (e) {
    res.status(200).json({ success: false, error: String(e?.message || e) });
  }
};
