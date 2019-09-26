import React from 'react';
import { shallow } from 'enzyme';
import Scoresheet from './Score';

describe('Scoresheet component test', () => {
   it('renders without crashing', () => {
      shallow(<Scoresheet />);
    });
});
