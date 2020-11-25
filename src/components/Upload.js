import React, { useState } from "react";
// import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Modal from "@material-ui/core/Modal";
import { storage, db } from "./firebase";
import firebase from "firebase";
import Select from "@material-ui/core/Select";
import LinearProgress from "@material-ui/core/LinearProgress";
import { connect } from "react-redux";
import {
  Button,
  Container,
  MenuItem,
  TextareaAutosize,
  TextField,
} from "@material-ui/core";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    // width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Upload = (props) => {
  const { user } = props;
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openSelect, setOpenSelect] = useState(false);

  // Use State HoOk
  // const history = useHistory();
  const [title, setTitle] = useState("");
  // const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(0);
  const [image, setImage] = useState(null);

  const [type, setType] = React.useState("");

  // Handle type open and close
  const selectOpen = () => {
    setOpenSelect(true);
  };
  const selectClose = () => {
    setOpenSelect(false);
  };

  const selectChange = (event) => {
    setType(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setImage(null);
    setDescription("");
    setType("");
  };

  const imageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // Now No need to worry about this check  as  i implement the isDisabled function
    if (title && description && image && type) {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progress function
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
          const buffer = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setBuffer(buffer);
        },
        (error) => {
          // Error Function
          console.log(error);
          alert(error.message);
        },
        () => {
          //  Complete function
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((url) => {
              //    put images inside the db
              db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                title: title,
                description: description,
                imageUrl: url,
                username: user.displayName,
                userId: user.uid,
                type: type,
              });

              setProgress(0);
              setBuffer(0);
              setTitle("");
              setImage(null);
              setDescription("");
              setType("");
            })
            // .then(() => history.push("/"));  set openmodal to false instead of history
            .then(() => handleClose());
        }
      );
    } else alert(`Fill all the Fields`);
  };

  const isDisabled = () => {
    if (title && description && image && type) {
      return false;
    }
    return true;
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <Container>
        <div
          style={{ minWidth: "60vw", display: "flex", flexDirection: "column" }}
        >
          <LinearProgress
            variant="buffer"
            className="margin"
            value={progress}
            color="primary"
            valueBuffer={buffer}
          />
          <TextField
            type="text"
            placeholder="Title..."
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            style={{ margin: "15px 0" }}
          />
          <TextareaAutosize
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            rowsMin={5}
            placeholder="Procedure Here..."
            style={{ paddingBottom: "10px" }}
          />

          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={openSelect}
            onClose={selectClose}
            onOpen={selectOpen}
            value={type}
            onChange={selectChange}
            style={{ margin: "10px 0" }}
          >
            <MenuItem value="Veg">Veg</MenuItem>
            <MenuItem value="Non-Veg">Non-Veg</MenuItem>
          </Select>
          <TextField type="file" onChange={imageChange} />
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "15px" }}
            disabled={isDisabled()}
            onClick={handleUpload}
          >
            upload
          </Button>
        </div>
      </Container>
    </div>
  );

  return (
    <>
      <AddCircleOutlineIcon
        style={{
          fontSize: "3rem",
        }}
        className="addIcon"
        onClick={handleOpen}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.User,
  };
};
export default connect(mapStateToProps)(Upload);

// 184566540;
// 361444267;
