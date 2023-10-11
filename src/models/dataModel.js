const mongoose = require('mongoose');
const validator = require('validator');
const { uuidv4 } = require("uuid");
//const uniqueValidator = require('mongoose-unique-validator');

//List output
const SocietyDataSchema = mongoose.Schema({
   list: [Object]
});

const ArtistDataSchema = mongoose.Schema({
   list: [Object]
});

const ManagementDataSchema = mongoose.Schema({
   list: [Object]
});


//Creating Model
const SocietyDataModel = new mongoose.model('Groobe-Society-Database', SocietyDataSchema);
const ArtistDataModel = new mongoose.model('Groobe-Artist-Database', ArtistDataSchema);
const ManagementDataModel = new mongoose.model('Groobe-Management-Database', ManagementDataSchema);


module.exports = {
    SocietyDataModel,
    ArtistDataModel,
    ManagementDataModel
};
