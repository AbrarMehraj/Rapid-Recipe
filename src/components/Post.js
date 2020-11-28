import React, { useState } from 'react';
import { useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  ListGroup,
  Row,
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { db } from './firebase';
import firebase from 'firebase';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import moment from 'moment';

const Post = ({ post, id, show, isAdmin }) => {
  const history = useHistory();
  const userInfo = useSelector((state) => state.userInfo);

  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');

  const found = likes.find((el) => el.uuid === userInfo?.uid);

  useEffect(() => {
    db.collection('posts')
      .doc(id)
      .collection('likes')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setLikes(snapshot.docs.map((doc) => doc.data()));
      });

    db.collection('posts')
      .doc(id)
      .collection('comments')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
      });
  }, [id]);

  const renderDelete = () => {
    const { userId } = post;
    if (userInfo || isAdmin)
      if (userInfo.uid === userId || isAdmin) {
        return (
          <Dropdown>
            <Dropdown.Toggle
              variant='dark'
              id='dropdown-basic'
            ></Dropdown.Toggle>

            <Dropdown.Menu>
              {/* <Dropdown.Item className='p-3'></Dropdown.Item> */}
              <Dropdown.Item className='p-3' onClick={onDeletePost}>
                <i className='fa fa-trash'></i>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    return null;
  };

  const onDeletePost = () => {
    const { userId } = post;
    if (window.confirm('Are You Sure ?'))
      if (userInfo.uid === userId || isAdmin) {
        db.collection('posts')
          .doc(id)
          .delete()
          .then(function () {})
          .catch(function (error) {
            alert('Error: ', error.message);
          });
      }

    //  deleting the post will delete the collection of likes and comments or not?
  };

  const commentHandler = (e) => {
    e.preventDefault();
    if (userInfo) {
      db.collection('posts').doc(id).collection('comments').add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        text: commentInput,
        username: userInfo.displayName,
      });
      setCommentInput('');
    } else {
      history.push('/login');
    }
  };

  const onLike = () => {
    db.collection('posts').doc(id).collection('likes').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      uuid: userInfo.uid,
    });
  };

  const onUnLike = () => {
    if (found?.uuid) {
      db.collection('posts')
        .doc(id)
        .collection('likes')
        .where('uuid', '==', userInfo.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.map((doc) => {
            return doc.ref.delete();
          });
        });
    }
  };

  const renderLikeButton = () => {
    if (!userInfo) {
      return (
        <span onClick={() => history.push('/login')}>
          <FavoriteBorderIcon />
        </span>
      );
    } else if (userInfo?.uid === found?.uuid) {
      return (
        <span onClick={onUnLike}>
          <FavoriteIcon />
        </span>
      );
    } else {
      return (
        <span onClick={onLike}>
          <FavoriteBorderIcon />
        </span>
      );
    }
  };

  const onShare = () => {
    // const title = title;
    const url = `${window.document.location.href}post/${id}`;
    if (navigator.share) {
      navigator
        .share({
          // title: title,
          url: url,
        })
        .then(() => {
          console.log('Thanks for sharing!');
        })
        .catch(console.error);
    } else {
      // console.log("title");
    }
  };

  return (
    <>
      <Card className='rounded my-3' text='white'>
        <Card.Header className='py-3 d-flex justify-content-between' as='h4'>
          <span>
            <Card.Title>Post by {post.username}</Card.Title>
            <Card.Subtitle>
              {moment
                .unix(post?.timestamp?.seconds)
                .format('MMMM Do YYYY, h:mma')}
            </Card.Subtitle>
          </span>

          {/* This show will be send from profile to show this */}
          {show && renderDelete()}
        </Card.Header>

        <LinkContainer to={`/post/${id}`} style={{ height: '250px' }}>
          <Card.Img variant='top' src={post.imageUrl} className='px-1 ' />
        </LinkContainer>

        <Card.Body className='my-n1'>
          <Card.Title>
            Recipe:
            <Link to={`/post/${id}`} className='ml-2'>
              {post.title}
            </Link>
          </Card.Title>
        </Card.Body>

        <ListGroup variant='flush'>
          {comments[0] ? (
            <ListGroup.Item>
              <strong className='mr-2'>
                {comments[0]?.username}
                <i className='fas fa-arrow-right mx-2'></i>
              </strong>
              {comments[0]?.text}

              <Card.Subtitle className='mt-1'>
                {moment
                  .unix(comments[0]?.timestamp?.seconds)
                  .format('MMMM Do YYYY, h:mma')}
              </Card.Subtitle>
            </ListGroup.Item>
          ) : (
            <ListGroup.Item>No Comments Yet</ListGroup.Item>
          )}

          <ListGroup.Item className='mb-n3'>
            {/* {userInfo ? ( */}
            <Form onSubmit={commentHandler}>
              <Form.Group controlId='comment' style={{ display: 'flex' }}>
                <Form.Control
                  type='text'
                  placeholder='Enter Comment'
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />
                <Button
                  type='submit'
                  variant='dark'
                  className='ml-2 rounded'
                  disabled={!commentInput}
                >
                  Post
                </Button>
              </Form.Group>
            </Form>
          </ListGroup.Item>
        </ListGroup>

        <Row className='p-2  text-center'>
          <Col className='p-2 '>
            {renderLikeButton()} <span>{likes?.length}</span>
          </Col>
          <Col className='p-2'>
            <Link to={`/post/${id}`} style={{ color: 'white' }}>
              <i className='fa fa-comments'></i>
            </Link>
          </Col>
          <Col className='p-2' onClick={onShare}>
            <i className='fa fa-paper-plane'></i>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Post;
