import React, { useEffect, useState } from 'react';
import RequestCard from './RequestCard'; // Modal component for more details
import HomeDetail from './HomeDetail';

const HomeWarnings = () => {
  const [appData, setAppData] = useState(null); // State to hold fetched data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const [selectedWarningId, setSelectedWarningId] = useState(null); // State for selected warning ID
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility control

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8080/top_warnings`);
        const resJson = await res.json();
        setAppData(resJson);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRowDoubleClick = (warningId) => {
    setSelectedWarningId(warningId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWarningId(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Most Severe Warnings!</h3>
      {appData && appData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Alert Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Application From</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Destination Domain</th>
                <th className="border border-gray-300 px-4 py-2 text-left text-gray-600">Severity</th>
              </tr>
            </thead>
            <tbody>
              {appData.map((warning) => (
                <tr
                  key={warning.id}
                  onDoubleClick={() => handleRowDoubleClick(warning.id)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="border border-gray-300 px-4 py-2">{warning.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{warning.alert_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{warning.application_from}</td>
                  <td className="border border-gray-300 px-4 py-2">{warning.destination_domain}</td>
                  <td className="border border-gray-300 px-4 py-2 text-red-500 font-semibold">{warning.severity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No alerts available.</p>
      )}

      {isModalOpen && (
        <HomeDetail id={selectedWarningId} onClose={handleCloseModal} />
      )}
    </section>
  );
};

export default HomeWarnings;
