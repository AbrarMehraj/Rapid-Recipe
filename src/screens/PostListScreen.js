import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { db } from '../components/firebase';
import Post from '../components/Post';
import { getPostList } from '../actions';

const ProfileScreen = ({ history }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  const { posts } = useSelector((state) => state.postList);

  const isAdmin = userInfo?.uid === 'Tj1Fu400buSxKyvsl32ES2nya003';

  useEffect(() => {
    if (isAdmin) {
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
    } else {
      history.push('/');
    }
  }, [dispatch, isAdmin, history]);

  return (
    <Row>
      <Col className='mt-3'>
        <h3>Posts </h3>
        {posts?.length === 0 ? (
          <span>No Posts</span>
        ) : (
          <>
            {posts?.map(({ postId, post }) => {
              return (
                <ListGroup key={postId} variant='flush'>
                  <Post id={postId} post={post} show isAdmin />
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
