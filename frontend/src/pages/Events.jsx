import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('upcoming');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const url = `/api/events?search=${search}&sort=${sort}`;
        const res = await axios.get(url);
        setEvents(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [search, sort]);

  const handleRegister = async (id) => {
    if (!user) {
      setError('Please log in to register for events');
      return;
    }
    try {
      await axios.post(`/api/events/${id}/register`);
      setEvents(events.map(event => 
        event._id === id ? { ...event, registeredUsers: [...event.registeredUsers, user._id] } : event
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };
  // unregister
  const handleUnregister = async (id) => {
  if (!user) {
    setError('Please log in to unregister from events');
    return;
  }
  try {
    await axios.delete(`/api/events/${id}/unregister`);
    setEvents(events.map(event => 
      event._id === id ? { ...event, registeredUsers: event.registeredUsers.filter(userId => userId !== user._id) } : event
    ));
  } catch (err) {
    setError(err.response?.data?.msg || 'Failed to unregister');
  }
};

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4 text-center">Events</h2>
      <div className="mb-4 max-w-md mx-auto flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full sm:w-auto p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="upcoming">Upcoming</option>
          <option value="recent">Most Recent</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(event => (
          <div key={event._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
            <h3 className="text-xl font-bold">{event.title}</h3>
            <p>{event.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{event.registeredUsers.length} students registered</p>
            {user.role === 'admin' && (
              <Link to={`/admin/events/${event._id}/attendees`} className="text-blue-500 hover:underline">View Attendees</Link>
            )}
            {event.registeredUsers.includes(user._id) ? (
              // <p className="text-green-500 mt-2">Registered</p>
              <button onClick={() => handleUnregister(event._id)} className="mt-2 bg-red-600 cursor-pointer text-white p-2 rounded w-full hover:bg-red-500 dark:hover:bg-red-700">Unregister</button>
            ) : (
              <button onClick={() => handleRegister(event._id)} className="mt-2 cursor-pointer bg-green-600 text-white p-2 rounded w-full hover:bg-green-500 dark:hover:bg-blue-700">Register</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;