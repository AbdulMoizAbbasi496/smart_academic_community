import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get('/api/announcements');
        setAnnouncements(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load announcements');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/announcements', { title, message });
      setAnnouncements([res.data, ...announcements]);
      setTitle('');
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create announcement');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/announcements/${id}`);
      setAnnouncements(announcements.filter(ann => ann._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete announcement');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4 text-center">Manage Announcements</h2>
      <form onSubmit={handleCreate} className="max-w-md mx-auto bg-white p-4 rounded shadow-md mb-8">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Create Announcement</button>
      </form>
      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann._id} className="bg-white p-4 rounded shadow-md flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">{ann.title}</h3>
              <p>{ann.message}</p>
              <p className="text-sm text-gray-500 mt-2">{new Date(ann.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={() => handleDelete(ann._id)} className="bg-red-500 cursor-pointer text-white p-2 rounded hover:bg-red-600 ml-4">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnnouncements;