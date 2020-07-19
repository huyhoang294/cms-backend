const router = require("express").Router();
const Cabinet = require("../../models/cabinet");
const Station = require("../../models/station");

router.get("/", (req, res) => {
  let result = {
    data: {},
  };
  Cabinet.find()
    .populate("station_id", "placename")
    .exec((err, cabinets) => {
      if (err) {
        console.log("Error: " + err);
      } else {
        result.total = cabinets.length;
        result.data = cabinets;
        res.json(result);
      }
    });
});

router.post("/deactive", (req, res) => {
  Cabinet.find({ _id: { $in: req.body.data } }, (err, cabinets) => {
    if (err) {
      console.log("Error: " + err);
      res.json({ success: false });
    } else {
      for (let i = 0; i < cabinets.length; i++) {
        cabinets[i].active = req.body.active;
        cabinets[i].save();
      }
      res.json({ success: true });
    }
  });
});

router.get("/search", (req, res) => {
  let result = {
    data: {},
  };

  const SearchString = req.query.searchString;
  Station.find(
    {
      $or: [
        { placename: { $regex: SearchString, $options: "i" } },
        { address: { $regex: SearchString, $options: "i" } },
      ],
    },
    (err, stations) => {
      if (err) {
        console.log("Error: " + err);
      } else {
        Cabinet.find({
          station_id: { $in: stations },
        })
          .populate("station_id", "placename")
          .exec((err, cabinets) => {
            if (err) {
              console.log("Error: " + err);
              res.json({ success: false });
            } else {
              result.data = cabinets;
              result.total = cabinets.length;
              res.json(result);
            }
          });
      }
    }
  );
});

router.get("/listener", (req, res) => {
  let cabinetListen = Cabinet.watch();
  let flag = false;
  cabinetListen.on("change", (response) => {
    flag = true;
    res.json(true);
    cabinetListen.close();
  });

  res.setTimeout(5000, () => {
    if (!flag) {
      res.json(false);
      cabinetListen.close();
    }
  });
});

// router.get("/log", async (req, res) => {

// });

module.exports = router;
