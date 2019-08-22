import React from 'react';
import ReactDOM from 'react-dom';
import Scoresheet from './scoresheet';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Scoresheet />, div);
    ReactDOM.unmountComponentAtNode(div);
});
