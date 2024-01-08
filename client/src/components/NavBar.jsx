import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  //get the user infor
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <Navbar className="mb-4 bar" style={{ height: "3.5rem" }}>
      <Container>
        <h2>
          <Link to="/" className="link-light text-decoration-none chat-home">
            ChatApp
          </Link>
        </h2>
        {/* get the user's name if already loged in and display it */}
        {user && <span style={{ color: "yellow" }}>Hi {user?.name}</span>}
        <Nav>
          <Stack direction="horizontal" gap={4}>
            {user && (
              <>
                <Link
                  onClick={() => logoutUser()}
                  to="/login"
                  className="link-light text-decoration-none"
                >
                  Logout
                </Link>
              </>
            )}
            {!user && (
              <>
                <Link to="/login" className="link-light text-decoration-none">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="link-light text-decoration-none"
                >
                  Register
                </Link>
              </>
            )}
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
