const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const {generateToken} = require("../lib/utils");
const {cloudinary} = require("../lib/cloudinary");
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

const login = async (req,res) => {
  const {email,password} = req.body;
  try{
    if(!email || !password){
      return res.status(400).json({message: "Please fill all the fields"});
    }
    const user = await User.findOne({email});
    

    if(!user){
      return res.status(400).json({message: "User not found"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({message: "Invalid credentials"});
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic
    })

  }catch(error){
    console.log("Error in login controller", error.message);
    res.status(500).json({message: "Internal server error"});
  }
}

const logout = (req,res) => {
  try{
    res.cookie("jwt","", {maxAge:0});
    res.status(200).json({message: "Logged out successfully"});
  }catch(error){
    console.log("Error in logout controller", error.message);
    res.status(500).json({message: "Internal server error"});
  }
}

const updateProfile = async (req,res) => {
  try {
    const {profilePic} = req.body;
    const userId = req.user._id;

    if(!profilePic){
      return res.status(404).json({message: "Please provide a profile picture"});
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const user = await User.findByIdAndUpdate(userId,{profilePic: uploadResponse.secure_url},{new: true});

    res.status(200).json(user)
  } catch (error) {
    console.log("Error in updateProfile controller", error.message);
    res.status(500).json({message: "Internal server error"});
  }
}

const checkAuth = async (req,res) => {
    try {
      const { _id, fullname, email, profilePic } = req.user;
      res.status(200).json({ _id, fullname, email, profilePic });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth
}