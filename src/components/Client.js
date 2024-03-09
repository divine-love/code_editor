import React from 'react';
import Avatar from 'react-avatar';

// const Client = ({ username }) => {
//     return (
//         <div className="client">
//             <Avatar name={username} size={50} round="14px" />
//             <span className="userName">{username}</span>
//         </div>
//     );
// };

const Client = ({ username }) => {
    const avatarOptions = {
      name: username,
      size: '50',
      round: true,
     
      textSizeRatio: 2.5, // Adjust the text size ratio for better aesthetics
      style: {
        border: '2px solid #ccc',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      className: 'custom-avatar',
    };
  

    return (
        <div className="client">
            <Avatar {...avatarOptions} />
            <span className="userName">{username}</span>
        </div>
    );
};

export default Client;
