import React from 'react';
import ReactDOM from 'react-dom';
import ScoreSheet from './ScoreSheet';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ScoreSheet />, div);
    ReactDOM.unmountComponentAtNode(div);
});
