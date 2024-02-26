import { useEffect, useState } from 'react';
import axios from 'axios';

const languageList = [
  { id: 1, value: 'en', Text: 'English' },
  { id: 2, value: 'fr', Text: 'French' },
  { id: 3, value: '	hi', Text: 'Hindi' },
];

function App() {
  const [type, setType] = useState('en');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get('/api');
      console.log(data);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axios.post('/api', { text, type });
    setResult(data);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <select onChange={(e) => setType(e.target.value)}>
        {languageList.map((l) => (
          <option key={l.id} value={l.value}>
            {l.Text}
          </option>
        ))}
      </select>
      <div>Result: {result}</div>
      <button>Convert</button>
    </form>
  );
}

export default App;
