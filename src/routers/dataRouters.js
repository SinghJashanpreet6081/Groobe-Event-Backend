const express = require("express");
const router = new express.Router();

//for firebase image upload
// const { initializeApp } = require("firebase/app")

const multer = require("multer");

//const storage2 = getStorage();

//setting up multer as a middleware to grap photo upload
const upload1 = multer({ storage2: multer.memoryStorage() });

//getting model
const { SocietyDataModel } = require("../models/dataModel");
const { send, listenerCount } = require("process");

//for error formatting
// const errorFormatter = e => {
//     var errObj = {};
//     //for refining output
//     var allE = e.substring(e.indexOf(':') + 1).trim().replace(/\n/g, "").replace(/{/g, "").replace(/}/g, "").replace("  ", "");

//     var allEArry = allE.split(',').map(er => er.trim());
//     allEArry.forEach(err => {
//         const [key, value] = err.split(':').map(er => er.trim());
//         errObj[key] = value;
//     });
//     return errObj;
// }

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

//List Output
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
          i = ls[ls.length - 1].id / 10 + 1;
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

          const updateData = await SocietyDataModel.findOneAndUpdate(
            { id: 10 }, // Replace '_id' with the correct identifier field for your document
            { $set: { list: newList } },
            { new: true }
          ).select({ _id: 0 });

          var list = updateData.list;
          res.status(201).send({
            staus: true,
            Data: list,
          });
        }
      } else {
        let id = 10 * i;
        let name = req.body.name;
        let address = req.body.address;
        //input string to output array
        let artist = req.body.artist;
        let management = req.body.management;
        let items = req.body.items;
        obj = {
          id,
          name,
          address,
          artist,
          management,
          items,
        };
        ls.push(obj);

        if (getData.length != 0) {
          const updateData = await SocietyDataModel.findOneAndUpdate(
            { _id: "65251b24f8ef82a8835cf543" },
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

// //THis is get for hero data
router.get("/society-data", middleware, upload.single('image'), async (req, res) => {
    try {
        const id = req.body.id || req.query.id;
        if (!id) {
            const getData = await SocietyDataModel.findOne().select({ list: 1, _id: 0, __v: 1 }).sort({ list: 1 });

            //for sorting:
            var TempList = getData.list;
            console.log("This is Society data--------");
            console.log(TempList);
            // TempList.sort((a, b) => {
            //     return a.ord_id - b.ord_id;
            // });

            res.status(200).send({
                status: "success",
                data: TempList
            });
        }
        else {
            const getData = await SocietyDataModel.findById(id);
            if (!getData) {
                res.status(500).send({
                    status: false,
                    message: errorFormatter(`: Data is not Available in Database For Id : ${id}`)
                });
            }
            else
                res.status(200).json({
                    status: "success",
                    data: getData
                });
        }
    } catch (e) {
        res.status(500).send({
            staus: false,
            message: errorFormatter(e.message)
        });
    }
});

module.exports = router;
