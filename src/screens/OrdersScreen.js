import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Row,
  Tab,
  Tabs,
} from 'react-bootstrap';
import { db } from '../components/firebase';
import moment from 'moment';
import { useHistory } from 'react-router';

const tabs = [
  { title: 'PENDING' },
  { title: 'CONFIRM' },
  { title: 'DISPATCH' },
  { title: 'CANCELLED' },
  { title: 'DELIVERED' },
];

const ProfileScreen = ({ history }) => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState('');
  const [loader, setLoader] = useState(true);
  const [key, setKey] = useState('PENDING');
  const userInfo = useSelector((state) => state.userInfo);

  const isAdmin = userInfo?.uid === 'Tj1Fu400buSxKyvsl32ES2nya003';

  useEffect(() => {
    if (isAdmin) {
      db.collection('orders')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setOrders(
            snapshot.docs.map((doc) => ({
              order_id: doc.id,
              order: doc.data(),
            }))
          );
          setLoader(false);
        });
    } else {
      history.push('/');
    }
  }, [dispatch, isAdmin, history]);

  // console.log(orders);
  return (
    <Row>
      <Col className='mt-3'>
        {/* <h3>Orders </h3> */}
        <Tabs
          id='controlled-tab-example'
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className='justify-content-between'
        >
          {!loader &&
            tabs.map((tab, i) => {
              return (
                <Tab key={i} eventKey={tab.title} title={tab.title}>
                  {orders &&
                    orders.length > 0 &&
                    orders.map((val, i) => {
                      return (
                        <ListGroup key={i} variant='flush'>
                          <Order
                            order_id={val.order_id}
                            order={val.order}
                            filterByStatus={tab.title}
                            show
                            isAdmin
                          />
                        </ListGroup>
                      );
                    })}
                </Tab>
              );
            })}
        </Tabs>

        {loader && 'Loading'}
      </Col>
    </Row>
  );
};

export default ProfileScreen;

function Order({ order, order_id, filterByStatus }) {
  // console.log(order);
  const history = useHistory();

  const handleUpdate = (order) => {
    history.push(`/admin/createorder/edit/${order_id}`);
  };

  const handleDelete = (order) => {
    // console.log(order);
    if (window.confirm('Are You Sure ?')) {
      db.collection('orders')
        .doc(order_id)
        .delete()
        .then(function () {
          alert('Order Deleted Successfully');
        })
        .catch(function (error) {
          alert('Error: ', error.message);
        });
    }
  };

  return order.status === filterByStatus ? (
    <Card className='rounded my-3' text='white'>
      <Card.Header
        className='py-3 d-flex justify-content-between align-items-center'
        as='h5'
      >
        Order by {order.username}
        <Card.Subtitle className='mt-1'>
          {moment.unix(order?.timestamp?.seconds).format('MMMM Do YYYY, h:mma')}
        </Card.Subtitle>
        {/* </span> */}
      </Card.Header>

      {/* <LinkContainer to={`/order/${id}`} style={{ height: '250px' }}> */}
      <Card.Img variant='top' src={order.imageUrl} className='px-1 ' />
      {/* </LinkContainer> */}

      <Card.Body className='my-n1'>
        {/* Details */}
        <Row className='p-2 bb-2 d-flex  align-items-center'>
          <Card.Subtitle style={{ color: 'yellow' }} className='mr-4 '>
            Customer Name:
          </Card.Subtitle>
          <Card.Subtitle>{order.name}</Card.Subtitle>
        </Row>

        <Row className='p-2 d-flex  align-items-center'>
          <Card.Subtitle style={{ color: 'yellow' }} className='mr-4 '>
            Customer Number:
          </Card.Subtitle>
          <Card.Subtitle>{order.number}</Card.Subtitle>
        </Row>

        <Row className='p-2 d-flex  align-items-center'>
          <Card.Subtitle style={{ color: 'yellow' }} className='mr-4 '>
            Status:
          </Card.Subtitle>
          <Card.Subtitle>{order.status}</Card.Subtitle>
        </Row>

        <Row className='p-2 d-flex  align-items-center'>
          <Card.Subtitle style={{ color: 'yellow' }} className='mr-4 '>
            Medicines:
          </Card.Subtitle>
          <Card.Subtitle>{order?.medicine}</Card.Subtitle>
        </Row>

        <Row className='p-2 d-flex  align-items-center'>
          <Card.Subtitle style={{ color: 'yellow' }} className='mr-4 '>
            Amount:
          </Card.Subtitle>
          <Card.Subtitle>{order.amount}</Card.Subtitle>
        </Row>
        <Row className='p-2 d-flex  align-items-center'>
          <Card.Subtitle style={{ color: 'yellow' }} className='mr-4 '>
            Address:
          </Card.Subtitle>
          <Card.Subtitle>{order.address}</Card.Subtitle>
        </Row>
      </Card.Body>
      <hr />
      {/* <Form
        // onSubmit={commentHandler}
      > */}
      <Form.Group
        controlId='comment'
        className='d-flex justify-content-evenly align-items-center'
      >
        <Button
          type='submit'
          variant='dark'
          className=' rounded w-50 mx-2'
          onClick={() => handleUpdate(order)}
        >
          Update
        </Button>

        <Button
          type='submit'
          variant='dark'
          className=' rounded w-50 mx-2'
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Form.Group>
      {/* </Form> */}
    </Card>
  ) : null;
}
