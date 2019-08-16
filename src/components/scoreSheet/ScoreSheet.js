import React, { useReducer, useState, useEffect } from 'react';
import './ScoreSheet.scss';
import Player from './Player';

const ScoreSheet = () => {
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
    // const players = [
    //   {
    //     name: 'player 1',
    //     points: [1, 3]
    //   }
    // ];

    const blankPlayer = {
        name: '',
        points: []
    };

    const playersReducer = (playersState, action) => {
        let newPlayersState;
        switch (action.type) {
            case 'setPoints':
                newPlayersState = [...playersState];
                newPlayersState[action.playerNumber].points[action.column] = action.point;
                return newPlayersState;
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

    const [players, dispatch] = useReducer(playersReducer, [{ ...blankPlayer }]);



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

    // useEffect(() => {
    //   // a condition may be added in case it shouldn't be executed every time
    //   console.log(players);
    // }, [players]);

    const renderPlayer = (player, index) => {
        return (
            <Player index={index} name={player.name}
                points={player.points} headers={headers}
                dispatch={dispatch} />
        )
    }

    return (
        <div className="scoreSheet">
            {/* <h1>scoreSheet</h1> */}
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

export default ScoreSheet;
