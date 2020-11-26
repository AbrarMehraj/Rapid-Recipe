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

  //   Filtering My Post
  const myPosts = posts.filter((post) => post.post.userId === userInfo.uid);

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

        // eslint-disable-next-line no-lone-blocks
        {
          myPosts.map(({ postId }) => {
            return db.collection('posts').doc(postId).update({
              username: userInfo.displayName,
            });
          });
        }
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
      </Col>
      <Col md={9} className='mt-3'>
        <h3>My Posts </h3>
        {myPosts.length === 0 ? (
          <span>You have not upload any post yet feel free to upload</span>
        ) : (
          <>
            {myPosts.map(({ postId, post }) => {
              return (
                <ListGroup key={postId} variant='flush'>
                  <Post id={postId} post={post} />
                </ListGroup>
              );
            })}
          </>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
