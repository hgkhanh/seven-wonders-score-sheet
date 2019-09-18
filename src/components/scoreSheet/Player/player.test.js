import React from 'react';
import { shallow } from 'enzyme';
import Player from './Player';
import Header from '../../../config/header';

describe('Players component test', () => {
    it('renders correctly with normal props', () => {
        const index = 1,
            name = 'John',
            score = [5,7,2,10,0,6,11,0,0,0];
        
        shallow(<Player header={Header} index={index} name={name}
            score={score}/>);
    });
});
