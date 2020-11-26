import React from 'react';

const PostScreen = ({ match }) => {
  return (
    <div>
      Post Screen
      {match.params.id}
    </div>
  );
};

export default PostScreen;
