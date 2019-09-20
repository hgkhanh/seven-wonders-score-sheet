import React, { useState } from 'react';
import './start.scss';
import { withRouter } from "react-router-dom";
import { store } from 'react-notifications-component';
const Start = () => {
    const [code, setCode] = useState('');
    const [isCodeValid, setIsCodeValid] = useState(false);

    /**
     * Elements
     */
    const GameLink = withRouter(
        ({ history }) => {
            const handleJoin = () => {
                if (isCodeValid) {
                    history.push(`/room/${code}`);
                } else {
                    store.addNotification({
                        title: "No Room Found!",
                        message: "Is your room code correct ?",
                        type: "warning",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn", "faster"],
                        animationOut: ["animated", "fadeOut", "fast"], 
                        dismiss: {
                            duration: 2000
                        }
                    });
                }
            }
            return (
                <button onClick={handleJoin}>Join</button>
            )
        }
    );

    /**
     * Handler
     */
    // Authenticated mean the user joined a game room
    const handleCodeInput = function (event) {
        const regexCode = /[0-9][0-9][0-9][0-9]/g;
        const regexChar = /[0-9]/g;
        if (!regexChar.test(event.key)) {
            event.preventDefault();
        }
        if (regexCode.test(code)) {
            setIsCodeValid(true);
        } else {
            setIsCodeValid(false);
        }
    }

    return (
        <div className="start">
            <h3>Join Game</h3>
            <p>Insert your room code</p>
            <input type="tel" pattern="[0-9]*" maxLength="4"
                onChange={(event) => setCode(event.target.value)}
                onKeyPress={(event) => handleCodeInput(event)}></input>

            <GameLink />
        </div>
    );
};

export default Start;
