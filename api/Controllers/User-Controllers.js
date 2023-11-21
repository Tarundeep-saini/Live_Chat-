const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtKey = process.env.JWT_KEY;
const User = require("../models/User");
const Message = require("../models/message");
const httpError = require("../Middleware/http-error");

async function getuserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtKey, {}, (err, data) => {
        if (err) {
          throw err;
        }
        resolve(data);
      });
    } else {
      reject("No Token");
    }
  });
}

const bcryptSalt = bcrypt.genSaltSync(10);

const Profile = (req, res, next) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtKey, {}, (err, data) => {
      if (err) {
        return next(new httpError("Auth failed", 500));
      }
      res.json(data).cookie("token", token);
    });
  } else {
    res.status(401).json("No Token Found");
  }
};

const Register = async (req, res, next) => {
  const { username, password } = req.body;
  console.log("username");
  if (!username && !password) {
    return next(new httpError("Please Fill The Form", 500));
  }
  if (password.length < 4) {
    return next(new httpError("Password is less than 6 characters", 500));
  }
  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
      username: username,
      password: hashedPassword,
    });
    jwt.sign(
      { userId: createdUser._id, username },
      jwtKey,
      {},
      (err, token) => {
        if (err) {
          return next(new httpError("Error Signing In Please Try again", 500));
        }
        res.cookie("token", token).status(201).json({
          id: createdUser._id,
        });
      }
    );
  } catch (error) {
    return next(new httpError("User Already exists", 500));
  }
};

const Login = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username && !password) {
    return next(new httpError("Please Fill The Form", 500));
  }
  if (password.length < 4) {
    return next(new httpError("Password is less than 4 characters", 500));
  }
  let passOk;
  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      return next(new httpError("User Does Not exists", 500));
    }
    if (foundUser) {
      passOk = bcrypt.compareSync(password, foundUser.password);
    }
    if (passOk) {
      jwt.sign(
        { userId: foundUser._id, username },
        jwtKey,
        {},
        (err, token) => {
          res.cookie("token", token).json({
            id: foundUser._id,
          });
        }
      );
    }
  } catch (error) {
    return next(new httpError("Error Logging In Please Try Again.", 404));
  }
};

const Messages = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const data = await getuserDataFromRequest(req);
    const ourUserId = data.userId;
    const messages = await Message.find({
      sender: { $in: [userId, ourUserId] },
      recipient: { $in: [userId, ourUserId] },
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    return next(new httpError("Pasasm", 500));
  }
};

const Users = async (req, res, next) => {
  try {
    const users = await User.find({}, { _id: 1, username: 1 });
    res.json(users);
  } catch (error) {
    return next(new httpError("Failed To fetch users Please Refresh", 500));
  }
};

const Logout = (req, res) => {
  res.cookie("token", "").json("Ok");
};

exports.Messages = Messages;
exports.Users = Users;
exports.Profile = Profile;
exports.Login = Login;
exports.Logout = Logout;
exports.Register = Register;
