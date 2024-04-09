import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please provide your name"],
        minLength: [3, "Name mumst contain atlest 3 characters"],
        maxLength: [30, "Name cannot exceed 30 characters"],
    },
    email:{
        type: String,
        required: [true, "Please provide your name"],
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone:{
        type: Number,
        required: [true, "Please provide your phone number"],
    },
    password:{
        type: String,
        required: [true, "Please provide your password"],
        minLength: [8, "Name mumst contain atlest 8 characters"],
        maxLength: [32, "Name cannot exceed 32 characters"],
    },
    role:{
        type: String, 
        required: [true, "Please provide your role"],
        enum: ["Job Seeker", "Employer"],
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
});

//hashing the password for encryption
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10); //8 very weak, 12 very strong
});

//comparing password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password); 
}

//generating jwt token for auth
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

export const User = mongoose.model("User", user); 
