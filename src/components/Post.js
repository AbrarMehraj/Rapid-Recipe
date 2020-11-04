import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import { Button, Divider, Grid, TextField } from "@material-ui/core";
import ChatBubbleIcon from "@material-ui/icons/ChatBubble";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { DeleteOutline } from "@material-ui/icons";
import Modal from "@material-ui/core/Modal";
import { connect } from "react-redux";
import firebase from "firebase";
import { db } from "./firebase";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

// Styling
const useStyles = makeStyles((theme) => ({
  root: {
    // maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  paper: {
    position: "absolute",
    minWidth: 320,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

// Post Component

const Post = (props) => {
  const classes = useStyles();

  // destructure
  const { id, post, user } = props;
  const {
    title,
    description,
    imageUrl,
    username,
    userId,
    type,
    timestamp,
  } = post;

  // console.log(timestamp);
  // const timeS = new Date(timestamp.seconds);
  // console.log(timeS);

  const [likes, setLikes] = useState([]);
  const [getComments, setGetComments] = useState([]);
  const [comment, setComment] = useState("");

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // UseEffect
  useEffect(() => {
    let likesUnsubscribe;
    if (id) {
      likesUnsubscribe = db
        .collection("posts")
        .doc(id)
        .collection("likes")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setLikes(snapshot.docs.map((doc) => doc.data()));
        });
    }

    let commentsUnsubscribe;
    if (id) {
      commentsUnsubscribe = db
        .collection("posts")
        .doc(id)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setGetComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      likesUnsubscribe();
      commentsUnsubscribe();
    };
  }, [id]);

  // Render html
  const deleteModal = (
    <div style={modalStyle} className={classes.paper}>
      <h5 id="simple-modal-title">Are you sure You wanna delete this Post ?</h5>
      <Divider />
      <div style={{ float: "right", marginTop: "1rem" }}>
        <Button
          variant="contained"
          color="primary"
          style={{ marginRight: "10px" }}
          onClick={() => handleClose()}
        >
          No
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            alert("Post Deleted Successfully");
            handleClose();
          }}
        >
          yes
        </Button>
      </div>
    </div>
  );

  //  Render Like Button On Condition
  const renderLikeButton = () => {
    const found = likes.find((el) => el.uuid === user.uid);
    if (user.uid === found?.uuid)
      return (
        <div onClick={onUnLike}>
          <FavoriteIcon />
        </div>
      );
    return (
      <div onClick={onLike}>
        <FavoriteBorderIcon />
      </div>
    );
  };

  // comment Form
  const form = (
    <form style={{ display: "flex", padding: "0 3px" }}>
      <input
        type="text"
        placeholder="Comment"
        style={{ flex: "1", marginRight: "5px" }}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        onClick={(e) => postComment(e)}
        disabled={!comment}
      >
        Post
      </Button>
    </form>
  );

  // Functionality
  const postComment = (e) => {
    e.preventDefault();

    db.collection("posts").doc(id).collection("comments").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      text: comment,
      username: user.displayName,
    });

    setComment("");
  };

  const onLike = () => {
    db.collection("posts").doc(id).collection("likes").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      uuid: user.uid,
    });
  };

  const onUnLike = () => {
    const found = likes.find((like) => like.uuid === user.uid);
    if (found?.uuid) {
      db.collection("posts")
        .doc(id)
        .collection("likes")
        .where("uuid", "==", user.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.docs.map((doc) => {
            return doc.ref.delete();
          });
        });
    }
  };

  return (
    <Card
    // className={classes.root}
    >
      <CardHeader
        avatar={
          <Avatar
            aria-label="recipe"
            className={classes.avatar}
            // Change src later
            src="dff"
            alt={username}
          />
        }
        action={
          <IconButton aria-label="settings">
            <div onClick={handleOpen}>
              <DeleteOutline />
            </div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              {deleteModal}
            </Modal>
          </IconButton>
        }
        title={username}
        subheader="Sep 20 2020"
      />

      <Divider />

      <CardMedia
        className={classes.media}
        image={imageUrl}
        title="failed to load"
      />
      <Divider />

      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Title:</strong> {title}
        </Typography>
      </CardContent>
      <Divider />
      <div style={{ margin: "10px 0", marginLeft: "4px" }}>
        <strong>{getComments[0]?.username} </strong>
        {getComments[0]?.text}
      </div>

      {/* Form Comment */}
      {form}

      <Grid container justify="space-between">
        <Grid item>
          <IconButton aria-label="add to favorites">
            {renderLikeButton()}
            <p style={{ fontSize: "1rem", marginBottom: "4px" }}>
              {likes.length}
            </p>
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton aria-label="add to comments">
            <ChatBubbleIcon />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.User,
  };
};

export default connect(mapStateToProps)(Post);
