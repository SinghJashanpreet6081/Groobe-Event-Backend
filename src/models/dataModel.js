const mongoose = require('mongoose');
const validator = require('validator');
const { uuidv4 } = require("uuid");
//const uniqueValidator = require('mongoose-unique-validator');

//single output
const SocietyDataSchema = mongoose.Schema({
   list: [Object]
});


//Creating Model
const SocietyDataModel = new mongoose.model('Groobe-Society-Database', SocietyDataSchema);


module.exports = {
    SocietyDataModel,
};
