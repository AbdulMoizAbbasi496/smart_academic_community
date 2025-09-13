import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events');
        setEvents(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      // update existing event
      try {
        const res = await axios.put(`/api/events/${editingId}`, {
          title,
          description,
          date,
        });

        setEvents(events.map(event => event._id === editingId ? res.data : event));
        setEditingId(null);
        setTitle('');
        setDescription('');
        setDate('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update event');
      }
    } else {
      // create new event
      try {
        const res = await axios.post('/api/events', { title, description, date });
        setEvents([...events, res.data]);
        setTitle('');
        setDescription('');
        setDate('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to create event');
      }
    }
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/events/${id}`);
      setEvents(events.filter(event => event._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const startEdit = (event) => {
    setEditingId(event._id);
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date.split("T")[0]); // format for input type="date"
  };


  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4 text-center">{editingId ? 'Edit Event' : 'Manage Events'}</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-4 rounded shadow-md mb-8">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white cursor-pointer p-2 rounded hover:bg-blue-600">{editingId ? 'Edit Event' : 'Create Event'}</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(event => (
          <div key={event._id} className="bg-white p-4 rounded shadow-md flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold">{event.title}</h3>
              <p>{event.description}</p>
              <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
            </div>
            {/* buttons */}
            <div>
              <button
                onClick={() => startEdit(event)}
                className="ml-4 p-2 text-gray-700 hover:text-gray-400 rounded-lg cursor-pointer"
              >Edit</button>

              <button onClick={() => handleDelete(event._id)} className="bg-red-500 text-white p-2 cursor-pointer rounded hover:bg-red-600 ml-4">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEvents;