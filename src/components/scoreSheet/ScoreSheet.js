import React, { useContext, useReducer, useState, useEffect } from 'react';
import './scoresheet.scss';
import Player from './Player';
import 'firebase/firestore';
import { FirebaseContext } from '../../utils/firebase';

const Scoresheet = () => {
    const firebase = useContext(FirebaseContext);
    const headers = [
        {
            name: 'military',
            color: '#a83232'
        },
        {
            name: 'coin',
            color: '#a89832'
        },
        {
            name: 'wonders',
            color: '#806821'
        },
        {
            name: 'culture',
            color: '#245e9c'
        },
        {
            name: 'trading',
            color: '#cfca42'
        },
        {
            name: 'guild',
            color: '#5d29d6'
        },
        {
            name: 'science',
            color: '#308a00'
        },
        {
            name: 'leader',
            color: '#ebebeb'
        },
        {
            name: 'city',
            color: '#000'
        },
        {
            name: 'armanda',
            color: '#33b1ff'
        }
    ];
    const gameId = 'iXRn0QvcMD5rxIk9bxcX';
    const blankPlayer = {
        name: '',
        points: []
    };

    const playersReducer = (playersState, action) => {
        let newPlayersState;
        switch (action.type) {
            case 'setPoints':
                // Set a single point field
                if (action.playerNumber) {
                    console.log('Set a single point field');
                    newPlayersState = [...playersState];
                    newPlayersState[action.playerNumber].points[action.column] = action.point;
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

    const [players, dispatch] = useReducer(playersReducer, []);


    const addPlayer = () => {
        dispatch({ type: 'addPlayer' });
    };

    const renderHeaders = (list) => {
        const headerHTML = list.map((item, index) => {
            const style = {
                backgroundColor: item.color,
                color: item.color === '#000' ? '#fff' : '#000'
            }
            // return <td id={index+row.name} {...row}/>
            return <th className="title" key={`${item.name}-${index}`} style={style}>{item.name}</th>;
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
     */
    useEffect(() => {
        const db = firebase.firestore();
        const documentRef = db.collection('game').doc(gameId);
        documentRef.get().then(snapshot => {
            if (snapshot) {
                console.log(snapshot);
                console.log(snapshot.data().players);
                dispatch(
                    {
                        type: 'setPoints',
                        players: snapshot.data().players
                    }
                )
            }
        }).catch(error => {
            // Handle the error
        })
    }, []);

    const renderPlayer = (player, index) => {
        return (
            <Player key={`${player.name} ${index}`} index={index} name={player.name}
                score={player.score} headers={headers}
                dispatch={dispatch} />
        )
    }


    return (
        <div className="scoreSheet">
            <h1>Score</h1>
            <table>
                <tbody>
                    {renderHeaders(Object.values(headers))}
                    {players.map((player, index) => renderPlayer(player, index))}
                </tbody>
            </table>
            <button onClick={addPlayer}>Add Player</button>
        </div>
    );
};

export default Scoresheet;
