/** @format */

import React from 'react';
import Menu from '@material-ui/core/Menu';
import Radio from '@material-ui/core/Radio';
import { Button } from 'react-bootstrap';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { useDispatch } from 'react-redux';
import { QUERY_RESET } from '../types/Types';

export default function Filter({ getType }) {
  const dispatch = useDispatch();
  const [value, setValue] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onSubmit = () => {
    setAnchorEl(null);
    getType(value);
    setValue('');
    dispatch({ type: QUERY_RESET });
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant='dark'
        className='rounded float-right mr-3'
      >
        <i className='fa fa-tasks' aria-hidden='true'></i>
      </Button>

      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <FormControl component='fieldset'>
          <RadioGroup
            aria-label='type'
            name='type'
            value={value}
            onChange={handleChange}
            style={{ display: 'inline-block', padding: '4px 15px' }}
          >
            <FormControlLabel value='Veg' control={<Radio />} label='Veg' />
            <FormControlLabel
              value='Non-Veg'
              control={<Radio />}
              label='Non-Veg'
            />
          </RadioGroup>
        </FormControl>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant='dark' onClick={onSubmit}>
            Apply
          </Button>
        </div>
      </Menu>
    </>
  );
}
