import React, { useContext, useState } from 'react';
import './start.scss';
import { withRouter } from 'react-router-dom';
import { store } from 'react-notifications-component';
import 'firebase/firestore';
import { FirebaseContext } from '../../utils/firebase';
import { get } from 'http';
const Start = () => {
    const firebase = useContext(FirebaseContext);
    const [code, setCode] = useState('');

    // Elements
    const GameLink = withRouter(
        ({ history }) => {
            const handleJoin = () => {
                // find room in db
                if (isCodeValid(code)) {
                    findRoomByCode(code).then(snapshot => {
                        if (!snapshot.empty) {
                            history.push(`/room/${code}`);
                        } else {
                            store.addNotification({
                                title: 'No Room Found!',
                                message: 'Is your room code correct ?',
                                type: 'warning',
                                insert: 'top',
                                container: 'top-right',
                                animationIn: ['animated', 'fadeIn', 'faster'],
                                animationOut: ['animated', 'fadeOut', 'fast'],
                                dismiss: {
                                    duration: 2000
                                }
                            });
                        }
                    });
                } else {
                    store.addNotification({
                        title: 'Need 4 digits!',
                        message: 'Were you missing a number ?',
                        type: 'danger',
                        insert: 'top',
                        container: 'top-right',
                        animationIn: ['animated', 'fadeIn', 'faster'],
                        animationOut: ['animated', 'fadeOut', 'fast'],
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

    // Handler
    // Prevent input other than numeric
    const handleCodeInput = async function (event) {
        const regexChar = /[0-9]/g;
        if (!regexChar.test(event.key)) {
            event.preventDefault();
        }
    }

    // Query firestore for room by code
    const findRoomByCode = (code) => {
        const db = firebase.firestore();
        return db.collection('game').where('room', '==', code).get();
    }

    // Utils
    /**
     * check if input qualified as a room code (4 digit number)
     * @param {string} code - code to validate
     * @return {boolean} Set to true if the code is valid
     */
    const isCodeValid = (code) => {
        const regexCode = /[0-9][0-9][0-9][0-9]/g;
        return regexCode.test(code)
    }

    return (
        <div className='start'>
            <h3>Join Game</h3>
            <p>Insert your room code</p>
            <input type='tel' pattern='[0-9]*' maxLength='4'
                onChange={(event) => setCode(event.target.value)}
                onKeyPress={(event) => handleCodeInput(event)}></input>

            <GameLink />
        </div>
    );
};

export default Start;
