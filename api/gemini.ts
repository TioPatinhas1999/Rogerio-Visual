import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { type, message } = req.body

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API Key não configurada" })
    }

    const endpoint =
      type === "image"
        ? "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
        : "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

    const response = await fetch(`${endpoint}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
      }),
    })

    const data = await response.json()

    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro interno no servidor" })
  }
}