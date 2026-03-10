export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const data = req.body;
    
    const keys = {
      clients: "Как находят клиенты",
      budget: "Бюджет",
      result: "Срок",
      check: "Средний чек",
      leads: "Заявок в месяц",
      audience: "Аудитория",
      geo: "География",
      tasks: "Задачи",
      competitors: "Конкуренты",
      advantage: "Преимущество",
      services: "Услуги"
    };

    let text = "📋 Новая заявка с квиза:\n\n";
    for (const key in keys) {
      if (data[key]) text += `• ${keys[key]}: ${data[key]}\n`;
    }
    
    // Все остальные поля
    for (const key in data) {
      if (!keys[key] && key !== "tranid") {
        text += `• ${key}: ${data[key]}\n`;
      }
    }

    await fetch(`https://api.telegram.org/bot8715209750:AAH4-blEgXPZpeYXii8IeWLX0wdbGWtANQc/sendMessage`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        chat_id: "376719975",
        text: text
      })
    });

    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
