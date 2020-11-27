import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            <h5>Copyright &copy; Rapid-Recipe</h5>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
