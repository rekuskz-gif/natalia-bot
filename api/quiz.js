let quizData = null;

export default async function handler(req, res) {

  // Tilda отправляет ответы
  if (req.method === "POST") {

    quizData = req.body;

    console.log("Новый квиз:", quizData);

    return res.status(200).json({ ok: true });

  }

  // бот запрашивает ответы
  if (req.method === "GET") {

    return res.status(200).json({
      quiz: quizData
    });

  }

  res.status(405).json({ error: "Method not allowed" });
}
