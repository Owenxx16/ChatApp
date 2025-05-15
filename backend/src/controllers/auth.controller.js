const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const {generateToken} = require("../lib/utils");
const signup = async (req,res) => {
 const {fullname,email,password} = req.body;
 try {
  // hash password
  if(!fullname || !email || !password){
    return res.status(400).json({message: "Please fill all the fields"});
  }
  if(password.length < 6){
    return res.status(400).json({message: "Password must be at least 6 characters long"});
  }
  const user = await User.findOne({email});
  if(user){
    return res.status(400).json({message: "User already exists"});
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    fullname,
    email,
    password: hashedPassword
  }); 
  if(newUser){
    generateToken(newUser._id, res);
    await newUser.save();
    res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
      profilePic: newUser.profilePic
    })
  }else{
    return res.status(400).json({message: "Invalid user data"});
  }
 } catch (error) {
    console.log("Error in signup controller", error.message);
 }
}

const login = (req,res) => {
  console.log("Login route hit");
}

const logout = (req,res) => {
  console.log("Logout route hit");
}

module.exports = {
  signup,
  login,
  logout
}