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
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  console.log("notifications", notifications);

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
    socket.on("getUsers", (res) => {
      setOnlineUsers(res);
    });

    //need this to turn off the online status of the user
    return () => {
      socket.off("getUsers");
    };
  }, [socket]);

  //send message
  useEffect(() => {
    //only reigger the event when socket is not null
    if (socket === null) return;

    const recipientId = currentChat?.members.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  //receive message and notifications
  useEffect(() => {
    //only reigger the event when socket is not null
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    //the (res) will contain the notification, and we want to check if the messages that the chat received is currently open or not
    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      //this response will return an array of the user's chats
      const response = await getRequest(`${baseURL}/users`);

      if (response.error) {
        return console.log("Error fetching users", response);
      }

      //the output of this is an array: but we need to exclude oursefl
      const pChats = response?.filter((u) => {
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
      //get allUsers for the notifications
      setAllUsers(response);
    };

    getUsers();
  }, [userChats]);
  //get our users from backend apis
  useEffect(() => {
    const getUserChats = async () => {
      setIsUserChatsLoading(true);
      setUserChatsError(null);
      //if the user exists and has id
      if (user?._id) {
        const response = await getRequest(`${baseURL}/chats/${user?._id}`);

        setIsUserChatsLoading(false);

        if (response.error) {
          return setUserChatsError(response);
        }
        setUserChats(response);
      }
    };

    getUserChats();
  }, [user, notifications]); // get the user chat whenever the user changes and

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
        return setMessagesError(response);
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
  const updateCurrentChat = useCallback(async (chat) => {
    setCurrentChat(chat);
  }, []);

  //create chat when we click the small name button on top
  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseURL}/chats`,
      JSON.stringify({ firstId, secondId })
    );
    if (response.error) {
      return console.log("Error creating chat", response);
    }

    setUserChats((prev) => [...prev, response]);
  }, []);

  //mark all notifications as read
  const markAllRead = useCallback((notifications) => {
    const markNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });

    setNotifications(markNotifications);
  }, []);

  //n is the current notification that we clicked on
  const markNotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      //find chat to open
      //we loop through each chat
      const desiredChat = userChats.find((chat) => {
        const chatMembers = [user._id, n.senderId];
        //we loop through every member of each chat to check if the member is in the chat that is currently checking
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });
        //if return true, the (chat) will be added to desireChat
        return isDesiredChat;
      });

      //mark notification as read
      //el is all the notifications that we go through
      const mNotifications = notifications.map((el) => {
        if (n.senderId === el.senderId) {
          return { ...n, isRead: true };
        } else {
          //return the notification that is not modified
          return el;
        }
      });
      //we do this to allow user to open the chat that has notification
      updateCurrentChat(desiredChat);

      //modify the notification to already read
      setNotifications(mNotifications);
    }
  );

  //turn off the notifictions of the chat on the left if the new message already read
  const markThisUserNotificationsAsRead = useCallback(
    (thisUserNotifications, notifications) => {
      //mark notificatios as read

      const mNotifications = notifications.map((el) => {
        let notification;

        //get each notification as a time
        thisUserNotifications.forEach((n) => {
          if (n.senderId === el.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = el;
          }
        });
        return notification;
      });

      setNotifications(mNotifications);
    }
  );
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
        notifications,
        allUsers,
        markAllRead,
        markNotificationAsRead,
        markThisUserNotificationsAsRead,
        newMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
