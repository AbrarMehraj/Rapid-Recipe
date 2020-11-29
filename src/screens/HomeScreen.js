import React, { useEffect, useState } from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import Post from '../components/Post';
import { db } from '../components/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { getPostList } from '../actions';
import Loader from '../components/Loader';
import Slider from '../components/Slider';
import Upload from '../components/Upload';
import Filter from '../components/Filter';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.query);
  const { posts } = useSelector((state) => state.postList);
  const [type, setType] = useState('');

  const getType = (value) => {
    setType(value);
  };

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

  const filtered = posts?.filter(({ post }) => post.type === type);

  const renderOnCondition = () => {
    if (query && displayOnSearch) {
      return displayOnSearch.map(({ postId, post }) => {
        return (
          <Col key={postId} sm={12} md={6} lg={4} xl={3}>
            <Post id={postId} post={post} />
          </Col>
        );
      });
    } else if (filtered && type) {
      return filtered.map(({ postId, post }) => {
        return (
          <Col key={postId} sm={12} md={6} lg={4} xl={3}>
            <Post id={postId} post={post} />
          </Col>
        );
      });
    } else {
      return posts.map(({ postId, post }) => {
        return (
          <Col key={postId} sm={12} md={6} lg={4} xl={3}>
            <Post id={postId} post={post} />
          </Col>
        );
      });
    }
  };

  return (
    <>
      {!posts ? (
        <Loader />
      ) : (
        <>
          <Row className='d-flex justify-content-end p-3'>
            <Filter getType={getType} />
            <Upload />
          </Row>
          {type && filtered && !query ? (
            <ListGroup.Item className='text-center' as='h5'>
              {filtered?.length}
              <span className='ml-2'>{filtered[0]?.post?.type} </span>
              Posts Are Found
            </ListGroup.Item>
          ) : query && displayOnSearch ? null : (
            <Slider />
          )}
          <Row className='justify-content-between'>{renderOnCondition()}</Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
