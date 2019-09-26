import React from 'react';
import './Row.scss';

const Row = (props) => {
    let {
        pointIndex,
        name,
        color,
        data,
        readOnly,
        dispatch
    } = props;

    const handlePointChange = (event, playerId, columnIndex) => {
        dispatch(
            {
                type: 'setPoints',
                playerNumber: playerId,
                column: columnIndex,
                point: event.target.value === '' ? '' : parseInt(event.target.value) + ''
            }
        );
    }
    const style = {
        backgroundColor: color,
        color: color === '#000' ? '#fff' : '#000'
    }

    return (
        <tr>
            <td className="rowName" style={style}>
                {name}
            </td>
            {data.map((point, playerIndex) => readOnly ? (
                <td className="inputCell" key={`point-${playerIndex}-${[pointIndex]}`}>
                    {point}
                </td>
            ) : (
                    <td className="inputCell" key={`point-${playerIndex}-${[pointIndex]}`}>
                        <input type="number" value={point} onChange={(event) => handlePointChange(event, playerIndex, pointIndex)} />
                    </td>
                ))
            }
        </tr >

    )
}

export default Row;
