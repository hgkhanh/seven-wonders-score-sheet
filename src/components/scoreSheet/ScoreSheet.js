import React, { useContext, useReducer, useEffect } from 'react';
import './Scoresheet.scss';
import Player from './Player';
import 'firebase/firestore';
import { FirebaseContext } from '../../utils/firebase';
import Header from '../../config/header';

const Scoresheet = ({ match }) => {
    const firebase = useContext(FirebaseContext);
    const gameId = 'iXRn0QvcMD5rxIk9bxcX';
    const blankPlayer = {
        name: '',
        score: []
    };

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
     * Firestore get games from'game' collection
     * Only get once when Component mount
     */
    useEffect(() => {
        const db = firebase.firestore();

        // Get all game by room code
        db.collection('game').where('room', '==', match.params.id)
            .orderBy("time", "desc")
            .get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    snapshot.forEach((document) => {
                        console.log(document);
                        console.log(document.data().players);
                        dispatch(
                            {
                                type: 'setPoints',
                                players: document.data().players
                            }
                        )
                    });
            }
            }).catch(error => {
                console.log(error);
            });
    }, []);

    const renderPlayer = (player, index) => {
        return (
            <Player key={`${player.name} ${index}`} index={index} name={player.name}
                score={player.score} header={Header}
                dispatch={dispatch} />
        )
    }


    return (
        <div className='scoreSheet'>
            <h1>Score</h1>
            <p>Room: {match.params.id}</p>
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
