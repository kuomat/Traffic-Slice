import React, { useState } from 'react';

const WarningsSection = () => {
  // State to store warnings
  const [warnings, setWarnings] = useState([
    "Warning 1: Placeholder warning text.",
    "Warning 2: Placeholder warning text.",
    "Warning 3: Placeholder warning text."
  ]);

  // Function to add a new warning
  const addWarning = () => {
    setWarnings([
      ...warnings,
      `Warning ${warnings.length + 1}: Placeholder warning text.` // Create new warning dynamically
    ]);
  };

  // Function to remove the last warning
  const removeWarning = () => {
    setWarnings(warnings.slice(0, warnings.length - 1));
  };

  return (
    <section className="m-10 inset-0 flex justify-center items-center z-10">
      <div className="w-1/2 max-h-96 bg-blue-100 text-gray-700 p-4 rounded-xl shadow-lg text-center overflow-invisible">
        <h3 className="text-xl font-semibold mb-4">List of Warnings</h3>

        {/* Render warnings dynamically */}
        <div className="mb-4">
          {warnings.length > 0 ? (
            warnings.map((warning, index) => (
              <p key={index}>- {warning}</p>
            ))
          ) : (
            <p>No warnings available.</p>
          )}
        </div>

        {/* Buttons to add and remove warnings */}
        <div className="mt-4 flex justify-center space-x-2">
          <button
            onClick={addWarning}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Add Warning
          </button>
          <button
            onClick={removeWarning}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Remove Warning
          </button>
        </div>
      </div>
    </section>
  );
};

export default WarningsSection;
