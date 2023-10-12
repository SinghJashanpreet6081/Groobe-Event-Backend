const express = require("express");
const router = new express.Router();
const generateUniqueId = require("generate-unique-id");
const multer = require("multer");
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
        obj = {
          id,
          oid,
          name,
          address,
          artist,
          management,
          items,
          services,
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
      const id = req.body.id || req.query.id;
      if (!id) {
        const getData = await SocietyDataModel.findOne()
          .select({ list: 1, _id: 0, __v: 1 })
          .sort({ list: 1 });

        //for sorting:
        var TempList = getData.list;
        console.log("This is Society data--------");
        console.log(TempList);

        res.status(200).send({
          status: "success",
          data: TempList,
        });
      } else {
        const getData = await SocietyDataModel.findById(id);
        if (!getData) {
          res.status(500).send({
            status: false,
            message: errorFormatter(
              `: Data is not Available in Database For Id : ${id}`
            ),
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
        message: errorFormatter(e.message),
      });
    }
  }
);

//List Output
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
      if (!id) {
        const getData = await SocietyArtistDataModel.findOne()
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
        const getData = await SocietyArtistDataModel.findById(id);
        if (!getData) {
          res.status(500).send({
            status: false,
            message: errorFormatter(
              `: Data is not Available in Database For Id : ${id}`
            ),
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
        message: errorFormatter(e.message),
      });
    }
  }
);

//List Output
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
      if (!id) {
        const getData = await SocietyManagementDataModel.findOne()
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
        const getData = await SocietyManagementDataModel.findById(id);
        if (!getData) {
          res.status(500).send({
            status: false,
            message: errorFormatter(
              `: Data is not Available in Database For Id : ${id}`
            ),
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
        message: errorFormatter(e.message),
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
      if (!id) {
        const getData = await ServiceDataModel.findOne()
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
        const getData = await ServiceDataModel.findById(id);
        if (!getData) {
          res.status(500).send({
            status: false,
            message: errorFormatter(
              `: Data is not Available in Database For Id : ${id}`
            ),
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
        message: errorFormatter(e.message),
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
      //const storageRef = ref(storage2, `Services/${"Service" + " " + i * 10}`);

      // const metadata = {
      //   contentType: req.file.mimetype,
      // };

      // //upload the file in the bucket storage
      // const snapshot = await uploadBytesResumable(
      //   storageRef,
      //   req.file.buffer,
      //   metadata
      // );
      // //by using uploadbytesres... we can control the progress of uploading like pause resume etcc;
      // const downloadURL = await getDownloadURL(snapshot.ref);
      // console.log(
      //   "File is uploaded to the Firebase! " + "About" + " " + i * 10
      // );

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
          if (!req.file) newList[k].image = newList[k].image;
          else newList[k].image = req.file.originalname;

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
        let image = req.file.originalname;
        let bgcolor = req.body.bgcolor;
        let textcolor = req.body.textcolor;
        let description = req.body.description;
        let service_category = req.body.service_category;
        let isPopular = req.body.isPopular;

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
      const id = req.body.id || req.query.id;
      if (!id) {
        const getData = await ServiceDataModel.findOne()
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
        const getData = await ServiceDataModel.findById(id);
        if (!getData) {
          res.status(500).send({
            status: false,
            message: errorFormatter(
              `: Data is not Available in Database For Id : ${id}`
            ),
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
        message: errorFormatter(e.message),
      });
    }
  }
);

module.exports = router;

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
      //const storageRef = ref(storage2, `Services/${"Service" + " " + i * 10}`);

      // const metadata = {
      //   contentType: req.file.mimetype,
      // };

      // //upload the file in the bucket storage
      // const snapshot = await uploadBytesResumable(
      //   storageRef,
      //   req.file.buffer,
      //   metadata
      // );
      // //by using uploadbytesres... we can control the progress of uploading like pause resume etcc;
      // const downloadURL = await getDownloadURL(snapshot.ref);
      // console.log(
      //   "File is uploaded to the Firebase! " + "About" + " " + i * 10
      // );

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
          else newList[k].image = req.file.originalname;

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
        let image = req.file.originalname;
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
      const id = req.body.id || req.query.id;
      if (!id) {
        const getData = await ServiceDetailDataModel.findOne()
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
        const getData = await ServiceDetailDataModel.findById(id);
        if (!getData) {
          res.status(500).send({
            status: false,
            message: errorFormatter(
              `: Data is not Available in Database For Id : ${id}`
            ),
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
        message: errorFormatter(e.message),
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
        obj = {
          id,
          oid,
          name,
          sid,
          price,
          subCatagory,
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
    const id = req.body.id || req.query.id;
    if (!id) {
      const getData = await PricingDataModel.findOne()
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
      const getData = await PricingDataModel.findById(id);
      if (!getData) {
        res.status(500).send({
          status: false,
          message: errorFormatter(
            `: Data is not Available in Database For Id : ${id}`
          ),
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
      message: errorFormatter(e.message),
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
        obj = {
          id,
          oid,
          name,
          sid,
          price,
          address,
          mobile,
          experience,
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
    if (!id) {
      const getData = await ArtistDataModel.findOne()
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
      const getData = await ArtistDataModel.findById(id);
      if (!getData) {
        res.status(500).send({
          status: false,
          message: errorFormatter(
            `: Data is not Available in Database For Id : ${id}`
          ),
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
      message: errorFormatter(e.message),
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

        obj = {
          id,
          oid,
          name,
          sid,

          mobile,
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
      if (!id) {
        const getData = await ManagementDataModel.findOne()
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
        const getData = await ManagementDataModel.findById(id);
        if (!getData) {
          res.status(500).send({
            status: false,
            message: errorFormatter(
              `: Data is not Available in Database For Id : ${id}`
            ),
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
        message: errorFormatter(e.message),
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
            message: errorFormatter(
              `: Data is not Available in Database For Id : ${id}`
            ),
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
        message: errorFormatter(e.message),
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
    const id = req.body.id || req.query.id;
    if (!id) {
      const getData = await TimeDataModel.findOne()
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
      const getData = await TimeDataModel.findById(id);
      if (!getData) {
        res.status(500).send({
          status: false,
          message: errorFormatter(
            `: Data is not Available in Database For Id : ${id}`
          ),
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
      message: errorFormatter(e.message),
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
          newList[k].bookId = req.body.bookId || newList[k].bookId;
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
        let bookId = req.body.bookId;
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
          bookId,
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
    if (!id) {
      const getData = await BookingDataModel.findOne()
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
      const getData = await BookingDataModel.findById(id);
      if (!getData) {
        res.status(500).send({
          status: false,
          message: errorFormatter(
            `: Data is not Available in Database For Id : ${id}`
          ),
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
      message: errorFormatter(e.message),
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
      if (!id) {
        const getData = await BookedServiceDataModel.findOne()
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
        const getData = await BookedServiceDataModel.findById(id);
        if (!getData) {
          res.status(500).send({
            status: false,
            message: errorFormatter(
              `: Data is not Available in Database For Id : ${id}`
            ),
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
        message: errorFormatter(e.message),
      });
    }
  }
);

module.exports = router;
