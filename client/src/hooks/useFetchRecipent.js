import { useEffect, useState } from "react";
import { getRequest } from "../utils/services";
import { baseURL } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  //fin the id of the user members that is not = to the user on line 3
  const recipientId = chat?.members.find((id) => id !== user?._id);

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return null;
      const response = await getRequest(`${baseURL}/users/find/${recipientId}`);
      if (response.error) {
        return setError(error);
      }

      setRecipientUser(response);
    };

    getUser();
  }, [recipientId]);

  return { recipientUser };
};
