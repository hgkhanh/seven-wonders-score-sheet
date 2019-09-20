import React, { useContext, useState, useEffect } from 'react';
import './start.scss';
import { withRouter } from 'react-router-dom';
import { store } from 'react-notifications-component';
import 'firebase/firestore';
import { FirebaseContext } from '../../utils/firebase';

const Start = () => {
    const firebase = useContext(FirebaseContext);
    const [code, setCode] = useState('');
    const [roomList, setRoomList] = useState([]);
    /**
     * Get list of game room
     */
    useEffect(() => {
        const db = firebase.firestore();
        // Get all game by room code
        db.collection('lobby').doc('list')
            .get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    console.log(snapshot.data().room);
                    setRoomList(snapshot.data().room);
            }
            }).catch(error => {
                console.log(error);
            });
    }, []);
    // Elements
    const JoinGame = withRouter(
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

    const CreateGame = withRouter(
        ({ history }) => {
            const handleCreate = () => {
                history.push(`/room/${code}`);
            }
            return (
                <button onClick={handleCreate}>Create</button>
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
            <div>{JSON.stringify(roomList)}</div>
            <h3>Join Game</h3>
            <p>Insert your room code</p>
            <input type='tel' pattern='[0-9]*' maxLength='4'
                onChange={(event) => setCode(event.target.value)}
                onKeyPress={(event) => handleCodeInput(event)}></input>
            <JoinGame />
            <hr/>
            <h3>Create Game</h3>
            <p>Create a new game</p>
            <CreateGame />
        </div>
    );
};

export default Start;
