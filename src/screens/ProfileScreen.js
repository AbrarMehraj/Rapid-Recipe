import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';
// import { updateUserProfile } from '../actions/userActions';
// import { getMyOrders } from '../actions/orderActions';
import Message from '../components/Message';
import { db } from '../components/firebase';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
// import Loader from '../components/Loader';
// import { LinkContainer } from 'react-router-bootstrap';
import moment from 'moment';
import Post from '../components/Post';
import firebase from 'firebase';

const ProfileScreen = ({ history }) => {
  //   const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [posts, setPosts] = useState([]);
  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [success, setSuccess] = useState('');

  //   console.log(userInfo.providerData);
  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.displayName);
      setEmail(userInfo.email);

      db.collection('posts')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setPosts(
            snapshot.docs.map((doc) => ({
              postId: doc.id,
              post: doc.data(),
            }))
          );
        });
    } else {
      history.push('/');
    }
  }, [userInfo, history]);

  const myPosts = posts.filter((post) => post.post.userId === userInfo.uid);
  console.log(myPosts);

  const onEmailSubmit = (e) => {
    e.preventDefault();
    userInfo
      .updateEmail(email)
      .then(function () {
        // Update successful.
        // alert('update email');
        setEditEmail(false);
        setSuccess('Email Updated');
      })
      .catch(function (error) {
        // An error happened.
        alert(error.message);
      });
  };

  const onUsernameSubmit = (e) => {
    e.preventDefault();
    userInfo
      .updateProfile({
        displayName: username,
        // photoURL: 'https://avatars3.githubusercontent.com/u/59432873?s=48&v=4',
      })
      .then(function () {
        setEditUsername(false);
        setSuccess('Username Updated');
      })
      .catch(function (error) {
        alert(error.message);
      });
  };

  return (
    <Row>
      <Col md={3}>
        <h2>Profile</h2>
        {success && <Message variant='success'>{success}</Message>}
        <ListGroup>
          <ListGroup.Item>
            Username : {userInfo.displayName}
            <span
              className='float-right'
              onClick={() => setEditUsername(!editUsername)}
            >
              <i className='fas fa-edit'></i>
            </span>
            {editUsername ? (
              <Form onSubmit={onUsernameSubmit} className='mt-2'>
                <Form.Group controlId='username'>
                  <Form.Control
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Button type='submit' variant='dark' className='dark'>
                  Update
                </Button>
              </Form>
            ) : null}
          </ListGroup.Item>

          <ListGroup.Item>
            Email : {userInfo.email}
            <span
              className='float-right'
              onClick={() => setEditEmail(!editEmail)}
            >
              <i className='fas fa-edit'></i>
            </span>
            {editEmail ? (
              <Form onSubmit={onEmailSubmit} className='mt-2'>
                <Form.Group controlId='email'>
                  <Form.Control
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Button type='submit' variant='dark' className='dark'>
                  Update
                </Button>
              </Form>
            ) : null}
          </ListGroup.Item>
        </ListGroup>
        {/* <img src={userInfo.photoURL} alt='' /> */}
        {/* {error && <Message variant='danger'>{error}</Message>} */}
        {/* {message ? <Message variant='danger'>{message}</Message> : null} */}
        {/* {!loading && updated ? ( */}
        {/* <Message variant='success'>Profile Updated</Message>) : null} */}
        {/* <Form onSubmit={submitHandler}>
          <Form.Group controlId='username'>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type='username'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='user@gmail.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Updating...
            </Button>
          ) : ( */}
        {/* )} */}
        {/* <Button type='submit' variant='dark' className='rounded'> */}
        {/* Update */}
        {/* </Button> */}
        {/* </Form> */}
      </Col>
      <Col md={9} className='mt-3'>
        <h3>My Posts </h3>
        {myPosts.length === 0 ? (
          <span>You have not upload any post yet feel free to upload</span>
        ) : (
          <>
            {myPosts.map(({ postId, post }) => {
              return <Post id={postId} post={post} />;
            })}
          </>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
