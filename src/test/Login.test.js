import React from 'react';
import { shallow, mount } from 'enzyme';
import Login from '../pages/Login';
import { expect } from 'chai';
import { BrowserRouter } from 'react-router-dom';
import { Button } from '@mui/material';
import enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

enzyme.configure({ adapter: new Adapter() });

describe('Login component tests', () => {
  const wrapper = mount(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  it('should have a btn component', () => {
    //There should be only one button
    expect(wrapper.find(Button)).to.have.lengthOf(1);

    //Button should have matching text
    expect(wrapper.find(Button).render().text()).equal('Sign in now');
  });

  it('should have input for email and password', () => {
    //Email and password input field should be present
    expect(wrapper.find('input#email')).to.have.lengthOf(1);
    expect(wrapper.find('input#password')).to.have.lengthOf(1);
  });
});
