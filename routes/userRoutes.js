const express = require("express");
const userController = require("../controllers/userController");
const authController = require("./../controllers/authController");

const userRouter = express.Router();
const { getUsers, postUser, getUser } = userController;
const { signUp, login, forgotPassword, resetPassword } = authController;


userRouter.post("/signup", signUp)
userRouter.post("/login", login)

userRouter.post("/forgotPassword", forgotPassword)
userRouter.patch("/resetPassword/:token", resetPassword);








//Trying out params middleware
userRouter.param("id", (req, res, next, val) => {
    console.log(`The id sent is ${val}`)
    next()
})


//Chaining Routes

userRouter.route("/")
    .get(getUsers)
    .post(postUser);


userRouter.route("/:id").get(getUser)

module.exports = userRouter;
