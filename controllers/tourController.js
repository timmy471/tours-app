const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");




exports.createTour = catchAsync(async (req, res) => {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      stats: "success",
      data: {
        tour: newTour,
      },
    });
});


exports.getTours = catchAsync(async (req, res) => {

        const tours = await Tour.find()
            res.status(200).json({
                status: "success",
                totalSize: tours.length,
                data: {
                    tours
                }
            })
   
    })


exports.getTour = catchAsync(async (req, res, next) => {
        //This is a shorthand for Tour.findOne({ _id: req.params.id})
        //more like a filter request to find where id is the params id
        const tour = await Tour.findById(req.params.id)
        if(!tour){
            return next(new AppError(`Cannot find a tour with such Id`, 404))
        }

        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        })
    });

exports.updateTour = catchAsync(async (req, res, next) => {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        if(!tour){
            return next(new AppError(`Cannot find a tour with such Id`, 404))
        }

        res.status(200).json({
            status: "success",
            data: {
                tour
            }
        })
    })

exports.deleteTour = catchAsync(async (req, res, next) => {
        const tour = await Tour.findById(req.params.id)
        if(!tour){
            return next(new AppError(`Cannot find a tour with such Id`, 404))
        }
        res.status(200).json({
            message: "success",
        })
    })
