import React, { useEffect, useState } from "react";
import { Container, Grid } from "@material-ui/core";
import Post from "./Post";
import Filter from "./Filter";
import { db } from "./firebase";
import Spinner from "./Spinner";

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubs = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // calling use State
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
    return () => {
      unsubs();
    };
  }, [setPosts]);

  return (
    <Container>
      <Grid container spacing={4} justify="center">
        <Filter />
        {posts ? <div></div> : <Spinner />}
        {posts.map(({ id, post }) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={id}>
              <Post id={id} post={post} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default PostList;
