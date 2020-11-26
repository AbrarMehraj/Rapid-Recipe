import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap';
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

const ProfileScreen = ({ history }) => {
  //   const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [posts, setPosts] = useState([]);

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

  //   const [password, setPassword] = useState('');
  //   const [updated, setUpdated] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    // DISPATCH update Profile
    //   dispatch(updateUserProfile({ id: userInfo._id, name, email, password }));
  };

  return (
    <Row>
      <Col md={3}>
        <h2>Profile</h2>
        {/* {error && <Message variant='danger'>{error}</Message>} */}
        {/* {message ? <Message variant='danger'>{message}</Message> : null} */}
        {/* {!loading && updated ? ( */}
        {/* <Message variant='success'>Profile Updated</Message>) : null} */}
        <Form onSubmit={submitHandler}>
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
          <Button type='submit' variant='dark' className='rounded'>
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9} className='mt-3'>
        <h3>My Posts </h3>
        {myPosts.map(({ postId, post }) => {
          return <Post id={postId} post={post} />;
        })}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
