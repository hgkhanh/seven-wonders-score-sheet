import React from 'react';
import './Player.scss';

const Player = (props) => {
    let {
        index,
        name,
        points,
        headers,
        dispatch
    } = props;
    let totalPoint = 0;


    const pointCells = Object.values(headers).map((column, columnIndex) => {
        let point = '';
        if (points[columnIndex]) {
            point = points[columnIndex]
        }
        totalPoint += point;
        return (
            <td className="inputCell" key={`player-${index}-${columnIndex}`}>
                <input type="number" value={point} onChange={event => {
                    dispatch(
                        {
                            type: 'setPoints',
                            playerNumber: index,
                            column: columnIndex,
                            point: parseInt(event.target.value)
                        }
                    );
                }} />
            </td>
        );
    }, this);

    const handleNameChange = (event) => {
        dispatch(
            {
                type: 'setName',
                playerNumber: index,
                name: event.target.value
            }
        );
    }

    const handleRemovePlayer = () => {
        dispatch(
            {
                type: 'removePlayer',
                playerNumber: index
            }
        );
    }



    return (
        <tr key={`player-${index}`}>
            <td className="playerName">
                <input type="text" value={name} onChange={handleNameChange}/>
                <button className="btnRemove" onClick={handleRemovePlayer}>-</button>
            </td>
            {pointCells}
            <td>{totalPoint}</td>
        </tr>

    )
}

export default Player;
