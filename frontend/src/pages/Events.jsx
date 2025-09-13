import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

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

  const handleRegister = async (id) => {
    try {
      await axios.post(`/api/events/${id}/register`);
      setEvents(events.map(event => 
        event._id === id ? { ...event, registeredUsers: [...event.registeredUsers, user._id] } : event
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4 text-center">Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map(event => (
          <div key={event._id} className="bg-white p-4 rounded shadow-md">
            <h3 className="text-xl font-bold">{event.title}</h3>
            <p>{event.description}</p>
            <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
            {event.registeredUsers.includes(user._id) ? (
              <p className="text-green-500 mt-2">Registered</p>
            ) : (
              <button onClick={() => handleRegister(event._id)} className="mt-2 bg-green-500 text-white p-2 cursor-pointer rounded w-full hover:bg-green-600">Register</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;