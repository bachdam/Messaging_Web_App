import { useContext, useState, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import { baseURL, getRequest } from "../utils/services";

export const useFetchLatestMessage = (chat) => {
  const { newMessage, notifications } = useContext(ChatContext);
  const [latestMessage, setLatestMessage] = useState(null);

  //get the latest message to show the preview
  useEffect(() => {
    const getMessages = async () => {
      const response = await getRequest(`${baseURL}/messages/${chat?._id}`);
      if (response.error) {
        return console.log("Error occured", error);
      }

      const lastMessage = response[response?.length - 1];

      setLatestMessage(lastMessage);
    };
    getMessages();
  }, [newMessage, notifications]);
  return { latestMessage };
};
