let lastQuiz = null

export default async function handler(req, res) {

if (req.method === "POST") {

lastQuiz = req.body

console.log("Новый квиз:", lastQuiz)

return res.status(200).json({ ok: true })

}

if (req.method === "GET") {

return res.status(200).json({
quiz: lastQuiz
})

}

res.status(405).end()

}
