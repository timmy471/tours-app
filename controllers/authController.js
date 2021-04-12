const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const sendEmail = require("./../utils/email");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  res.status(201).json({
    status: "success",
    token: signToken(newUser._id),
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password"), 400);
  }

  const user = await User.findOne({ email }).select("+password"); //We removed password already from model but here, we need to make some comparison so we add it back

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Invalid credentials", 400));
  }

  res.status(200).json({
    status: "success",
    token: signToken(user._id),
    data: {
      user,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //check if token is in header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("User is unauthorized", 401));
  }

  //verify token. If this throws an error of false, the code will jump into the global errorHandler and pic weather invalid token or exired token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if we still have the user in our db. The user could have been deleted, but his/or her token already stolen
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("User with such token no longer exists", 401));
  }

  req.user = currentUser;

  //Check if user has changed pasw after token has been issued

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    //req.user.role is gotten from protect middleware
    if (!roles.includes(req.user.role)) {
      console.log(req);
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new AppError("User not found", 404));

  const resetToken = user.createPasswordResetToken();

  // this will help bypass the whole password and email validation on the scema
  await user.save({ validateBeforeSave: false });

  //Send to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a request with your new password to ${resetURL}.\nIf you didn't forget your password, please ignore this message`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (error) {
    //Reset the token and expiry time to undefined
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    console.log(error);

    return next(new AppError("There was an error sending the email", 500));
  }
});


exports.resetPassword = catchAsync(async (req, res, next) => {
    //Get user based on token
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    //get user via token, comparing dates
    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}});

    if(!user){
        return next(new AppError("Token is Invalid or has expired", 400))
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save()

    res.status(200).json({
        status: "success",
        message: "Password updated successfully"
    })
})
