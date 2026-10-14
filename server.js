const express = require("express");
const OpenAI = require("openai");

const app = express();
app.use(express.json({ limit: "20kb" }));

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

app.get("/", (req, res) => {
  res.json({
    app: "SIA",
    status: "online",
    message: "Le serveur SIA fonctionne."
  });
});

app.post("/chat", async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({
        error: "La clé OpenAI n'est pas configurée."
      });
    }

    const message = req.body.message;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Message manquant."
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        error: "Message trop long."
      });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "Tu es SIA, un assistant vocal intelligent. " +
        "Réponds naturellement en français et de manière concise. " +
        "Si on te demande qui est ton créateur, réponds : " +
        "Mon créateur est Jérémie LOSSO, développeur de Kinshasa, " +
        "en République démocratique du Congo.",
      input: message,
      max_output_tokens: 350
    });

    res.json({
      reply: response.output_text ||
        "Je n'ai pas de réponse pour le moment."
    });
  } catch (error) {
    console.error("Erreur OpenAI :", error.message);
    res.status(500).json({
      error: "Impossible d'obtenir une réponse pour le moment."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Serveur SIA démarré sur le port " + PORT);
});
