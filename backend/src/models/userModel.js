const mongoose = require("mongoose")
const {Schema} = mongoose;

const userModel = Schema({
    name:{type:String, required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    pic:{
        type:String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    }
}, {
    timestamps: true,   
  })

  const userSchema = mongoose.model("User",userModel)
  module.exports = userSchema;