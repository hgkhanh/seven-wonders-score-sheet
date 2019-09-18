import React from 'react';
import { shallow } from 'enzyme';
import Scoresheet from './scoresheet';

describe('Scoresheet component test', () => {
   it('renders without crashing', () => {
      shallow(<Scoresheet />);
    });
});
