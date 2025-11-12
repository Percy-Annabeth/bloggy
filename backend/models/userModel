const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
      maxLength: [34, "Name cannot exceed 34 characters"],
      minLength: [3, "Name should have more than 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Please Enter Your own Email"],
      unique: true,
      validate: {
        validator: validator.isEmail, 
        message:"Please Enter a valid Email"},
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: [8, "Password should be greater than 8 characters"],
      select: false,
    },
    status:{
        type:String,
        default:"user",
    },
    profile_pic: {
        type: String,
        default:"enter_later_default_profile_pic",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }],
    favourites:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    liked:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    disliked:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    reading_list:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    subscribers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    subscribed:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
});

module.exports = mongoose.model('User', userSchema);