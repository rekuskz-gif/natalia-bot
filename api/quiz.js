let quizzes = {}

export default async function handler(req, res) {

  if (req.method === "POST") {

    const data = req.body
    const id = data.tranid

    quizzes[id] = data

    console.log("Квиз сохранён:", id, data)

    return res.status(200).json({ ok: true })
  }

  if (req.method === "GET") {

    const { id } = req.query

    if (!id) {
      return res.status(400).json({ error: "no id" })
    }

    const quiz = quizzes[id]

    return res.status(200).json({ quiz })
  }

  res.status(405).end()
}
