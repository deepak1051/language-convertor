import { useEffect, useState } from 'react';
import axios from 'axios';

const languageList = [
  { id: 1, value: 'en', Text: 'English' },
  { id: 2, value: 'fr', Text: 'French' },
  { id: 3, value: 'hi', Text: 'Hindi' },
];

function App() {
  const [type, setType] = useState('en');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get('/api');
      console.log(data);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult('');

    try {
      const { data } = await axios.post('/api', { text, type });
      setResult(data);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError(error.response.data || error.message);
    }
  };
  return (
    <div className="max-w-md  mx-auto p-4">
      <h1 className="text-center py-4 font-extrabold text-2xl text-orange-400 italic ">
        Language Convertor
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <textarea
            rows={4}
            className="resize-none flex-1 rounded border font-semibold text-lg border-gray-800 outline-none p-1"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className=" flex my-2 justify-end items-center gap-4">
          <select
            className="rounded border font-semibold  border-gray-800 outline-none  cursor-pointer h-12"
            onChange={(e) => setType(e.target.value)}
          >
            {languageList.map((l) => (
              <option key={l.id} value={l.value}>
                {l.Text}
              </option>
            ))}
          </select>
          <button
            disabled={loading}
            className=" bg-blue-500 p-2 text-white font-bold text-lg rounded my-2"
          >
            {loading ? 'Converting...' : 'Convert'}
          </button>
        </div>
      </form>
      {error ? (
        <p className="my-2 p-2 bg-red-200 border border-red-400 rounded">
          {error}
        </p>
      ) : null}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="uppercase font-semibold">Result:</h2>
          {result ? (
            <button
              onClick={() => {
                navigator.clipboard.writeText(result);
              }}
              className="bg-black text-white border p-1 border-black "
            >
              Copy Text
            </button>
          ) : null}
        </div>
        <div className=" mt-2 bg-slate-200 p-4 rounded  font-semibold text-lg">
          {' '}
          {result}
        </div>
      </div>
    </div>
  );
}

export default App;
