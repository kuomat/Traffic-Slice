// import React from 'react';

// const Footer = () => {
//   return (
//     <footer className="bg-red-500 text-white py-3 fixed w-[97%] bottom-3 rounded-lg mx-5 center">
//       <p className="m-0 text-center">© 2024 Website. All rights reserved.</p>
//     </footer>
//   );
// };

// export default Footer;
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-lg mx-5 mt-5 absolute bottom-0 w-[98vw] my-5">
      <div className="max-w-screen-xl mx-auto flex justify-center items-center">
        <p className="m-0 text-center text-lg font-medium">© 2024 Website. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
