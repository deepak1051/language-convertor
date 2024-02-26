import express from 'express';
import { translate } from '@vitalets/google-translate-api';
import { HttpProxyAgent } from 'http-proxy-agent';
import path from 'path';
import axios from 'axios';

const app = express();

app.use(express.json());

app.post('/api', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json('Please provide a text to convert.');

  try {
    const { text: data } = await translate(text, {
      to: 'fr',
    });

    res.send(data);
  } catch (error) {
    // console.log(error);

    // if (e.name === 'TooManyRequestsError') {
    //   // retry with another proxy agent
    //   const agent = new HttpProxyAgent('http://103.152.112.162:80');
    //   const { text: data } = await translate(text, {
    //     to: 'en',
    //     fetchOptions: { agent },
    //   });

    //   return res.send(data);
    // }

    return res.status(500).json('Something went wrong.');
  }
});

app.post('/api/convert', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json('Please provide a text to convert.');

  try {
    const { data } = await axios.post(
      'https://microsoft-translator-text.p.rapidapi.com/translate',
      [
        {
          Text: text,
        },
      ],
      {
        params: {
          'to[0]': 'fr',
          'api-version': '3.0',
          profanityAction: 'NoAction',
          textType: 'plain',
        },

        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key':
            '09aaccd449msh057e2012d266280p197393jsn616ca1c0859d',
          'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
        },
      }
    );

    res.send(data[0].translations[0].text);
  } catch (error) {
    return res.status(500).json('Something went wrong.');
  }
});

app.get('/api', (req, res) => {
  res.send('its working');
});

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  console.log(__dirname);
  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  );
} else {
  // const __dirname = path.resolve();
  // app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Running on ${port}`));
