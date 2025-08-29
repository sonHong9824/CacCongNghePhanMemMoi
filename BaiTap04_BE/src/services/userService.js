require("dotenv").config();
const Users = require("../models/user");
const bcrypt = require("bcrypt");
const e = require("express");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const createUserService = async (email, name, password) =>{
    try {
        const user = await Users.findOne({email});
        if (user) {
            console.log("User already exists");
            return null;
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let result = await Users.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: "user"
        });
        return result;
    } catch (error) {
        console.error("Error creating user:", error);
        return null;
    }
}

const loginService = async (email, password) => {
    try {
        const user = await Users.findOne({ email: email });
        if(user){
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if(!isMatchPassword){
                return {
                    EC: 2,
                    EM: "Wrong password",
                }
            } else {
                const payload = {
                    email: user.email,
                    name: user.name
                }
                const access_token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRE
                    }
                )
                return {
                    EC: 0,
                    access_token,
                    user: {
                        email: user.email,
                        name: user.name,
                    }
                };
            }
        } else {
            return {
                EC: 1,
                EM: "User not found",
            }
        }
    } catch (error) {
        console.error("Error during login:", error);
        return null;
    }
}


const getUserService = async () => {
    try {
        let result = await Users.find({}).select('-password');
        return result;
    } catch (error) {
        console.error("Error fetching users:", error);
        return null;
    }
}

module.exports = {
    createUserService,
    loginService,
    getUserService
}
