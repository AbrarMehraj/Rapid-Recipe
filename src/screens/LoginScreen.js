import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import { auth } from '../components/firebase';

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const userInfo = useSelector((state) => state.userInfo);

  useEffect(() => {
    if (userInfo) {
      history.push('/');
    }
  }, [userInfo, history]);

  const loginHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => history.push('/'))
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });

    e.preventDefault();
  };

  return (
    <FormContainer>
      <h1 className='mb-3 text-center'>Sign In</h1>
      {error && <Message variant='info'>{error}</Message>}
      <Form onSubmit={loginHandler}>
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
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        {loading ? (
          <Button variant='dark' disabled>
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
          <Button type='submit' variant='dark' className='rounded'>
            Sign In
          </Button>
        )}

        <Button
          onClick={() => history.push('/forgetpassword')}
          variant='dark'
          className='rounded ml-3 float-right'
        >
          Forget Password
        </Button>
      </Form>

      <Row className='py-3 mt-3 float-right'>
        <Col>
          Don't have an Account?
          <Link to='/register'>
            <Button type='submit' variant='dark' className='rounded ml-3'>
              Register
            </Button>
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
