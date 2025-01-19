import React, { useEffect, useState } from 'react';

const HomeDetail = ({ id, onClose }) => {
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequestData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080/specific_warning/${id}`);
        const data = await response.json();
        setRequestData(data);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRequestData();
  }, [id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-1/2 max-h-[80vh] relative">
        {/* Sticky Header with Title and Close Button */}
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Warning Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-lg"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-auto max-h-[calc(80vh-50px)]">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && requestData && (
            <div>
              <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    {Object.keys(requestData[0] || {}).map((key) => (
                      <th key={key} className="border px-4 py-2 bg-gray-100">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requestData.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, idx) => (
                        <td key={idx} className="border px-4 py-2">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeDetail;
