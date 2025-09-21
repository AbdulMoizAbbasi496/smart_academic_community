import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/users/events');
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
    try {
      const res = await axios.put('/api/users/profile', { name, email, password });
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setPassword('');
      setError('');
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4 text-center">My Profile</h2>
      {success && <div className="text-green-500 text-center mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white dark:bg-gray-800 p-4 rounded shadow-md mb-8">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:text-white"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:text-white"
          required
        />
        <input
          type="password"
          placeholder="New Password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700">Update Profile</button>
      </form>
      <h3 className="text-xl mb-4 text-center">My Registered Events</h3>
      {events.length === 0 ? (
        <p className="text-center">No registered events.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(event => (
            <div key={event._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
              <h4 className="text-lg font-bold">{event.title}</h4>
              <p>{event.description}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;