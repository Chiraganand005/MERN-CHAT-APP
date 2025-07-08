import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },    
   username: {
    type: String,
    required: true,
    unique: true,   
   },
   password: {
    type: String,
    required: true,
    Minlength: 6,
  },
  gender: {
    type: String,   
    enum: ["male", "female", "other"],
  },
    profilePicture: {
        type: String,
        default: "",
    },
});
const User = mongoose.model("User", userSchema);

export default User;

