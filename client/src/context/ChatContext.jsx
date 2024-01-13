import { createContext, useCallback, useEffect, useState } from "react";
import { baseURL, postRequest, getRequest } from "../utils/services.js";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  console.log("onlineUsers", onlineUsers);

  //initial socket
  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    //clean up funct
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  //trigger an event for [socket]; whenever the socket changes, so we run this useEffect
  //get onlineUsers
  useEffect(() => {
    //only reigger the event when socket is not null
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    //need this to turn off the online status of the user
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  useEffect(() => {
    const getUsers = async () => {
      //this response will return an array of the user's chats
      const response = await getRequest(`${baseURL}/users`);

      if (response.error) {
        return console.log("Error fetching users", response);
      }

      //the output of this is an array: but we need to exclude oursefl
      const pChats = response.filter((u) => {
        let isChatCreated = false;
        //it exclude the curent user id
        if (user?._id === u._id) return false;

        //check if the chat is available or already created by chec
        if (userChats) {
          userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }

        //if the ischat is not create, the u will be added to pChats
        return !isChatCreated;
      });
      setPotentialChats(pChats);
    };

    getUsers();
  }, [userChats]);
  //get our users from backend apis
  useEffect(() => {
    const getUserChats = async () => {
      //if the user exists and has id
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseURL}/chats/${user?._id}`);

        setIsUserChatsLoading(false);

        if (response.error) {
          return setUserChatsError(response);
        }
        setUserChats(response);
      }
    };

    getUserChats();
  }, [user]); // get the user chat whenever the user changes

  //perform the http request to get our messages
  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      const response = await getRequest(
        `${baseURL}/messages/${currentChat?._id}`
      );

      setIsMessagesLoading(false);

      if (response.error) {
        return setMessages(response);
      }

      setMessages(response);
    };

    getMessages();
  }, [currentChat]);

  //send message
  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return console.log("Type message!");
      const response = await postRequest(
        `${baseURL}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );

      if (response.error) return setSendTextMessageError(response);

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage("");
    },
    []
  );

  //this will show the chat that the user wants to send a message
  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  //create chat when we click the small name button on top
  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseURL}/chats`,
      JSON.stringify({ firstId, secondId })
    );
    if (response.error) {
      return console.log("Error createing chat", response);
    }

    setUserChats((prev) => [...prev, response]);
  }, []);
  return (
    <ChatContext.Provider
      value={{
        userChats,
        userChatsError,
        isUserChatsLoading,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        sendTextMessage,
        onlineUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
