const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const tourRouter = express.Router();

const { protect, restrictTo } = authController

const {
  getTour,
  createTour,
  getTours,
  updateTour,
  deleteTour,
} = tourController;

tourRouter.route("/").get(protect, restrictTo(["admin", "lead-guide"]), getTours).post(createTour);
tourRouter.route("/:id").get(getTour).put(updateTour).delete(deleteTour);

module.exports = tourRouter;
