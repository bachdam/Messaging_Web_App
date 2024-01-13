const { Server } = require("socket.io");

//whenever we deloy the server on live, change the cors: to live link
const io = new Server({ cors: { origin: "http://localhost:5173/" } });

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("new connection", socket.id);

  //listen to a connection; we need to contain socketId also because it changes everytime we reload the page
  socket.on("addNewUser", (userId) => {
    //if the user in the onlineUsers = the incomming user => the user already online
    //=> onlineUsers.some is true => dont do the onlineUsers.push >>>so we add ! at the front
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    console.log("online Users", onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("disconnect", () => {
    //if the condition is wrong, it means that the user disconnected
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    //update the onlineUsers again
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(8080);
