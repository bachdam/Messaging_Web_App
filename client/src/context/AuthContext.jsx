import { createContext, useCallback, useState } from "react";
import { postRequest, baseURL } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfor, setRegisterInfor] = useState({
    name: "",
    email: "",
    password: "",
  });

  //   this is a hook to update the register data without refreshing everytime we render
  // the infor here is the input data of the Register form
  const updateRegisterInfor = useCallback((infor) => {
    setRegisterInfor(infor);
  }, []);

  //a function to let us register a user; we need to add event "e" to prevent the auto refreshing whenever we click submit in Regiser.jsx.
  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError(null);
      const response = await postRequest(
        `${baseURL}/users/register`,
        JSON.stringify(registerInfor)
      );

      setIsRegisterLoading(false);

      if (response.error) {
        return setRegisterError(response);
      }

      //this will keep the user login whenever we refresh the page
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [registerInfor]
  );
  console.log("registerInfor", registerInfor);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfor,
        updateRegisterInfor,
        registerError,
        registerUser,
        isRegisterLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
