import { useEffect, useState } from "react";

const Visits = () => {
  const [visits, setVisits] = useState("Loading...");

  useEffect(() => {
    fetch("/api/visits")
      .then((res) => res.json())
      .then((data) => {
        setVisits(data.visits);
      })
      .catch(() => {
        setVisits("Error loading visits");
      });
  }, []);

  return (
    <div className="visits-page">
      <h2>Application Visits</h2>
      <p>
        Total visits: <strong>{visits}</strong>
      </p>
    </div>
  );
};

export default Visits;
