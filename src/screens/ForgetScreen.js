import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Form, ListGroup, Row, Spinner } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import { auth } from '../components/firebase';

const ForgetScreen = ({ location, history }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const userInfo = useSelector((state) => state.userInfo);

  useEffect(() => {
    if (userInfo) {
      history.push('/');
    }
  }, [userInfo, history]);

  const forgetHandler = (e) => {
    setLoading(true);
    e.preventDefault();
    auth
      .sendPasswordResetEmail(email)
      .then(function () {
        // Email sent.
        alert('send');
        setSuccess('A verification email has been sent to your email');
        setEmail('');
        setLoading(false);
      })
      .catch(function (error) {
        // An error happened
        alert(error.message);
        setError(error.message);
        setLoading(false);
      });
  };
  return (
    <>
      <Link to='/login'>
        <Button type='submit' variant='dark' className=''>
          Go Back
        </Button>
      </Link>
      <FormContainer>
        <h1 className='mb-3 text-center'>Forget Password</h1>
        {success && <Message variant='info'>{success}</Message>}
        {error && <Message variant='info'>{error}</Message>}
        <Form onSubmit={forgetHandler}>
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

          {loading ? (
            <Button variant='dark' disabled>
              <Spinner
                as='span'
                animation='border'
                size='sm'
                role='status'
                aria-hidden='true'
                className='rounded '
              />
              Sending Email...
            </Button>
          ) : (
            <Button
              type='submit'
              variant='dark'
              className='rounded '
              disabled={!email}
            >
              Send Email
            </Button>
          )}
        </Form>
      </FormContainer>
    </>
  );
};

export default ForgetScreen;
