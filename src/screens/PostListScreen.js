import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row } from 'react-bootstrap';
import { db } from '../components/firebase';
import Post from '../components/Post';
import { getPostList } from '../actions';

const ProfileScreen = ({ history }) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  const { posts } = useSelector((state) => state.postList);

  const isAdmin = userInfo?.uid === process.env.REACT_APP_IS_ADMIN;

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
            <Row>
              {posts?.map(({ postId, post }) => {
                return (
                  <Col key={postId} sm={12} md={6} lg={4} xl={3}>
                    <Post id={postId} post={post} show isAdmin />
                  </Col>
                );
              })}
            </Row>
          </>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
