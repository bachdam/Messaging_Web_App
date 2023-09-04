import userModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

//create token func
const createToken = (_id) => {
  const jwtKey = process.env.SECRET_TOKEN;
  return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" });
};

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

export { registerUser };
