import React from 'react';
import './player.scss';

const Player = (props) => {
    let {
        index,
        name,
        score,
        header,
        dispatch
    } = props;
    let totalPoint = 0;

    const handlePointChange = (event, columnIndex) => {
        dispatch(
            {
                type: 'setPoints',
                playerNumber: index,
                column: columnIndex,
                point: event.target.value === '' ? 0 : parseInt(event.target.value)
            }
        );
    }
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

    const pointCells = Object.values(header).map((column, columnIndex) => {
        let point = '';
        if (score[columnIndex]) {
            point = score[columnIndex]
        }
        totalPoint += point === '' ? 0 : parseInt(point);
        return (
            <td className="inputCell" key={`player-${index}-${columnIndex}`}>
                <input type="number" value={point} onChange={(event) => handlePointChange(event, columnIndex)} />
            </td>
        );
    }, this);

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
