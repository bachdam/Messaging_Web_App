import express from "express";
import cors from "cors"; // this allows us to communicate with front end (send data, update...)
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config(); //this allows us to config the process.env

const port = process.env.PORT || 3000;
const uri = process.env.ATLAS_URI;

app.use(express.json); // a middleware that alows us to send and receive data in app
app.use(cors());

app.listen(port, (req, res) => {
  console.log(`The server is lauched at port ${port}`);
});

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`MongoDB connected successfully`))
  .catch((error) => console.log(`MongoDB connected fail: `, error.message));
