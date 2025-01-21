// import React from 'react';
// import Header from '../components/Header';
// import Footer from '../components/Footer';

// function About() {

//     return (
//     <div className="App">
//         <Header />
//         <h1 className="text-center font-bold text-4xl py-3 my-[2vh]">About us:</h1>
//         <div className='px-10 w-[70vw] mx-[15vw] leading-8'>The Traffic Slice solution aims to provide transparency without compromising privacy, emphasizing open-source availability to build trust within the user community. By making the code openly accessible, users and developers alike can review the tool's inner workings, ensuring there are no hidden data collection practices or vulnerabilities. This transparency not only helps in identifying potential security issues early but also fosters a collaborative environment where the community can contribute to the tool's improvement.</div>
//         <h2 className ='text-center font-bold text-2xl py-3 my-[2vh]'>Next Steps:</h2>
//         <div className='px-10 w-[70vw] mx-[15vw] leading-8'>If you see an application with excessive warnings, particulary with severe warnings, please take action immediately. If it seems to be taking a lot of important data, consider deleting the application or restriction its permissions in settings.</div>
//         <Footer />
//     </div>
//     );
//     }

// export default About;

import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function About() {
  return (
    <div>
      <Header />
      
      {/* Main Title */}
      <h1 className="text-center text-4xl font-extrabold text-gray-800 py-6">About Us</h1>
      
      {/* Content Section: Mission */}
      <div className="px-8 md:px-16 lg:px-32 text-lg leading-relaxed text-gray-700 max-w-4xl mx-auto">
        <p className="mb-8">
          The <strong>Traffic Slice</strong> solution aims to provide transparency without compromising privacy, emphasizing open-source availability to build trust within the user community. By making the code openly accessible, users and developers alike can review the tool's inner workings, ensuring there are no hidden data collection practices or vulnerabilities.
        </p>
        <p className="mb-8">
          This transparency not only helps in identifying potential security issues early but also fosters a collaborative environment where the community can contribute to the tool's improvement.
        </p>
      </div>

      {/* Section Title */}
      <h2 className="text-center text-3xl font-semibold text-gray-800 py-4">Next Steps</h2>
      
      {/* Next Steps Content */}
      <div className="px-8 md:px-16 lg:px-32 text-lg leading-relaxed text-gray-700 max-w-4xl mx-auto">
        <p className="mb-8">
          If you see an application with excessive warnings, particularly with severe warnings, please take action immediately. If it seems to be taking a lot of important data, consider deleting the application or restricting its permissions in your device's settings.
        </p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default About;
