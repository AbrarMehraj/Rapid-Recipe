import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { db, storage } from './firebase';
import firebase from 'firebase';
import { LinearProgress } from '@material-ui/core';

const Upload = () => {
  const history = useHistory();
  const [modalShow, setModalShow] = useState(false);
  const userInfo = useSelector((state) => state.userInfo);

  const handleUpload = () => {
    if (userInfo) {
      setModalShow(true);
    } else {
      history.push('/login');
    }
  };

  return (
    <div>
      <Button variant='dark' onClick={handleUpload}>
        <i className='fa fa-plus'></i>
      </Button>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
};

export default Upload;

function MyVerticallyCenteredModal(props) {
  const [category, setCategory] = useState('Veg');
  const [dishName, setDishName] = useState('');
  const [procedure, setProcedure] = useState('');
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);

  const userInfo = useSelector((state) => state.userInfo);

  const imageChange = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleUpload = (e) => {
    e.preventDefault();

    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // Error Function
        console.log(error);
        alert(error.message);
      },
      () => {
        //  Complete function
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            //    put image inside the db
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              title: dishName,
              description: procedure,
              imageUrl: url,
              username: userInfo.displayName,
              userId: userInfo.uid,
              type: category,
            });

            setProgress(0);
            setDishName('');
            setImage(null);
            setProcedure('');
            setCategory('');
          })
          .then(() => {
            props.onHide();
          });
      }
    );
  };

  return (
    <Modal {...props} aria-labelledby='contained-modal-title-vcenter' centered>
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>Upload</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpload}>
          <LinearProgress
            variant='buffer'
            className='mb-4'
            value={progress}
            color='primary'
            valueBuffer={progress}
          />

          <Form.Group controlId='dishName'>
            <Form.Label>Dish Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter Dish Name'
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId='selectCategory'>
            <Form.Label>Select Category</Form.Label>
            <Form.Control
              as='select'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Veg</option>
              <option>Non-Veg</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='Procedure'>
            <Form.Label>Procedure</Form.Label>
            <Form.Control
              as='textarea'
              rows={5}
              placeholder='Enter Your Procedure'
              value={procedure}
              onChange={(e) => setProcedure(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.File id='image' required onChange={imageChange} />
          </Form.Group>

          <Button type='submit' variant='dark' className='rounded'>
            Upload
          </Button>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={props.onHide} variant='dark'>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// // 184566540;
// // 361444267;
