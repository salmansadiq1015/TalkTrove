import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;
    if (!name || !email || !password) {
      return res.status(201).send({
        succcess: false,
        message: "Please fill all the fields!",
      });
    }
    // Existing User =
    const Existinguser = await userModel.findOne({ email });
    if (Existinguser) {
      return res.status(201).send({
        success: false,
        message: "Email already exists!",
      });
    }
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // New user
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    // Check if "avatar" is a string before assigning it
    if (typeof avatar === "string") {
      user.avatar = avatar;
    }
    await user.save();
    res.status(200).send({
      success: true,
      message: "Register scuccessfully!",
      user: {
        name: user.name,
        email: user.email,
        password: user.password,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in register controller",
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(201).send({
        success: false,
        message: "Please fill all the fields!",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(201).send({
        success: false,
        message: "Email does not exists!",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(201).send({
        success: false,
        message: "Invalid password!",
      });
    }

    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.status(200).send({
      success: true,
      message: "Login scuccessfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login controller",
    });
  }
};

//   Update User
export const UpdateUser = async (req, res) => {
  try {
    res.status(200).send({
      succcess: true,
      message: "Profile update scuccessfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      succcess: false,
      message: "Error in update controller",
    });
  }
};

//   All Users
export const allUser = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      total: users.length,
      succcess: true,
      message: "All users list!",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      succcess: false,
      message: "Error in all user controller",
    });
  }
};

// Single User
export const singleUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.status(200).send({
      succcess: true,
      message: "Single user!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      succcess: false,
      message: "Error in single controller",
    });
  }
};

//Delete User
export const deleteUser = async (req, res) => {
  try {
    res.status(200).send({
      succcess: true,
      message: "Profile delete scuccessfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      succcess: false,
      message: "Error in delete controller",
    });
  }
};

// Search Users
export const searchUser = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            {
              name: {
                $regex: req.query.search,
                $options: "i",
              },
            },
            {
              email: {
                $regex: req.query.search,
                $options: "i",
              },
            },
          ],
        }
      : {};
    const users = await userModel.find({ ...keyword });
    // const users = await userModel.find({
    //   ...keyword,
    //   _id: { $ne: req.user._id },
    // });

    res.status(200).send({
      success: true,
      message: "User list",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      succcess: false,
      message: "Error in search user controller",
    });
  }
};
