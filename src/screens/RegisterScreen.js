import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import { auth } from '../components/firebase';

const RegisterScreen = ({ history }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userInfo = useSelector((state) => state.userInfo);

  useEffect(() => {
    if (userInfo) {
      history.push('/');
    }
  }, [userInfo, history]);

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    if (password === confirmPassword) {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          return authUser.user.updateProfile({
            displayName: username,
          });
        })
        .then(() => history.push('/'))
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    } else {
      setMessage(`Password Doesn't Match`);
      setPassword('');
      setConfirmPassword('');
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <h1 className='text-center mb-2'>Sign Up</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {message ? <Message variant='danger'>{message}</Message> : null}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='username'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='username'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>

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

        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Registering...
          </Button>
        ) : (
          <Button type='submit' variant='dark' className='rounded'>
            Register
          </Button>
        )}
      </Form>

      <Row className='py-3 mt-3 float-right'>
        <Col>
          Have an Account?
          <Link to={'/login'}>
            <Button type='submit' variant='dark' className='rounded ml-3'>
              Login
            </Button>
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
