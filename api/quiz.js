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

    await fetch(`${KV_URL}/set/quiz_latest`, {
      method: "POST",
      headers: { Authorization: `Bearer ${KV_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ex: 3600, value: JSON.stringify(data) })
    });

    // ОБНОВЛЁННЫЕ КЛЮЧИ под новый квиз
    const keys = {
      name:     "👤 Имя",
      clients:  "🏢 Тип клиентов",
      leads:    "📊 Заявок сейчас",
      check:    "💰 Средний чек",
      tasks:    "😤 Боль",
      result:   "🎯 Хочет заявок",
      geo:      "📍 Регион",
      phone:    "📱 Телефон"
    };

    // TELEGRAM — красивое уведомление
    let text = "🔥 Новая заявка с квиза!\n\n";
    for (const k in keys) {
      if (data[k]) text += `${keys[k]}: ${data[k]}\n`;
    }

    // Расчёт потенциала
    const checkNum = {
      "до 100 000 р": 100000,
      "100 000 — 500 000 р": 300000,
      "500 000 — 1 000 000 р": 750000,
      "более 1 000 000 р": 1000000
    }[data.check] || 0;

    const leadsNum = {
      "0-5 (почти нет)": 3,
      "5-20 (маловато)": 12,
      "20-50 (неплохо)": 35,
      "50+ (хочу больше)": 50
    }[data.leads] || 0;

    const resultNum = {
      "20-50 заявок": 35,
      "50-100 заявок": 75,
      "100-200 заявок": 150,
      "200+ заявок": 200
    }[data.result] || 0;

    const potential = (resultNum - leadsNum) * checkNum;
    if (potential > 0) {
      text += `\n💸 Потенциал роста: ${potential.toLocaleString("ru")} р/мес\n`;
    }

    text += `\n🔗 Открыть бота: https://seokazmarket.ru/bot?id=${id}`;

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
    const safeId = id === "latest" ? "latest" : id.replace(/[^a-zA-Z0-9_]/g, "_");
    const r = await fetch(`${KV_URL}/get/quiz_${safeId}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` }
    });
    const raw = await r.text();
    let quiz = null;
    try {
      const match = raw.match(/\{.*\}/s);
      if (match) quiz = JSON.parse(match[0]);
    } catch(e) {}
    return res.status(200).json({ quiz });
  }

  res.status(405).end();
}
```

---

**Что изменилось:**
```
✅ Новые переменные: name, leads, tasks, result, phone
✅ Telegram показывает потенциал в рублях
✅ Расчёт автоматический по ответам квиза
```

**Теперь в Telegram будешь видеть:**
```
🔥 Новая заявка с квиза!

👤 Имя: Алексей
🏢 Тип клиентов: ЖК / Застройщики
📊 Заявок сейчас: 5-20 (маловато)
💰 Средний чек: 500 000 — 1 000 000 р
😤 Боль: Мало заявок
🎯 Хочет заявок: 50-100 заявок
📍 Регион: Москва и МО
📱 Телефон: +7...

💸 Потенциал роста: 47 250 000 р/мес

🔗 Открыть бота: https://seokazmarket.ru/bot?id=...
