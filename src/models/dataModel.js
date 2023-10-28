const mongoose = require("mongoose");
const validator = require("validator");
const { uuidv4 } = require("uuid");
//const uniqueValidator = require('mongoose-unique-validator');

//List output
const SocietyDataSchema = mongoose.Schema({
  list: [Object],
});

const SocietyArtistDataSchema = mongoose.Schema({
  list: [Object],
});

const SocietyManagementDataSchema = mongoose.Schema({
  list: [Object],
});

const SocietyServiceDataSchema = mongoose.Schema({
  list: [Object],
});

const ServiceDataSchema = mongoose.Schema({
  list: [Object],
});
const ServiceDetailDataSchema = mongoose.Schema({
  list: [Object],
});
const PricingDataSchema = mongoose.Schema({
  list: [Object],
});
const ArtistDataSchema = mongoose.Schema({
  list: [Object],
});
const ManagementDataSchema = mongoose.Schema({
  list: [Object],
});
const SocietyTimeSlotDataSchema = mongoose.Schema({
  list: [Object],
});
const TimeDataSchema = mongoose.Schema({
  list: [Object],
});
const BookingDataSchema = mongoose.Schema({
  list: [Object],
});
const BookedServiceDataSchema = mongoose.Schema({
  list: [Object],
});
const UserDataSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  oid: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  societyId: {
    type: String,
  },
  serviceId: {
    type: String,
  },
});

//Creating Model
const SocietyDataModel = new mongoose.model("Society", SocietyDataSchema);
const SocietyArtistDataModel = new mongoose.model(
  "Society-Artist",
  SocietyArtistDataSchema
);
const SocietyManagementDataModel = new mongoose.model(
  "Society-Management",
  SocietyManagementDataSchema
);
const SocietyServiceDataModel = new mongoose.model(
  "Society-Service",
  SocietyServiceDataSchema
);
const ServiceDataModel = new mongoose.model("Services", ServiceDataSchema);
const ServiceDetailDataModel = new mongoose.model(
  "Services-Detail",
  ServiceDetailDataSchema
);
const PricingDataModel = new mongoose.model("Pricing", PricingDataSchema);
const ArtistDataModel = new mongoose.model("Artist", ArtistDataSchema);
const ManagementDataModel = new mongoose.model(
  "Management",
  ManagementDataSchema
);
const SocietyTimeSlotDataModel = new mongoose.model(
  "Society-Slots",
  SocietyTimeSlotDataSchema
);
const TimeDataModel = new mongoose.model("Time", TimeDataSchema);
const BookingDataModel = new mongoose.model("Bookings", BookingDataSchema);
const BookedServiceDataModel = new mongoose.model(
  "Booked-Services ",
  BookedServiceDataSchema
);
const UserDataModel = new mongoose.model("User ", UserDataSchema);

const EmployeeDataModel = new mongoose.model("Employee", {
  email: String,
  password: String,
  userType: Number,
});

module.exports = {
  SocietyDataModel,
  SocietyArtistDataModel,
  SocietyManagementDataModel,
  SocietyServiceDataModel,
  ServiceDataModel,
  ServiceDetailDataModel,
  PricingDataModel,
  ArtistDataModel,
  ManagementDataModel,
  SocietyTimeSlotDataModel,
  TimeDataModel,
  BookingDataModel,
  BookedServiceDataModel,
  UserDataModel,
  EmployeeDataModel,
};
