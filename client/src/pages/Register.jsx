import { useContext } from "react";
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  //   this is to test the data was passed from the AuthContext: const { user } = useContext(AuthContext);
  const {
    registerInfor,
    updateRegisterInfor,
    registerUser,
    registerError,
    isRegisterLoading,
  } = useContext(AuthContext);
  return (
    <>
      <Form onSubmit={registerUser}>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Register</h2>
              {/* this is to test the data was passed from the AuthContext <h2>{user.name}</h2> */}
              <Form.Control
                type="text"
                placeholder="Name"
                onChange={(e) =>
                  updateRegisterInfor({
                    ...registerInfor,
                    name: e.target.value,
                  })
                }
              />
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={(e) => {
                  updateRegisterInfor({
                    ...registerInfor,
                    email: e.target.value,
                  });
                }}
              />
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  updateRegisterInfor({
                    ...registerInfor,
                    password: e.target.value,
                  });
                }}
              />
              <Button variant="secondary" type="submit" className="buttons">
                {isRegisterLoading ? "Creating your account..." : "Register!"}
              </Button>
              {registerError?.error && (
                <Alert variant="danger">
                  <p>{registerError?.message}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Register;
