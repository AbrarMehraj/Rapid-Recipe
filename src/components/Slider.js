import React from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import airpods from '../images/airpods.jpg';
// import phone from '../images/phone.jpg';
// import playstation from '../images/playstation.jpg';

const Slider = () => {
  return (
    <Carousel className='mb-4'>
      {/* <Carousel.Item interval={1500}>
        <img
          className='d-block h-50 '
          src='https://firebasestorage.googleapis.com/v0/b/rapid-13334.appspot.com/o/images%2Fwow.jpg?alt=media&token=dad9b9ba-4186-4152-aaa1-144bbdcdde55'
          alt='First slide'
        />
      </Carousel.Item> */}

      <Link to='/post/8fPpzoBzbi6xiY5gVjn4'>
        <Carousel.Item
          interval={1500}
          className='d-flex justify-content-center'
        >
          <img
            className='d-block h-50'
            src='https://firebasestorage.googleapis.com/v0/b/rapid-13334.appspot.com/o/images%2Fimage.jpg?alt=media&token=48a960b8-0583-420c-a6de-4e2702acd413'
            alt='Third slide'
          />
        </Carousel.Item>
      </Link>

      {/* <Carousel.Item>
        <img
          className='d-block h-50'
          src='https://firebasestorage.googleapis.com/v0/b/rapid-13334.appspot.com/o/images%2Fsdf.jpg?alt=media&token=f022c938-0104-40cb-ba46-58589cb03094'
          alt='Third slide'
        />
      </Carousel.Item> */}
    </Carousel>
  );
};

export default Slider;
