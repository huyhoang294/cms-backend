const router = require("express").Router();
const Cabinet = require("../../models/cabinet");
const Station = require("../../models/station");
const Authorize_log = require("../../models/authorize_log");
const Open_log = require("../../models/open_log");
const Order = require("../../models/order");

router.get("/", (req, res) => {
  console.log("oke");
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

router.get("/log", (req, res) => {
  let result = {
    data: {},
  };

  const id = req.query.cabinetId;
  Authorize_log.find({ box_id: id })
    .populate("owner_id", "email")
    .populate("authorize_id", "email")
    .populate("box_id", "no")
    .populate("station_id")
    .exec((err, authLogs) => {
      if (err) {
        console.log("Error: " + err);
      } else {
        result.data.authLogs = authLogs;
        Open_log.find({ box_id: id })
          .populate("user_id", "email")
          .populate("box_id", "no")
          .populate("station_id",)
          .exec((err, openLogs) => {
            if (err) {
              console.log("Error: " + err);
            } else {
              result.data.openLogs = openLogs;
              Order.find({ box_id: id })
                .populate("user_id", "email")
                .populate("box_id", "no")
                .populate("station_id")
                .exec((err, orderLogs) => {
                  if (err) {
                    console.log("Error: " + err);
                  } else {
                    result.data.orderLogs = orderLogs;
                    res.json(result);
                  }
                });
            }
          });
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
