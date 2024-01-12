// this controllers will contain 3 api endpoints

import chatModel from "../Models/chatModel.js";

//------------------createChat----------------
const createChat = async (req, res) => {
  //get 2 ids: sender and receiver
  const { firstId, secondId } = req.body;

  try {
    //check if we already have a chat created by the 2 ids
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    //if the chat is already exists, just send it to the frontend
    if (chat) return res.status(200).json(chat);

    //if the chat is not created, we create a new one
    const newChat = new chatModel({ members: [firstId, secondId] });

    //save the newChat into database and send it to the frontend
    const response = await newChat.save();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(err);
  }
};

//----------------findUserChats---------------------
const findUserChats = async (req, res) => {
  try {
    //get the current loggin user
    const userId = req.params.userId;

    // find all the chats of the current user and push that to front end
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });
    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json(err);
  }
};

//----------------findChat---------------------
const findChat = async (req, res) => {
  try {
    //get the sender and receiver ids
    const { firstId, secondId } = req.params;

    // find the chat that has both of the ids and push it to frontend
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(err);
  }
};

export { createChat, findUserChats, findChat };
