const express = require ("express")
const userRouter  = require("./routes/userRoutes")
const tourRouter = require("./routes/tourRouter")
const globalErrorHandler = require("./controllers/errorController")
const AppError = require("./utils/appError")

const app = express()
app.use(express.json())


app.use("/api/v1/users", userRouter)
app.use("/api/v1/tours", tourRouter)

//Not found route
app.all("*", (req, res, next) => {

    // res.status(404).json({
    //     status: "fail",
    //     message: `Can't find ${req.url} on the server`
    // })



    // const err = new Error(`Can't find ${req.url} on the server`)
    // err.status = "Fail";
    // err.statusCode = 404;
    next(new AppError(`Can't find ${req.url} on the server`, 404))
})


//Error handling
app.use(globalErrorHandler)


module.exports = app