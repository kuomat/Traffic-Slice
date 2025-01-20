import React, { useEffect, useState } from 'react';

const AppWarnings = ({ app }) => {
  const [appData, setAppData] = useState(null); // Holds the fetched data
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState(null); // Error state for handling errors

  // Fetch data when the component is mounted or when `app` prop changes
  useEffect(() => {
    setLoading(true); // Set loading to true before the fetch
    setError(null); // Reset previous errors

    fetch(`http://localhost:8080/application/${app}/from`)
      .then((res) => res.json())
      .then((resJson) => {
        setAppData(resJson); // Update state with fetched data
        setLoading(false); // Set loading to false when data is loaded
      })
      .catch((err) => {
        setError('Failed to fetch data'); // Handle any errors
        setLoading(false); // Set loading to false on error
      });
  }, [app]); // Re-fetch when `app` prop changes

  if (loading) {
    return <p>Loading...</p>; // Display loading message while fetching
  }

  if (error) {
    return <p>{error}</p>; // Display error message if there was an error
  }

  return (
    <section>
      <h3>Warnings for {app}</h3>
      {appData && appData.warnings ? (
        <ul>
          {appData.warnings.map((warning, index) => (
            <li key={index}>{warning}</li>
          ))}
        </ul>
      ) : (
        <p>No warnings available.</p>
      )}
    </section>
  );
};

export default AppWarnings;