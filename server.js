const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Tour = require("./models/tourModel")

process.on("uncaughtException", err => {
    console.log(err.msg, err.name)
    process.exit(1)
})

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("connected to DB");
  });




  //CREATING A DOCUMENT INSTANCE
//   const testTour = new Tour({
//       name: "Test",
//       rating: 3,
//       price: 50
//   })

//   testTour.save().then(res => console.log(res)).catch(err => console.log(err))


const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log(`listening on port ${port}`));


//To handle unhandled promise rejection accross the app (catch blocks)
process.on("unhandledRejection", err => {
    console.log(err.msg, err.name)
    console.log("unhandled rejection")
    server.close(() => {
        process.exit(1)
    })
})

  