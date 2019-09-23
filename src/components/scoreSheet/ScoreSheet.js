import React, { useContext, useState, useReducer, useEffect } from 'react';
import './Scoresheet.scss';
import Player from './Player';
import 'firebase/firestore';
import { FirebaseContext } from 'components/Firebase/context';
import Header from 'config/Header';
import * as utils from 'utils';

const Scoresheet = ({ match }) => {
    const firebase = useContext(FirebaseContext);
    const gameId = 'iXRn0QvcMD5rxIk9bxcX';
    const blankPlayer = {
        name: '',
        score: []
    };
    const [room, setRoom] = useState('');
    // Lobby: rooms currently in play
    const [lobby, updateLobby] = useState([]);
    const [isError, setError] = useState(false);
    const [isLoading, setLoading] = useState(true);

    const playersReducer = (playersState, action) => {
        let newPlayersState;
        switch (action.type) {
            case 'setPoints':
                // Set a single point field
                if (action.playerNumber) {
                    console.log('Set a single point field');
                    newPlayersState = [...playersState];
                    newPlayersState[action.playerNumber].score[action.column] = action.point;
                    return newPlayersState;
                } else {
                    // Get all player points from Firebase query
                    console.log('Get all player points from Firebase query');
                    return action.players;
                }
            case 'addPlayer':
                return [...playersState, { ...blankPlayer }];
            case 'setName':
                newPlayersState = [...playersState];
                playersState[action.playerNumber].name = action.name;
                return newPlayersState;
            case 'removePlayer':
                newPlayersState = [...playersState.filter(
                    (player, index) => index !== action.playerNumber
                )];
                return newPlayersState;
            default:
                return playersState;
        }
    };

    /**
     * Main app object
     * An array of players
     * Each player object hold score of the individual
     */
    const [players, dispatch] = useReducer(playersReducer, []);

    const addPlayer = () => {
        dispatch({ type: 'addPlayer' });
    };

    const saveScore = () => {
        const db = firebase.firestore();
        const documentRef = db.collection('game').doc(gameId);
        documentRef.set(
            {
                room: room,
                players: players
            },
            {
                merge: true
            }
        )
            .then(function () {
                console.log('Score successfully saved!');
            })
            .catch(error => {
                console.log(error);
            });
    };

    const renderHeader = (list) => {
        const headerHTML = list.map((item, index) => {
            const style = {
                backgroundColor: item.color,
                color: item.color === '#000' ? '#fff' : '#000'
            }
            // return <td id={index+row.name} {...row}/>
            return <th className='title' key={`${item.name}-${index}`} style={style}>{item.name}</th>;
        });
        return (
            <tr>
                <th>Player Name</th>
                {headerHTML}
            </tr>
        );
    }

    /**
     * Get games list from 'lobby' collection
     * Only get once when Component mount
     */
    useEffect(() => {
        const db = firebase.firestore();
        // if (match && match.params && match.params.id) {
        //     setRoom(match.params.id);
        // }

        // Get game by id
        const gameDocRef = db.collection('game').doc(match.params.id);
        gameDocRef.get()
            .then((document) => {
                if (document.exists) {
                    // If game do not have a room code
                    // Generate room code
                    if (document.data().room === '') {
                        const lobbyDocRef = db.collection('lobby').doc('list');

                        // Get room list from lobby
                        lobbyDocRef.get()
                            .then(document => {
                                if (document.exists) {
                                    // After getting lobby
                                    const snapShotLobby = document.data().room;
                                    console.log('snapShotLobby');
                                    console.log(snapShotLobby);
                                    updateLobby(snapShotLobby);
                                    const roomCode = utils.generateRoomCode(4, snapShotLobby);
                                    setRoom(roomCode);
                                    // Update room code in game object
                                    gameDocRef.set(
                                        {
                                            room: roomCode
                                        },
                                        {
                                            merge: true
                                        }
                                    );
                                    // Update room code in lobby list
                                    console.log(snapShotLobby);
                                    console.log([...snapShotLobby, roomCode]);
                                    lobbyDocRef.set(
                                        {
                                            room: [...snapShotLobby, roomCode]
                                        }
                                    )
                                } else {
                                    console.log('Lobby list not found!');
                                }
                            }).catch(error => {
                                setError(true);
                                console.log(error);
                            });
                    } else {
                        // If game have a room code
                        // Fetch all game with the same room code
                        setRoom(document.data().room);
                    }
                    // Display game data
                    dispatch(
                        {
                            type: 'setPoints',
                            players: document.data().players
                        }
                    )
                } else {
                    console.log('No such document id');
                    setError(true);
                }
                setLoading(false);
            }).catch((error) => {
                console.log('Error getting document: ', error);
                setError(true);
                setLoading(false);
            });
    }, []);

    const renderPlayer = (player, index) => {
        return (
            <Player key={`${player.name} ${index}`} index={index} name={player.name}
                score={player.score} header={Header}
                dispatch={dispatch} />
        )
    }

    if (isLoading) {
        return (
            <h3>Loading...</h3>
        )
    }
    if (isError) {
        return (
            <h3>Game not found!</h3>
        )
    }
    return (
        <div className='scoreSheet'>
            <h1>Score</h1>
            <p>Room: {room}</p>
            <p>Lobby: {JSON.stringify(lobby)}</p>
            <table>
                <tbody>
                    {renderHeader(Object.values(Header))}
                    {players.map((player, index) => renderPlayer(player, index))}
                </tbody>
            </table>
            <button onClick={addPlayer}>Add Player</button>
            <button onClick={saveScore}>Save score</button>
        </div>
    );
};

export default Scoresheet;
