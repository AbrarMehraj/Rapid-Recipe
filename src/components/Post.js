import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { Button, Card, Col, Form, ListGroup, Row } from 'react-bootstrap';
// eslint-disable-next-line no-unused-vars
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { db } from './firebase';
import firebase from 'firebase';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import moment from 'moment';

const Post = ({ post, id }) => {
  const history = useHistory();
  const userInfo = useSelector((state) => state.userInfo);

  const imageRef = useRef();

  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const found = likes.find((el) => el.uuid === userInfo?.uid);

  // console.log(comments);
  useEffect(() => {
    let likesUnsubscribe;
    if (id) {
      likesUnsubscribe = db
        .collection('posts')
        .doc(id)
        .collection('likes')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setLikes(snapshot.docs.map((doc) => doc.data()));
        });
    }

    let commentsUnsubscribe;
    if (id) {
      commentsUnsubscribe = db
        .collection('posts')
        .doc(id)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      likesUnsubscribe();
      commentsUnsubscribe();
    };
  }, [id]);

  const commentHandler = (e) => {
    e.preventDefault();
    db.collection('posts').doc(id).collection('comments').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      text: commentInput,
      username: userInfo.displayName,
    });
    setCommentInput('');
  };

  const onLike = () => {
    console.log('OnLike');
    db.collection('posts').doc(id).collection('likes').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      uuid: userInfo.uid,
    });
  };

  const onUnLike = () => {
    console.log('OnUnLike');
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

  console.log(imageRef);
  // if (imageRef.current?.clientHeight > 180) {
  //   imageRef.current.clientHeight = 180;
  // }
  // console.log(imageRef.current?.clientHeight);
  return (
    <>
      <Card className='rounded my-3' text='white' ref={imageRef}>
        <Card.Header className='py-3' as='h4'>
          <Card.Title>Post by {post.username}</Card.Title>
          <Card.Subtitle>
            {moment.unix(post.timestamp.seconds).format('MMMM Do YYYY, h:mma')}
          </Card.Subtitle>
        </Card.Header>

        <LinkContainer to={`/post/${id}`}>
          <Card.Img variant='top' src={post.imageUrl} className='px-1 ' />
        </LinkContainer>

        <Card.Body>
          <Card.Title>
            Card Title:
            <Link to={`/post/${id}`}> {post.title}</Link>
          </Card.Title>
        </Card.Body>

        <ListGroup variant='flush'>
          <ListGroup.Item>
            <strong className='mr-2'>
              {comments[0]?.username}
              <i className='fas fa-arrow-right mx-2'></i>
            </strong>
            {comments[0]?.text}

            <Card.Subtitle className='mt-3'>
              {moment
                .unix(comments[0]?.timestamp?.seconds)
                .format('MMMM Do YYYY, h:mma')}
            </Card.Subtitle>
          </ListGroup.Item>

          <ListGroup.Item className='mb-n2'>
            {userInfo ? (
              <Form onSubmit={commentHandler}>
                <Form.Group
                  controlId='formBasicEmail'
                  style={{ display: 'flex' }}
                >
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
            ) : null}
          </ListGroup.Item>
        </ListGroup>

        <Row className='p-2 text-center'>
          <Col className='p-2 '>
            {renderLikeButton()} <span>{likes?.length}</span>
          </Col>
          <Col className='p-2'>
            <Link to={`/post/${id}`}>comments</Link>
          </Col>
          <Col className='p-2' onClick={onShare}>
            Share
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Post;

// import React, { useEffect, useState } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Card from '@material-ui/core/Card';
// import CardHeader from '@material-ui/core/CardHeader';
// import CardMedia from '@material-ui/core/CardMedia';
// import CardContent from '@material-ui/core/CardContent';
// import Avatar from '@material-ui/core/Avatar';
// import IconButton from '@material-ui/core/IconButton';
// import Typography from '@material-ui/core/Typography';
// import { red } from '@material-ui/core/colors';
// import FavoriteIcon from '@material-ui/icons/Favorite';
// import ShareIcon from '@material-ui/icons/Share';
// import { Button, Divider, Grid } from '@material-ui/core';
// import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
// import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
// import { DeleteOutline } from '@material-ui/icons';
// import Modal from '@material-ui/core/Modal';
// import { connect } from 'react-redux';
// import firebase from 'firebase';
// import { db } from './firebase';
// import { Link } from 'react-router-dom';

// function getModalStyle() {
//   const top = 50;
//   const left = 50;

//   return {
//     top: `${top}%`,
//     left: `${left}%`,
//     transform: `translate(-${top}%, -${left}%)`,
//   };
// }

// // Styling
// const useStyles = makeStyles((theme) => ({
//   root: {
//     // maxWidth: 345,
//     marginBottom: 15,
//   },
//   media: {
//     height: 0,
//     paddingTop: '56.25%', // 16:9
//   },
//   expand: {
//     transform: 'rotate(0deg)',
//     marginLeft: 'auto',
//     transition: theme.transitions.create('transform', {
//       duration: theme.transitions.duration.shortest,
//     }),
//   },
//   expandOpen: {
//     transform: 'rotate(180deg)',
//   },
//   avatar: {
//     backgroundColor: red[500],
//   },
//   paper: {
//     position: 'absolute',
//     minWidth: 320,
//     backgroundColor: theme.palette.background.paper,
//     border: '2px solid #000',
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(2, 4, 3),
//   },
// }));

// // Post Component

// const Post = (props) => {
//   const classes = useStyles();

//  destructure
//   const { id, post, user } = props;
//   const {
//     title,
//     // description,
//     imageUrl,
//     username,
//     userId,
//     // type,
//     // timestamp
//   } = post;

//   const [likes, setLikes] = useState([]);
//   const [getComments, setGetComments] = useState([]);
//   const [comment, setComment] = useState('');

//   // getModalStyle is not a pure function, we roll the style only on the first render
//   const [modalStyle] = React.useState(getModalStyle);
//   const [open, setOpen] = React.useState(false);

//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   // UseEffect
//   // useEffect(() => {
//   //   let likesUnsubscribe;
//   //   if (id) {
//   //     likesUnsubscribe = db
//   //       .collection('posts')
//   //       .doc(id)
//   //       .collection('likes')
//   //       .orderBy('timestamp', 'desc')
//   //       .onSnapshot((snapshot) => {
//   //         setLikes(snapshot.docs.map((doc) => doc.data()));
//   //       });
//   //   }

//   //   let commentsUnsubscribe;
//   //   if (id) {
//   //     commentsUnsubscribe = db
//   //       .collection('posts')
//   //       .doc(id)
//   //       .collection('comments')
//   //       .orderBy('timestamp', 'desc')
//   //       .onSnapshot((snapshot) => {
//   //         setGetComments(snapshot.docs.map((doc) => doc.data()));
//   //       });
//   //   }

//   //   return () => {
//   //     likesUnsubscribe();
//   //     commentsUnsubscribe();
//   //   };
//   // }, [id]);

//   // Render html
//   // const deleteModalBody = (
//   //   <div style={modalStyle} className={classes.paper}>
//   //     <h5 id='simple-modal-title'>Are you sure You wanna delete this Post ?</h5>
//   //     <Divider />
//   //     <div style={{ float: 'right', marginTop: '1rem' }}>
//   //       <Button
//   //         variant='contained'
//   //         color='primary'
//   //         style={{ marginRight: '10px' }}
//   //         onClick={() => handleClose()}
//   //       >
//   //         No
//   //       </Button>
//   //       <Button
//   //         variant='contained'
//   //         color='secondary'
//   //         onClick={() => {
//   //           alert('Post Deleted Successfully');
//   //           handleClose();
//   //         }}
//   //       >
//   //         yes
//   //       </Button>
//   //     </div>
//   //   </div>
//   // );

//   //  Render Like Button On Condition
//   const renderLikeButton = () => {
//     // const found = likes.find((el) => el.uuid === user.uid);
//     // if (user.uid === found?.uuid)
//     //   return (
//     //     <div onClick={onUnLike}>
//     //       <FavoriteIcon />
//     //     </div>
//     //   );
//     return (
//       <div>
//         <FavoriteBorderIcon />
//       </div>
//     );
//   };

//   // // comment Form
//   // const form = (
//   //   <form style={{ display: 'flex', padding: '0 3px' }}>
//   //     <input
//   //       type='text'
//   //       placeholder='Comment'
//   //       style={{ flex: '1', marginRight: '5px' }}
//   //       onChange={(e) => setComment(e.target.value)}
//   //     />
//   //     <Button
//   //       variant='contained'
//   //       color='primary'
//   //       type='submit'
//   //       onClick={(e) => postComment(e)}
//   //       disabled={!comment}
//   //     >
//   //       Post
//   //     </Button>
//   //   </form>
//   // );

//   // ############## Functionality  ###############
//   // const deleteRenderCondition = () => {
//   //   if (userId === user.uid) {
//   //     return (
//   //       <div>
//   //         <div onClick={handleOpen}>
//   //           <DeleteOutline />
//   //         </div>
//   //         <Modal
//   //           open={open}
//   //           onClose={handleClose}
//   //           aria-labelledby='simple-modal-title'
//   //           aria-describedby='simple-modal-description'
//   //         >
//   //           {deleteModalBody}
//   //         </Modal>
//   //       </div>
//   //     );
//   //   }
//   // };

//   // const postComment = (e) => {
//   //   e.preventDefault();

//   //   db.collection('posts').doc(id).collection('comments').add({
//   //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//   //     text: comment,
//   //     username: user.displayName,
//   //   });

//   //   setComment('');
//   // };

//   // const onLike = () => {
//   //   db.collection('posts').doc(id).collection('likes').add({
//   //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//   //     uuid: user.uid,
//   //   });
//   // };

//   // const onUnLike = () => {
//   //   const found = likes.find((like) => like.uuid === user.uid);
//   //   if (found?.uuid) {
//   //     db.collection('posts')
//   //       .doc(id)
//   //       .collection('likes')
//   //       .where('uuid', '==', user.uid)
//   //       .get()
//   //       .then((querySnapshot) => {
//   //         querySnapshot.docs.map((doc) => {
//   //           return doc.ref.delete();
//   //         });
//   //       });
//   //   }
//   // };

//   return (
//     <Card className={classes.root}>
//       <CardHeader
//         avatar={
//           <Avatar
//             aria-label='recipe'
//             className={classes.avatar}
//             // Change src later
//             src='dff'
//             alt={username}
//           />
//         }
//         action={<IconButton aria-label='settings'></IconButton>}
//         title={username}
//         subheader='Sep 20 2020'
//       />

//       <Divider />

//       <Link to={`/post/${id}`}>
//         <CardMedia
//           className={classes.media}
//           image={imageUrl}
//           title='failed to load'
//         />
//       </Link>
//       <Divider />

//       <CardContent>
//         <Typography variant='body2' color='textSecondary' component='p'>
//           <strong>Title:</strong> <Link to={`/post/${id}`}>{title}</Link>
//         </Typography>
//       </CardContent>

//       <Divider />
//       <div style={{ margin: '10px 0', marginLeft: '4px' }}>
//         <strong>{getComments[0]?.username} </strong>
//         {getComments[0]?.text}
//       </div>

//       {/* Form Comment */}
//       {/* {form} */}

//       <Grid container justify='space-between'>
//         <Grid item>
//           <IconButton aria-label='add to favorites'>
//             {renderLikeButton()}
//             <p style={{ fontSize: '1rem', marginBottom: '4px' }}>
//               {likes.length}
//             </p>
//           </IconButton>
//         </Grid>
//         <Grid item>
//           <IconButton aria-label='add to comments'>
//             <ChatBubbleIcon />
//           </IconButton>
//         </Grid>
//         <Grid item>
//           <IconButton aria-label='share'>
//             <ShareIcon />
//           </IconButton>
//         </Grid>
//       </Grid>
//     </Card>
//   );
// };

// export default Post;
