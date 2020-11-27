import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import Post from '../components/Post';
import { db } from '../components/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { getPostList } from '../actions';
import Loader from '../components/Loader';
import Slider from '../components/Slider';
import Upload from '../components/Upload';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.postList);
  const query = useSelector((state) => state.query);

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

  const displayOnSearch = posts?.filter(({ post }) =>
    post.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {!posts ? (
        <Loader />
      ) : (
        <>
          <Upload />

          <h1 className='text-center'>Most Famous Dish</h1>
          <Slider />
          <Row>
            {query && displayOnSearch
              ? displayOnSearch.map(({ postId, post }) => {
                  return (
                    <Col key={postId} sm={12} md={6} lg={4} xl={3}>
                      <Post id={postId} post={post} />
                    </Col>
                  );
                })
              : posts.map(({ postId, post }) => {
                  return (
                    <Col key={postId} sm={12} md={6} lg={4} xl={3}>
                      <Post id={postId} post={post} />
                    </Col>
                  );
                })}
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
