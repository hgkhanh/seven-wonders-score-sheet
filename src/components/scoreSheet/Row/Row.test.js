import React from 'react';
import { shallow } from 'enzyme';
import Row from './Row';
import Header from '../../../config/header';

describe('Rows component test', () => {
    it('renders correctly with normal props', () => {
        const index = 1,
            name = 'John',
            score = [5,7,2,10,0,6,11,0,0,0];
        
        shallow(<Row header={Header} index={index} name={name}
            score={score}/>);
    });
});
