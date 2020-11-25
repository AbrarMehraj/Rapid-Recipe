import React from 'react';
import { Carousel } from 'react-bootstrap';
import airpods from '../images/airpods.jpg';
import phone from '../images/phone.jpg';
import playstation from '../images/playstation.jpg';

const Slider = () => {
  return (
    <Carousel className='mb-4'>
      <Carousel.Item interval={1000}>
        <img className='d-block h-50 w-100' src={airpods} alt='First slide' />
      </Carousel.Item>

      <Carousel.Item interval={500}>
        <img className='d-block h-50' src={phone} alt='Third slide' />
      </Carousel.Item>

      <Carousel.Item>
        <img className='d-block h-50' src={playstation} alt='Third slide' />
      </Carousel.Item>
    </Carousel>
  );
};

export default Slider;
