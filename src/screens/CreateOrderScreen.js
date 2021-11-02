import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import firebase from 'firebase';
import { LinearProgress } from '@material-ui/core';
import { db, storage } from '../components/firebase';

const CreateOrderScreen = ({ history }) => {
  return <OrderForm />;
};

export default CreateOrderScreen;

const initialState = {
  name: '',
  number: '',
  address: '',
  medicine: '',
  amount: '',
  status: 'Pending',
};

function OrderForm(props) {
  const [values, setValues] = useState(initialState);
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const userInfo = useSelector((state) => state.userInfo);

  const imageChange = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleInputChange = (val, type) => {
    setValues({ ...values, [type]: val });
  };

  console.log({ values });

  const handleUpload = (e) => {
    e.preventDefault();
    setDisabled(true);
    const uploadTask = storage.ref(`orderImages/${image.name}`).put(image);

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
          .ref('orderImages')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            //    put image inside the db
            db.collection('orders').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              name: values.name,
              number: values.number,
              address: values.address,
              medicine: values.medicine,
              amount: values.amount,
              status: values.status,
              imageUrl: url,
              username: userInfo.displayName,
              userId: userInfo.uid,
            });

            setProgress(0);
            setImage(null);
            setValues(initialState);
            setDisabled(false);
          })
          .then(() => {
            // props.onHide();
            alert('Order Created Successfully');
          });
      }
    );
  };

  return (
    <div>
      <Form onSubmit={handleUpload}>
        <Form.Label>Indicator</Form.Label>
        <LinearProgress
          variant='buffer'
          className='my-2'
          value={progress}
          color='primary'
          valueBuffer={progress}
        />

        <Form.Group controlId='name'>
          <Form.Label>Customer Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Customer Name'
            value={values.name}
            onChange={(e) => handleInputChange(e.target.value, 'name')}
            required
          />
        </Form.Group>

        <Form.Group controlId='number'>
          <Form.Label>Customer Number</Form.Label>
          <Form.Control
            type='number'
            placeholder='Customer Number'
            value={values.number}
            onChange={(e) => handleInputChange(e.target.value, 'number')}
            required
          />
        </Form.Group>

        <Form.Group controlId='Status'>
          <Form.Label>Status</Form.Label>
          <Form.Control
            as='select'
            value={values.status}
            onChange={(e) => handleInputChange(e.target.value, 'status')}
          >
            <option>Pending</option>
            <option>Confirm</option>
            <option>Dispatch</option>
            <option>Cancelled</option>
            <option>Delivered</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId='amount'>
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type='number'
            placeholder='Amount'
            name='amount'
            value={values.amount}
            onChange={(e) => handleInputChange(e.target.value, 'amount')}
            required
          />
        </Form.Group>

        <Form.Group controlId='Address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            as='textarea'
            rows={5}
            placeholder='Enter Your Address'
            value={values.address}
            onChange={(e) => handleInputChange(e.target.value, 'address')}
            // required
          />
        </Form.Group>

        <Form.Group controlId='Medicines'>
          <Form.Label>Medicines</Form.Label>
          <Form.Control
            as='textarea'
            rows={5}
            placeholder='Enter Your Medicines'
            value={values.medicine}
            onChange={(e) => handleInputChange(e.target.value, 'medicine')}
            name='medicine'
            // required
          />
        </Form.Group>

        <Form.Group>
          <Form.File id='image' required onChange={imageChange} />
        </Form.Group>

        <Button
          type='submit'
          variant='dark'
          className='rounded  mb-4'
          style={{ width: '100%' }}
          disabled={disabled}
        >
          Upload
        </Button>
      </Form>
    </div>
  );
}
