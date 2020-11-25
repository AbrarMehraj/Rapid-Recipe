import React from 'react';

const PostScreen = ({ match }) => {
  return <div>{match.params.id}</div>;
};

export default PostScreen;
