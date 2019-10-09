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
        card,
        data,
        readOnly,
        totalRow,
        dispatch
    } = props;

    let color = props.color || '#000000';
    const handlePointChange = (event, playerId, columnIndex) => {
        dispatch(
            {
                type: 'setPoints',
                playerNumber: playerId,
                column: columnIndex,
                point: formatInput(event.target.value)
            }
        );
    };

    const filterInput = (event) => {
        const regexChar = /[0-9-]/g;
        if (!regexChar.test(event.key)) {
            event.preventDefault();
        }
    };

    const formatInput = (value) => {
        if (value === '-') {
            return '-';
        } else if (value === '') {
            return '';
        }
        return parseFloat(value);
    };

    const background = {
        backgroundColor: color + 'AA'
    };

    const fadedBg = {
        backgroundColor: color + '44'
    };

    const veryFadedBg = {
        backgroundColor: color + '22'
    };

    const originalColor = {
        backgroundColor: color,
    };

    const imageSrc = {
        coin: coin,
        leader: leader,
        armada: island,
        wonder: wonder
    };

    let iconDiv;
    // There are 3 type of row Header
    if (card) {
        // Header with card image
        iconDiv = <div className='icon card' style={originalColor}></div>
    } else {
        if (imageSrc[name]) {
            // Header with icon svg
            iconDiv = <img className='icon' src={imageSrc[name]} alt={name} />
        } else {
            // Header with text
            iconDiv = <div className='icon text' style={originalColor}>{name}</div>
        }
    }

    return (
        <tr className={totalRow ? 'total' : ''}>
            {/* If row is totalRow (e.g: Total row) show original color for header */}
            <td className={`cell header ${name}`} style={totalRow ? originalColor : background}>
                {iconDiv}
            </td>
            {/* If row is readOnly , use <span> */}
            {data.map((point, playerIndex) => readOnly ? (
                <td className='cell' key={`point-${playerIndex}-${[pointIndex]}`}
                    style={parseInt(playerIndex) % 2 === 0 ? veryFadedBg : fadedBg}>
                    <span>{`${point}`}</span>
                </td>
            ) : (
                    <td className='cell' key={`point-${playerIndex}-${[pointIndex]}`}
                        style={parseInt(playerIndex) % 2 === 0 ? veryFadedBg : fadedBg}>
                        <input type='text' value={point} onChange={(event) => handlePointChange(event, playerIndex, pointIndex)}
                            onKeyPress={(event) => filterInput(event)} />
                    </td>
                ))
            }
        </tr >

    )
}

export default Row;
