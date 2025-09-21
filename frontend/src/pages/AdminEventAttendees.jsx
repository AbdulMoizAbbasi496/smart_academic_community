import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const AdminEventAttendees = () => {
  const { id } = useParams();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const res = await axios.get(`/api/events/${id}/attendees`);
        setAttendees(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load attendees');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendees();
  }, [id]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4 text-center">Event Attendees</h2>
      <Link to="/admin/events" className="text-blue-500 hover:underline mb-4 inline-block">Back to Manage Events</Link>
      {attendees.length === 0 ? (
        <p className="text-center">No attendees registered for this event.</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md">
          <ul className="space-y-2">
            {attendees.map(user => (
              <li key={user._id} className="border-b py-2">
                <span className="font-bold">{user.name}</span> ({user.email})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminEventAttendees;