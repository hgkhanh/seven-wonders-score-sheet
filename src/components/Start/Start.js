import React, { useContext, useState, useEffect } from 'react';
import './Start.scss';
import { withRouter } from 'react-router-dom';
import { store } from 'react-notifications-component';
import 'firebase/firestore';
import { FirebaseContext } from 'components/Firebase/context';
// import * as utils from 'utils';
import blankGame from 'config/Game';

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
                    console.log('Entering Room: ' + code);

                    const db = firebase.firestore();
                    db.collection('game').where('room', '==', code).orderBy('time', 'desc').limit(1).get().then(querySnapshot => {
                        if (!querySnapshot.empty) {
                            const game = querySnapshot.docs[0];
                            console.log('findRoomByCode result');
                            console.log(game.data());
                            console.log(`Navigating to game room: /game/${game.id}`);
                            history.push(`/game/${game.id}`);
                        } else {
                            console.log(`Room ${code} not found!`);
                            store.addNotification({
                                title: `Cannot find room ${code}`,
                                message: 'Is your room code correct ?',
                                type: 'warning',
                                insert: 'top',
                                container: 'top-right',
                                animationIn: ['animated', 'fadeIn', 'faster'],
                                animationOut: ['animated', 'fadeOut', 'fast'],
                                dismiss: {
                                    duration: 2000
                                },
                                width: 300
                            });
                        }
                    });
                } else {
                    console.log('Room code is in wrong format!');
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
                        },
                        width: 300
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
                // const code = utils.generateRoomCode(4, roomList);
                const db = firebase.firestore();
                let newGame = blankGame;
                newGame.time = new Date();
                // create new document in game collection
                db.collection('game')
                    .add(newGame)
                    .then(function (docRef) {
                        console.log('Created new game with id:' + docRef.id);
                        history.push(`/game/${docRef.id}`);
                    })
                    .catch(error => {
                        console.log(error);
                    });
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

    // 
    /**
     * Query firestore for games with given room code
     * @param {string} code - room code to search for
     * @return {Object} an array of document references of found games, order by time, newest first
     */
    // const findGamesByCode = (code) => {
    //     const db = firebase.firestore();
    //     return db.collection('game').where('room', '==', code).orderBy('time', 'desc').get();
    // }

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
            <br />
            <JoinGame />
            <br />
            <h3>Create Game</h3>
            <p>Create a new game</p>
            <CreateGame />
        </div>
    );
};

export default Start;
