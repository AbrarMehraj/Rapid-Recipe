import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Container,
  Form,
  InputGroup,
  Nav,
  Navbar,
  NavDropdown,
} from 'react-bootstrap';
import { auth } from './firebase';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setTerm } from '../actions';
import { useHistory } from 'react-router-dom';

const Header = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  const query = useSelector((state) => state.query);

  const isAdmin = userInfo?.uid === 'Tj1Fu400buSxKyvsl32ES2nya003';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(setUser(authUser));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => {
      // perform some cleanup actions need to look again on useEffect
      unsubscribe();
    };
  }, [dispatch]);

  console.log(userInfo);

  const logoutHandler = () => {
    auth.signOut();
    history.push('/');
  };

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>Rapid-Recipe</Navbar.Brand>
          </LinkContainer>
          <div>
            <InputGroup>
              <Form.Control
                placeholder='Search Your Recipe'
                aria-label='search'
                aria-describedby='basic-addon1'
                value={query}
                onChange={(e) => dispatch(setTerm(e.target.value))}
              />
              <InputGroup.Prepend>
                <InputGroup.Text id='basic-addon1'>
                  <i className='fas fa-search'></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
            </InputGroup>
          </div>

          <Navbar.Toggle aria-controls='navbar-nav' />
          <Navbar.Collapse id='navbar-nav'>
            <Nav className='ml-auto '>
              {userInfo ? (
                <NavDropdown title={userInfo.displayName || ''} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item className='light p-3'>
                      Profile
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item
                    onClick={logoutHandler}
                    className='light p-3'
                  >
                    Log Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <i className='fas fa-user mr-2'></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

              {userInfo && isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item className='light p-3'>
                      Users
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to='/admin/postList'>
                    <NavDropdown.Item className='light p-3'>
                      Posts
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to='/admin/orders'>
                    <NavDropdown.Item className='light p-3'>
                      Orders
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to='/admin/createorder'>
                    <NavDropdown.Item className='light p-3'>
                      Create Order
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
