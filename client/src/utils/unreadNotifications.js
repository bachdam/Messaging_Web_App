export const unreadNotificationsFunc = (notifications) => {
  //there are alot of notifications but we only need the unread ones
  return notifications.filter((n) => n.isRead === false);
};
