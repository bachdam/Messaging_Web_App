import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <Navbar className="mb-4 bar" style={{ height: "3.5rem" }}>
      <Container>
        <h2>
          <Link to="/" className="link-light text-decoration-none chat-home">
            ChatApp
          </Link>
        </h2>
        <span style={{ color: "yellow" }}>Hi there</span>
        <Nav>
          <Stack direction="horizontal" gap={4}>
            <Link to="/login" className="link-light text-decoration-none">
              Login
            </Link>
            <Link to="/register" className="link-light text-decoration-none">
              Register
            </Link>
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
