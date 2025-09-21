import { useState, useEffect } from 'react';
import axios from 'axios';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const url = category ? `/api/announcements?category=${category}` : '/api/announcements';
        const res = await axios.get(url);
        setAnnouncements(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load announcements');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [category]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4 text-center">Announcements</h2>
      <div className="mb-4 max-w-md mx-auto">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Categories</option>
          <option value="General">General</option>
          <option value="Academic">Academic</option>
          <option value="Sports">Sports</option>
          <option value="Societies">Societies</option>
        </select>
      </div>
      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
            <h3 className="text-xl font-bold">{ann.title}</h3>
            <p>{ann.message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{ann.category} • {new Date(ann.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;