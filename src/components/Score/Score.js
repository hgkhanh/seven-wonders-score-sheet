import React, { useContext, useState, useReducer, useEffect } from 'react';
import './Score.scss';
import Row from './Row';
import 'firebase/firestore';
import { FirebaseContext } from 'components/Firebase/context';
import Category from 'config/Category';
import * as utils from 'utils';
import { store } from 'react-notifications-component';
import { BrowserRouter as Route, Link } from "react-router-dom";
import Start from '../Start';
import { RemoveCircleTwoTone, PersonAdd } from '@material-ui/icons';
import { Button } from '@material-ui/core';
const Scoresheet = ({ match }) => {
    // Role is Room master (can edit) or Player (can view)
    const masterMode = match && match.params && match.params.gameId;
    const firebase = useContext(FirebaseContext);
    const db = firebase.firestore();
    // const gameId = 'iXRn0QvcMD5rxIk9bxcX';
    const blankPlayer = {
        name: 'p1',
        score: [0,0,0,0,0,0,0,0,0,0]
    };
    const [room, setRoom] = useState('');
    const [gameId, setGameId] = useState('');
    // Lobby: rooms currently in play
    const [lobby, updateLobby] = useState([]);
    const [isError, setError] = useState(false);
    const [isLoading, setLoading] = useState(true);

    /**
     * Handle action to main app object - players
     */
    const playersReducer = (playersState, action) => {
        let newPlayersState;
        switch (action.type) {
            case 'setPoints':
                // Set a single point field
                if (typeof action.playerNumber === 'number') {
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
                store.addNotification({
                    title: 'Success',
                    message: 'Score has been saved!',
                    type: 'success',
                    insert: 'top',
                    container: 'top-right',
                    animationIn: ['animated', 'fadeIn', 'faster'],
                    animationOut: ['animated', 'fadeOut', 'fast'],
                    dismiss: {
                        duration: 2000
                    },
                    width: 300
                });
            })
            .catch(error => {
                console.log(error);
                store.addNotification({
                    title: 'Something wrong!',
                    message: 'Error: ' + error,
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
            });
    };

    /**
     * Fetch game by id
     * Check room code of current game
     * If no room code: Generate new one, exclude room code from lobby list
     * TO-DO If has room code: Fetch all game with current room code
     * Only run once when Component mount
     */
    useEffect(() => {
        // Room Master (game/:gameId)
        if (masterMode) {
            setGameId(match.params.gameId);
            getGameById(match.params.gameId);
        }
        // Player (room/:roomCode)
        else {
            setRoom(match.params.roomCode);
            // Fetch all game with the same room code
            db.collection('game').where('room', '==', match.params.roomCode).orderBy('time', 'desc')
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((document) => {
                        console.log(document.id, " => ", document.data());
                    });
                    // Display game data
                    console.log(querySnapshot.docs[0]);
                    dispatch(
                        {
                            type: 'setPoints',
                            players: querySnapshot.docs[0].data().players
                        }
                    );
                    setLoading(false);
                })
                .catch((error) => {
                    console.log('Error getting document: ', error);
                    setError(true);
                    setLoading(false);
                });
        }
    }, []);


    // HANDLER FUNCTIONS

    // fetch game from database, create roomCode 
    const getGameById = (id) => {
        const gameDocRef = db.collection('game').doc(id);
        gameDocRef.get()
            .then((document) => {
                // If game do not have a room code
                // Generate room code then update in game object and lobby list
                if (document.data().room === '') {
                    const lobbyDocRef = db.collection('lobby').doc('list');

                    // Get room list from lobby
                    lobbyDocRef.get()
                        .then(document => {
                            if (document.exists) {
                                // After getting lobby
                                const snapShotLobby = document.data().room;
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
                                lobbyDocRef.set(
                                    {
                                        room: [...snapShotLobby, roomCode]
                                    }
                                )
                            } else {
                                console.log('Lobby list not found!');
                            }
                        });
                } else {
                    // If game have a room code
                    setRoom(document.data().room);
                }
                // Display game data
                dispatch(
                    {
                        type: 'setPoints',
                        players: document.data().players
                    }
                )
                setLoading(false);
            }).catch((error) => {
                console.log('Error getting document: ', error);
                setError(true);
                setLoading(false);
            });
    }
    const handleNameChange = (event, playerId) => {
        dispatch(
            {
                type: 'setName',
                playerNumber: playerId,
                name: event.target.value
            }
        );
    }

    const handleRemovePlayer = (playerId) => {
        dispatch(
            {
                type: 'removePlayer',
                playerNumber: playerId
            }
        );
    }

    /**
     * RENDER FUNCTIONS
     */
    const renderPlayerName = (player, playerId) => {
        if (masterMode) {
            return (
                <th key={`player-${playerId}`} className={`cell playerName`}>
                    <input type='text' value={player.name} 
                        onChange={(event) => handleNameChange(event, playerId)} />
                    <button className='iconBtn remove' onClick={() => handleRemovePlayer(playerId)}>
                        <RemoveCircleTwoTone color="error" />
                    </button>
                </th>
            )
        } else {
            return (
                <th key={`player-${playerId}`} className={`cell playerName`}>
                    <input type='text' value={player.name} 
                        disabled />
                </th>
            )
        }
    };

    // A row show score in one category - identified by categoryIndex
    const renderRow = (category, categoryIndex) => {
        // Data: an array of scores of all players in that category
        const data = players.map(player => player.score[categoryIndex]);
        return (
            <Row key={category.name} pointIndex={categoryIndex} name={category.name}
                color={category.color} card={category.card} data={data} dispatch={dispatch}
                readOnly={!masterMode} />
        );
    };

    // A row show total scores of all player
    const renderRowTotal = () => {
        // Data: an array of total scores of all players
        const data = players.map(player => {
            // Calculate sum of point
            return player.score.reduce((accumulator, point) => {
                return point === '' ? accumulator : accumulator + parseInt(point)
            }, 0);
        });
        return (
            <Row name='Σ' data={data} readOnly={true} totalRow={true} />
        );
    };

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
            <Link to='/'>Home</Link>
            <div className="titleHeader">
                <h1>Score</h1>
                <p>Room: {room}</p>
            </div>
            <div className='content'>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            {players.map((player, playerId) => renderPlayerName(player, playerId))}
                            {masterMode &&
                                (<th><button className='iconBtn' onClick={addPlayer}><PersonAdd /></button></th>)
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {Category.map((category, index) => renderRow(category, index))}
                        {renderRowTotal()}
                    </tbody>
                </table>
                <div className='footer'>
                    {masterMode &&
                        (<Button type='submit' variant='contained'
                            onClick={saveScore}>
                            Save score
                    </Button>)
                    }
                </div>
                <Route exact path="/start" component={Start} />
            </div>
        </div>
    );
};

export default Scoresheet;
