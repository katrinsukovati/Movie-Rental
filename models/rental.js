const Joi = require('joi');
const mongoose = require('mongoose');

const Rental = mongoose.model('Rental', new mongoose.Schema({
  customer: { 
    // custom schema (not reusing the customer schema from the customer module)
    // this is because, our customer can have 50 properties but we only need some
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }      
    }),  
    required: true
  },
  movie: {
    // custom schema (not reusing the movie schema from the movie module)
    // this is because, our movie can have 50 properties but we only need some
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      // used to calculate the rental fee
      dailyRentalRate: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
      }   
    }),
    required: true
  },
  dateOut: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  dateReturned: { 
    type: Date
  },
  rentalFee: { 
    type: Number, 
    min: 0
  }
}));

// when creating a new rental, client should only set two values
function validateRental(rental) {
  const schema = {
    customerId: Joi.string().required(),
    movieId: Joi.string().required()
  };

  return Joi.validate(rental, schema);
}

exports.Rental = Rental; 
exports.validate = validateRental;

