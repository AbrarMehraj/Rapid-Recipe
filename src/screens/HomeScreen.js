import React, { useEffect } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import Post from '../components/Post';
import { db } from '../components/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { getPostList } from '../actions';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.postList);

  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        dispatch(
          getPostList(
            snapshot.docs.map((doc) => ({
              postId: doc.id,
              post: doc.data(),
            }))
          )
        );
      });
  }, [dispatch]);

  if (!posts) {
    return <Spinner animation='border' />;
  }

  return (
    <>
      <h1 className='text-center'>Most Famous Dishes</h1>
      <h5 className='text-center'>Carousel</h5>
      <Row>
        {posts.map((post) => {
          return (
            <Col key={post.postId} sm={12} md={6} lg={4} xl={3}>
              <Post post={post} />
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default HomeScreen;
