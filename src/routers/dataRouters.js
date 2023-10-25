const express = require("express");
const router = new express.Router();
const generateUniqueId = require("generate-unique-id");
const multer = require("multer");

const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const storage1 = require("../firebase");
const storage2 = getStorage();
//setting up multer as a middleware to grap photo upload
const upload1 = multer({ storage2: multer.memoryStorage() });

//getting model
const {
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
} = require("../models/dataModel");

const { send, listenerCount } = require("process");

// const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
// const storage2 = getStorage();

//Giving image file new name and destinaion
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      new Date().getHours() +
      "-" +
      new Date().getMinutes() +
      "-" +
      new Date().getSeconds();
    cb(null, file.fieldname + "-" + uniqueName + ".jpg");
  },
});

//Will store all data about image: newname, destination etc
const upload = multer({ storage: storage });

const middleware = (req, res, next) => {
  next();
};

//Society Data
router.post(
  "/society-data",
  middleware,
  upload1.single("image"),
  async (req, res) => {
    try {
      const getData = await SocietyDataModel.find();
      // if already data
      if (getData.length != 0) {
        if (getData[getData.length - 1].list) {
          ls = getData[getData.length - 1].list;
          i = ls[ls.length - 1].oid / 10 + 1;
        } else {
          var ls = [];
          var i = 1;
        }
      } else {
        var ls = [];
        var i = 1;
      }

      //Update data by id
      const Uid = req.body.id || req.params.id;
      if (Uid) {
        var newList = getData[getData.length - 1].list;
        var k = null;
        for (var j = 0; j < newList.length; j++) {
          if (newList[j].id == Uid) {
            k = j;
            break;
          }
        }
        if (k == null) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else {
          newList[k].name = req.body.name || newList[k].name;
          newList[k].address = req.body.address || newList[k].address;
          newList[k].artist = req.body.artist || newList[k].artist;
          newList[k].management = req.body.management || newList[k].management;
          newList[k].items = req.body.items || newList[k].items;
          newList[k].services = req.body.services || newList[k].services;
          newList[k].isActive =
            req.body.isActive || newList[k].isActive;
            const getData = await SocietyDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
            const _id = getData._id;
            const updateData = await SocietyDataModel.findOneAndUpdate(
              { _id: _id }, // Replace '_id' with the correct identifier field for your document
              { $set: { list: newList } },
              { new: true }
              );
              
              console.log(updateData);
          var list = updateData.list;
          res.status(201).send({
            staus: true,
            Data: list,
          });
        }
      } else {
        let id = generateUniqueId({
          length: 12,
        });
        let oid = 10 * i;
        let name = req.body.name;
        let address = req.body.address;
        //input string to output array
        let artist = req.body.artist;
        let management = req.body.management;
        let items = req.body.items;
        let services = req.body.services;
        let isActive = req.body.isActive;
        obj = {
          id,
          oid,
          name,
          address,
          artist,
          management,
          items,
          services,
          isActive
        };
        ls.push(obj);

        if (getData.length != 0) {
          const getData = await SocietyDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await SocietyDataModel.findOneAndUpdate(
            { _id: _id },
            { $set: { list: ls } },
            {
              new: true,
            }
          );
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        } else {
          const SocietyUser = new SocietyDataModel({
            list: ls,
          });
          const updateData = await SocietyUser.save();
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        }
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({
        staus: false,
        error: e.message,
      });
    }
  }
);

// //THis is get for Society data
router.get(
  "/society-data",
  middleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const typeOfUser = req.get("usertype");
      //console.log(typeOfUser);
      const id = req.body.id || req.query.id;
      if (typeOfUser === "admin") {
        const getData = await SocietyDataModel.findOne()
          .select({ list: 1, _id: 0, __v: 1 })
          .sort({ list: 1 });

        //for sorting:
        var TempList = getData.list;

        if (!id) {
          console.log("This is Admin Society data--------");

          res.status(200).send({
            status: "success",
            data: TempList,
          });
        } else {
          const SignleIdData = TempList.filter((arr) => {
            return arr.id === id;
          });

          if (SignleIdData.length === 0) {
            res.status(500).send({
              status: false,
              message: `Data is not Available in Database For Id : ${id}`,
            });
          } else
            res.status(200).json({
              status: "success",
              data: SignleIdData,
            });
        }
      } else if (typeOfUser === "user") {
        const getData = await SocietyDataModel.findOne()
          .select({ list: 1, _id: 0, __v: 1 })
          .sort({ list: 1 });

        //for sorting:
        var TempList = getData.list;

        if (!id) {
          console.log("This is User Society data--------");
          var newTemList = TempList.map((arr) => {
            const obj = {
              id: arr.id,
              oid: arr.oid,
              name: arr.name,
              address: arr.address,
              services: arr.services,
            };
            return obj;
          });

          console.log(newTemList);

          res.status(200).send({
            status: "success",
            data: newTemList,
          });
        } else {
          const SignleIdData = TempList.filter((arr) => {
            return arr.id === id;
          });

          if (SignleIdData.length === 0) {
            res.status(500).send({
              status: false,
              message: `Data is not Available in Database For Id : ${id}`,
            });
          } else
            var newTemList = SignleIdData.map((arr) => {
              const obj = {
                id: arr.id,
                oid: arr.oid,
                name: arr.name,
                address: arr.address,
                services: arr.services,
              };
              return obj;
            });
          res.status(200).json({
            status: "success",
            data: newTemList,
          });
        }
      } else {
        res.status(500).json({
          status: false,
          data: "Authentication Header is Missing",
        });
      }
    } catch (e) {
      res.status(500).send({
        staus: false,
        message: e.message,
      });
    }
  }
);

// Society Artist Data
router.post(
  "/society-artist-data",
  middleware,
  upload1.single("image"),
  async (req, res) => {
    try {
      const getData = await SocietyArtistDataModel.find();
      // if already data
      if (getData.length != 0) {
        if (getData[getData.length - 1].list) {
          ls = getData[getData.length - 1].list;
          i = ls[ls.length - 1].oid / 10 + 1;
        } else {
          var ls = [];
          var i = 1;
        }
      } else {
        var ls = [];
        var i = 1;
      }

      //Update data by id
      const Uid = req.body.id || req.params.id;
      if (Uid) {
        var newList = getData[getData.length - 1].list;
        var k = null;
        for (var j = 0; j < newList.length; j++) {
          if (newList[j].id == Uid) {
            k = j;
            break;
          }
        }
        if (k == null) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else {
          newList[k].name = req.body.name || newList[k].name;
          newList[k].address = req.body.address || newList[k].address;
          newList[k].mobile = req.body.mobile || newList[k].mobile;
          newList[k].experience = req.body.experience || newList[k].experience;
          newList[k].price = req.body.price || newList[k].price;
          newList[k].sid = req.body.sid || newList[k].sid;

          const getData = await SocietyArtistDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await SocietyArtistDataModel.findOneAndUpdate(
            { _id: _id }, // Replace '_id' with the correct identifier field for your document
            { $set: { list: newList } },
            { new: true }
          );
          var list = updateData.list;
          res.status(201).send({
            staus: true,
            Data: list,
          });
        }
      } else {
        let id = generateUniqueId({
          length: 12,
        });
        let oid = 10 * i;
        let name = req.body.name;
        let address = req.body.address;
        //input string to output array
        let mobile = req.body.mobile;
        let experience = req.body.experience;
        let price = req.body.price;
        let sid = req.body.sid;
        obj = {
          id,
          oid,
          name,
          address,
          mobile,
          experience,
          price,
          sid,
        };
        ls.push(obj);

        if (getData.length != 0) {
          const getData = await SocietyArtistDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await SocietyArtistDataModel.findOneAndUpdate(
            { _id: _id },
            { $set: { list: ls } },
            {
              new: true,
            }
          );
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        } else {
          const ArtistUser = new SocietyArtistDataModel({
            list: ls,
          });
          const updateData = await ArtistUser.save();
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        }
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({
        staus: false,
        error: e.message,
      });
    }
  }
);

// //THis is get for Society  Artist data
router.get(
  "/society-artist-data",
  middleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const id = req.body.id || req.query.id;
      const getData = await SocietyArtistDataModel.findOne()
        .select({ list: 1, _id: 0, __v: 1 })
        .sort({ list: 1 });

      //for sorting:
      var TempList = getData.list;
      if (!id) {
        console.log("This is Artist data--------");
        console.log(TempList);

        res.status(200).send({
          status: "success",
          data: TempList,
        });
      } else {
        const SignleIdData = TempList.filter((arr) => {
          return arr.id === id;
        });

        if (SignleIdData.length === 0) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else
          res.status(200).json({
            status: "success",
            data: SignleIdData,
          });
      }
    } catch (e) {
      res.status(500).send({
        staus: false,
        message: e.message,
      });
    }
  }
);

// Society Management Data
router.post(
  "/society-management-data",
  middleware,
  upload1.single("image"),
  async (req, res) => {
    try {
      const getData = await SocietyManagementDataModel.find();
      // if already data
      if (getData.length != 0) {
        if (getData[getData.length - 1].list) {
          ls = getData[getData.length - 1].list;
          i = ls[ls.length - 1].oid / 10 + 1;
        } else {
          var ls = [];
          var i = 1;
        }
      } else {
        var ls = [];
        var i = 1;
      }

      //Update data by id
      const Uid = req.body.id || req.params.id;
      if (Uid) {
        var newList = getData[getData.length - 1].list;
        var k = null;
        for (var j = 0; j < newList.length; j++) {
          if (newList[j].id == Uid) {
            k = j;
            break;
          }
        }
        if (k == null) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else {
          newList[k].name = req.body.name || newList[k].name;

          newList[k].mobile = req.body.mobile || newList[k].mobile;

          newList[k].sid = req.body.sid || newList[k].sid;

          const getData = await SocietyManagementDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await SocietyManagementDataModel.findOneAndUpdate(
            { _id: _id }, // Replace '_id' with the correct identifier field for your document
            { $set: { list: newList } },
            { new: true }
          );
          var list = updateData.list;
          res.status(201).send({
            staus: true,
            Data: list,
          });
        }
      } else {
        let id = generateUniqueId({
          length: 12,
        });
        let oid = 10 * i;
        let name = req.body.name;
        //input string to output array
        let mobile = req.body.mobile;
        let sid = req.body.sid;
        obj = {
          id,
          oid,
          name,
          mobile,
          sid,
        };
        ls.push(obj);

        if (getData.length != 0) {
          const getData = await SocietyManagementDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await SocietyManagementDataModel.findOneAndUpdate(
            { _id: _id },
            { $set: { list: ls } },
            {
              new: true,
            }
          );
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        } else {
          const ManagementUser = new SocietyManagementDataModel({
            list: ls,
          });
          const updateData = await ManagementUser.save();
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        }
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({
        staus: false,
        error: e.message,
      });
    }
  }
);

// //THis is get for Society  Artist data
router.get(
  "/society-management-data",
  middleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const id = req.body.id || req.query.id;
      const getData = await SocietyManagementDataModel.findOne()
        .select({ list: 1, _id: 0, __v: 1 })
        .sort({ list: 1 });

      //for sorting:
      var TempList = getData.list;
      if (!id) {
        console.log("This is Management data--------");
        console.log(TempList);

        res.status(200).send({
          status: "success",
          data: TempList,
        });
      } else {
        const SignleIdData = TempList.filter((arr) => {
          return arr.id === id;
        });

        if (SignleIdData.length === 0) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else
          res.status(200).json({
            status: "success",
            data: SignleIdData,
          });
      }
    } catch (e) {
      res.status(500).send({
        staus: false,
        message: e.message,
      });
    }
  }
);

// Society Service Data
router.post(
  "/society-service-data",
  middleware,
  upload1.single("image"),
  async (req, res) => {
    try {
      const getData = await SocietyServiceDataModel.find();
      // if already data
      if (getData.length != 0) {
        if (getData[getData.length - 1].list) {
          ls = getData[getData.length - 1].list;
          i = ls[ls.length - 1].oid / 10 + 1;
        } else {
          var ls = [];
          var i = 1;
        }
      } else {
        var ls = [];
        var i = 1;
      }

      //Update data by id
      const Uid = req.body.id || req.params.id;
      if (Uid) {
        var newList = getData[getData.length - 1].list;
        var k = null;
        for (var j = 0; j < newList.length; j++) {
          if (newList[j].id == Uid) {
            k = j;
            break;
          }
        }
        if (k == null) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else {
          newList[k].name = req.body.name || newList[k].name;
          newList[k].sid = req.body.sid || newList[k].sid;

          const getData = await SocietyServiceDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await SocietyServiceDataModel.findOneAndUpdate(
            { _id: _id }, // Replace '_id' with the correct identifier field for your document
            { $set: { list: newList } },
            { new: true }
          );
          var list = updateData.list;
          res.status(201).send({
            staus: true,
            Data: list,
          });
        }
      } else {
        let id = generateUniqueId({
          length: 12,
        });
        let oid = 10 * i;
        let name = req.body.name;
        let sid = req.body.sid;
        obj = {
          id,
          oid,
          name,
          sid,
        };
        ls.push(obj);

        if (getData.length != 0) {
          const getData = await SocietyServiceDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await SocietyServiceDataModel.findOneAndUpdate(
            { _id: _id },
            { $set: { list: ls } },
            {
              new: true,
            }
          );
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        } else {
          const ServiceUser = new SocietyServiceDataModel({
            list: ls,
          });
          const updateData = await ServiceUser.save();
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        }
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({
        staus: false,
        error: e.message,
      });
    }
  }
);

// //THis is get for Society  Artist data
router.get(
  "/society-service-data",
  middleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const id = req.body.id || req.query.id;
      const getData = await SocietyServiceDataModel.findOne()
        .select({ list: 1, _id: 0, __v: 1 })
        .sort({ list: 1 });

      //for sorting:
      var TempList = getData.list;
      if (!id) {
        console.log("This is Artist data--------");
        console.log(TempList);

        res.status(200).send({
          status: "success",
          data: TempList,
        });
      } else {
        const SignleIdData = TempList.filter((arr) => {
          return arr.id === id;
        });

        if (SignleIdData.length === 0) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else
          res.status(200).json({
            status: "success",
            data: SignleIdData,
          });
      }
    } catch (e) {
      res.status(500).send({
        staus: false,
        message: e.message,
      });
    }
  }
);

// Main Service Data
router.post(
  "/service-data",
  middleware,
  upload1.single("image"),
  async (req, res) => {
    try {
      const getData = await ServiceDataModel.find();
      // if already data
      if (getData.length != 0) {
        if (getData[getData.length - 1].list) {
          ls = getData[getData.length - 1].list;
          i = ls[ls.length - 1].oid / 10 + 1;
        } else {
          var ls = [];
          var i = 1;
        }
      } else {
        var ls = [];
        var i = 1;
      }

      // for uploading pics
      const storageRef = ref(
        storage2,
        `Groobe-Events/Service-Data/${"Service" + " " + i * 10}`
      );

      const metadata = {
        contentType: req.file.mimetype,
      };

      //upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );
      //by using uploadbytesres... we can control the progress of uploading like pause resume etcc;
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log(
        "File is uploaded to the Firebase! " + "Service" + " " + i * 10
      );

      //Update data by id
      const Uid = req.body.id || req.params.id;
      if (Uid) {
        var newList = getData[getData.length - 1].list;
        var k = null;
        for (var j = 0; j < newList.length; j++) {
          if (newList[j].id == Uid) {
            k = j;
            break;
          }
        }
        if (k == null) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else {
          newList[k].name = req.body.name || newList[k].name;
          newList[k].bgcolor = req.body.bgcolor || newList[k].bgcolor;
          newList[k].textcolor = req.body.textcolor || newList[k].textcolor;
          newList[k].description =
            req.body.description || newList[k].description;
          newList[k].service_category =
            req.body.service_category || newList[k].service_category;
          newList[k].isPopular = req.body.isPopular || newList[k].isPopular;
          newList[k].isRecommended =
            req.body.isRecommended || newList[k].isRecommended;
          newList[k].isActive =
            req.body.isActive || newList[k].isActive;
          if (!req.file) newList[k].image = newList[k].image;
          else newList[k].image = downloadURL;

          const getData = await ServiceDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await ServiceDataModel.findOneAndUpdate(
            { _id: _id }, // Replace '_id' with the correct identifier field for your document
            { $set: { list: newList } },
            { new: true }
          );
          var list = updateData.list;
          res.status(201).send({
            staus: true,
            Data: list,
          });
        }
      } else {
        let id = generateUniqueId({
          length: 12,
        });
        let oid = 10 * i;
        let name = req.body.name;
        let image = downloadURL;
        let bgcolor = req.body.bgcolor;
        let textcolor = req.body.textcolor;
        let description = req.body.description;
        let service_category = req.body.service_category;
        let isPopular = req.body.isPopular;
        let isActive = req.body.isActive;

        obj = {
          id,
          oid,
          name,
          image,
          bgcolor,
          textcolor,
          description,
          service_category,
          isPopular,
          isActive
        };
        ls.push(obj);

        if (getData.length != 0) {
          const getData = await ServiceDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await ServiceDataModel.findOneAndUpdate(
            { _id: _id },
            { $set: { list: ls } },
            {
              new: true,
            }
          );
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        } else {
          const ServiceUser = new ServiceDataModel({
            list: ls,
          });
          const updateData = await ServiceUser.save();
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        }
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({
        staus: false,
        error: e.message,
      });
    }
  }
);

// //THis is get for main Service data
router.get(
  "/service-data",
  middleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const typeOfUser = req.get("usertype");
      //console.log(typeOfUser);
      const id = req.body.id || req.query.id;
      if (typeOfUser === "admin") {
        const getData = await ServiceDataModel.findOne()
          .select({ list: 1, _id: 0, __v: 1 })
          .sort({ list: 1 });

        //for sorting:
        var TempList = getData.list;

        const serviceCategory = await ServiceDetailDataModel.findOne()
          .select({ list: 1, _id: 0, __v: 1 })
          .sort({ list: 1 });

        const updatedTempList = TempList.map((arr) => {
          const ids = arr.service_category;
          let result;

          if (ids.length > 12) {
            const idsArr = ids.split(",").map((a) => a.trim());

            console.log(idsArr);
            result = idsArr.map((a) => {
              return serviceCategory.list.find((element) => element.id === a);
            });
          } else {
            result = serviceCategory.list.find((element) => element.id === ids);
          }

          arr.service_category = result; // Update the service_category field
          return arr; // Return the updated object
        });

        //console.log(updatedTempList); // This will contain the updated objects

        // console.log("hello" , dd)
        // console.log(dd);

        if (!id) {
          console.log("This is Service data--------");

          res.status(200).send({
            status: "success",
            data: TempList,
          });
        } else {
          const SignleIdData = TempList.filter((arr) => {
            return arr.id === id;
          });

          if (SignleIdData.length === 0) {
            res.status(500).send({
              status: false,
              message: `Data is not Available in Database For Id : ${id}`,
            });
          } else
            res.status(200).json({
              status: "success",
              data: SignleIdData,
            });
        }
      } else if (typeOfUser === "user") {
        const getData = await ServiceDataModel.findOne()
          .select({ list: 1, _id: 0, __v: 1 })
          .sort({ list: 1 });

        //for sorting:
        var TempList = getData.list;

        if (!id) {
          console.log("This is Service data--------");
          var newTemList = TempList.map((arr) => {
            const obj = {
              id: arr.id,
              oid: arr.oid,
              name: arr.name,
              image: arr.image,
              bgcolor: arr.bgcolor,
              textcolor: arr.textcolor,
              description: arr.description,
            };
            return obj;
          });

          console.log(newTemList);

          res.status(200).send({
            status: "success",
            data: newTemList,
          });
        } else {
          const SignleIdData = TempList.filter((arr) => {
            return arr.id === id;
          });

          if (SignleIdData.length === 0) {
            res.status(500).send({
              status: false,
              message: `Data is not Available in Database For Id : ${id}`,
            });
          } else
            var newTemList = SignleIdData.map((arr) => {
              const obj = {
                id: arr.id,
                oid: arr.oid,
                name: arr.name,
                image: arr.image,
                bgcolor: arr.bgcolor,
                textcolor: arr.textcolor,
                description: arr.description,
              };
              return obj;
            });
          res.status(200).json({
            status: "success",
            data: newTemList,
          });
        }
      } else {
        res.status(500).json({
          status: false,
          data: "Authentication Header is Missing",
        });
      }
    } catch (e) {
      res.status(500).send({
        staus: false,
        message: e.message,
      });
    }
  }
);

// Service catagory Data
router.post(
  "/service-detail-data",
  middleware,
  upload1.single("image"),
  async (req, res) => {
    try {
      const getData = await ServiceDetailDataModel.find();
      // if already data
      if (getData.length != 0) {
        if (getData[getData.length - 1].list) {
          ls = getData[getData.length - 1].list;
          i = ls[ls.length - 1].oid / 10 + 1;
        } else {
          var ls = [];
          var i = 1;
        }
      } else {
        var ls = [];
        var i = 1;
      }

      // for uploading pics
      const storageRef = ref(
        storage2,
        `Groobe-Events/Service-Category-Data/${"Detail" + " " + i * 10}`
      );

      const metadata = {
        contentType: req.file.mimetype,
      };

      //upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );
      //by using uploadbytesres... we can control the progress of uploading like pause resume etcc;
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log(
        "File is uploaded to the Firebase! " + "Service" + " " + i * 10
      );

      //Update data by id
      const Uid = req.body.id || req.params.id;
      if (Uid) {
        var newList = getData[getData.length - 1].list;
        var k = null;
        for (var j = 0; j < newList.length; j++) {
          if (newList[j].id == Uid) {
            k = j;
            break;
          }
        }
        if (k == null) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else {
          newList[k].name = req.body.name || newList[k].name;
          newList[k].bgcolor = req.body.bgcolor || newList[k].bgcolor;
          newList[k].textcolor = req.body.textcolor || newList[k].textcolor;
          newList[k].description =
            req.body.description || newList[k].description;
          newList[k].price = req.body.price || newList[k].price;
          newList[k].sid = req.body.sid || newList[k].sid;
          newList[k].serviceId = req.body.serviceId || newList[k].serviceId;
          if (!req.file) newList[k].image = newList[k].image;
          else newList[k].image = downloadURL;

          const getData = await ServiceDetailDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await ServiceDetailDataModel.findOneAndUpdate(
            { _id: _id }, // Replace '_id' with the correct identifier field for your document
            { $set: { list: newList } },
            { new: true }
          );
          var list = updateData.list;
          res.status(201).send({
            staus: true,
            Data: list,
          });
        }
      } else {
        let id = generateUniqueId({
          length: 12,
        });
        let oid = 10 * i;
        let name = req.body.name;
        let image = downloadURL;
        let bgcolor = req.body.bgcolor;
        let textcolor = req.body.textcolor;
        let description = req.body.description;
        let price = req.body.price;
        let sid = req.body.sid;
        let serviceId = req.body.serviceId;

        obj = {
          id,
          oid,
          name,
          image,
          bgcolor,
          textcolor,
          description,
          price,
          sid,
          serviceId,
        };
        ls.push(obj);

        if (getData.length != 0) {
          const getData = await ServiceDetailDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await ServiceDetailDataModel.findOneAndUpdate(
            { _id: _id },
            { $set: { list: ls } },
            {
              new: true,
            }
          );
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        } else {
          const ServiceUser = new ServiceDetailDataModel({
            list: ls,
          });
          const updateData = await ServiceUser.save();
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        }
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({
        staus: false,
        error: e.message,
      });
    }
  }
);

// //THis is get for Society  Artist data
router.get(
  "/service-detail-data",
  middleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const typeOfUser = req.get("usertype");
      //console.log(typeOfUser);
      const id = req.body.id || req.query.id;
      if (typeOfUser === "admin") {
        const getData = await ServiceDetailDataModel.findOne()
          .select({ list: 1, _id: 0, __v: 1 })
          .sort({ list: 1 });

        //for sorting:
        var TempList = getData.list;

        if (!id) {
          console.log("This is Service Category data--------");

          res.status(200).send({
            status: "success",
            data: TempList,
          });
        } else {
          const SignleIdData = TempList.filter((arr) => {
            return arr.id === id;
          });

          if (SignleIdData.length === 0) {
            res.status(500).send({
              status: false,
              message: `Data is not Available in Database For Id : ${id}`,
            });
          } else
            res.status(200).json({
              status: "success",
              data: SignleIdData,
            });
        }
      } else if (typeOfUser === "user") {
        const getData = await ServiceDetailDataModel.findOne()
          .select({ list: 1, _id: 0, __v: 1 })
          .sort({ list: 1 });

        //for sorting:
        var TempList = getData.list;

        if (!id) {
          console.log("This is Service Category data--------");
          var newTemList = TempList.map((arr) => {
            const obj = {
              id: arr.id,
              oid: arr.oid,
              name: arr.name,
              image: arr.image,
              bgcolor: arr.bgcolor,
              textcolor: arr.textcolor,
              description: arr.description,
              price: arr.price,
            };
            return obj;
          });

          console.log(newTemList);

          res.status(200).send({
            status: "success",
            data: newTemList,
          });
        } else {
          const SignleIdData = TempList.filter((arr) => {
            return arr.id === id;
          });

          if (SignleIdData.length === 0) {
            res.status(500).send({
              status: false,
              message: `Data is not Available in Database For Id : ${id}`,
            });
          } else
            var newTemList = SignleIdData.map((arr) => {
              const obj = {
                id: arr.id,
                oid: arr.oid,
                name: arr.name,
                image: arr.image,
                bgcolor: arr.bgcolor,
                textcolor: arr.textcolor,
                description: arr.description,
                price: arr.price,
              };
              return obj;
            });
          res.status(200).json({
            status: "success",
            data: newTemList,
          });
        }
      } else {
        res.status(500).json({
          status: false,
          data: "Authentication Header is Missing",
        });
      }
    } catch (e) {
      res.status(500).send({
        staus: false,
        message: e.message,
      });
    }
  }
);

// Pricing Data
router.post(
  "/pricing",
  middleware,
  upload1.single("image"),
  async (req, res) => {
    try {
      const getData = await PricingDataModel.find();
      // if already data
      if (getData.length != 0) {
        if (getData[getData.length - 1].list) {
          ls = getData[getData.length - 1].list;
          i = ls[ls.length - 1].oid / 10 + 1;
        } else {
          var ls = [];
          var i = 1;
        }
      } else {
        var ls = [];
        var i = 1;
      }

      //Update data by id
      const Uid = req.body.id || req.params.id;
      if (Uid) {
        var newList = getData[getData.length - 1].list;
        var k = null;
        for (var j = 0; j < newList.length; j++) {
          if (newList[j].id == Uid) {
            k = j;
            break;
          }
        }
        if (k == null) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else {
          newList[k].name = req.body.name || newList[k].name;
          newList[k].sid = req.body.sid || newList[k].sid;
          newList[k].price = req.body.price || newList[k].price;
          newList[k].subCatagory =
            req.body.subCatagory || newList[k].subCatagory;
            newList[k].isActive =
            req.body.isActive || newList[k].isActive;
            
            const getData = await PricingDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
            const _id = getData._id;
            const updateData = await PricingDataModel.findOneAndUpdate(
              { _id: _id }, // Replace '_id' with the correct identifier field for your document
            { $set: { list: newList } },
            { new: true }
            );
            var list = updateData.list;
            res.status(201).send({
              staus: true,
              Data: list,
            });
          }
        } else {
        let id = generateUniqueId({
          length: 12,
        });
        let oid = 10 * i;
        let name = req.body.name;
        let sid = req.body.sid;
        let price = req.body.price;
        let subCatagory = req.body.subCatagory;
        let isActive = req.body.isActive;
        obj = {
          id,
          oid,
          name,
          sid,
          price,
          subCatagory,
          isActive
        };
        ls.push(obj);

        if (getData.length != 0) {
          const getData = await PricingDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await PricingDataModel.findOneAndUpdate(
            { _id: _id },
            { $set: { list: ls } },
            {
              new: true,
            }
          );
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        } else {
          const PricingUser = new PricingDataModel({
            list: ls,
          });
          const updateData = await PricingUser.save();
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        }
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({
        staus: false,
        error: e.message,
      });
    }
  }
);

// //THis is get for priicng data
router.get("/pricing", middleware, upload.single("image"), async (req, res) => {
  try {
    const typeOfUser = req.get("usertype");
    //console.log(typeOfUser);
    const id = req.body.id || req.query.id;
    if (typeOfUser === "admin") {
      const getData = await PricingDataModel.findOne()
        .select({ list: 1, _id: 0, __v: 1 })
        .sort({ list: 1 });

      //for sorting:
      var TempList = getData.list;

      if (!id) {
        console.log("This is Pricing data--------");

        res.status(200).send({
          status: "success",
          data: TempList,
        });
      } else {
        const SignleIdData = TempList.filter((arr) => {
          return arr.id === id;
        });

        if (SignleIdData.length === 0) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else
          res.status(200).json({
            status: "success",
            data: SignleIdData,
          });
      }
    } else if (typeOfUser === "user") {
      const getData = await PricingDataModel.findOne()
        .select({ list: 1, _id: 0, __v: 1 })
        .sort({ list: 1 });

      //for sorting:
      var TempList = getData.list;

      if (!id) {
        console.log("This is Pricing data--------");
        var newTemList = TempList.map((arr) => {
          const obj = {
            id: arr.id,
            oid: arr.oid,
            name: arr.name,
            price: arr.price,
            subCatagory: arr.subCatagorys,
          };
          return obj;
        });

        console.log(newTemList);

        res.status(200).send({
          status: "success",
          data: newTemList,
        });
      } else {
        const SignleIdData = TempList.filter((arr) => {
          return arr.id === id;
        });

        if (SignleIdData.length === 0) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else
          var newTemList = SignleIdData.map((arr) => {
            const obj = {
              id: arr.id,
              oid: arr.oid,
              name: arr.name,
              price: arr.price,
              subCatagory: arr.subCatagorys,
            };
            return obj;
          });
        res.status(200).json({
          status: "success",
          data: newTemList,
        });
      }
    } else {
      res.status(500).json({
        status: false,
        data: "Authentication Header is Missing",
      });
    }
  } catch (e) {
    res.status(500).send({
      staus: false,
      message: e.message,
    });
  }
});

// artist Data
router.post(
  "/artist",
  middleware,
  upload1.single("image"),
  async (req, res) => {
    try {
      const getData = await ArtistDataModel.find();
      // if already data
      if (getData.length != 0) {
        if (getData[getData.length - 1].list) {
          ls = getData[getData.length - 1].list;
          i = ls[ls.length - 1].oid / 10 + 1;
        } else {
          var ls = [];
          var i = 1;
        }
      } else {
        var ls = [];
        var i = 1;
      }

      //Update data by id
      const Uid = req.body.id || req.params.id;
      if (Uid) {
        var newList = getData[getData.length - 1].list;
        var k = null;
        for (var j = 0; j < newList.length; j++) {
          if (newList[j].id == Uid) {
            k = j;
            break;
          }
        }
        if (k == null) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else {
          newList[k].name = req.body.name || newList[k].name;
          newList[k].address = req.body.address || newList[k].address;
          newList[k].mobile = req.body.mobile || newList[k].mobile;
          newList[k].experience = req.body.experience || newList[k].experience;
          newList[k].sid = req.body.sid || newList[k].sid;
          newList[k].price = req.body.price || newList[k].price;
          newList[k].isActive =
            req.body.isActive || newList[k].isActive;
            const getData = await ArtistDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await ArtistDataModel.findOneAndUpdate(
            { _id: _id }, // Replace '_id' with the correct identifier field for your document
            { $set: { list: newList } },
            { new: true }
          );
          var list = updateData.list;
          res.status(201).send({
            staus: true,
            Data: list,
          });
        }
      } else {
        let id = generateUniqueId({
          length: 12,
        });
        let oid = 10 * i;
        let name = req.body.name;
        let sid = req.body.sid;
        let price = req.body.price;
        let address = req.body.address;
        let mobile = req.body.mobile;
        let experience = req.body.experience;
            let isActive = req.body.isActive;
        obj = {
          id,
          oid,
          name,
          sid,
          price,
          address,
          mobile,
          experience,
          isActive
        };
        ls.push(obj);

        if (getData.length != 0) {
          const getData = await ArtistDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await ArtistDataModel.findOneAndUpdate(
            { _id: _id },
            { $set: { list: ls } },
            {
              new: true,
            }
          );
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        } else {
          const ArtistUser = new ArtistDataModel({
            list: ls,
          });
          const updateData = await ArtistUser.save();
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        }
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({
        staus: false,
        error: e.message,
      });
    }
  }
);

// //THis is get for Artist data
router.get("/artist", middleware, upload.single("image"), async (req, res) => {
  try {
    const id = req.body.id || req.query.id;
    const getData = await ArtistDataModel.findOne()
      .select({ list: 1, _id: 0, __v: 1 })
      .sort({ list: 1 });

    //for sorting:
    var TempList = getData.list;
    if (!id) {
      console.log("This is Artist data--------");
      console.log(TempList);

      res.status(200).send({
        status: "success",
        data: TempList,
      });
    } else {
      const SignleIdData = TempList.filter((arr) => {
        return arr.id === id;
      });

      if (SignleIdData.length === 0) {
        res.status(500).send({
          status: false,
          message: `Data is not Available in Database For Id : ${id}`,
        });
      } else
        res.status(200).json({
          status: "success",
          data: SignleIdData,
        });
    }
  } catch (e) {
    res.status(500).send({
      staus: false,
      message: e.message,
    });
  }
});

// management Data
router.post(
  "/management",
  middleware,
  upload1.single("image"),
  async (req, res) => {
    try {
      const getData = await ManagementDataModel.find();
      // if already data
      if (getData.length != 0) {
        if (getData[getData.length - 1].list) {
          ls = getData[getData.length - 1].list;
          i = ls[ls.length - 1].oid / 10 + 1;
        } else {
          var ls = [];
          var i = 1;
        }
      } else {
        var ls = [];
        var i = 1;
      }

      //Update data by id
      const Uid = req.body.id || req.params.id;
      if (Uid) {
        var newList = getData[getData.length - 1].list;
        var k = null;
        for (var j = 0; j < newList.length; j++) {
          if (newList[j].id == Uid) {
            k = j;
            break;
          }
        }
        if (k == null) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else {
          newList[k].name = req.body.name || newList[k].name;
          newList[k].mobile = req.body.mobile || newList[k].mobile;
          newList[k].sid = req.body.sid || newList[k].sid;
          newList[k].isActive =
          req.body.isActive || newList[k].isActive;
          const getData = await ManagementDataModel.findOne()
          .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await ManagementDataModel.findOneAndUpdate(
            { _id: _id }, // Replace '_id' with the correct identifier field for your document
            { $set: { list: newList } },
            { new: true }
            );
            var list = updateData.list;
            res.status(201).send({
              staus: true,
              Data: list,
            });
          }
        } else {
        let id = generateUniqueId({
          length: 12,
        });
        let oid = 10 * i;
        let name = req.body.name;
        let sid = req.body.sid;
        
        let mobile = req.body.mobile;
        let isActive = req.body.isActive;

        obj = {
          id,
          oid,
          name,
          sid,

          mobile,
          isActive
        };
        ls.push(obj);

        if (getData.length != 0) {
          const getData = await ManagementDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await ManagementDataModel.findOneAndUpdate(
            { _id: _id },
            { $set: { list: ls } },
            {
              new: true,
            }
          );
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        } else {
          const ManagementUser = new ManagementDataModel({
            list: ls,
          });
          const updateData = await ManagementUser.save();
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        }
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({
        staus: false,
        error: e.message,
      });
    }
  }
);

// //THis is get for management data
router.get(
  "/management",
  middleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const id = req.body.id || req.query.id;
      const getData = await ManagementDataModel.findOne()
        .select({ list: 1, _id: 0, __v: 1 })
        .sort({ list: 1 });

      //for sorting:
      var TempList = getData.list;
      if (!id) {
        console.log("This is Artist data--------");
        console.log(TempList);

        res.status(200).send({
          status: "success",
          data: TempList,
        });
      } else {
        const SignleIdData = TempList.filter((arr) => {
          return arr.id === id;
        });

        if (SignleIdData.length === 0) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else
          res.status(200).json({
            status: "success",
            data: SignleIdData,
          });
      }
    } catch (e) {
      res.status(500).send({
        staus: false,
        message: e.message,
      });
    }
  }
);

// time-slot Data
router.post(
  "/time-slot",
  middleware,
  upload1.single("image"),
  async (req, res) => {
    try {
      const getData = await SocietyTimeSlotDataModel.find();
      // if already data
      if (getData.length != 0) {
        if (getData[getData.length - 1].list) {
          ls = getData[getData.length - 1].list;
          i = ls[ls.length - 1].oid / 10 + 1;
        } else {
          var ls = [];
          var i = 1;
        }
      } else {
        var ls = [];
        var i = 1;
      }

      //Update data by id
      const Uid = req.body.id || req.params.id;
      if (Uid) {
        var newList = getData[getData.length - 1].list;
        var k = null;
        for (var j = 0; j < newList.length; j++) {
          if (newList[j].id == Uid) {
            k = j;
            break;
          }
        }
        if (k == null) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else {
          newList[k].date = req.body.date || newList[k].date;
          newList[k].time = req.body.time || newList[k].time;
          newList[k].sid = req.body.sid || newList[k].sid;

          const getData = await SocietyTimeSlotDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await SocietyTimeSlotDataModel.findOneAndUpdate(
            { _id: _id }, // Replace '_id' with the correct identifier field for your document
            { $set: { list: newList } },
            { new: true }
          );
          var list = updateData.list;
          res.status(201).send({
            staus: true,
            Data: list,
          });
        }
      } else {
        let id = generateUniqueId({
          length: 12,
        });
        let oid = 10 * i;
        let date = req.body.date;
        let sid = req.body.sid;

        let time = req.body.time;

        obj = {
          id,
          oid,
          date,
          sid,
          time,
        };
        ls.push(obj);

        if (getData.length != 0) {
          const getData = await SocietyTimeSlotDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await SocietyTimeSlotDataModel.findOneAndUpdate(
            { _id: _id },
            { $set: { list: ls } },
            {
              new: true,
            }
          );
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        } else {
          const ManagementUser = new SocietyTimeSlotDataModel({
            list: ls,
          });
          const updateData = await ManagementUser.save();
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        }
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({
        staus: false,
        error: e.message,
      });
    }
  }
);

// //THis is get for management data
router.get(
  "/time-slot",
  middleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const id = req.body.id || req.query.id;
      if (!id) {
        const getData = await SocietyTimeSlotDataModel.findOne()
          .select({ list: 1, _id: 0, __v: 1 })
          .sort({ list: 1 });

        //for sorting:
        var TempList = getData.list;
        console.log("This is Artist data--------");
        console.log(TempList);

        res.status(200).send({
          status: "success",
          data: TempList,
        });
      } else {
        const getData = await SocietyTimeSlotDataModel.findById(id);
        if (!getData) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else
          res.status(200).json({
            status: "success",
            data: getData,
          });
      }
    } catch (e) {
      res.status(500).send({
        staus: false,
        message: e.message,
      });
    }
  }
);

// time Data
router.post("/time", middleware, upload1.single("image"), async (req, res) => {
  try {
    const getData = await TimeDataModel.find();
    // if already data
    if (getData.length != 0) {
      if (getData[getData.length - 1].list) {
        ls = getData[getData.length - 1].list;
        i = ls[ls.length - 1].oid / 10 + 1;
      } else {
        var ls = [];
        var i = 1;
      }
    } else {
      var ls = [];
      var i = 1;
    }

    //Update data by id
    const Uid = req.body.id || req.params.id;
    if (Uid) {
      var newList = getData[getData.length - 1].list;
      var k = null;
      for (var j = 0; j < newList.length; j++) {
        if (newList[j].id == Uid) {
          k = j;
          break;
        }
      }
      if (k == null) {
        res.status(500).send({
          status: false,
          message: `Data is not Available in Database For Id : ${id}`,
        });
      } else {
        newList[k].time = req.body.time || newList[k].time;
        newList[k].sid = req.body.sid || newList[k].sid;
        newList[k].quantity = req.body.quantity || newList[k].quantity;
        newList[k].enabled = req.body.enabled || newList[k].enabled;
        newList[k].bookings = req.body.bookings || newList[k].bookings;

        const getData = await TimeDataModel.findOne()
          .select({ list: 1, _id: 1, __v: 1 })
          .sort({ list: 1 });
        const _id = getData._id;
        const updateData = await TimeDataModel.findOneAndUpdate(
          { _id: _id }, // Replace '_id' with the correct identifier field for your document
          { $set: { list: newList } },
          { new: true }
        );
        var list = updateData.list;
        res.status(201).send({
          staus: true,
          Data: list,
        });
      }
    } else {
      let id = generateUniqueId({
        length: 12,
      });
      let oid = 10 * i;
      let quantity = req.body.quantity;
      let sid = req.body.sid;
      let time = req.body.time;
      let enabled = req.body.enabled;
      let bookings = req.body.bookings;

      obj = {
        id,
        oid,
        bookings,
        sid,
        enabled,
        time,
        quantity,
      };
      ls.push(obj);

      if (getData.length != 0) {
        const getData = await TimeDataModel.findOne()
          .select({ list: 1, _id: 1, __v: 1 })
          .sort({ list: 1 });
        const _id = getData._id;
        const updateData = await TimeDataModel.findOneAndUpdate(
          { _id: _id },
          { $set: { list: ls } },
          {
            new: true,
          }
        );
        const data = JSON.stringify(updateData.list);
        const data2 = JSON.parse(data);
        res.status(201).send({
          staus: true,
          message: "The following data is send to Database ",
          Data: data2,
        });
      } else {
        const ManagementUser = new TimeDataModel({
          list: ls,
        });
        const updateData = await ManagementUser.save();
        const data = JSON.stringify(updateData.list);
        const data2 = JSON.parse(data);
        res.status(201).send({
          staus: true,
          message: "The following data is send to Database ",
          Data: data2,
        });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({
      staus: false,
      error: e.message,
    });
  }
});

// //THis is get for time data
router.get("/time", middleware, upload.single("image"), async (req, res) => {
  try {
    const typeOfUser = req.get("usertype");
    //console.log(typeOfUser);
    const id = req.body.id || req.query.id;
    if (typeOfUser === "admin") {
      const getData = await TimeDataModel.findOne()
        .select({ list: 1, _id: 0, __v: 1 })
        .sort({ list: 1 });

      //for sorting:
      var TempList = getData.list;

      if (!id) {
        console.log("This is Time data--------");

        res.status(200).send({
          status: "success",
          data: TempList,
        });
      } else {
        const SignleIdData = TempList.filter((arr) => {
          return arr.id === id;
        });

        if (SignleIdData.length === 0) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else
          res.status(200).json({
            status: "success",
            data: SignleIdData,
          });
      }
    } else if (typeOfUser === "user") {
      const getData = await TimeDataModel.findOne()
        .select({ list: 1, _id: 0, __v: 1 })
        .sort({ list: 1 });

      //for sorting:
      var TempList = getData.list;

      if (!id) {
        console.log("This is User Society data--------");
        var newTemList = TempList.map((arr) => {
          const obj = {
            id: arr.id,
            oid: arr.oid,
            date: arr.date,
            time: arr.time,
          };
          return obj;
        });

        console.log(newTemList);

        res.status(200).send({
          status: "success",
          data: newTemList,
        });
      } else {
        const SignleIdData = TempList.filter((arr) => {
          return arr.id === id;
        });

        if (SignleIdData.length === 0) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else
          var newTemList = SignleIdData.map((arr) => {
            const obj = {
              id: arr.id,
              oid: arr.oid,
              date: arr.date,
              time: arr.time,
            };
            return obj;
          });
        res.status(200).json({
          status: "success",
          data: newTemList,
        });
      }
    } else {
      res.status(500).json({
        status: false,
        data: "Authentication Header is Missing",
      });
    }
  } catch (e) {
    res.status(500).send({
      staus: false,
      message: e.message,
    });
  }
});

// bookings Data
router.post(
  "/booking",
  middleware,
  upload1.single("image"),
  async (req, res) => {
    try {
      const getData = await BookingDataModel.find();
      // if already data
      if (getData.length != 0) {
        if (getData[getData.length - 1].list) {
          ls = getData[getData.length - 1].list;
          i = ls[ls.length - 1].oid / 10 + 1;
        } else {
          var ls = [];
          var i = 1;
        }
      } else {
        var ls = [];
        var i = 1;
      }

      //Update data by id
      const Uid = req.body.id || req.params.id;
      if (Uid) {
        var newList = getData[getData.length - 1].list;
        var k = null;
        for (var j = 0; j < newList.length; j++) {
          if (newList[j].id == Uid) {
            k = j;
            break;
          }
        }
        if (k == null) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else {
          newList[k].sid = req.body.sid || newList[k].sid;
          //newList[k].bookId = req.body.bookId || newList[k].bookId;
          newList[k].time = req.body.time || newList[k].time;
          newList[k].date = req.body.date || newList[k].date;
          newList[k].location = req.body.location || newList[k].location;
          newList[k].name = req.body.name || newList[k].name;
          newList[k].mobile = req.body.mobile || newList[k].mobile;
          newList[k].bookedServices =
            req.body.bookedServices || newList[k].bookedServices;
          newList[k].paymentStatus =
            req.body.paymentStatus || newList[k].paymentStatus;
          newList[k].paymentMode =
            req.body.paymentMode || newList[k].paymentMode;

          const getData = await BookingDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await BookingDataModel.findOneAndUpdate(
            { _id: _id }, // Replace '_id' with the correct identifier field for your document
            { $set: { list: newList } },
            { new: true }
          );
          var list = updateData.list;
          res.status(201).send({
            staus: true,
            Data: list,
          });
        }
      } else {
        let id = generateUniqueId({
          length: 12,
        });
        let oid = 10 * i;
        let sid = req.body.sid;
        let time = req.body.time;
        //let bookId = req.body.bookId;
        let date = req.body.date;
        let location = req.body.location;
        let name = req.body.name;
        let mobile = req.body.mobile;
        let bookedServices = req.body.bookedServices;
        let paymentStatus = req.body.paymentStatus;
        let paymentMode = req.body.paymentMode;

        obj = {
          id,
          oid,
          sid,
          time,
          //bookId,
          date,
          location,
          name,
          mobile,
          bookedServices,
          paymentMode,
          paymentStatus,
        };
        ls.push(obj);

        if (getData.length != 0) {
          const getData = await BookingDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await BookingDataModel.findOneAndUpdate(
            { _id: _id },
            { $set: { list: ls } },
            {
              new: true,
            }
          );
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        } else {
          const ManagementUser = new BookingDataModel({
            list: ls,
          });
          const updateData = await ManagementUser.save();
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        }
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({
        staus: false,
        error: e.message,
      });
    }
  }
);

// //THis is get for booking data
router.get("/booking", middleware, upload.single("image"), async (req, res) => {
  try {
    const id = req.body.id || req.query.id;
    const getData = await BookingDataModel.findOne()
      .select({ list: 1, _id: 0, __v: 1 })
      .sort({ list: 1 });

    //for sorting:
    var TempList = getData.list;
    if (!id) {
      console.log("This is Artist data--------");
      console.log(TempList);

      res.status(200).send({
        status: "success",
        data: TempList,
      });
    } else {
      const SignleIdData = TempList.filter((arr) => {
        return arr.id === id;
      });

      if (SignleIdData.length === 0) {
        res.status(500).send({
          status: false,
          message: `Data is not Available in Database For Id : ${id}`,
        });
      } else
        res.status(200).json({
          status: "success",
          data: SignleIdData,
        });
    }
  } catch (e) {
    res.status(500).send({
      staus: false,
      message: e.message,
    });
  }
});

// booked ser. Data
router.post(
  "/booked-services",
  middleware,
  upload1.single("image"),
  async (req, res) => {
    try {
      const getData = await BookedServiceDataModel.find();
      // if already data
      if (getData.length != 0) {
        if (getData[getData.length - 1].list) {
          ls = getData[getData.length - 1].list;
          i = ls[ls.length - 1].oid / 10 + 1;
        } else {
          var ls = [];
          var i = 1;
        }
      } else {
        var ls = [];
        var i = 1;
      }

      //Update data by id
      const Uid = req.body.id || req.params.id;
      if (Uid) {
        var newList = getData[getData.length - 1].list;
        var k = null;
        for (var j = 0; j < newList.length; j++) {
          if (newList[j].id == Uid) {
            k = j;
            break;
          }
        }
        if (k == null) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else {
          newList[k].bookId = req.body.bookId || newList[k].bookId;
          newList[k].categoryId = req.body.categoryId || newList[k].categoryId;

          const getData = await BookedServiceDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await BookedServiceDataModel.findOneAndUpdate(
            { _id: _id }, // Replace '_id' with the correct identifier field for your document
            { $set: { list: newList } },
            { new: true }
          );
          var list = updateData.list;
          res.status(201).send({
            staus: true,
            Data: list,
          });
        }
      } else {
        let id = generateUniqueId({
          length: 12,
        });
        let oid = 10 * i;
        let bookId = req.body.bookId;

        let categoryId = req.body.categoryId;

        obj = {
          id,
          oid,
          bookId,
          categoryId,
        };
        ls.push(obj);

        if (getData.length != 0) {
          const getData = await BookedServiceDataModel.findOne()
            .select({ list: 1, _id: 1, __v: 1 })
            .sort({ list: 1 });
          const _id = getData._id;
          const updateData = await BookedServiceDataModel.findOneAndUpdate(
            { _id: _id },
            { $set: { list: ls } },
            {
              new: true,
            }
          );
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        } else {
          const ManagementUser = new BookedServiceDataModel({
            list: ls,
          });
          const updateData = await ManagementUser.save();
          const data = JSON.stringify(updateData.list);
          const data2 = JSON.parse(data);
          res.status(201).send({
            staus: true,
            message: "The following data is send to Database ",
            Data: data2,
          });
        }
      }
    } catch (e) {
      console.log(e);
      res.status(404).json({
        staus: false,
        error: e.message,
      });
    }
  }
);

// //THis is get for booked ser. data
router.get(
  "/booked-services",
  middleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const id = req.body.id || req.query.id;
      const getData = await BookedServiceDataModel.findOne()
        .select({ list: 1, _id: 0, __v: 1 })
        .sort({ list: 1 });

      //for sorting:
      var TempList = getData.list;
      if (!id) {
        console.log("This is Artist data--------");
        console.log(TempList);

        res.status(200).send({
          status: "success",
          data: TempList,
        });
      } else {
        const SignleIdData = TempList.filter((arr) => {
          return arr.id === id;
        });

        if (SignleIdData.length === 0) {
          res.status(500).send({
            status: false,
            message: `Data is not Available in Database For Id : ${id}`,
          });
        } else
          res.status(200).json({
            status: "success",
            data: SignleIdData,
          });
      }
    } catch (e) {
      res.status(500).send({
        staus: false,
        message: e.message,
      });
    }
  }
);

//User Data
router.post("/user-data", middleware, upload1.none(), async (req, res) => {
  try {
    const getData = await UserDataModel.find();
    // if already data
    if (getData.length != 0) {
      if (getData[getData.length - 1]) {
        i = getData[getData.length - 1].oid / 10 + 1;
        //console.log(i);
      } else {
        var i = 1;
      }
    } else {
      var i = 1;
    }
    //Update data by id
    const Uid = req.body.uid || req.params.uid;
    const idData = await UserDataModel.findOne({ uid: Uid }).exec();

    if (Uid) {
      if (idData) {
        if (
          req.body.name ||
          req.body.mobile ||
          req.body.isVerified ||
          req.body.societyId ||
          req.body.serviceId ||
          req.body.oid
        ) {
          const updateData = await UserDataModel.findOneAndUpdate(
            { uid: Uid },
            {
              $set: {
                name: req.body.name,
                mobile: req.body.mobile,
                isVerified: req.body.isVerified,
                societyId: req.body.societyId,
                serviceId: req.body.serviceId,
                oid: req.body.oid,
              },
            },
            {
              new: true,
            }
          ).select({ _id: 0 });
          res.status(201).send({
            staus: true,
            Data: updateData,
          });
        } else {
          res.status(400).send({
            staus: false,
            message: `Enter Valid Input field to be Updated for id : ${Uid}`,
          });
          return;
        }
      } else {
        res.status(400).send({
          staus: false,
          message: `No matching Found in Database for id : ${Uid}`,
        });
      }
    } else {
      const User = new UserDataModel({
        uid: generateUniqueId({
          length: 12,
        }),
        oid: i * 10,
        name: req.body.name,
        mobile: req.body.mobile,
        isVerified: req.body.isVerified,
        societyId: req.body.societyId,
        serviceId: req.body.serviceId,
      });
      const sendData = await User.save();
      res.status(201).send({
        staus: true,
        message: "The following data is send to Database ",
        Data: sendData,
      });
    }
  } catch (e) {
    //console.log(e);
    res.status(404).send({
      staus: false,
      message: e.message,
    });
  }
});

//THis is get for User data
router.get("/user-data", middleware, upload.none(), async (req, res) => {
  try {
    const Uid = req.body.uid || req.query.uid;
    if (!Uid) {
      const getData = await UserDataModel.find()
        .select({ _id: 0 })
        .sort({ oid: 1 });

      if (getData.length != 0)
        res.status(200).send({
          status: "success",
          data: getData,
        });
      else {
        res.status(500).send({
          status: false,
          message: `No Data Is Available`,
        });
      }
    } else {
      const getData = await UserDataModel.findOne({ uid: Uid }).exec();
      if (!getData) {
        res.status(500).send({
          status: false,
          message: `Data is not Available in Database For Id : ${Uid}`,
        });
      } else
        res.status(200).json({
          status: "success",
          data: getData,
        });
    }
  } catch (e) {
    res.status(500).send({
      staus: false,
      message: e.message,
    });
  }
});

router.get("/send-sms", async (req, res) => {
  const mobile = req.get("mobile");
  const otpcode = req.get("otpcode");
  try {
    console.log("mobile and otp is : ", mobile, otpcode);

    const apiKey = "oUsBzN0SIFCeAMVRmxGxMzA3d8GfIF%2BX8xgcgRk35nU%3D";
    const clientId = "d1d94ba5-44cb-4f51-aa4b-7cf751d58490";
    const apiUrl = `http://smsproadv.in/api/v2/SendSMS?SenderId=SANBAS&Is_Unicode=true&Message=1234&MobileNumbers=+919464115434&TemplateId=1007968231488654489&ApiKey=${apiKey}&ClientId=${clientId}`;

    const response = await fetch(apiUrl);
    const data = await response.text();

    res.send(data);
  } catch (error) {
    console.error("Error in proxy request:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
