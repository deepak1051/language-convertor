import express from 'express';
import { translate } from '@vitalets/google-translate-api';
const app = express();

app.use(express.json());

app.post('/api', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json('Please provide a text to convert.');
  const { text: data } = await translate(text, {
    to: 'en',
  });

  res.send(data);
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
