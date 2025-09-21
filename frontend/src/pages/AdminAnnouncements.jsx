import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Added for success messages
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [category, setCategory] = useState('General');

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

  const startEdit = (ann) => {
    setEditingId(ann._id);
    setTitle(ann.title);
    setMessage(ann.message);
    setCategory(ann.category);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      try {
        const res = await axios.put(`/api/announcements/${editingId}`, {
          title,
          message,
          category,
        });
        setAnnouncements(announcements.map(ann => ann._id === editingId ? res.data : ann));
        setEditingId(null);
        setTitle('');
        setMessage('');
        setCategory('General');
        setSuccess(`Announcement updated successfully at ${new Date(res.data.updatedAt).toLocaleString()}`); // Success message with timestamp
        setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update announcement');
        setSuccess('');
      }
    } else {
      try {
        const res = await axios.post('/api/announcements', { title, message, category });
        setAnnouncements([res.data, ...announcements]);
        setTitle('');
        setMessage('');
        setCategory('General');
        setSuccess(`Announcement created successfully at ${new Date(res.data.createdAt).toLocaleString()}`); // Success message with timestamp
        setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to create announcement');
        setSuccess('');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/announcements/${id}`);
      setAnnouncements(announcements.filter(ann => ann._id !== id));
      setSuccess('Announcement deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete announcement');
      setSuccess('');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4 text-center">{editingId ? 'Edit Announcement' : 'Manage Announcements'}</h2>
      {success && <div className="text-green-500 text-center mb-4">{success}</div>} {/* Display success message */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white dark:bg-gray-800 p-4 rounded shadow-md mb-8">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:text-white"
          required
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:text-white"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="General">General</option>
          <option value="Academic">Academic</option>
          <option value="Sports">Sports</option>
          <option value="Societies">Societies</option>
        </select>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700">
          {editingId ? 'Update Announcement' : 'Create Announcement'}
        </button>
      </form>
      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">{ann.title}</h3>
              <p>{ann.message}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {ann.category} • Created: {new Date(ann.createdAt).toLocaleString()}
                {ann.updatedAt && new Date(ann.updatedAt).getTime() !== new Date(ann.createdAt).getTime() && (
                  <span> • Updated: {new Date(ann.updatedAt).toLocaleString()}</span>
                )}
              </p>
            </div>
            <div>
              <button
                onClick={() => startEdit(ann)}
                className="ml-4 p-2 text-gray-700 hover:text-gray-400 rounded-lg cursor-pointer"
              >Edit</button>
              <button onClick={() => handleDelete(ann._id)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 dark:hover:bg-red-700 ml-4">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnnouncements;