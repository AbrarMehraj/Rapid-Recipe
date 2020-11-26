import React, { useEffect, useState } from 'react';
import { Button, Col, Image, ListGroup, Row, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { db } from '../components/firebase';
import moment from 'moment';

const PostScreen = ({ match }) => {
  const postId = match.params.id;
  const [post, setPost] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [key, setKey] = useState('home');

  // console.log(comments);
  // console.log(likes);
  // console.log(post);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection('posts')
        .doc(postId)
        .onSnapshot((snapshot) => {
          setPost(snapshot.data());
        });
    }

    if (postId) {
      db.collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              comment: doc.data(),
            }))
          );
        });
    }

    if (postId) {
      db.collection('posts')
        .doc(postId)
        .collection('likes')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setLikes(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);
  return (
    <>
      <Link to='/'>
        <Button variant='dark'>Go Back</Button>
      </Link>
      {/* <Card> */}
      <Row className='mt-3' style={{ color: 'white' }}>
        <Col md={5}>
          <Image src={post.imageUrl} alt={post.title} fluid />
        </Col>
        <Col md={7}>
          <ListGroup>
            <ListGroup.Item>
              <strong className='mr-2'>Author:</strong>
              {post.username}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong className='mr-2'>Post At:</strong>
              {moment
                .unix(post?.timestamp?.seconds)
                .format('MMMM Do YYYY, h:mma')}
            </ListGroup.Item>

            <ListGroup.Item>
              <strong className='mr-2'>Dish</strong>
              {post.title}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong className='mr-2'>Category:</strong>
              {post.type}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong className='mr-2'>Likes:</strong>
              {likes.length}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong className='mr-2'>Comments:</strong>
              {comments.length}
            </ListGroup.Item>
          </ListGroup>

          <Tabs
            id='controlled-tab-example'
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className='justify-content-between'
          >
            <Tab eventKey='home' title='Procedure'>
              <ListGroup.Item>{post.description}</ListGroup.Item>
            </Tab>
            <Tab eventKey='comment' title='Comments '>
              {comments.length === 0 ? (
                <ListGroup.Item>No Comments Yet</ListGroup.Item>
              ) : (
                <ListGroup>
                  {comments.map(({ comment, id }) => {
                    return (
                      <ListGroup.Item key={id}>
                        <strong>
                          {comment.username}
                          <i className='fas fa-arrow-right mx-2'></i>
                        </strong>
                        {comment.text}
                        <p>
                          {moment
                            .unix(post?.timestamp?.seconds)
                            .format('MMMM Do YYYY, h:mma')}
                        </p>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </Tab>
            <Tab eventKey='likes' title='Comment Here'>
              <input type='text' />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </>
  );
};

export default PostScreen;
