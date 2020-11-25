import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { Link } from 'react-router-dom';
import Message from '../components/Message';

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  //   useEffect(() => {
  //     dispatch({ type: CLEAR_ERROR });
  //     if (userInfo) {
  //       history.push(redirect);
  //     }
  //   }, [history, userInfo, redirect, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    // dispatch(login(email, password));
  };

  return (
    <FormContainer>
      <h1 className='mb-3 text-center'>Sign In</h1>
      {/* {error && <Message variant='danger'>{error}</Message>} */}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='user@gmail.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        {/* {loading ? (
          <Button variant='success' disabled>
            <Spinner
              as='span'
              animation='border'
              size='sm'
              role='status'
              aria-hidden='true'
              className='mr-2'
            />
            Signing In...
          </Button>
        ) : (
        )} */}
        <Button type='submit' variant='dark' className='rounded'>
          Sign In
        </Button>
      </Form>

      <Row className='py-3 mt-3 float-right'>
        <Col>
          New Customer?
          <Link to='/register'>
            <Button type='submit' variant='primary' className='rounded ml-3'>
              Register
            </Button>
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
