export async function chatWithGemini(message: string) {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "chat",
      message,
    }),
  })

  const data = await response.json()

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta"
}

export async function generateImage(prompt: string) {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "image",
      message: prompt,
    }),
  })

  const data = await response.json()

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
}