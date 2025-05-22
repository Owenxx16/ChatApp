const User = require('../models/user.model')
const Message =  require('../models/message.model')
const {cloudinary} = require("../lib/cloudinary");
const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({_id:{$ne: loggedInUserId}}).select("-password");

    res.status(200).json(filteredUsers)
  } catch (error) {
    console.error("Error get Users for Sidebar :" + error.message);
    res.status(500).json({message: "Internal server error"});
  }
}

const getMessages = async (req,res) => {
  try {
    const {id:userToChatId} = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
      {senderId:myId, receiverId:userToChatId},
      {senderId:userToChatId, receiverId:myId}
    ]
  });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error get Messages :" + error.message);
    res.status(500).json({message: "Internal server error"});
  }
}

const sendMessage = async(req,res) => {
  try {
    const {text, image} = req.body;
    const {id:receiverId} = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image){
      // upload image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });
    await newMessage.save();

    // todo: socket.io emit
    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Send Message: " + error.message);
    res.status(500).json({message: "Internal server error"});
  }
}

module.exports = {
  getUsersForSidebar,getMessages,sendMessage
};