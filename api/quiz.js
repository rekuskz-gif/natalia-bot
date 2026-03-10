let quizzes = {};

export default function handler(req, res) {

  // Tilda отправляет webhook
  if (req.method === "POST") {

    const id = Date.now().toString();

    quizzes[id] = req.body;

    console.log("Новый квиз:", id, req.body);

    return res.status(200).json({
      ok: true,
      id: id
    });

  }

  // бот получает данные по ID
  if (req.method === "GET") {

    const id = req.query.id;

    if (!id || !quizzes[id]) {
      return res.status(404).json({error:"quiz not found"});
    }

    return res.status(200).json({
      quiz: quizzes[id]
    });

  }

  res.status(405).end();
}
