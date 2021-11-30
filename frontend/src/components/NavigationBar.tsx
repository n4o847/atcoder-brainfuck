import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

function NavigationBar() {
  return (
    <Navbar expand="md" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          AtCoder Brainfuck
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link as={NavLink} end to="/">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} end to="/submissions">
              Recent Submissions
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
