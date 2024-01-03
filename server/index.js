import express from "express";
import cors from "cors"; // this allows us to communicate with front end (send data, update...)
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "../server/Routes/userRoute.js";

const app = express();

dotenv.config({
  path: "/Users/bachquangdam/Documents/projects/Chat App/server/.env",
}); //this allows us to config the process.env

const port = process.env.PORT || 3000;
const uri = process.env.ATLAS_URI;

//middleware to parse json data
app.use(express.json());
// a middleware that alows us to send and receive data in app from front end
app.use(cors());
//middleware for link destination
app.use("/users", userRoute);

//main page
app.get("/", (req, res) => {
  res.send("Hello from chat app");
  // res.render("index.html");
});

//run the server
app.listen(port, (req, res) => {
  console.log(`The server is lauched at port ${port}`);
});

//connect to database
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`MongoDB connected successfully`))
  .catch((error) => console.log(`MongoDB connected fail: `, error.message));
