import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";

const Notification = () => {
  //set state of the message icon next to Logout
  const [isOpen, setIsOpen] = useState(false);
  //get the user that is logged in
  const { user } = useContext(AuthContext);
  //get the data of the user
  const {
    notifications,
    userChats,
    allUsers,
    markAllRead,
    markNotificationAsRead,
  } = useContext(ChatContext);
  //get the unread notifications
  const unreadNotifications = unreadNotificationsFunc(notifications);

  //only need the sender's name
  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user._id === n.senderId);
    return {
      ...n,
      senderName: sender?.name,
    };
  });
  console.log("un", unreadNotifications);
  console.log("mn", modifiedNotifications);

  return (
    <div className="notifications">
      {/* change the icon state on click */}
      <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-chat-square-dots-fill"
          viewBox="0 0 16 16"
        >
          <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2zm5 4a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
        </svg>

        {/* show the number of unread notifications in frontend */}
        {unreadNotifications?.length === 0 ? null : (
          <span className="notification-count">
            <span>{unreadNotifications?.length}</span>
          </span>
        )}
      </div>
      {/* if it is clicked, show content or vice versa */}
      {isOpen ? (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Notification</h3>
            {/* mark allread button clicking */}
            <div
              className="mar-as-read"
              onClick={() => markAllRead(notifications)}
            >
              Mark all as read
            </div>
          </div>
          {/* display the message icon next to Logout */}
          {modifiedNotifications?.length === 0 ? (
            <span className="notification">No notification yet!</span>
          ) : null}
          {modifiedNotifications &&
            modifiedNotifications.map((n, index) => {
              return (
                <div
                  key={index}
                  className={
                    n.isRead ? "notification" : "notification not-read"
                  }
                  //   this onclick event will mark the notification as read and open the chat
                  onClick={() => {
                    markNotificationAsRead(n, userChats, user, notifications);
                    //close the icon after we clicked the notifications
                    setIsOpen(false);
                  }}
                >
                  <span>{`${n.senderName} sent you a message`}</span>
                  <span className="notification-time">
                    {moment(n.date).calendar()}
                  </span>
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
};

export default Notification;

//need to hook this to NavBar.js
