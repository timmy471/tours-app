const mongoose = require("mongoose")

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tour name is required'],
        unique: true,
        trim: true
    },
    rating: {
        type: Number,
        default: 4.5,
    },
    price: {
        type: Number,
        required: [true, 'Tour Price is Required']
    },
    durations: {
        type: Number,
        required: [true, "Duration is required"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "Group size is required"]
    },
    difficulty: {
        type: Number,
        required: [true, "Difficulty is required"]
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQunatity: {
        type: Number,
        default: 0
    },
    priceDiscount: Number,
    summary: {
        type: String,
        required: [true, "Summary is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    // imageCover: {
    //     type: String,
    //     required: [true, "A cover image is required"]
    // },
    // images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // startDate: [Date],
   
})

//CREATING THE TOUR MODEL (FIRST LETTER OF MODELS USUALLY IN CAPS)
const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour