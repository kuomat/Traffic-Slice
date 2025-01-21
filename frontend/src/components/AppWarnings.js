// import React, { useEffect, useState } from 'react';
// import RequestCard from './RequestCard'; // Import the modal component

// const AppWarnings = ({ app }) => {
//   const [appData, setAppData] = useState(null); // Holds the fetched data
//   const [loading, setLoading] = useState(true); // Loading state for fetching data
//   const [error, setError] = useState(null); // Error state for handling errors
//   const [selectedWarningId, setSelectedWarningId] = useState(null); // Holds the selected warning ID for the modal
//   const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true); // Set loading to true before the fetch
//       setError(null); // Reset previous errors
//       try {
//         const res = await fetch(`http://localhost:8080/application/${app}/from`);
//         const resJson = await res.json(); // Wait for the JSON response
//         console.log('nathan', resJson);
//         setAppData(resJson); // Update state with fetched data
//         setLoading(false); // Set loading to false when data is loaded
//       } catch (err) {
//         setError('Failed to fetch data'); // Handle any errors
//         setLoading(false); // Set loading to false on error
//       }
//     };

//     fetchData(); // Call the async function
//   }, [app]); // Re-fetch when `app` prop changes

//   const handleRowDoubleClick = (warningId) => {
//     setSelectedWarningId(warningId); // Set the selected warning ID
//     setIsModalOpen(true); // Open the modal
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false); // Close the modal
//     setSelectedWarningId(null); // Clear the selected warning ID
//   };

//   if (loading) {
//     return <p>Loading...</p>; // Display loading message while fetching
//   }

//   if (error) {
//     return <p>{error}</p>; // Display error message if there was an error
//   }

//   return (
//     <section className="overflow-x-auto max-h-[80vh] p-4 text-center w-[80vw] mx-auto">
//   <h3 className="text-xl mb-4 font-bold">Warnings for {app}</h3>
//   {!loading && appData ? (
//     <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
//       <table className="table-auto w-full min-w-max mx-auto">
//         <thead className = "bg-gray-100">
//           <tr>
//             {Object.keys(appData[0]).map((key) => (
//               <th key={key} className="border border-gray-300 px-4 py-2 text-left text-gray-600">{key}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {appData.map((warning, index) => (
//             <tr
//               key={index}
//               onDoubleClick={() => handleRowDoubleClick(warning.warning_id)} // Handle double-click
//               className="cursor-pointer hover:bg-gray-100"
//             >
//               {Object.values(warning).map((value, idx) => (
//                 <td key={idx} className="border px-4 py-2">{value}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>

//       ) : (
//         <p>No warnings available.</p>
//       )}

//       {/* Render modal if it is open */}
//       {isModalOpen && (
//         <RequestCard requestId={selectedWarningId} onClose={handleCloseModal} />
//       )}
//     </section>
//   );
// };

// export default AppWarnings;


import React, { useEffect, useState } from 'react';
import RequestCard from './RequestCard'; // Import the modal component

const AppWarnings = ({ app }) => {
  const [appData, setAppData] = useState(null); // Holds the fetched data
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [error, setError] = useState(null); // Error state for handling errors
  const [selectedWarningId, setSelectedWarningId] = useState(null); // Holds the selected warning ID for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before the fetch
      setError(null); // Reset previous errors
      try {
        const res = await fetch(`http://localhost:8080/application/${app}/from`);
        const resJson = await res.json(); // Wait for the JSON response
        console.log('nathan', resJson);
        setAppData(resJson); // Update state with fetched data
        setLoading(false); // Set loading to false when data is loaded
      } catch (err) {
        setError('Failed to fetch data'); // Handle any errors
        setLoading(false); // Set loading to false on error
      }
    };

    fetchData(); // Call the async function
  }, [app]); // Re-fetch when `app` prop changes

  const handleRowDoubleClick = (warningId) => {
    setSelectedWarningId(warningId); // Set the selected warning ID
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedWarningId(null); // Clear the selected warning ID
  };

  // Helper function to get the background color based on severity
  const getSeverityBackgroundColor = (severity) => {
    switch (severity) {
      case 5:
        return 'bg-red-500'; // Dark red
      case 4:
        return 'bg-red-400'; // Lighter red
      case 3:
        return 'bg-red-300'; // Even lighter red
      case 2:
        return 'bg-red-200'; // Light red
      case 1:
        return 'bg-pink-100'; // Light pink
      default:
        return ''; // Default (no background)
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Display loading message while fetching
  }

  if (error) {
    return <p>{error}</p>; // Display error message if there was an error
  }

  return (
    <section className="overflow-x-auto max-h-[80vh] p-4 text-center w-[80vw] mx-auto">
      <h3 className="text-xl mb-4 font-bold">Warnings for {app}</h3>
      {!loading && appData ? (
        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
          <table className="table-auto w-full min-w-max mx-auto">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(appData[0]).map((key) => (
                  <th key={key} className="border border-gray-300 px-4 py-2 text-left text-gray-600">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appData.map((warning, index) => (
                <tr
                  key={index}
                  onDoubleClick={() => handleRowDoubleClick(warning.warning_id)} // Handle double-click
                  className={`cursor-pointer hover:bg-gray-100 ${getSeverityBackgroundColor(warning.severity)}`} // Add dynamic background color
                >
                  {Object.values(warning).map((value, idx) => (
                    <td key={idx} className="border px-4 py-2">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No warnings available.</p>
      )}

      {/* Render modal if it is open */}
      {isModalOpen && (
        <RequestCard requestId={selectedWarningId} onClose={handleCloseModal} />
      )}
    </section>
  );
};

export default AppWarnings;
