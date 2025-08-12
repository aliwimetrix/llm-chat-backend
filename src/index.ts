import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello World!")

})

app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
      max_completion_tokens: 512
    });
    res.json({
      reply: response.choices[0]?.message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({error});
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://0.0.0.0:${process.env.PORT}`);
});
