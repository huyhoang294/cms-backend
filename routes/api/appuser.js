const User = require("../../models/user");
const Authorize_log = require("../../models/authorize_log");
const Open_log = require("../../models/open_log");
const Order = require("../../models/order");
const router = require("express").Router();

router.get("/", (req, res) => {
  let result = {
    data: {},
  };
  User.find((err, users) => {
    if (err) {
      console.log("Error: " + err);
    } else {
      result.total = users.length;
      result.data = users;

      res.json(result);
    }
  });
});

router.post("/ban", (req, res) => {
  User.find({ _id: { $in: req.body.data } }, (err, users) => {
    if (err) {
      console.log("Error: " + err);
      res.json({ success: false });
    } else {
      for (let i = 0; i < users.length; i++) {
        users[i].active = req.body.status;
        users[i].save();
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
  User.find(
    {
      $or: [
        { username: { $regex: SearchString, $options: "i" } },
        { email: { $regex: SearchString, $options: "i" } },
      ],
    },
    (err, users) => {
      if (err) {
        console.log("Error: " + err);
      } else {
        result.data = users;
        result.total = users.length;
        res.json(result);
      }
    }
  );
});

router.get("/log", (req, res) => {
  let result = {
    data: {},
  };

  const id = req.query.userId;
  Authorize_log.find({ owner_id: id }, (authLogs, err) => {
    if (err) {
      console.log("Error: " + err);
    } else {
      result.data.authLogs = authLogs;
      Open_log.find({ user_id: id }, (openLogs, err) => {
        if (err) {
          console.log("Error: " + err);
        } else {
          result.data.openLogs = openLogs;
          Order.find({ user_id: id }, (orderLogs, err) => {
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

router.get("/listener", (req, res) => {
  let userListen = User.watch();
  let flag = false;
  userListen.on("change", (response) => {
    flag = true;
    res.json(true);
    userListen.close();
  });

  res.setTimeout(5000, () => {
    if (!flag) {
      res.json(false);
      userListen.close();
    }
  });
});

router.post("/updateprofile", (req, res) => {
  User.findById(req.body.id, (err, user) => {
    if (err) {
      console.log("Error: " + err);
      res.json({ success: false });
    } else {
      user.username = req.body.username;
      user.email = req.body.email;
      user.sex = req.body.sex;
      user.birthday = req.body.birthday;
      user.phonenum = req.body.phonenum;
      user.save();
      res.json({ success: true });
    }
  });
});
module.exports = router;
