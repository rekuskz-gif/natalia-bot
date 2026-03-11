const SHEET_ID = "1ZxEv1K5t8X-M2GHvzHmsgP4viJUIrCo4EuaKnt8Fyd0";

const DEFAULT_SYS = "Ты — Наталия, эксперт по лидогенерации для производителей детских площадок. Используй реальные данные клиента. Никогда не пиши [name] [leads] [check] — только реальные значения.";

async function loadPrompt() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
    const r = await fetch(url);
    const text = await r.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));
    return json.table.rows[0].c[1].v;
  } catch(e) {
    console.error("Промпт не загрузился, использую дефолтный", e);
    return DEFAULT_SYS;
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  try {
    const body = req.body;

    // Подгружаем промпт из Google Sheets
    const SYS = await loadPrompt();
    if (!body.messages || body.messages[0]?.role !== "system") {
      body.messages = [{role: "system", content: SYS}, ...(body.messages || [])];
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://natalia-bot.vercel.app",
        "X-Title": "NataliaBot"
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
}
```

---

Старый код полностью сохранён, добавились только 2 вещи:
```
1. loadPrompt() — читает B1 из таблицы
2. Вставляет промпт в начало messages
