import React from 'react';
import { shallow } from 'enzyme';
import Start from './Start';

describe('Scoresheet component test', () => {
    it('renders without crashing', () => {
        shallow(<Start />);
    });
});
