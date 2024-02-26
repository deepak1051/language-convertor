import express from 'express';
import { translate } from '@vitalets/google-translate-api';
import path from 'path';

const app = express();

app.use(express.json());

app.post('/api', async (req, res) => {
  const { text, type } = req.body;
  if (!text || !type)
    return res.status(400).json('Please provide a text to convert.');

  try {
    const { text: data } = await translate(text, {
      to: type,
    });

    res.send(data);
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
