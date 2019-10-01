import React from 'react';
import './Row.scss';
import coin from 'images/icon-coin.svg';
import island from 'images/icon-island.svg';
import leader from 'images/icon-leader.svg';
import wonder from 'images/icon-wonder.svg';

const Row = (props) => {
    let {
        pointIndex,
        name,
        color,
        card,
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

    const filterInput = (event) => {
        const regexChar = /[0-9]/g;
        if (!regexChar.test(event.key)) {
            event.preventDefault();
        }
    }

    const styleRow = {
        backgroundColor: `${color}AA`,
    }

    const styleIcon = {
        backgroundColor: `${color}`,
    }

    const imageSrc = {
        coin: coin,
        leader: leader,
        armada: island,
        wonder: wonder
    }

    let iconDiv;
    if (card) {
        iconDiv = <div className='icon card' style={styleIcon}></div>
    } else {
        if (imageSrc[name]) {
            iconDiv = <img className='icon' src={imageSrc[name]} alt={name} />
        } else {
            iconDiv = <div className='icon text' style={styleIcon}>{name}</div>
        }
    }

    return (
        <tr>
            <td className={`rowHeader ${name}`} style={styleRow}>
                {iconDiv}
            </td>
            {data.map((point, playerIndex) => readOnly ? (
                <td className="inputCell" key={`point-${playerIndex}-${[pointIndex]}`}>
                    <span>{point}</span>
                </td>
            ) : (
                    <td className="inputCell" key={`point-${playerIndex}-${[pointIndex]}`}>
                        <input type="text" value={point} onChange={(event) => handlePointChange(event, playerIndex, pointIndex)}
                            onKeyPress={(event) => filterInput(event)} />
                    </td>
                ))
            }
        </tr >

    )
}

export default Row;
