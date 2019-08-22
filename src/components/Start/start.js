import React, { useState } from 'react';
import './start.scss';

const Start = () => {
    // Authenticated mean the user joined a game room
    const [auth, setAuth] = useState(false);
    return (
        <div className="start">
            <h3>Insert your room code</h3>
        </div>
    );
};

export default Start;
