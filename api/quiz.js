export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const KV_URL = "https://ready-snail-66852.upstash.io";
  const KV_TOKEN = "gQAAAAAAAQUkAAIncDE1ODRmZjFhODNlMDU0YzA0ODEyNzI2YTczNDA2ZGJkNHAxNjY4NTI";

  if (req.method === "POST") {
    const data = req.body;
    const id = (data.tranid || Date.now().toString()).replace(/[^a-zA-Z0-9_]/g, "_");

    await fetch(`${KV_URL}/set/quiz_${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${KV_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ex: 86400, value: JSON.stringify(data) })
    });

    const keys = { clients:"Как находят",budget:"Бюджет",result:"Срок",check:"Средний чек",leads:"Заявок",audience:"Аудитория",geo:"География",tasks:"Задачи",competitors:"Конкуренты",advantage:"Преимущество",services:"Услуги" };
    let text = "📋 Новая заявка с квиза:\n\n";
    for (const k in keys) { if (data[k]) text += `• ${keys[k]}: ${data[k]}\n`; }
    text += `\n🔗 Бот: https://seokazmarket.ru/bot?id=${id}`;

    await fetch(`https://api.telegram.org/bot8715209750:AAH4-blEgXPZpeYXii8IeWLX0wdbGWtANQc/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: "376719975", text })
    });

    return res.status(200).json({ ok: true, id });
  }

  if (req.method === "GET") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "no id" });

    const safeId = id.replace(/[^a-zA-Z0-9_]/g, "_");

    const r = await fetch(`${KV_URL}/get/quiz_${safeId}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` }
    });
    const json = await r.json();
    const quiz = json.result ? JSON.parse(json.result) : null;
    return res.status(200).json({ quiz });
  }

  res.status(405).end();
}
