const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.post('/prompt', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post('https://api.chatanywhere.tech/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500
    }, {
      headers: {
        'Authorization': 'Bearer sk-ThJ2bucGs6Vw0Sq9NSVuDoMR2xthhIQGamBbzorxalbspvN6',
        'Content-Type': 'application/json'
      }
    });

    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error.code === 'insufficient_quota') {
      res.status(402).json({ error: 'Quota exceeded. Please check your OpenAI plan and billing details or wait for the next reset.' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.options('/prompt', cors());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});