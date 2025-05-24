require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Secure endpoint for career suggestions
app.post('/api/career-path', async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{
        role: "system",
        content: "Generate detailed career roadmap for: " + req.body.query
      }],
      model: "gpt-3.5-turbo",
    });

    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));