import userModel from "../Models/userModel.js";
import bcrypt from "bcrypt"; //to hash the password before save to the database
import jwt from "jsonwebtoken";
import validator from "validator";

//create token func
const createToken = (_id) => {
  const jwtKey = process.env.SECRET_TOKEN;
  return jwt.sign({ _id }, jwtKey);
};

//create new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check if the email is already exist and all fields are filled
    let user = await userModel.findOne({ email });

    if (user)
      return res.status(400).json("User with the email is already exist!");

    if (!name || !password || !email)
      return res.status(400).json("Require all fields!");

    if (!validator.isEmail(email))
      return res.status(400).json("It is not a valid email!");

    //create user since all fields are satisfied
    user = new userModel({ name, email, password });
    const saltRounds = 10;
    const encryptPass = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, encryptPass);

    user = new userModel({ name, email, password: hashedPassword });

    //save the user info
    await user.save();

    //call the createToken()
    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, name, email, token });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });

    //check the validation of login infor
    if (!user)
      return res
        .status(400)
        .json("Invalid email or password please try again!");
    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword)
      return res
        .status(404)
        .json("Invalid email or password please try again!");

    //if the login is valid then give the user there token
    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

//look for a user
const findUser = async (req, res) => {
  try {
    let user = await userModel.findById(req.params.userId);
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

//show all users
const getUsers = async (req, res) => {
  try {
    let user = await userModel.find();
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export { registerUser, loginUser, findUser, getUsers };
